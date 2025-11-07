# cdk-diff-pr-github-action

A small Projen-based helper library that wires GitHub workflows for:
- Creating CloudFormation Change Sets for your CDK stacks on pull requests and commenting a formatted diff back on the PR.
- Detecting CloudFormation drift on a schedule or manual trigger and producing a consolidated summary (optionally creating an issue).

It also provides ready‑to‑deploy IAM templates with the minimal permissions required for each workflow.

This package exposes four constructs:

- `CdkDiffStackWorkflow` — Generates one GitHub Actions workflow per stack to create a change set and render the diff back to the PR and Step Summary.
- `CdkDiffIamTemplate` — Emits a CloudFormation template file with minimal permissions for the Change Set workflow.
- `CdkDriftDetectionWorkflow` — Generates a GitHub Actions workflow to detect CloudFormation drift per stack, upload machine‑readable results, and aggregate a summary.
- `CdkDriftIamTemplate` — Emits a CloudFormation template file with minimal permissions for the Drift Detection workflow.

## Quick start

1) Add the constructs to your Projen project (in `.projenrc.ts`).
2) Synthesize with `npx projen`.
3) Commit the generated files.
4) Open a pull request or run the drift detection workflow.

## Usage: CdkDiffStackWorkflow

`CdkDiffStackWorkflow` renders a workflow per stack named `diff-<StackName>.yml` under `.github/workflows/`. It also generates a helper script at `.github/workflows/scripts/describe-cfn-changeset.ts` that formats the change set output and takes care of posting the PR comment and Step Summary.

Example `.projenrc.ts`:

```ts
import { awscdk } from 'projen';
import { CdkDiffStackWorkflow } from '@jjrawlins/cdk-diff-pr-github-action';

const project = new awscdk.AwsCdkConstructLibrary({
  // ... your usual settings ...
  workflowName: 'my-lib',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.85.0',
  github: true,
});

new CdkDiffStackWorkflow({
  project,
  stacks: [
    {
      stackName: 'MyAppStack',
      changesetRoleToAssumeArn: 'arn:aws:iam::123456789012:role/cdk-diff-role',
      changesetRoleToAssumeRegion: 'us-east-1',
      // Optional per‑stack OIDC override (if not using the defaults below)
      // oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      // oidcRegion: 'us-east-1',
    },
  ],
  // Default OIDC role/region used by all stacks unless overridden per‑stack
  oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
  oidcRegion: 'us-east-1',
  // Optional: Node version used in the workflow (default: '24.x')
  // nodeVersion: '24.x',
  // Optional: Yarn command to run CDK (default: 'cdk')
  // cdkYarnCommand: 'cdk',
  // Optional: Where to place the helper script (default: '.github/workflows/scripts/describe-cfn-changeset.ts')
  // scriptOutputPath: '.github/workflows/scripts/describe-cfn-changeset.ts',
});

project.synth();
```

### CdkDiffStackWorkflow props
- `project` (required) — Your Projen project instance.
- `stacks` (required) — Array of stack entries.
- `oidcRoleArn` (required unless provided per‑stack) — Default OIDC role ARN.
- `oidcRegion` (required unless provided per‑stack) — Default OIDC region.
- `nodeVersion` (optional, default `'24.x'`) — Node.js version for the workflow runner.
- `cdkYarnCommand` (optional, default `'cdk'`) — Yarn script/command to invoke CDK.
- `scriptOutputPath` (optional, default `'.github/workflows/scripts/describe-cfn-changeset.ts'`) — Where to write the helper script.

If neither top‑level OIDC defaults nor all per‑stack values are supplied, the construct throws a helpful error.

### Stack item fields
- `stackName` (required) — The CDK stack name to create the change set for.
- `changesetRoleToAssumeArn` (required) — The ARN of the role used to create the change set (role chaining after OIDC).
- `changesetRoleToAssumeRegion` (required) — The region for that role.
- `oidcRoleArn` (optional) — Per‑stack override for the OIDC role.
- `oidcRegion` (optional) — Per‑stack override for the OIDC region.

