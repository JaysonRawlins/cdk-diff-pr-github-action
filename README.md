# cdk-diff-pr-github-action

A small Projen-based helper library that wires a GitHub workflow to create a CloudFormation Change Set for a CDK stack on every pull request, then comments the formatted diff back on the PR. It also provides a ready‑to‑deploy IAM template you can use to grant the minimal permissions required for the workflow to create and inspect change sets.

This package exposes two constructs:

- `CdkDiffStackWorkflow` — Generates one GitHub Actions workflow per stack that:
  - Assumes your GitHub OIDC role
  - Optionally chains into a separate CDK deploy role
  - Runs `cdk deploy --no-execute` to create a change set
  - Runs a generated script to render the change set as an HTML table and posts it to the PR and to the GitHub Step Summary
  - Cleans up the change set

- `CdkDiffIamTemplate` — Emits a CloudFormation template file (`cdk-diff-workflow-iam-template.yaml`) containing an example IAM role policy with the minimal permissions to create, describe, and delete CloudFormation change sets and read common CDK bootstrap resources. You can launch this in your account and then reference the created role.

## Quick start

1) Add the constructs to your Projen project (in `.projenrc.ts`).
2) Synthesize with `npx projen`.
3) Commit the generated files.
4) Open a pull request — the workflow will create a change set and comment the diff.

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
  // Stacks to diff on PRs
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
  // nodeVersion: '20.x',
  // Optional: Yarn command to run CDK (default: 'cdk')
  // cdkYarnCommand: 'cdk',
  // Optional: Where to place the helper script
  // scriptOutputPath: '.github/workflows/scripts/describe-cfn-changeset.ts',
});

project.synth();
```

### Required properties
- `project` (AwsCdkTypeScriptApp) — Your Projen project instance.
- `stacks` (array) — One entry per CDK stack you want a diff for.
- OIDC configuration: either
  - Provide `oidcRoleArn` and `oidcRegion` at the top level, or
  - Provide `oidcRoleArn` and `oidcRegion` on every stack item.

If neither the defaults nor all per‑stack values are supplied, the construct throws with a helpful error.

### Stack item fields
- `stackName` — The CDK stack workflowName to create the change set for.
- `changesetRoleToAssumeArn` — The ARN of the role used to create the change set (role chaining after OIDC).
- `changesetRoleToAssumeRegion` — The region for that role.
- `oidcRoleArn` (optional) — Per‑stack override for the OIDC role.
- `oidcRegion` (optional) — Per‑stack override for the OIDC region.

### What gets generated
- `.github/workflows/diff-<StackName>.yml` — One workflow per stack, triggered on PR open/sync/reopen.
- `.github/workflows/scripts/describe-cfn-changeset.ts` — A helper script that:
  - Polls `DescribeChangeSet` until terminal
  - Filters out ignorable logical IDs or resource types using environment variables `IGNORE_LOGICAL_IDS` and `IGNORE_RESOURCE_TYPES`
  - Renders an HTML table with actions, logical IDs, types, replacements, and changed properties
  - Prints the HTML, appends to the GitHub Step Summary, and (if `GITHUB_TOKEN` and `GITHUB_COMMENT_URL` are present) posts a PR comment

### Environment variables used by the script
- `STACK_NAME` (required) — Stack workflowName to describe.
- `CHANGE_SET_NAME` (default: same as `STACK_NAME`).
- `AWS_REGION` — Region for CloudFormation API calls. The workflow sets this via the credentials action.
- `GITHUB_TOKEN` (optional) — If set with `GITHUB_COMMENT_URL`, posts a PR comment.
- `GITHUB_COMMENT_URL` (optional) — PR comments URL.
- `GITHUB_STEP_SUMMARY` (optional) — When present, appends the HTML to the step summary file.
- `IGNORE_LOGICAL_IDS` (optional) — Comma‑separated logical IDs to ignore (default includes `CDKMetadata`).
- `IGNORE_RESOURCE_TYPES` (optional) — Comma‑separated resource types to ignore (e.g., `AWS::CDK::Metadata`).

## Usage: CdkDiffIamTemplate

Add `CdkDiffIamTemplate` to your Projen project to emit an example IAM template you can deploy in your account:

```ts
import { awscdk } from 'projen';
import { CdkDiffIamTemplate } from '@jjrawlins/cdk-diff-pr-github-action';

const project = new awscdk.AwsCdkConstructLibrary({
  // ...
});

new CdkDiffIamTemplate({ project });

project.synth();
```

This will write `cdk-diff-workflow-iam-template.yaml` at the project root. The template defines:
- A parameter `GitHubOIDCRoleArn` — pass the ARN of your existing GitHub OIDC role that will assume the change set role.
- An IAM role `CdkChangesetRole` with minimal permissions for:
  - CloudFormation Change Set operations
  - Access to common CDK bootstrap S3 buckets and SSM parameters
  - `iam:PassRole` to `cloudformation.amazonaws.com`
- Outputs exporting the role workflowName and ARN.

You can deploy the file via CloudFormation/StackSets and then use the created role ARN as the `changesetRoleToAssumeArn` in your workflow configuration.

## Testing

This repository includes Jest tests that snapshot the synthesized outputs from Projen and assert that:
- Workflows are created per stack and contain all expected steps.
- Only one script file is generated.
- Per‑stack OIDC overrides are respected.
- Helpful validation errors are thrown for missing OIDC settings.
- The IAM template file contains the expected resources and outputs.

Run tests with:

```bash
yarn test
```

## Notes
- This package assumes your repository is configured with GitHub Actions and that you have a GitHub OIDC role configured in AWS.
- The generated script uses the AWS SDK v3 for CloudFormation and posts comments using the GitHub REST API.
