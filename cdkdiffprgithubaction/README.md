# cdk-diff-pr-github-action

A [Projen](https://projen.io/) construct library that surfaces **CloudFormation change set diffs and drift status directly on your pull requests** so reviewers can see exactly what will change before merging.

## Why this exists

`cdk diff` output disappears into CI logs that nobody reads. Meanwhile, a single property change on an RDS instance or EC2 "pet" server can trigger a **resource replacement** — destroying the database or instance and recreating it from scratch. If that replacement slips through code review unnoticed, the result is data loss and downtime.

This construct was built to make those dangerous changes impossible to miss:

* **Replacement column front and center** — Every change set row shows whether CloudFormation will modify the resource in place or **replace** it, with before/after property values so reviewers can understand *why*.
* **Comment appears on the PR itself** — No digging through workflow logs. The diff table is posted (and updated in place) as a PR comment and in the GitHub Step Summary.
* **Drift banner** — If the stack has drifted from its template, a warning banner is prepended to the comment so reviewers know the baseline is already out of sync.

If you have ever lost an EC2 instance, an RDS database, or an ElastiCache cluster to an unexpected CloudFormation replacement, this tool is for you.

---


A library that provides GitHub workflows and IAM templates for:

* Creating CloudFormation Change Sets for your CDK stacks on pull requests and commenting a formatted diff back on the PR.
* Detecting CloudFormation drift on a schedule or manual trigger and producing a consolidated summary (optionally creating an issue).
* Deploying IAM roles across AWS Organizations using StackSets.

It also provides ready-to-deploy IAM templates with the minimal permissions required for each workflow.

**Works with or without Projen** -- The StackSet generator can be used standalone in any Node.js project.

This package exposes five constructs:

* `CdkDiffStackWorkflow` — Generates one GitHub Actions workflow per stack to create a change set and render the diff back to the PR and Step Summary.
* `CdkDiffIamTemplate` — Emits a CloudFormation template file with minimal permissions for the Change Set workflow.
* `CdkDriftDetectionWorkflow` — Generates a GitHub Actions workflow to detect CloudFormation drift per stack, upload machine‑readable results, and aggregate a summary.
* `CdkDriftIamTemplate` — Emits a CloudFormation template file with minimal permissions for the Drift Detection workflow.
* `CdkDiffIamTemplateStackSet` — Creates a CloudFormation StackSet template for org-wide deployment of GitHub OIDC and IAM roles (Projen integration).
* `CdkDiffIamTemplateStackSetGenerator` — Pure generator class for StackSet templates (no Projen dependency).

## Quick start

1) Add the constructs to your Projen project (in `.projenrc.ts`).
2) Synthesize with `npx projen`.
3) Commit the generated files.
4) Open a pull request or run the drift detection workflow.

## End-to-end example

A realistic setup for a CDK Pipelines project with multiple stages and accounts. This generates one diff workflow per stack, a shared IAM template, and a scheduled drift detection workflow.

