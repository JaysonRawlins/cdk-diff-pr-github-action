import { GitHub, GithubWorkflow } from 'projen/lib/github';
import { JobPermission } from 'projen/lib/github/workflows-model';
import { CdkDriftDetectionScript } from './bin/cdk-drift-detection-script';

const githubActionsAwsCredentialsVersion = 'v5';
const githubActionsCheckoutVersion = 'v5';
const githubActionsSetupNodeVersion = 'v5';
const githubActionsUploadArtifactVersion = 'v4';
const githubActionsDownloadArtifactVersion = 'v5';
const githubActionsGithubScriptVersion = 'v8';

export interface Stack {
  readonly stackName: string;
  readonly driftDetectionRoleToAssumeRegion: string;
  readonly driftDetectionRoleToAssumeArn: string;
  readonly failOnDrift?: boolean; // if true, fail job when drift detected (default true)
}

export interface CdkDriftDetectionWorkflowProps {
  readonly scriptOutputPath?: string;
  readonly project: any; // avoid exporting projen types in public API
  readonly workflowName?: string; // workflow workflowName (also used to derive file workflowName)
  readonly schedule?: string; // cron expression, e.g. '0 0 * * *'
  readonly createIssues?: boolean; // create/update issue when drift detected on schedule (default true)
  readonly oidcRoleArn: string; // default OIDC role ARN to assume for all stacks
  readonly oidcRegion: string; // default OIDC region to assume for all stacks
  readonly stacks: Stack[];
  readonly nodeVersion?: string; // e.g., '24.x'
  /**
   * Optional hook to append additional GitHub Actions steps after drift detection per stack.
   * You can supply a static array of steps, or a factory that receives context and returns steps.
   */
  /**
   * Optional additional GitHub Action steps to run after drift detection for each stack.
   * These steps run after results are uploaded for each stack. You can include
   * any notifications you like (e.g., Slack). Provide explicit inputs (e.g., payload/markdown)
   * directly in your step without relying on a pre-generated payload.
   */
  // NOTE: jsii does not support function types in public APIs; use 'any' here and accept either:
  // - An array of GitHub steps, or
  // - A function (ctx: { stack: string }) => GitHubStep[]
  // The constructor handles both at runtime.
  readonly postGitHubSteps?: any;
}

type GitHubStep = {
  name?: string;
  id?: string;
  if?: string;
  uses?: string;
  run?: string;
  with?: Record<string, any>;
  env?: Record<string, string>;
  continueOnError?: boolean;
  shell?: string;
};

export class CdkDriftDetectionWorkflow {
  private static scriptCreated = false;

