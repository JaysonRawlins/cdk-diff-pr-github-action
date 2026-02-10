import { GitHub, GithubWorkflow } from 'projen/lib/github';
import { JobPermission } from 'projen/lib/github/workflows-model';
import { CdkChangesetScript } from './bin/cdk-changeset-script';

const githubActionsAwsCredentialsVersion = 'v4';
const githubActionsCheckoutVersion = 'v4';
const githubActionsSetupNodeVersion = 'v4';

const MAX_WORKFLOW_FILENAME_LENGTH = 255;

export interface CdkDiffStack {
  readonly stackName: string;
  readonly changesetRoleToAssumeArn: string;
  readonly changesetRoleToAssumeRegion: string;
  readonly oidcRoleArn?: string; // Optional override for OIDC role
  readonly oidcRegion?: string; // Optional override for OIDC region
}

export interface CdkDiffStackWorkflowProps {
  readonly project: any; // avoid exporting projen types in public API
  readonly stacks: CdkDiffStack[];
  readonly oidcRoleArn?: string; // Default OIDC role ARN for all stacks (or each stack must have its own)
  readonly oidcRegion?: string; // Default OIDC region for all stacks (or each stack must have its own)
  readonly nodeVersion?: string;
  readonly cdkYarnCommand?: string;
  readonly scriptOutputPath?: string;
}
export class CdkDiffStackWorkflow {
  private static scriptCreated = false;

  constructor(props: CdkDiffStackWorkflowProps) {
    const cdkYarnCommand = props.cdkYarnCommand ?? 'cdk';
    const nodeVersion = props.nodeVersion ?? '24.x';
    const scriptOutputPath = props.scriptOutputPath ?? '.github/workflows/scripts/describe-cfn-changeset.ts';

    // Validate OIDC configuration
    this.validateOidcConfiguration(props);

    // Only create the changeset script once to avoid collisions
    if (!CdkDiffStackWorkflow.scriptCreated) {
      new CdkChangesetScript({
        project: props.project,
        outputPath: scriptOutputPath,
      });
      CdkDiffStackWorkflow.scriptCreated = true;
    }

    // Create a separate workflow for each stack
    for (const stack of props.stacks) {
      const sanitizedStackName = sanitizeForFileName(stack.stackName);
      const workflowName = buildWorkflowName('diff-', sanitizedStackName);
      const fileName = `${workflowName}.yml`;
      const gh = (props as any).project.github ?? new GitHub((props as any).project);
      const diffDeployWorkflow = new GithubWorkflow(gh, workflowName, { fileName });

      this.createWorkflowForStack(diffDeployWorkflow, stack, cdkYarnCommand, nodeVersion, scriptOutputPath, props.oidcRoleArn, props.oidcRegion);
    }
  }

  private validateOidcConfiguration(props: CdkDiffStackWorkflowProps): void {
    const hasDefaultOidcRole = !!props.oidcRoleArn;
    const hasDefaultOidcRegion = !!props.oidcRegion;

    // Check if all stacks have their own OIDC configuration
    const allStacksHaveOidcRole = props.stacks.every(stack => !!stack.oidcRoleArn);
    const allStacksHaveOidcRegion = props.stacks.every(stack => !!stack.oidcRegion);

    // Either defaults must be provided OR all stacks must have their own OIDC config
    if (!hasDefaultOidcRole && !allStacksHaveOidcRole) {
      throw new Error('Either provide default oidcRoleArn or specify oidcRoleArn for each stack');
    }

    if (!hasDefaultOidcRegion && !allStacksHaveOidcRegion) {
      throw new Error('Either provide default oidcRegion or specify oidcRegion for each stack');
    }
  }

