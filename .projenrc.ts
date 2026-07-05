import { awscdk, TextFile, YamlFile, DependencyType } from 'projen';
import { Dependabot, DependabotScheduleInterval, GithubCredentials, VersioningStrategy } from 'projen/lib/github';
import { NpmAccess } from 'projen/lib/javascript';
const cdkCliVersion = '2.1029.2';
const minNodeVersion = '20.0.0';
const devNodeVersion = '20.19.0';
const workflowNodeVersion = '20.x';
const jsiiVersion = '^5.8.0';
const cdkVersion = '2.85.0'; // Minimum CDK Version Required
const minProjenVersion = '0.99.52'; // Bumped to pick up Dependabot.cooldown option (PR #4650, 2026-04-10).
const minConstructsVersion = '10.0.5'; // Minimum version to support CDK v2 and does affect consumers of the library
const devConstructsVersion = '10.0.5'; // Pin for local dev/build to avoid jsii type conflicts
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Jayson Rawlins',
  description: 'A GitHub Action that creates a CDK diff for a pull request.',
  keywords: ['aws', 'cdk', 'github', 'action', 'diff', 'pull request'],
  authorAddress: 'JaysonJ.Rawlins@gmail.com',
  packageName: '@jjrawlins/cdk-diff-pr-github-action',
  minNodeVersion: minNodeVersion,
  stability: 'experimental',
  cdkVersion: cdkVersion,
  cdkCliVersion: cdkCliVersion,
  projenVersion: `^${minProjenVersion}`,
  defaultReleaseBranch: 'main',
  majorVersion: 1, // Bump to 1.0.0 for StackSet and dual-mode API features
  license: 'Apache-2.0',
  jsiiVersion: jsiiVersion,
  name: '@jjrawlins/cdk-diff-pr-github-action',
  projenrcTs: true,
  repositoryUrl: 'https://jjrawlins@github.com/JaysonRawlins/cdk-diff-pr-github-action.git',
  githubOptions: {
    projenCredentials: GithubCredentials.fromApp({
      appIdSecret: 'PROJEN_APP_ID',
      privateKeySecret: 'PROJEN_APP_PRIVATE_KEY',
    }),
    mergify: false,
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: [
          'feat',
          'fix',
          'docs',
          'style',
          'refactor',
          'perf',
          'test',
          'chore',
          'revert',
          'ci',
          'build',
          'deps',
          'wip',
          'release',
        ],
      },
    },
  },
  // Dependency upgrades are handled by Dependabot (lockfile-only + cooldown).
  depsUpgrade: false,

  // Frozen-lockfile in CI so Dependabot lockfile-only PRs don't trigger
  // cosmetic self-mutation.
  buildWorkflowOptions: {
    mutableBuild: false,
  },

  // Aikido Safe-Chain 1.5.3 — in-flight malware scanner pinned to a release tag.
  workflowBootstrapSteps: [
    {
      name: 'Install Aikido Safe-Chain 1.5.3 (in-flight malware scanner, 7d minimum age)',
      run: [
        'echo "SAFE_CHAIN_MINIMUM_PACKAGE_AGE_HOURS=168" >> $GITHUB_ENV',
        // AWS publishes @aws-sdk/@smithy daily; the 7-day cooldown (meant for unknown
        // malicious packages) would snag nearly every release on these trusted scopes.
        'echo "SAFE_CHAIN_MINIMUM_PACKAGE_AGE_EXCLUSIONS=@aws-sdk/*,@smithy/*" >> $GITHUB_ENV',
        'curl -fsSL https://github.com/AikidoSec/safe-chain/releases/download/1.5.3/install-safe-chain.sh | sh -s -- --ci',
      ].join('\n'),
    },
  ],
  peerDeps: [
    `aws-cdk-lib@>=${cdkVersion} <3.0.0`,
    `constructs@>=${minConstructsVersion} <11.0.0`,
  ],
  deps: [ // Does affect consumers of the library
    'crypto-js',
    'lodash',
    '@aws-sdk/client-cloudformation',
  ],
  devDeps: [ // Does not affect consumers of the library
    `aws-cdk@${cdkCliVersion}`,
    `aws-cdk-lib@${cdkVersion}`,
    '@aws-sdk/types',
    '@types/node',
    '@types/lodash',
    'projen',
  ],
  bundledDeps: [
    '@aws-sdk/client-cloudformation',
    '@types/js-yaml',
    'js-yaml',
    'lodash.merge',
    '@types/crypto-js',
    'crypto-js',
    'lodash',
  ],
  gitignore: [
    'cdk.out',
    'cdk.out/*',
    'assets',
    'cdk.context.json',
    'tsconfig.json',
    '.dccache',
    '.yalc',
  ],
  npmAccess: NpmAccess.PUBLIC,
  releaseToNpm: true,
  npmTrustedPublishing: true, // Enable npm Trusted Publishing via OIDC - eliminates need for NPM_TOKEN
  publishToPypi: {
    distName: 'jjrawlins-cdk-diff-pr-github-action',
    module: 'jjrawlins_cdk_diff_pr_github_action',
    trustedPublishing: true,
  },
  publishToNuget: {
    dotNetNamespace: 'JJRawlins.CdkDiffPrGithubAction',
    packageId: 'JJRawlins.CdkDiffPrGithubAction',
    trustedPublishing: true,
  },
  publishToGo: {
    moduleName: 'github.com/JaysonRawlins/cdk-diff-pr-github-action',
    packageName: 'cdkdiffprgithubaction',
  },
});