```go
// .projenrc.ts
import { awscdk } from 'projen';
import {
  CdkDiffStackWorkflow,
  CdkDiffIamTemplate,
  CdkDriftDetectionWorkflow,
} from '@jjrawlins/cdk-diff-pr-github-action';

const project = new awscdk.AwsCdkTypeScriptApp({
  name: 'my-data-platform',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.170.0',
  github: true,
});

// --- Change Set Diff Workflows (one per stack) ---
// stackName is the CDK construct path used with `cdk deploy <target>`.
// For CDK Pipelines, this is typically: pipeline/Stage/Stack
// The construct automatically resolves the real CloudFormation stack name
// from cdk.out at runtime (e.g., "my-stage-dev-my-stack").

new CdkDiffStackWorkflow({
  project,
  oidcRoleArn: 'arn:aws:iam::111111111111:role/GitHubOIDCRole',
  oidcRegion: 'us-east-1',
  stacks: [
    {
      stackName: 'my-pipeline/dev/DatabaseStack',
      changesetRoleToAssumeArn: 'arn:aws:iam::111111111111:role/CdkChangesetRole',
      changesetRoleToAssumeRegion: 'us-east-1',
    },
    {
      stackName: 'my-pipeline/dev/ComputeStack',
      changesetRoleToAssumeArn: 'arn:aws:iam::111111111111:role/CdkChangesetRole',
      changesetRoleToAssumeRegion: 'us-east-1',
    },
    {
      // Cross-account: prod stacks can use a different OIDC role and region
      stackName: 'my-pipeline/prod/DatabaseStack',
      changesetRoleToAssumeArn: 'arn:aws:iam::222222222222:role/CdkChangesetRole',
      changesetRoleToAssumeRegion: 'us-east-1',
      oidcRoleArn: 'arn:aws:iam::222222222222:role/GitHubOIDCRole',
      oidcRegion: 'us-east-1',
    },
  ],
});

// --- IAM Template (deploy once per account) ---
new CdkDiffIamTemplate({
  project,
  roleName: 'CdkChangesetRole',
  createOidcRole: true,
  githubOidc: {
    owner: 'my-org',
    repositories: ['my-data-platform'],
    branches: ['main'],
  },
});

// --- Drift Detection (scheduled + manual) ---
new CdkDriftDetectionWorkflow({
  project,
  schedule: '0 6 * * 1', // Every Monday at 6 AM UTC
  oidcRoleArn: 'arn:aws:iam::111111111111:role/GitHubOIDCRole',
  oidcRegion: 'us-east-1',
  stacks: [
    {
      stackName: 'dev-DatabaseStack',
      driftDetectionRoleToAssumeArn: 'arn:aws:iam::111111111111:role/CdkDriftRole',
      driftDetectionRoleToAssumeRegion: 'us-east-1',
    },
  ],
});

project.synth();
```

After `npx projen`, this generates:

* `.github/workflows/diff-my-pipeline-dev-databasestack.yml`
* `.github/workflows/diff-my-pipeline-dev-computestack.yml`
* `.github/workflows/diff-my-pipeline-prod-databasestack.yml`
* `.github/workflows/scripts/describe-cfn-changeset.ts`
* `.github/workflows/drift-detection.yml`
* `.github/workflows/scripts/detect-drift.ts`
* `cdk-diff-workflow-iam-template.yaml`

When a pull request is opened, each diff workflow runs automatically and posts a comment like this:

| Action | ID | Type | Replacement | Details |
|--------|-----|------|-------------|---------|
| 🔵 Modify | MyDatabase | AWS::RDS::DBInstance | **True** | 🔵 **DBInstanceClass**: `db.t3.medium` -> `db.t3.large` |
| 🔵 Modify | MyFunction | AWS::Lambda::Function | False | 🔵 **Runtime**: `nodejs18.x` -> `nodejs20.x` |

The **Replacement: True** on the RDS instance is exactly the kind of change this tool is designed to catch before it reaches production.

## Usage: CdkDiffStackWorkflow

`CdkDiffStackWorkflow` renders a workflow per stack named `diff-<StackName>.yml` under `.github/workflows/`. It also generates a helper script at `.github/workflows/scripts/describe-cfn-changeset.ts` that formats the change set output and takes care of posting the PR comment and Step Summary.

Example `.projenrc.ts`:

```go
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

* `project` (required) — Your Projen project instance.
* `stacks` (required) — Array of stack entries.
* `oidcRoleArn` (required unless provided per‑stack) — Default OIDC role ARN.
* `oidcRegion` (required unless provided per‑stack) — Default OIDC region.
* `nodeVersion` (optional, default `'24.x'`) — Node.js version for the workflow runner.
* `cdkYarnCommand` (optional, default `'cdk'`) — Yarn script/command to invoke CDK.
* `scriptOutputPath` (optional, default `'.github/workflows/scripts/describe-cfn-changeset.ts'`) — Where to write the helper script.

If neither top‑level OIDC defaults nor all per‑stack values are supplied, the construct throws a helpful error.

### Stack item fields

* `stackName` (required) — The CDK stack name to create the change set for.
* `changesetRoleToAssumeArn` (required) — The ARN of the role used to create the change set (role chaining after OIDC).
* `changesetRoleToAssumeRegion` (required) — The region for that role.
* `oidcRoleArn` (optional) — Per‑stack override for the OIDC role.
* `oidcRegion` (optional) — Per‑stack override for the OIDC region.

### What gets generated

* `.github/workflows/diff-<StackName>.yml` — One workflow per stack, triggered on PR open/sync/reopen.
* `.github/workflows/scripts/describe-cfn-changeset.ts` — A helper script that:

  * Polls `DescribeChangeSet` until terminal
  * Filters out ignorable logical IDs or resource types using environment variables `IGNORE_LOGICAL_IDS` and `IGNORE_RESOURCE_TYPES`
  * Renders an HTML table with actions, logical IDs, types, replacements, and changed properties
  * **Checks cached drift status** via `DescribeStacks` — if the stack has drifted, a warning banner with drifted resource details is prepended to the output (non-fatal; degrades gracefully if IAM permissions are missing)
  * Prints the HTML and appends to the GitHub Step Summary
  * **Upserts the PR comment** — uses an HTML marker (`<!-- cdk-diff:stack:STACK_NAME -->`) to find and update an existing comment instead of creating duplicates on every push

### Change Set Output Format

The change set script uses the CloudFormation `IncludePropertyValues` API feature to show **actual before/after values** for changed properties, not just property names.

**Example PR comment:**

> **Warning: Stack has drifted (2 resources out of sync)**
>
> Last drift check: 2025-01-15T10:30:00.000Z
>
> <details><summary>View drifted resources</summary>
>
> | Resource | Type | Drift Status |
> |----------|------|-------------|
> | MySecurityGroup | AWS::EC2::SecurityGroup | MODIFIED |
> | OldBucket | AWS::S3::Bucket | DELETED |
>
> </details>

| Action | ID | Type | Replacement | Details |
|--------|-----|------|-------------|---------|
| 🔵 Modify | MyDatabase | AWS::RDS::DBInstance | **True** | 🔵 **DBInstanceClass**: `db.t3.medium` -> `db.t3.large` |
| 🔵 Modify | MyLambdaFunction | AWS::Lambda::Function | False | 🔵 **Runtime**: `nodejs18.x` -> `nodejs20.x` |
| 🟢 Add | NewSecurityGroup | AWS::EC2::SecurityGroup | - | |
| 🔴 Remove | OldRole | AWS::IAM::Role | - | |

**Features:**

* **Replacement column** highlights when CloudFormation will **destroy and recreate** a resource — critical for stateful resources like databases, EC2 instances, and file systems
* **Drift banner** — if the stack has drifted, a warning with drifted resource details appears above the change set table so reviewers know the baseline state
* **Comment upsert** — each stack's comment is updated in place on subsequent pushes instead of creating duplicates; uses an HTML marker for reliable find-and-replace
* **Color-coded indicators**: 🟢 Added, 🔵 Modified, 🔴 Removed
* **Inline values for small changes**: Shows `before -> after` directly in the table
* **Collapsible details for large values**: IAM policies, tags, and other large JSON values are wrapped in expandable `<details>` elements to keep the table readable
* **All attribute types supported**: Properties, Tags, Metadata, etc.
* **HTML-escaped values**: Prevents XSS from property values

### Environment variables used by the change set script

* `STACK_NAME` (required) — Stack name to describe.
* `CHANGE_SET_NAME` (default: same as `STACK_NAME`).
* `AWS_REGION` — Region for CloudFormation API calls. The workflow sets this via the credentials action(s).
* `GITHUB_TOKEN` (optional) — If set with `GITHUB_COMMENT_URL`, posts a PR comment.
* `GITHUB_COMMENT_URL` (optional) — PR comments URL.
* `GITHUB_STEP_SUMMARY` (optional) — When present, appends the HTML to the step summary file.
* `IGNORE_LOGICAL_IDS` (optional) — Comma‑separated logical IDs to ignore (default includes `CDKMetadata`).
* `IGNORE_RESOURCE_TYPES` (optional) — Comma‑separated resource types to ignore (e.g., `AWS::CDK::Metadata`).

## Usage: CdkDiffIamTemplate

Emit an IAM template you can deploy in your account for the Change Set workflow. Supports two modes:

1. **External OIDC Role** — Reference an existing GitHub OIDC role (original behavior)
2. **Self-Contained** — Create the GitHub OIDC provider and role within the same template (new)

### Option 1: Using an Existing OIDC Role (External)

Use this when you already have a GitHub OIDC provider and role set up in your account.

#### With Projen

```go
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

