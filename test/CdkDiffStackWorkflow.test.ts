import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { CdkDiffStackWorkflow, sanitizeForCloudFormation, sanitizeForFileName } from '../src';

function createApp(): awscdk.AwsCdkTypeScriptApp {
  return new awscdk.AwsCdkTypeScriptApp({
    name: 'test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '2.85.0',
    projenrcTs: false,
    github: true,
  } as any);
}

describe('CdkDiffStackWorkflow', () => {
  test('generates one workflow per stack and a single script file', () => {
    const app = createApp();

    new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName: 'MyStackA',
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-east-1',
        },
        {
          stackName: 'MyStackB',
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-east-2',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    // Workflows exist for each stack (filenames are sanitized to lowercase with dashes)
    expect(out['.github/workflows/diff-mystacka.yml']).toBeDefined();
    expect(out['.github/workflows/diff-mystackb.yml']).toBeDefined();

    // Script file created exactly once at default location
    expect(out['.github/workflows/scripts/describe-cfn-changeset.ts']).toBeDefined();

    const wfA = out['.github/workflows/diff-mystacka.yml'].toString();

    // Verify key steps exist in the workflow
    expect(wfA).toContain('actions/checkout@v4');
    expect(wfA).toContain('actions/setup-node@v4');
    expect(wfA).toContain('aws-actions/configure-aws-credentials@v4');
    // Step names still use the original stack name for readability
    expect(wfA).toContain('Create Changeset for MyStackA');
    expect(wfA).toContain('Describe change set for MyStackA');
    expect(wfA).toContain('Delete changeset for MyStackA');

    // Verify describe step uses ts-node to run the script
    expect(wfA).toContain('npx ts-node .github/workflows/scripts/describe-cfn-changeset.ts');

    // Verify GITHUB_TOKEN and PR comment URL are wired
    expect(wfA).toContain('GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}');
    expect(wfA).toContain('GITHUB_COMMENT_URL: ${{ github.event.pull_request.comments_url }}');

    // Verify script uses upsert pattern (not old postGithubComment)
    const script = out['.github/workflows/scripts/describe-cfn-changeset.ts'].toString();
    expect(script).toContain('upsertGithubComment');
    expect(script).toContain('findExistingComment');
    expect(script).not.toContain('postGithubComment');
    // Comment marker for find-and-replace
    expect(script).toContain('<!-- cdk-diff:stack:');
    // Pagination support
    expect(script).toContain('per_page=100');
    expect(script).toContain('parseLinkHeader');
    // PATCH for updates
    expect(script).toContain("method: 'PATCH'");
    // Drift banner
    expect(script).toContain('getDriftBannerHtml');
    expect(script).toContain('DescribeStacksCommand');
    expect(script).toContain('DescribeStackResourceDriftsCommand');
    expect(script).toContain('IN_SYNC');
    expect(script).toContain('NOT_CHECKED');
    expect(script).toContain('DRIFTED');
    expect(script).toContain('driftBanner');

    // Changeset name is sanitized for CloudFormation compatibility
    expect(wfA).toContain('--change-set-name MyStackA');
    expect(wfA).toContain('CHANGE_SET_NAME: MyStackA');

    // STACK_NAME is resolved at runtime from cdk.out manifest (not a static value)
    expect(wfA).toContain('id: create-changeset');
    expect(wfA).toContain('cf-stack-name=');
    expect(wfA).toContain('STACK_NAME: ${{ steps.create-changeset.outputs.cf-stack-name }}');
    // Manifest lookup uses jq to find the real CF stack name by displayName
    expect(wfA).toContain('cdk.out/*/manifest.json');
    expect(wfA).toContain('aws:cloudformation:stack');
    expect(wfA).toContain('.displayName');
    expect(wfA).toContain('.properties.stackName');

    // Delete step uses runtime-resolved stack name
    expect(wfA).toContain('--stack-name "${{ steps.create-changeset.outputs.cf-stack-name }}"');
  });

  test('per-stack oidc overrides are respected', () => {
    const app = createApp();

    new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName: 'StackWithOverride',
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-west-2',
          oidcRoleArn: 'arn:aws:iam::444455556666:role/override-oidc',
          oidcRegion: 'eu-west-1',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/default-oidc',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);
    const wf = out['.github/workflows/diff-stackwithoverride.yml'].toString();

    // Ensure the override values are present
    expect(wf).toContain('role-to-assume: arn:aws:iam::444455556666:role/override-oidc');
    expect(wf).toContain('aws-region: eu-west-1');
  });

  test('throws when no default OIDC and stacks missing per-stack OIDC', () => {
    const app = createApp();

    expect(() => new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName: 'BadStack',
          cdkDiffRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          cdkDiffRoleToAssumeRegion: 'us-east-1',
          // no per-stack oidc provided
        } as any,
      ],
      // No defaults provided
      oidcRoleArn: '' as any,
      oidcRegion: '' as any,
    })).toThrow(/Either provide default oidcRoleArn|oidcRegion/);
  });

  test('stack names with slashes are sanitized to dashes in filenames', () => {
    const app = createApp();

    const stackName = 'MyApp/MyService/MyStack';
    const cfName = sanitizeForCloudFormation(stackName);
    const fileName = sanitizeForFileName(stackName);

    new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName,
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-east-1',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    // Slashes replaced with dashes, all lowercase for filename
    expect(out[`.github/workflows/diff-${fileName}.yml`]).toBeDefined();

    // No subdirectories created under workflows
    const workflowFiles = Object.keys(out).filter(k => k.startsWith('.github/workflows/') && k.endsWith('.yml'));
    for (const f of workflowFiles) {
      const afterWorkflows = f.slice('.github/workflows/'.length);
      expect(afterWorkflows).not.toContain('/');
    }

    const wf = out[`.github/workflows/diff-${fileName}.yml`].toString();

    // Original stack name is preserved in step display names
    expect(wf).toContain(`Create Changeset for ${stackName}`);

    // Changeset name uses sanitizeForCloudFormation output
    expect(wf).toContain(`--change-set-name ${cfName}`);
    expect(wf).toContain(`CHANGE_SET_NAME: ${cfName}`);
    // Raw slashed name is NOT passed to CloudFormation changeset
    expect(wf).not.toContain(`--change-set-name ${stackName}`);

    // STACK_NAME is resolved at runtime from cdk.out manifest (not a static sanitized value)
    expect(wf).toContain('id: create-changeset');
    expect(wf).toContain('STACK_NAME: ${{ steps.create-changeset.outputs.cf-stack-name }}');
    expect(wf).toContain('--stack-name "${{ steps.create-changeset.outputs.cf-stack-name }}"');
    // Manifest lookup searches for the original construct path as displayName
    expect(wf).toContain(`"${stackName}"`);
  });

  test('realistic CDK pipeline path: deploy uses original path, CF APIs use sanitized name', () => {
    const app = createApp();

    // Realistic CDK pipeline construct path
    const cdkPath = 'data-platform-pipeline/TestCompanyStageDev/DataBucketsStack';
    const sanitized = sanitizeForCloudFormation(cdkPath);

    new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName: cdkPath,
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-east-1',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);
    const fileName = sanitizeForFileName(cdkPath);
    // Workflow filename is lowercased (sanitizeForFileName), but CF names preserve case (sanitizeForCloudFormation)
    const wf = out[`.github/workflows/diff-${fileName}.yml`].toString();

    // CDK deploy uses the original construct path (CDK resolves it)
    expect(wf).toContain(`deploy ${cdkPath}`);

    // Step display names use the original path for readability
    expect(wf).toContain(`Create Changeset for ${cdkPath}`);
    expect(wf).toContain(`Describe change set for ${cdkPath}`);
    expect(wf).toContain(`Delete changeset for ${cdkPath}`);

    // Changeset name uses the sanitized name (no slashes)
    expect(wf).toContain(`--change-set-name ${sanitized}`);
    expect(wf).toContain(`CHANGE_SET_NAME: ${sanitized}`);
    // Raw slashed name is NOT passed to CloudFormation changeset
    expect(wf).not.toContain(`--change-set-name ${cdkPath}`);

    // STACK_NAME is resolved at runtime from cdk.out manifest, NOT the sanitized CDK path
    // (CDK Pipelines: real CF stack name = {StageID}-{StackID}, pipeline prefix dropped)
    expect(wf).toContain('id: create-changeset');
    expect(wf).toContain('cf-stack-name=');
    expect(wf).toContain('STACK_NAME: ${{ steps.create-changeset.outputs.cf-stack-name }}');
    expect(wf).toContain('--stack-name "${{ steps.create-changeset.outputs.cf-stack-name }}"');
    // Manifest lookup searches for the original construct path as displayName
    expect(wf).toContain(`"${cdkPath}"`);
    expect(wf).toContain('aws:cloudformation:stack');
    expect(wf).toContain('.properties.stackName');
    // The sanitized CDK path should NOT be used as STACK_NAME (it doesn't match real CF name)
    expect(wf).not.toContain(`STACK_NAME: ${sanitized}`);
  });

  test('very long stack names are truncated from the beginning to fit 255-char filename limit', () => {
    const app = createApp();

    // Create a stack name that when combined with 'diff-' prefix and '.yml' suffix exceeds 255 chars
    // prefix 'diff-' = 5 chars, '.yml' = 4 chars, so max stack portion = 246 chars
    const longSegment = 'a'.repeat(50);
    // Build a stack name with slashes that will be converted to dashes
    // After sanitization, each segment is 50 chars + dash separator
    const segments = Array.from({ length: 6 }, (_, i) => `${longSegment}${i}`);
    const longStackName = segments.join('/');
    // sanitized: "aaa...0-aaa...1-aaa...2-aaa...3-aaa...4-aaa...5" = 6*51 - 1 = 305 chars
    // with prefix + ext: 5 + 305 + 4 = 314 chars > 255

    new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName: longStackName,
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-east-1',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    // Find the workflow file
    const workflowFiles = Object.keys(out).filter(k => k.startsWith('.github/workflows/diff-') && k.endsWith('.yml'));
    expect(workflowFiles).toHaveLength(1);

    const fileName = workflowFiles[0].slice('.github/workflows/'.length);
    // Filename must not exceed 255 characters
    expect(fileName.length).toBeLessThanOrEqual(255);

    // The end of the stack name (most specific part) should be preserved
    expect(fileName).toContain(longSegment + '5');
  });

  test('special characters in stack names are sanitized', () => {
    const app = createApp();

    new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName: 'My Stack @v2 (prod)',
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-east-1',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    // Special characters replaced with dashes, lowercased
    expect(out['.github/workflows/diff-my-stack-v2-prod.yml']).toBeDefined();
  });

  test('changeset names exceeding 128 chars are truncated from the beginning', () => {
    const app = createApp();

    // Build a stack name that produces a changeset name > 128 chars after sanitization
    // Use a meaningful suffix so we can verify the end is preserved
    const longPrefix = 'a'.repeat(120);
    const longStackName = `${longPrefix}/ImportantStack`;

    new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName: longStackName,
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-east-1',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    const workflowFiles = Object.keys(out).filter(k => k.startsWith('.github/workflows/diff-') && k.endsWith('.yml'));
    expect(workflowFiles).toHaveLength(1);
    const wf = out[workflowFiles[0]].toString();

    // Extract the changeset name from --change-set-name <name>
    const match = wf.match(/--change-set-name\s+(\S+)/);
    expect(match).toBeTruthy();
    const changeSetName = match![1];

    // Must not exceed 128 chars
    expect(changeSetName.length).toBeLessThanOrEqual(128);
    // Must start with a letter
    expect(changeSetName).toMatch(/^[a-zA-Z]/);
    // Must match CloudFormation pattern
    expect(changeSetName).toMatch(/^[a-zA-Z][-a-zA-Z0-9]*$/);
    // End of the name (stack identifier) should be preserved
    expect(changeSetName).toContain('ImportantStack');
  });
});