// Add Yarn resolutions to ensure patched transitive versions
project.package.addField('resolutions', {
  'brace-expansion': '1.1.12',
  'form-data': '^4.0.4',
  '@eslint/plugin-kit': '^0.3.4',
  'aws-cdk-lib': `>=${cdkVersion} <3.0.0`,
  // Pin constructs for local dev/build to a single version to avoid jsii conflicts
  'constructs': devConstructsVersion,
  'projen': `>=${minProjenVersion} <1.0.0`,
});

// Allow Node 20+ for consumers (CDK constructs work on any modern Node).
project.package.addField('engines', {
  node: `>=${minNodeVersion}`,
});

new TextFile(project, '.tool-versions', {
  lines: [
    '# ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".',
    `nodejs ${devNodeVersion}`,
    'yarn 1.22.22',
  ],
});

// Allow importing projen from devDependencies in source files.
// projen is a build-time dependency (consumers provide their own projen).
project.eslint?.addOverride({
  files: ['src/**/*.ts'],
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
      optionalDependencies: false,
      peerDependencies: true,
    }],
  },
});

// Ensure 'constructs' is only a peer dependency (avoid duplicates that cause jsii conflicts)
project.deps.removeDependency('constructs');
project.deps.addDependency(`constructs@>=${minConstructsVersion} <11.0.0`, DependencyType.PEER);

/**
 * For the build job, we need to be able to read from packages and also need id-token permissions for OIDC to authenticate to the registry.
 * This is needed to be able to install dependencies from GitHub Packages during the build.
 */
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.id-token', 'write');
project.github!.tryFindWorkflow('build')!.file!.addOverride('jobs.build.permissions.packages', 'read');

/**
 * Fix checkout to use SHA instead of branch ref (survives branch deletion after merge).
 * When merge deletes the head branch before workflow jobs complete, using the branch ref fails.
 * The commit SHA persists even after branch deletion.
 */
const buildWorkflow = project.github!.tryFindWorkflow('build')!;

// NOTE: these step indices account for the Aikido Safe-Chain bootstrap step
// (workflowBootstrapSteps) that projen prepends into every job. That step shifts
// the checkout/setup-node positions; targeting the wrong index injects a `with:`
// onto Aikido's `run` step, which is invalid YAML and makes GitHub reject the whole
// workflow file. Re-verify these against the generated YAML if bootstrap steps change.

// Main build job: checkout at [0], Aikido at [1], setup-node at [2]
buildWorkflow.file!.addOverride('jobs.build.steps.0.with.ref', '${{ github.event.pull_request.head.sha }}');
buildWorkflow.file!.addOverride('jobs.build.steps.2.with.node-version', workflowNodeVersion);

// package-js: setup-node at [0], Aikido at [3], checkout at [4]
buildWorkflow.file!.addOverride('jobs.package-js.steps.4.with.ref', '${{ github.event.pull_request.head.sha }}');
buildWorkflow.file!.addOverride('jobs.package-js.steps.0.with.node-version', workflowNodeVersion);