#### Without Projen (Standalone Generator)

```go
import { CdkDiffIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action';
import * as fs from 'fs';

const template = CdkDiffIamTemplateGenerator.generateTemplate({
  roleName: 'cdk-diff-role',
  oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
  oidcRegion: 'us-east-1',
});

fs.writeFileSync('cdk-diff-iam-template.yaml', template);
```

### Option 2: Self-Contained Template (Create OIDC Role)

Use this when you want a single template that creates everything needed — the GitHub OIDC provider, OIDC role, and changeset role. This simplifies deployment and pairs well with the `CdkDiffStackWorkflow`.

#### With Projen

```go
import { awscdk } from 'projen';
import { CdkDiffIamTemplate } from '@jjrawlins/cdk-diff-pr-github-action';

const project = new awscdk.AwsCdkConstructLibrary({
  // ...
});

new CdkDiffIamTemplate({
  project,
  roleName: 'CdkChangesetRole',
  createOidcRole: true,
  oidcRoleName: 'GitHubOIDCRole',  // Optional, default: 'GitHubOIDCRole'
  githubOidc: {
    owner: 'my-org',                          // GitHub org or username
    repositories: ['infra-repo', 'app-repo'], // Repos allowed to assume roles
    branches: ['main', 'release/*'],          // Branch patterns (default: ['*'])
  },
  // Optional: Skip OIDC provider creation if it already exists
  // skipOidcProviderCreation: true,
});

project.synth();
```

#### Without Projen (Standalone Generator)

```go
import { CdkDiffIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action';
import * as fs from 'fs';

const template = CdkDiffIamTemplateGenerator.generateTemplate({
  roleName: 'CdkChangesetRole',
  createOidcRole: true,
  oidcRoleName: 'GitHubOIDCRole',
  githubOidc: {
    owner: 'my-org',
    repositories: ['infra-repo'],
    branches: ['main'],
  },
});

fs.writeFileSync('cdk-diff-iam-template.yaml', template);
```

#### With Existing OIDC Provider (Skip Creation)

If your account already has a GitHub OIDC provider but you want the template to create the roles:

```go
new CdkDiffIamTemplate({
  project,
  roleName: 'CdkChangesetRole',
  createOidcRole: true,
  skipOidcProviderCreation: true,  // Account already has OIDC provider
  githubOidc: {
    owner: 'my-org',
    repositories: ['*'],  // All repos in org
  },
});
```

### Deploy Task

A Projen task is added for easy deployment:

```bash
npx projen deploy-cdkdiff-iam-template -- --parameter-overrides GitHubOIDCRoleArn=... # plus any extra AWS CLI args
```

### CdkDiffIamTemplate Props

