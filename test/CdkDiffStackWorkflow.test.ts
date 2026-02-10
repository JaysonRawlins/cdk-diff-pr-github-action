import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { CdkDiffStackWorkflow } from '../src';

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

    new CdkDiffStackWorkflow({
      project: app,
      stacks: [
        {
          stackName: 'MyApp/MyService/MyStack',
          changesetRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          changesetRoleToAssumeRegion: 'us-east-1',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    // Slashes replaced with dashes, all lowercase
    expect(out['.github/workflows/diff-myapp-myservice-mystack.yml']).toBeDefined();

    // No subdirectories created under workflows
    const workflowFiles = Object.keys(out).filter(k => k.startsWith('.github/workflows/') && k.endsWith('.yml'));
    for (const f of workflowFiles) {
      // After .github/workflows/ there should be no more path separators
      const afterWorkflows = f.slice('.github/workflows/'.length);
      expect(afterWorkflows).not.toContain('/');
    }

    // Original stack name is preserved in step names and env vars
    const wf = out['.github/workflows/diff-myapp-myservice-mystack.yml'].toString();
    expect(wf).toContain('Create Changeset for MyApp/MyService/MyStack');
    expect(wf).toContain('STACK_NAME: MyApp/MyService/MyStack');
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
});