// package-python: setup-node at [0], Aikido at [4], checkout at [5]
buildWorkflow.file!.addOverride('jobs.package-python.steps.5.with.ref', '${{ github.event.pull_request.head.sha }}');
buildWorkflow.file!.addOverride('jobs.package-python.steps.0.with.node-version', workflowNodeVersion);

// package-dotnet: setup-node at [0], Aikido at [4], checkout at [5]
buildWorkflow.file!.addOverride('jobs.package-dotnet.steps.5.with.ref', '${{ github.event.pull_request.head.sha }}');
buildWorkflow.file!.addOverride('jobs.package-dotnet.steps.0.with.node-version', workflowNodeVersion);

// package-go: setup-node at [0], Aikido at [4], checkout at [5]
buildWorkflow.file!.addOverride('jobs.package-go.steps.5.with.ref', '${{ github.event.pull_request.head.sha }}');
buildWorkflow.file!.addOverride('jobs.package-go.steps.0.with.node-version', workflowNodeVersion);

/** * For the release jobs, we need to be able to read from packages and also need id-token permissions for OIDC to authenticate to the registry.
*/
const releaseWorkflow = project.github!.tryFindWorkflow('release')!;
releaseWorkflow.file!.addOverride('jobs.release.permissions.id-token', 'write');
releaseWorkflow.file!.addOverride('jobs.release.permissions.packages', 'read');
releaseWorkflow.file!.addOverride('jobs.release.permissions.contents', 'write');
// release job: checkout [0], git-identity [1], Aikido [2], setup-node [3]
releaseWorkflow.file!.addOverride('jobs.release.steps.3.with.node-version', workflowNodeVersion);
releaseWorkflow.file!.addOverride('jobs.release_github.steps.0.with.node-version', workflowNodeVersion);

releaseWorkflow.file!.addOverride('jobs.release_npm.permissions.id-token', 'write');
releaseWorkflow.file!.addOverride('jobs.release_npm.permissions.packages', 'read');
releaseWorkflow.file!.addOverride('jobs.release_npm.permissions.contents', 'write');

// Override node-version to 24 for npm trusted publishing (requires npm 11.5.1+)
// This only affects the release_npm job, not the project's minNodeVersion
releaseWorkflow.file!.addOverride('jobs.release_npm.steps.0.with.node-version', '24');
// Add --ignore-engines to yarn install since Node 24 is outside the engines range (20.x)
// release_npm: setup-node [0], Aikido [3], checkout [4], Install Dependencies [5]
releaseWorkflow.file!.addOverride('jobs.release_npm.steps.5.run', 'cd .repo && yarn install --check-files --frozen-lockfile --ignore-engines');

// PyPI release permissions and node version
releaseWorkflow.file!.addOverride('jobs.release_pypi.permissions.id-token', 'write');
releaseWorkflow.file!.addOverride('jobs.release_pypi.permissions.packages', 'read');
releaseWorkflow.file!.addOverride('jobs.release_pypi.permissions.contents', 'write');
releaseWorkflow.file!.addOverride('jobs.release_pypi.steps.0.with.node-version', workflowNodeVersion);

// NuGet release permissions and node version
releaseWorkflow.file!.addOverride('jobs.release_nuget.permissions.id-token', 'write');
releaseWorkflow.file!.addOverride('jobs.release_nuget.permissions.packages', 'read');
releaseWorkflow.file!.addOverride('jobs.release_nuget.permissions.contents', 'write');
releaseWorkflow.file!.addOverride('jobs.release_nuget.steps.0.with.node-version', workflowNodeVersion);

// Go release permissions and node version
releaseWorkflow.file!.addOverride('jobs.release_golang.permissions.id-token', 'write');
releaseWorkflow.file!.addOverride('jobs.release_golang.permissions.packages', 'read');
releaseWorkflow.file!.addOverride('jobs.release_golang.permissions.contents', 'write');
releaseWorkflow.file!.addOverride('jobs.release_golang.steps.0.with.node-version', workflowNodeVersion);