  private createWorkflowForStack(
    workflow: GithubWorkflow,
    stack: CdkDiffStack,
    cdkYarnCommand: string,
    nodeVersion: string,
    scriptOutputPath: string,
    defaultOidcRoleArn?: string,
    defaultOidcRegion?: string,
  ) {
    // Sanitize stack name for CloudFormation API calls (must match [a-zA-Z][-a-zA-Z0-9]*, max 128 chars)
    // Original stack.stackName is preserved only for the CDK deploy target and step display names
    const sanitizedStackName = sanitizeForCloudFormation(stack.stackName);

    workflow.on({
      pullRequest: {
        types: ['opened', 'synchronize', 'reopened'],
      },
    });
    workflow.addJobs({
      diff: {
        runsOn: ['ubuntu-latest'],
        permissions: {
          idToken: JobPermission.WRITE,
          contents: JobPermission.READ,
          issues: JobPermission.WRITE,
          pullRequests: JobPermission.WRITE,
          packages: JobPermission.READ,
        },
        env: {
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
        },
        steps: [
          {
            uses: `actions/checkout@${githubActionsCheckoutVersion}`,
          },
          {
            uses: `actions/setup-node@${githubActionsSetupNodeVersion}`,
            with: {
              'node-version': nodeVersion,
              'registry-url': 'https://npm.pkg.github.com',
              'scope': '@${{ github.repository_owner }}',
              'token': '${{ secrets.GITHUB_TOKEN }}',
            },
          },
          {
            run: 'yarn install --frozen-lockfile',
            env: {
              NODE_AUTH_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
            },
          },
          {
            uses: `aws-actions/configure-aws-credentials@${githubActionsAwsCredentialsVersion}`,
            with: {
              'role-to-assume': stack.oidcRoleArn ?? defaultOidcRoleArn,
              'aws-region': stack.oidcRegion ?? defaultOidcRegion,
            },
          },
          {
            name: `Create Changeset for ${stack.stackName}`,
            run: `yarn ${cdkYarnCommand} deploy ${stack.stackName} --no-execute --change-set-name ${sanitizedStackName} --require-approval never`,
          },
          {
            id: 'creds',
            uses: `aws-actions/configure-aws-credentials@${githubActionsAwsCredentialsVersion}`,
            with: {
              'role-to-assume': stack.oidcRoleArn ?? defaultOidcRoleArn,
              'aws-region': stack.oidcRegion ?? defaultOidcRegion,
            },
          },
          {
            name: 'Assume CloudFormation Changeset Role',
            id: 'changeset-role',
            uses: `aws-actions/configure-aws-credentials@${githubActionsAwsCredentialsVersion}`,
            with: {
              'role-to-assume': stack.changesetRoleToAssumeArn,
              'role-chaining': true,
              'role-skip-session-tagging': true,
              'aws-region': stack.changesetRoleToAssumeRegion,
              'aws-access-key-id': '${{ steps.creds.outputs.aws-access-key-id }}',
              'aws-secret-access-key': '${{ steps.creds.outputs.aws-secret-access-key }}',
              'aws-session-token': '${{ steps.creds.outputs.aws-session-token }}',
            },
          },
          {
            name: `Describe change set for ${stack.stackName}`,
            run: `npx ts-node ${scriptOutputPath}`,
            env: {
              STACK_NAME: sanitizedStackName,
              CHANGE_SET_NAME: sanitizedStackName,
              GITHUB_COMMENT_URL: '${{ github.event.pull_request.comments_url }}',
              GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
            },
          },
          {
            name: `Delete changeset for ${stack.stackName}`,
            run: `aws cloudformation delete-change-set --change-set-name ${sanitizedStackName} --stack-name ${sanitizedStackName} --region ${stack.changesetRoleToAssumeRegion}`,
          },
        ],
      },
    });
  }
}

export function sanitizeForFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

export const MAX_CF_IDENTIFIER_LENGTH = 128;

export function sanitizeForCloudFormation(name: string): string {
  // CloudFormation stack/changeset names: [a-zA-Z][-a-zA-Z0-9]*, max 128 chars
  let sanitized = name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  // Ensure it starts with a letter
  if (!sanitized || !/^[a-zA-Z]/.test(sanitized)) {
    sanitized = `cs-${sanitized}`;
  }
  // Truncate from the beginning to keep the stack name (end) intact
  if (sanitized.length > MAX_CF_IDENTIFIER_LENGTH) {
    sanitized = sanitized.slice(-MAX_CF_IDENTIFIER_LENGTH).replace(/^-+/, '');
    // Re-check starts with a letter after truncation
    if (!/^[a-zA-Z]/.test(sanitized)) {
      sanitized = `cs-${sanitized.slice(0, MAX_CF_IDENTIFIER_LENGTH - 3)}`;
    }
  }
  return sanitized;
}

function buildWorkflowName(prefix: string, sanitizedName: string, maxLength: number = MAX_WORKFLOW_FILENAME_LENGTH): string {
  const ext = '.yml';
  const full = `${prefix}${sanitizedName}${ext}`;
  if (full.length <= maxLength) {
    return `${prefix}${sanitizedName}`;
  }
  const available = maxLength - prefix.length - ext.length;
  if (available <= 0) {
    throw new Error(`Workflow prefix and extension exceed maximum filename length of ${maxLength}`);
  }
  // Truncate from the beginning to keep the stack name (end) intact
  return `${prefix}${sanitizedName.slice(-available).replace(/^-+/, '')}`;
}