### What gets generated
- `.github/workflows/diff-<StackName>.yml` — One workflow per stack, triggered on PR open/sync/reopen.
- `.github/workflows/scripts/describe-cfn-changeset.ts` — A helper script that:
  - Polls `DescribeChangeSet` until terminal
  - Filters out ignorable logical IDs or resource types using environment variables `IGNORE_LOGICAL_IDS` and `IGNORE_RESOURCE_TYPES`
  - Renders an HTML table with actions, logical IDs, types, replacements, and changed properties
  - Prints the HTML, appends to the GitHub Step Summary, and (if `GITHUB_TOKEN` and `GITHUB_COMMENT_URL` are present) posts a PR comment

### Environment variables used by the change set script
- `STACK_NAME` (required) — Stack name to describe.
- `CHANGE_SET_NAME` (default: same as `STACK_NAME`).
- `AWS_REGION` — Region for CloudFormation API calls. The workflow sets this via the credentials action(s).
- `GITHUB_TOKEN` (optional) — If set with `GITHUB_COMMENT_URL`, posts a PR comment.
- `GITHUB_COMMENT_URL` (optional) — PR comments URL.
- `GITHUB_STEP_SUMMARY` (optional) — When present, appends the HTML to the step summary file.
- `IGNORE_LOGICAL_IDS` (optional) — Comma‑separated logical IDs to ignore (default includes `CDKMetadata`).
- `IGNORE_RESOURCE_TYPES` (optional) — Comma‑separated resource types to ignore (e.g., `AWS::CDK::Metadata`).

## Usage: CdkDiffIamTemplate

Emit an example IAM template you can deploy in your account for the Change Set workflow:

```ts
import { awscdk } from 'projen';
import { CdkDiffIamTemplate } from '@jjrawlins/cdk-diff-pr-github-action';

const project = new awscdk.AwsCdkConstructLibrary({
  // ...
});

new CdkDiffIamTemplate({
  project,
  roleName: 'cdk-diff-role',
  oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
  oidcRegion: 'us-east-1',
  // Optional: custom output path (default: 'cdk-diff-workflow-iam-template.yaml')
  // outputPath: 'infra/cdk-diff-iam.yaml',
});

project.synth();
```

This writes `cdk-diff-workflow-iam-template.yaml` at the project root (or your chosen `outputPath`). The template defines:
- Parameter `GitHubOIDCRoleArn` with a default from `oidcRoleArn` — the ARN of your existing GitHub OIDC role allowed to assume the change set role.
- IAM role `CdkChangesetRole` with minimal permissions for:
  - CloudFormation Change Set operations
  - Access to common CDK bootstrap S3 buckets and SSM parameters
  - `iam:PassRole` to `cloudformation.amazonaws.com`
- Outputs exporting the role name and ARN.

A Projen task is also added:

```bash
npx projen deploy-cdkdiff-iam-template -- --parameter-overrides GitHubOIDCRoleArn=... # plus any extra AWS CLI args
```

Use the created role ARN as `changesetRoleToAssumeArn` in `CdkDiffStackWorkflow`.

---

## Usage: CdkDriftDetectionWorkflow

`CdkDriftDetectionWorkflow` creates a single workflow file (default `drift-detection.yml`) that can run on a schedule and via manual dispatch. It generates a helper script at `.github/workflows/scripts/detect-drift.ts` (by default) that uses AWS SDK v3 to run drift detection, write optional machine‑readable JSON, and print an HTML report for the Step Summary.

Example `.projenrc.ts`:

```ts
import { awscdk } from 'projen';
import { CdkDriftDetectionWorkflow } from '@jjrawlins/cdk-diff-pr-github-action';

const project = new awscdk.AwsCdkConstructLibrary({ github: true, /* ... */ });

new CdkDriftDetectionWorkflow({
  project,
  workflowName: 'Drift Detection',            // optional; file name derived as 'drift-detection.yml'
  schedule: '0 1 * * *',                      // optional cron
  createIssues: true,                         // default true; create/update issue when drift detected on schedule
  oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
  oidcRegion: 'us-east-1',
  // Optional: Node version (default '24.x')
  // nodeVersion: '24.x',
  // Optional: Where to place the helper script (default '.github/workflows/scripts/detect-drift.ts')
  // scriptOutputPath: '.github/workflows/scripts/detect-drift.ts',
  stacks: [
    {
      stackName: 'MyAppStack-Prod',
      driftDetectionRoleToAssumeArn: 'arn:aws:iam::123456789012:role/cdk-drift-role',
      driftDetectionRoleToAssumeRegion: 'us-east-1',
      // failOnDrift: true, // optional (default true)
    },
  ],
});

project.synth();
```

### CdkDriftDetectionWorkflow props
- `project` (required) — Your Projen project instance.
- `stacks` (required) — Array of stacks to check.
- `oidcRoleArn` (required) — Default OIDC role ARN used before chaining into per‑stack drift roles.
- `oidcRegion` (required) — Default OIDC region.
- `workflowName` (optional, default `'drift-detection'`) — Human‑friendly workflow name; the file name is derived in kebab‑case.
- `schedule` (optional) — Cron expression for automatic runs.
- `createIssues` (optional, default `true`) — When true, scheduled runs will create/update a GitHub issue if drift is detected.
- `nodeVersion` (optional, default `'24.x'`) — Node.js version for the runner.
- `scriptOutputPath` (optional, default `'.github/workflows/scripts/detect-drift.ts'`) — Where to write the helper script.

### Per‑stack fields
- `stackName` (required) — The full CloudFormation stack name.
- `driftDetectionRoleToAssumeArn` (required) — Role to assume (after OIDC) for making drift API calls.
- `driftDetectionRoleToAssumeRegion` (required) — Region for that role and API calls.
- `failOnDrift` (optional, default `true`) — Intended to fail the detection step on drift. The provided script exits with non‑zero when drift is found; the job continues to allow artifact upload and issue creation.

### What gets generated
- `.github/workflows/<kebab(workflowName)>.yml` — A workflow with one job per stack plus a final summary job.
- `.github/workflows/scripts/detect-drift.ts` — Helper script that:
  - Starts drift detection and polls until completion
  - Lists non‑`IN_SYNC` resources and builds an HTML report
  - Writes optional JSON to `DRIFT_DETECTION_OUTPUT` when set
  - Prints to stdout and appends to the GitHub Step Summary when available

### Artifacts and summary
- Each stack job uploads `drift-results-<stack>.json` (if produced).
- A final `Drift Detection Summary` job downloads all artifacts and prints a consolidated summary.

### Manual dispatch
- The workflow exposes an input named `stack` with choices including each configured stack and an `all` option.
- Choose a specific stack to run drift detection for that stack only, or select `all` (or leave the input empty) to run all stacks.

Note: The default workflow does not post PR comments for drift. It can create/update an Issue on scheduled runs when `createIssues` is `true`.

### Post-notification steps (e.g., Slack)

You can add your own GitHub Action steps to run after the drift detection step for each stack using `postGitHubSteps`.
Provide your own Slack payload/markdown (this library no longer generates a payload step for you).

Option A: slackapi/slack-github-action (Incoming Webhook, official syntax)