// Replace GO_GITHUB_TOKEN PAT with GitHub App installation token for Go module publishing
// Step 10: clear old Release step fields and repurpose as token generation
releaseWorkflow.file!.addOverride('jobs.release_golang.steps.10.name', 'Generate token');
releaseWorkflow.file!.addOverride('jobs.release_golang.steps.10.id', 'generate_token');
releaseWorkflow.file!.addOverride('jobs.release_golang.steps.10.uses', 'actions/create-github-app-token@3ff1caaa28b64c9cc276ce0a02e2ff584f3900c5');
releaseWorkflow.file!.addOverride('jobs.release_golang.steps.10.with', {
  'app-id': '${{ secrets.PROJEN_APP_ID }}',
  'private-key': '${{ secrets.PROJEN_APP_PRIVATE_KEY }}',
});
// Remove old Release step fields from step 10
releaseWorkflow.file!.addDeletionOverride('jobs.release_golang.steps.10.env');
releaseWorkflow.file!.addDeletionOverride('jobs.release_golang.steps.10.run');
// Step 11: actual release using the App token
releaseWorkflow.file!.addOverride('jobs.release_golang.steps.11', {
  name: 'Release',
  env: {
    GIT_USER_NAME: 'github-actions[bot]',
    GIT_USER_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
    GITHUB_TOKEN: '${{ steps.generate_token.outputs.token }}',
  },
  run: [
    // publib constructs https://<token>@github.com/... which works for PATs but not GitHub App tokens.
    // App tokens require the x-access-token: username prefix.
    'git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "https://${GITHUB_TOKEN}@github.com/"',
    'npx -p publib@latest publib-golang',
  ].join('\n'),
});

// Prevent release workflow from triggering on Go module commits
releaseWorkflow.file!.addOverride('on.push.paths-ignore', [
  'cdkdiffprgithubaction/**',
]);

// =========================================================================
// Security baseline — see ../.claude/projen-security-baseline.ts for the
// source-of-truth pattern.
// =========================================================================

const prLintWorkflow = project.github!.tryFindWorkflow('pull-request-lint');
if (prLintWorkflow) {
  prLintWorkflow.file!.addOverride(
    'jobs.validate.steps.0.uses',
    'amannn/action-semantic-pull-request@48f256284bd46cdaab1048c3721360e808335d50', // v6.1.1
  );
}

const dependabot = new Dependabot(project.github!, {
  scheduleInterval: DependabotScheduleInterval.WEEKLY,
  versioningStrategy: VersioningStrategy.LOCKFILE_ONLY,
  labels: ['dependencies'],
  openPullRequestsLimit: 10,
  cooldown: {
    defaultDays: 7,
    semverMinorDays: 7,
    semverPatchDays: 3,
    include: ['*'],
  },
  groups: {
    'aws-sdk': { patterns: ['@aws-sdk/*', '@smithy/*'] },
    'typescript-eslint': { patterns: ['@typescript-eslint/*'] },
  },
});

dependabot.config.updates[0].ignore = [
  { 'dependency-name': 'projen' },
  { 'dependency-name': '*', 'update-types': ['version-update:semver-major'] },
];

dependabot.config.updates.push({
  'package-ecosystem': 'github-actions',
  'directory': '/',
  'schedule': { interval: 'weekly' },
  'open-pull-requests-limit': 0,
  'labels': ['dependencies', 'github-actions'],
});

new YamlFile(project, '.github/workflows/security.yml', {
  obj: {
    name: 'security',
    on: { pull_request: {}, workflow_dispatch: {} },
    jobs: {
      security: { uses: 'JaysonRawlins/.github/.github/workflows/security.yml@main' },
    },
  },
});

new YamlFile(project, '.github/workflows/semgrep.yml', {
  obj: {
    name: 'Semgrep',
    on: {
      push: { branches: ['main'] },
      pull_request: { branches: ['main'] },
    },
    permissions: { 'contents': 'read', 'security-events': 'write' },
    jobs: {
      scan: {
        'name': 'Scan',
        'runs-on': 'ubuntu-latest',
        'container': {
          image: 'semgrep/semgrep@sha256:9349edbadf90c3f3c0c3f55867625354e89680e6fa10d9034042af52fdb0e0d0',
        },
        'steps': [
          { uses: 'actions/checkout@v4' },
          {
            name: 'Run Semgrep',
            run: [
              'semgrep scan \\',
              '  --config=p/security-audit \\',
              '  --config=p/typescript \\',
              '  --config=p/javascript \\',
              '  --config=p/nodejs \\',
              '  --sarif --output=semgrep.sarif \\',
              '  || true',
            ].join('\n'),
          },
          {
            'name': 'Upload SARIF',
            'if': "always() && hashFiles('semgrep.sarif') != ''",
            'continue-on-error': true,
            'uses': 'github/codeql-action/upload-sarif@f411752efdf656cb71aa17b755b22c890960da1d', // v3.35.5
            'with': { sarif_file: 'semgrep.sarif' },
          },
        ],
      },
    },
  },
});