  constructor(props: CdkDriftDetectionWorkflowProps) {
    const name = props.workflowName ?? 'drift-detection';
    const fileName = toKebabCase(name) + '.yml';
    const nodeVersion = props.nodeVersion ?? '24.x';
    const createIssues = props.createIssues ?? true;
    const project = props.project;
    const scriptOutputPath= props.scriptOutputPath ?? '.github/workflows/scripts/detect-drift.ts';

    // Only create the drift detection script once to avoid collisions
    if (!CdkDriftDetectionWorkflow.scriptCreated) {
      new CdkDriftDetectionScript({
        project: props.project,
        outputPath: scriptOutputPath,
      });
      CdkDriftDetectionWorkflow.scriptCreated = true;
    }

    const gh = (project as any).github ?? new GitHub(project);
    const workflow = new GithubWorkflow(gh, name, { fileName });

    // triggers: schedule + manual dispatch with stack choice
    const stackChoices = ['all', ...props.stacks.map((s) => s.stackName)];
    workflow.on({
      schedule: props.schedule ? [{ cron: props.schedule }] : undefined,
      workflowDispatch: {
        inputs: {
          stack: {
            description: "Stack to check for drift ('all' to run every stack)",
            required: false,
            type: 'choice',
            options: stackChoices,
          },
        },
      },
    });

    // One job per stack
    const jobs: Record<string, any> = {};

    for (const stack of props.stacks) {
      const sanitizedStackName = toKebabCase(toGithubJobId(stack.stackName));
      const originalStackName = stack.stackName;
      const jobId = `drift-${sanitizedStackName}`;
      const resultsFile = `drift-results-${sanitizedStackName}.json`;
      const innerCond = "github.event_name == 'schedule' || !github.event.inputs.stack || github.event.inputs.stack == 'all' || github.event.inputs.stack == '" + sanitizedStackName + "' || github.event.inputs.stack == '" + originalStackName + "'";
      const condExpr = '${{ ' + innerCond + ' }}';
      const notCondExpr = '${{ !(' + innerCond + ') }}';

      const rawPost = props.postGitHubSteps;
      const postSteps: GitHubStep[] = typeof rawPost === 'function' ? (rawPost as (ctx: { stack: string }) => GitHubStep[])({ stack: sanitizedStackName }) : (rawPost ?? []);

      jobs[jobId] = {
        name: `Drift Detection - ${sanitizedStackName}`,
        runsOn: ['ubuntu-latest'],
        permissions: {
          contents: JobPermission.READ,
          idToken: JobPermission.WRITE,
          issues: JobPermission.WRITE,
        },
        env: {
          AWS_DEFAULT_REGION: stack.driftDetectionRoleToAssumeRegion,
          AWS_REGION: stack.driftDetectionRoleToAssumeRegion,
          DRIFT_DETECTION_OUTPUT: resultsFile,
          STACK_ID: sanitizedStackName,
          STACK_NAME: stack.stackName,
        },
        // No job-level condition; we gate steps so the job always completes and summary can run
        steps: [
          { name: 'Skip (stack not selected)', if: notCondExpr, run: 'echo "Stack not selected; skipping drift detection for this job."' },
          { name: 'Checkout', if: condExpr, uses: `actions/checkout@${githubActionsCheckoutVersion}` },
          {
            name: 'Setup Node.js',
            if: condExpr,
            uses: `actions/setup-node@${githubActionsSetupNodeVersion}`,
            with: { 'node-version': nodeVersion },
          },
          { name: 'Install dependencies', if: condExpr, run: 'yarn install --frozen-lockfile || npm ci', env: { GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}' } },
          {
            name: 'AWS Credentials',
            if: condExpr,
            id: 'creds',
            uses: `aws-actions/configure-aws-credentials@${githubActionsAwsCredentialsVersion}`,
            with: {
              'role-to-assume': props.oidcRoleArn,
              'role-session-name': 'GitHubAction',
              'aws-region': props.oidcRegion,
            },
          },
          {
            name: 'Assume Drift Detection Role',
            if: condExpr,
            uses: `aws-actions/configure-aws-credentials@${githubActionsAwsCredentialsVersion}`,
            with: {
              'role-to-assume': stack.driftDetectionRoleToAssumeArn,
              'role-chaining': true,
              'role-skip-session-tagging': true,
              'aws-region': stack.driftDetectionRoleToAssumeRegion,
              'aws-access-key-id': '${{ steps.creds.outputs.aws-access-key-id }}',
              'aws-secret-access-key': '${{ steps.creds.outputs.aws-secret-access-key }}',
              'aws-session-token': '${{ steps.creds.outputs.aws-session-token }}',
            },
          },
          {
            name: 'Detect drift',
            if: condExpr,
            id: 'drift',
            continueOnError: true, // allow artifact upload and issue creation even when drift is detected
            run: [
              'set +e',
              // Use the bundled script from this package
              'node ./node_modules/@jjrawlins/cdk-diff-pr-github-action/lib/bin/detect-drift.js',
              'status=$?',
              'if [ -f "$DRIFT_DETECTION_OUTPUT" ]; then echo "Results file created: $DRIFT_DETECTION_OUTPUT"; fi',
              // Expose useful outputs for downstream steps
              "STACK_ARN=$(aws cloudformation describe-stacks --stack-name \"$STACK_NAME\" --query 'Stacks[0].StackId' --output text 2>/dev/null || true)",
              'echo "stack-arn=$STACK_ARN" >> "$GITHUB_OUTPUT"',
              'exit $status',
            ].join('\n'),
            env: {
              STACK_NAME: stack.stackName,
              AWS_REGION: stack.driftDetectionRoleToAssumeRegion,
              DRIFT_DETECTION_OUTPUT: resultsFile,
            },
          },
          {
            name: 'Upload results',
            if: condExpr,
            uses: `actions/upload-artifact@${githubActionsUploadArtifactVersion}`,
            with: { 'name': `drift-results-${sanitizedStackName}`, 'path': resultsFile, 'if-no-files-found': 'ignore' },
          },
          ...(
            createIssues
              ? [
                {
                  name: 'Create Issue on Drift',
                  if: "always() && steps.drift.outcome == 'failure'",
                  id: 'issue',
                  uses: `actions/github-script@${githubActionsGithubScriptVersion}`,
                  with: { 'result-encoding': 'string', 'script': issueScript(sanitizedStackName, stack.driftDetectionRoleToAssumeRegion, resultsFile) },
                },
              ]
              : []
          ),
          ...postSteps.map((step) => {
            const s: any = { ...(step as any) };
            // By default, only run extra notification steps when drift occurs
            s.if = s.if ?? "always() && steps.drift.outcome == 'failure'";
            return s;
          }),
        ],
      };
    }

    // summary aggregator job
    jobs['drift-summary'] = {
      name: 'Drift Detection Summary',
      needs: Object.keys(jobs).filter((j) => j.startsWith('drift-') && j !== 'drift-summary'),
      runsOn: ['ubuntu-latest'],
      permissions: { contents: JobPermission.READ },
      steps: [
        {
          name: 'Download all artifacts',
          uses: `actions/download-artifact@${githubActionsDownloadArtifactVersion}`,
          with: { path: 'drift-results' },
        },
        { name: 'Generate summary', shell: 'bash', run: summaryScript() },
      ],
    };

    workflow.addJobs(jobs);
  }
}


function issueScript(stack: string, region: string, resultsFile: string): string {
  // Construct a plain JS script string (no template string nesting mishaps)
  const lines = [
    "const fs = require('fs');",
    `const resultsFile = '${resultsFile}';`,
    "if (!fs.existsSync(resultsFile)) { console.log('No results file found'); return 'NO_RESULTS'; }",
    "const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));",
    "const driftedStacks = results.filter(r => r.driftStatus === 'DRIFTED');",
    "if (driftedStacks.length === 0) { console.log('No drift detected'); return 'NO_DRIFT'; }",
    `const title = 'Drift Detected in ${stack}';`,
    `let body = '## Drift Detection Report\\n\\n' + '**Stack:** ${stack}\\n' + '**Region:** ${region}\\n' + '**Time:** ' + new Date().toISOString() + '\\n\\n';`,
    "body += '### Summary\\n';",
    "body += '- Total stacks checked: ' + results.length + '\\n';",
    "body += '- Drifted stacks: ' + driftedStacks.length + '\\n\\n';",
    "body += '### Drifted Stacks\\n';",
    'for (const s of driftedStacks) {',
    '  const resources = s.driftedResources || [];',
    "  body += '#### ' + s.stackName + '\\n';",
    "  body += '- Drifted resources: ' + resources.length + '\\n';",
    "  for (const r of resources) { body += '  - ' + r.logicalResourceId + ' (' + r.resourceType + ')\\n'; }",
    "  body += '\\n';",
    '}',
    "body += '### Action Required\\n' + 'Please review the drifted resources and either:\\n1. Update the infrastructure code to match the actual state\\n2. Restore the resources to match the expected state\\n\\n';",
    'body += `[View workflow run](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId})`;',
    // List or update an issue with labels
    `const issues = await github.rest.issues.listForRepo({ owner: context.repo.owner, repo: context.repo.repo, state: 'open', labels: ['drift-detection', '${stack}'] });`,
    'let issueNumber;',
    'if (issues.data.length === 0) {',
    `  const created = await github.rest.issues.create({ owner: context.repo.owner, repo: context.repo.repo, title, body, labels: ['drift-detection', '${stack}'] });`,
    '  issueNumber = created.data.number;',
    '} else {',
    '  const issue = issues.data[0];',
    '  issueNumber = issue.number;',
    '  await github.rest.issues.createComment({ owner: context.repo.owner, repo: context.repo.repo, issue_number: issue.number, body });',
    '}',
    'return String(issueNumber ?? "");',
  ];
  return lines.join('\n');
}


function summaryScript(): string {
  return [
    '#!/bin/bash',
    'set -e',
    'echo "## Drift Detection Summary" >> $GITHUB_STEP_SUMMARY',
    'echo "" >> $GITHUB_STEP_SUMMARY',
    '',
    'total_stacks=0',
    'total_drifted=0',
    'total_errors=0',
    '',
    'shopt -s nullglob',
    'for file in drift-results-*.json drift-results/*/drift-results-*.json; do',
    '  if [[ -f "$file" ]]; then',
    '    stack=$(basename "$file" | sed -E \"s/^drift-results-([^.]+)\\.json$/\\1/\")',
    '    echo "### Stack: $stack" >> $GITHUB_STEP_SUMMARY',
    '    jq -r \'' +
      '. as $results |\n' +
      '"- Total stacks: " + ($results | length | tostring) + "\\n" +\n' +
      '"- Drifted: " + ([.[] | select(.driftStatus == "DRIFTED")] | length | tostring) + "\\n" +\n' +
      '"- Errors: " + ([.[] | select(.error)] | length | tostring) + "\\n" +\n' +
      '([.[] | select(.driftStatus == "DRIFTED")] | if length > 0 then "\\n**Drifted stacks:**\\n" + (map("  - " + .stackName + " (" + ((.driftedResources // []) | length | tostring) + " resources)") | join("\\n")) else "" end)\n' +
    '\'' +
    ' "$file" >> $GITHUB_STEP_SUMMARY',
    '    echo "" >> $GITHUB_STEP_SUMMARY',
    '    total_stacks=$((total_stacks + $(jq \"length\" \"$file\")))',
    '    total_drifted=$((total_drifted + $(jq \"[.[] | select(.driftStatus == \\\"DRIFTED\\\")] | length\" \"$file\")))',
    '    total_errors=$((total_errors + $(jq \"[.[] | select(.error)] | length\" \"$file\")))',
    '  fi',
    'done',
    '',
    'echo "### Overall Summary" >> $GITHUB_STEP_SUMMARY',
    'echo "- Total stacks checked: $total_stacks" >> $GITHUB_STEP_SUMMARY',
    'echo "- Total drifted stacks: $total_drifted" >> $GITHUB_STEP_SUMMARY',
    'echo "- Total errors: $total_errors" >> $GITHUB_STEP_SUMMARY',
    '',
    'if [[ $total_drifted -gt 0 ]]; then',
    '  echo "" >> $GITHUB_STEP_SUMMARY',
    '  echo "⚠️ **Action required:** Drift detected in $total_drifted stacks" >> $GITHUB_STEP_SUMMARY',
    'fi',
  ].join('\n');
}

function toKebabCase(s: string): string {
  return s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}


function toGithubJobId(s: string): string {
  // GitHub job_id must start with a letter or underscore and contain only A-Za-z0-9, '-', '_'
  // 1) Replace any disallowed chars with '-'
  let out = s.replace(/[^A-Za-z0-9_-]+/g, '-');
  // 2) Collapse consecutive dashes
  out = out.replace(/-+/g, '-');
  // 3) Trim leading/trailing dashes (underscores are allowed at start)
  out = out.replace(/^-+|-+$/g, '');
  // 4) Lowercase for consistency (not required by GitHub but keeps things stable)
  out = out.toLowerCase();
  // 5) Ensure it starts with a letter or underscore
  if (!out || !/^[a-z_]/i.test(out)) {
    out = `s-${out}`;
  }
  return out;
}