| Property | Type | Description |
|----------|------|-------------|
| `roleName` | `string` | Name for the changeset IAM role (required) |
| `oidcRoleArn` | `string?` | ARN of existing GitHub OIDC role. Required when `createOidcRole` is false. |
| `oidcRegion` | `string?` | Region for OIDC trust condition. Required when `createOidcRole` is false. |
| `createOidcRole` | `boolean?` | Create OIDC role within template (default: false) |
| `oidcRoleName` | `string?` | Name of OIDC role to create (default: 'GitHubOIDCRole') |
| `githubOidc` | `GitHubOidcConfig?` | GitHub OIDC config. Required when `createOidcRole` is true. |
| `skipOidcProviderCreation` | `boolean?` | Skip OIDC provider if it exists (default: false) |
| `outputPath` | `string?` | Template output path (default: 'cdk-diff-workflow-iam-template.yaml') |

### What the Template Creates

**External OIDC Role mode:**

* Parameter `GitHubOIDCRoleArn` — ARN of your existing GitHub OIDC role
* IAM role `CdkChangesetRole` with minimal permissions for change set operations
* Outputs: `CdkChangesetRoleArn`, `CdkChangesetRoleName`

**Self-Contained mode (`createOidcRole: true`):**

* GitHub OIDC Provider (unless `skipOidcProviderCreation: true`)
* IAM role `GitHubOIDCRole` with trust policy for GitHub Actions
* IAM role `CdkChangesetRole` with minimal permissions (trusts the OIDC role)
* Outputs: `GitHubOIDCProviderArn`, `GitHubOIDCRoleArn`, `GitHubOIDCRoleName`, `CdkChangesetRoleArn`, `CdkChangesetRoleName`

**Changeset Role Permissions:**

* CloudFormation Change Set operations
* Access to CDK bootstrap S3 buckets and SSM parameters
* `iam:PassRole` to `cloudformation.amazonaws.com`

Use the created changeset role ARN as `changesetRoleToAssumeArn` in `CdkDiffStackWorkflow`.

---


## Usage: CdkDriftDetectionWorkflow

`CdkDriftDetectionWorkflow` creates a single workflow file (default `drift-detection.yml`) that can run on a schedule and via manual dispatch. It generates a helper script at `.github/workflows/scripts/detect-drift.ts` (by default) that uses AWS SDK v3 to run drift detection, write optional machine‑readable JSON, and print an HTML report for the Step Summary.

Example `.projenrc.ts`:

```go
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

* `project` (required) — Your Projen project instance.
* `stacks` (required) — Array of stacks to check.
* `oidcRoleArn` (required) — Default OIDC role ARN used before chaining into per‑stack drift roles.
* `oidcRegion` (required) — Default OIDC region.
* `workflowName` (optional, default `'drift-detection'`) — Human‑friendly workflow name; the file name is derived in kebab‑case.
* `schedule` (optional) — Cron expression for automatic runs.
* `createIssues` (optional, default `true`) — When true, scheduled runs will create/update a GitHub issue if drift is detected.
* `nodeVersion` (optional, default `'24.x'`) — Node.js version for the runner.
* `scriptOutputPath` (optional, default `'.github/workflows/scripts/detect-drift.ts'`) — Where to write the helper script.

### Per‑stack fields

* `stackName` (required) — The full CloudFormation stack name.
* `driftDetectionRoleToAssumeArn` (required) — Role to assume (after OIDC) for making drift API calls.
* `driftDetectionRoleToAssumeRegion` (required) — Region for that role and API calls.
* `failOnDrift` (optional, default `true`) — Intended to fail the detection step on drift. The provided script exits with non‑zero when drift is found; the job continues to allow artifact upload and issue creation.

### What gets generated

* `.github/workflows/<kebab(workflowName)>.yml` — A workflow with one job per stack plus a final summary job.
* `.github/workflows/scripts/detect-drift.ts` — Helper script that:

  * Starts drift detection and polls until completion
  * Lists non‑`IN_SYNC` resources and builds an HTML report
  * Writes optional JSON to `DRIFT_DETECTION_OUTPUT` when set
  * Prints to stdout and appends to the GitHub Step Summary when available

### Artifacts and summary

* Each stack job uploads `drift-results-<stack>.json` (if produced).
* A final `Drift Detection Summary` job downloads all artifacts and prints a consolidated summary.

### Manual dispatch

* The workflow exposes an input named `stack` with choices including each configured stack and an `all` option.
* Choose a specific stack to run drift detection for that stack only, or select `all` (or leave the input empty) to run all stacks.

Note: The default workflow does not post PR comments for drift. It can create/update an Issue on scheduled runs when `createIssues` is `true`.

### Post-notification steps (e.g., Slack)

You can add your own GitHub Action steps to run after the drift detection step for each stack using `postGitHubSteps`.
Provide your own Slack payload/markdown (this library no longer generates a payload step for you).

Option A: slackapi/slack-github-action (Incoming Webhook, official syntax)

```go
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

