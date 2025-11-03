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
          cdkDiffRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          cdkDiffRoleToAssumeRegion: 'us-east-1',
        },
        {
          stackName: 'MyStackB',
          cdkDiffRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          cdkDiffRoleToAssumeRegion: 'us-east-2',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    // Workflows exist for each stack
    expect(out['.github/workflows/diff-MyStackA.yml']).toBeDefined();
    expect(out['.github/workflows/diff-MyStackB.yml']).toBeDefined();

    // Script file created exactly once at default location
    expect(out['.github/workflows/scripts/describe-cfn-changeset.ts']).toBeDefined();

    const wfA = out['.github/workflows/diff-MyStackA.yml'].toString();

    // Verify key steps exist in the workflow
    expect(wfA).toContain('actions/checkout@v4');
    expect(wfA).toContain('actions/setup-node@v4');
    expect(wfA).toContain('aws-actions/configure-aws-credentials@v4');
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
          cdkDiffRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-diff-role',
          cdkDiffRoleToAssumeRegion: 'us-west-2',
          oidcRoleArn: 'arn:aws:iam::444455556666:role/override-oidc',
          oidcRegion: 'eu-west-1',
        },
      ],
      oidcRoleArn: 'arn:aws:iam::111122223333:role/default-oidc',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);
    const wf = out['.github/workflows/diff-StackWithOverride.yml'].toString();

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
});