new YamlFile(project, '.github/workflows/dependabot-automerge.yml', {
  obj: {
    name: 'dependabot-automerge',
    on: {
      pull_request_target: {
        types: ['opened', 'synchronize', 'reopened', 'ready_for_review'],
      },
    },
    permissions: { 'contents': 'write', 'pull-requests': 'write' },
    jobs: {
      automerge: {
        'runs-on': 'ubuntu-latest',
        'if': "github.actor == 'dependabot[bot]'",
        'steps': [
          {
            name: 'Get Dependabot metadata',
            id: 'metadata',
            uses: 'dependabot/fetch-metadata@21025c705c08248db411dc16f3619e6b5f9ea21a', // v2.5.0
            with: { 'github-token': '${{ secrets.GITHUB_TOKEN }}' },
          },
          {
            name: 'Enable auto-merge for safe Dependabot PRs',
            if: "steps.metadata.outputs.update-type == 'version-update:semver-patch' || steps.metadata.outputs.update-type == 'version-update:semver-minor'",
            run: 'gh pr merge --auto --squash "$PR_URL"',
            env: {
              PR_URL: '${{ github.event.pull_request.html_url }}',
              GH_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
            },
          },
        ],
      },
    },
  },
});

new YamlFile(project, '.github/workflows/dependabot-rebase-stuck.yml', {
  obj: {
    name: 'dependabot-unblocker',
    on: {
      schedule: [{ cron: '0 9 * * 1' }],
      workflow_dispatch: {},
    },
    permissions: { 'pull-requests': 'read', 'actions': 'write' },
    jobs: {
      unblock: {
        'runs-on': 'ubuntu-latest',
        'steps': [
          {
            name: 'Rerun failed build on Aikido-cooldown-blocked Dependabot PRs',
            env: {
              GH_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
              REPO: '${{ github.repository }}',
            },
            run: [
              'set -euo pipefail',
              '',
              'stuck=$(gh pr list --repo "$REPO" \\',
              '  --author "app/dependabot" \\',
              '  --state open \\',
              '  --json number,statusCheckRollup \\',
              '  --jq \'.[] | select([.statusCheckRollup[] | select(.name == "build")] | any(.conclusion == "FAILURE")) | .number\')',
              '',
              'if [ -z "$stuck" ]; then',
              '  echo "No stuck Dependabot PRs."',
              '  exit 0',
              'fi',
              '',
              'for pr in $stuck; do',
              '  run_id=$(gh pr view "$pr" --repo "$REPO" --json statusCheckRollup \\',
              '    --jq \'.statusCheckRollup[] | select(.name == "build") | .detailsUrl\' \\',
              '    | grep -oE "/runs/[0-9]+" | head -1 | cut -d/ -f3)',
              '',
              '  if [ -z "$run_id" ]; then',
              '    echo "PR #$pr: no build run id, skipping"',
              '    continue',
              '  fi',
              '',
              '  log=$(gh run view "$run_id" --repo "$REPO" --log-failed 2>&1 || true)',
              '',
              '  if echo "$log" | grep -q "minimum package age"; then',
              '    echo "PR #$pr: Aikido cooldown block — rerunning failed build (preserves lockfile)"',
              '    gh run rerun "$run_id" --repo "$REPO" --failed',
              '  elif echo "$log" | grep -q "Safe-chain: blocked"; then',
              '    echo "PR #$pr: Aikido blocked (non-age, possibly malware) — leaving for human review"',
              '  else',
              '    echo "PR #$pr: build failed for unrecognized reason — leaving for human review"',
              '  fi',
              'done',
            ].join('\n'),
          },
        ],
      },
    },
  },
});

project.synth();