* `postGitHubSteps` can be:

  * an array of step objects, or
  * a factory function `({ stack }) => step | step[]`.
* Each step you provide is inserted after the results are uploaded.
* Default condition: if you do not set `if` on your step, it will default to `always() && steps.drift.outcome == 'failure'`.
* Available context/env you can use:

  * `${{ env.STACK_NAME }}`, `${{ env.DRIFT_DETECTION_OUTPUT }}`
  * `${{ steps.drift.outcome }}` — success/failure of the detect step
  * `${{ steps.drift.outputs.stack-arn }}` — Stack ARN resolved at runtime
  * `${{ steps.issue.outputs.result }}` — Issue number if the workflow created/found one (empty when not applicable)

```

## Usage: CdkDriftIamTemplate

Emit an example IAM template you can deploy in your account for the Drift Detection workflow.

### With Projen

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

A Projen task is also added:

```bash
npx projen deploy-cdkdrift-iam-template -- --parameter-overrides GitHubOIDCRoleArn=... # plus any extra AWS CLI args
```

### Without Projen (Standalone Generator)

```go
import { CdkDriftIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action';
import * as fs from 'fs';

const template = CdkDriftIamTemplateGenerator.generateTemplate({
  roleName: 'cdk-drift-role',
  oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
  oidcRegion: 'us-east-1',
});

fs.writeFileSync('cdk-drift-iam-template.yaml', template);

// Get the deploy command
const deployCmd = CdkDriftIamTemplateGenerator.generateDeployCommand('cdk-drift-iam-template.yaml');
console.log('Deploy with:', deployCmd);
```

### What the template defines

* Parameter `GitHubOIDCRoleArn` with a default from `oidcRoleArn` — the ARN of your existing GitHub OIDC role allowed to assume this drift role.
* IAM role `CdkDriftRole` with minimal permissions for CloudFormation drift detection operations.
* Outputs exporting the role name and ARN.

---


## Usage: CdkDiffIamTemplateStackSet (Org-Wide Deployment)

`CdkDiffIamTemplateStackSet` creates a CloudFormation StackSet template for deploying GitHub OIDC provider, OIDC role, and CDK diff/drift IAM roles across an entire AWS Organization. This is the recommended approach for organizations that want to enable CDK diff/drift workflows across multiple accounts.

### Architecture

Each account in your organization gets:

* **GitHub OIDC Provider** — Authenticates GitHub Actions workflows
* **GitHubOIDCRole** — Trusts the OIDC provider with repo/branch restrictions
* **CdkChangesetRole** — For PR change set previews (trusts GitHubOIDCRole)
* **CdkDriftRole** — For drift detection (trusts GitHubOIDCRole)

This is a self-contained deployment with **no role chaining required**.

### With Projen

```go
import { awscdk } from 'projen';
import { CdkDiffIamTemplateStackSet } from '@jjrawlins/cdk-diff-pr-github-action';

const project = new awscdk.AwsCdkConstructLibrary({ /* ... */ });

new CdkDiffIamTemplateStackSet({
  project,
  githubOidc: {
    owner: 'my-org',                          // GitHub org or username
    repositories: ['infra-repo', 'app-repo'], // Repos allowed to assume roles
    branches: ['main', 'release/*'],          // Branch patterns (default: ['*'])
  },
  targetOrganizationalUnitIds: ['ou-xxxx-xxxxxxxx'], // Target OUs
  regions: ['us-east-1', 'eu-west-1'],               // Target regions
  // Optional settings:
  // oidcRoleName: 'GitHubOIDCRole',       // default
  // changesetRoleName: 'CdkChangesetRole', // default
  // driftRoleName: 'CdkDriftRole',         // default
  // roleSelection: StackSetRoleSelection.BOTH, // BOTH, CHANGESET_ONLY, or DRIFT_ONLY
  // delegatedAdmin: true,                  // Use --call-as DELEGATED_ADMIN (default: true)
});

project.synth();
```

This creates:

* `cdk-diff-workflow-stackset-template.yaml` — CloudFormation template
* Projen tasks for StackSet management

**Projen tasks:**

```bash
npx projen stackset-create          # Create the StackSet
npx projen stackset-update          # Update the StackSet template
npx projen stackset-deploy-instances # Deploy to target OUs/regions
npx projen stackset-delete-instances # Remove stack instances
npx projen stackset-delete          # Delete the StackSet
npx projen stackset-describe        # Show StackSet status
npx projen stackset-list-instances  # List all instances
```

### Without Projen (Standalone Generator)

For non-Projen projects, use `CdkDiffIamTemplateStackSetGenerator` directly:

```go
import {
  CdkDiffIamTemplateStackSetGenerator
} from '@jjrawlins/cdk-diff-pr-github-action';
import * as fs from 'fs';

// Generate the CloudFormation template
const template = CdkDiffIamTemplateStackSetGenerator.generateTemplate({
  githubOidc: {
    owner: 'my-org',
    repositories: ['infra-repo'],
    branches: ['main'],
  },
});

// Write to file
fs.writeFileSync('stackset-template.yaml', template);

// Get AWS CLI commands for StackSet operations
const commands = CdkDiffIamTemplateStackSetGenerator.generateCommands({
  stackSetName: 'cdk-diff-workflow-iam-stackset',
  templatePath: 'stackset-template.yaml',
  targetOrganizationalUnitIds: ['ou-xxxx-xxxxxxxx'],
  regions: ['us-east-1'],
});

console.log('Create StackSet:', commands['stackset-create']);
console.log('Deploy instances:', commands['stackset-deploy-instances']);
```

### GitHub Actions Workflow (Simplified)

With per-account OIDC, your workflow is simplified — no role chaining needed:

```yaml
jobs:
  diff:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ env.ACCOUNT_ID }}:role/GitHubOIDCRole
          aws-region: us-east-1

      - name: Assume Changeset Role
        run: |
          CREDS=$(aws sts assume-role \
            --role-arn arn:aws:iam::${{ env.ACCOUNT_ID }}:role/CdkChangesetRole \
            --role-session-name changeset-session)
          # Export credentials...
```

### GitHubOidcConfig options

| Property | Description |
|----------|-------------|
| `owner` | GitHub organization or username (required) |
| `repositories` | Array of repo names, or `['*']` for all repos (required) |
| `branches` | Array of branch patterns (default: `['*']`) |
| `additionalClaims` | Extra OIDC claims like `['pull_request', 'environment:production']` |

---


## Testing

This repository includes Jest tests that snapshot the synthesized outputs from Projen and assert that:

* Diff workflows are created per stack and contain all expected steps.
* Drift detection workflow produces one job per stack and a summary job.
* Only one helper script file is generated per workflow type.
* Per‑stack OIDC overrides (where supported) are respected.
* Helpful validation errors are thrown for missing OIDC settings.
* The IAM template files contain the expected resources and outputs.

Run tests with:

```bash
yarn test
```

## Notes

* This package assumes your repository is configured with GitHub Actions and that you have a GitHub OIDC role configured in AWS.
* The generated scripts use the AWS SDK v3 for CloudFormation and, where applicable, the GitHub REST API.