```ts
new CdkDriftDetectionWorkflow({
  project,
  oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
  oidcRegion: 'us-east-1',
  stacks: [/* ... */],
  postGitHubSteps: ({ stack }) => {
    // Build a descriptive name per stack
    const name = `Notify Slack (${stack} post-drift)`;
    const step = {
      name,
      uses: 'slackapi/slack-github-action@v2.1.1',
      // by default, post steps run only when drift is detected; you can override `if`
      if: "always() && steps.drift.outcome == 'failure'",
      // Use official inputs: webhook + webhook-type, and a YAML payload with blocks
      with: {
        webhook: '${{ secrets.CDK_NOTIFICATIONS_SLACK_WEBHOOK }}',
        'webhook-type': 'incoming-webhook',
        payload: [
          'text: "** ${{ env.STACK_NAME }} ** has drifted!"',
          'blocks:',
          '  - type: "section"',
          '    text:',
          '      type: "mrkdwn"',
          '      text: "*Stack:* ${{ env.STACK_NAME }} (region ${{ env.AWS_REGION }}) has drifted:exclamation:"',
          '  - type: "section"',
          '    fields:',
          '      - type: "mrkdwn"',
          '        text: "*Stack ARN*\\n${{ steps.drift.outputs.stack-arn }}"',
          '      - type: "mrkdwn"',
          '        text: "*Issue*\\n<${{ github.server_url }}/${{ github.repository }}/issues/${{ steps.issue.outputs.result }}|#${{ steps.issue.outputs.result }}>"',
        ].join('\n'),
      },
    };
    return [step];
  },
});
```

Note: The Issue link requires `createIssues: true` (default) so that the `Create Issue on Drift` step runs before this Slack step and exposes `steps.issue.outputs.result`. This library orders the steps accordingly.

Details:
- `postGitHubSteps` can be:
  - an array of step objects, or
  - a factory function `({ stack }) => step | step[]`.
- Each step you provide is inserted after the results are uploaded.
- Default condition: if you do not set `if` on your step, it will default to `always() && steps.drift.outcome == 'failure'`.
- Available context/env you can use:
  - `${{ env.STACK_NAME }}`, `${{ env.DRIFT_DETECTION_OUTPUT }}`
  - `${{ steps.drift.outcome }}` — success/failure of the detect step
  - `${{ steps.drift.outputs.stack-arn }}` — Stack ARN resolved at runtime
  - `${{ steps.issue.outputs.result }}` — Issue number if the workflow created/found one (empty when not applicable)
```

## Usage: CdkDriftIamTemplate

Emit an example IAM template you can deploy in your account for the Drift Detection workflow:

```ts
import { awscdk } from 'projen';
import { CdkDriftIamTemplate } from '@jjrawlins/cdk-diff-pr-github-action';

const project = new awscdk.AwsCdkConstructLibrary({
  // ...
});

new CdkDriftIamTemplate({
  project,
  roleName: 'cdk-drift-role',
  oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
  oidcRegion: 'us-east-1',
  // Optional: custom output path (default: 'cdk-drift-workflow-iam-template.yaml')
  // outputPath: 'infra/cdk-drift-iam.yaml',
});

project.synth();
```

This writes `cdk-drift-workflow-iam-template.yaml` at the project root (or your chosen `outputPath`). The template defines:
- Parameter `GitHubOIDCRoleArn` with a default from `oidcRoleArn` — the ARN of your existing GitHub OIDC role allowed to assume this drift role.
- IAM role `CdkDriftRole` with minimal permissions for CloudFormation drift detection operations.
- Outputs exporting the role name and ARN.

A Projen task is also added:

```bash
npx projen deploy-cdkdrift-iam-template -- --parameter-overrides GitHubOIDCRoleArn=... # plus any extra AWS CLI args
```

## Testing

This repository includes Jest tests that snapshot the synthesized outputs from Projen and assert that:
- Diff workflows are created per stack and contain all expected steps.
- Drift detection workflow produces one job per stack and a summary job.
- Only one helper script file is generated per workflow type.
- Per‑stack OIDC overrides (where supported) are respected.
- Helpful validation errors are thrown for missing OIDC settings.
- The IAM template files contain the expected resources and outputs.

Run tests with:

```bash
yarn test
```

## Notes
- This package assumes your repository is configured with GitHub Actions and that you have a GitHub OIDC role configured in AWS.
- The generated scripts use the AWS SDK v3 for CloudFormation and, where applicable, the GitHub REST API.
