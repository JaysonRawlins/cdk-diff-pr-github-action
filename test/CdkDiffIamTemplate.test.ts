import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { CdkDiffIamTemplate, CdkDiffIamTemplateGenerator } from '../src/CdkDiffIamTemplate';

describe('CdkDiffIamTemplateGenerator', () => {
  test('generateTemplate returns valid YAML string', () => {
    const template = CdkDiffIamTemplateGenerator.generateTemplate({
      roleName: 'test-changeset-role',
      oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    expect(typeof template).toBe('string');
    expect(template).toContain("AWSTemplateFormatVersion: '2010-09-09'");
    expect(template).toContain("Description: 'IAM role for CDK Diff Stack Workflow construct'");
    expect(template).toContain('CdkChangesetRole:');
    expect(template).toContain("RoleName: 'test-changeset-role'");
    expect(template).toContain("Default: 'arn:aws:iam::123456789012:role/github-oidc-role'");
    expect(template).toContain("aws:RequestedRegion: 'us-east-1'");
    expect(template).toContain('cloudformation:CreateChangeSet');
    expect(template).toContain('CdkChangesetRoleArn:');
  });

  test('generateDeployCommand returns correct AWS CLI command', () => {
    const command = CdkDiffIamTemplateGenerator.generateDeployCommand();
    expect(command).toContain('aws cloudformation deploy');
    expect(command).toContain('cdk-diff-workflow-iam-template.yaml');
    expect(command).toContain('CAPABILITY_NAMED_IAM');

    const customCommand = CdkDiffIamTemplateGenerator.generateDeployCommand('custom-path.yaml');
    expect(customCommand).toContain('custom-path.yaml');
  });
});

describe('CdkDiffIamTemplate', () => {
  test('emits IAM template file with expected resources and outputs', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplate({
      project: app,
      roleName: 'test-cdk-changeset-role',
      oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    const file = out['cdk-diff-workflow-iam-template.yaml'];
    expect(file).toBeDefined();

    const text = file.toString();

    // Basic template scaffolding
    expect(text).toContain("AWSTemplateFormatVersion: '2010-09-09'");
    expect(text).toContain("Description: 'IAM role for CDK Diff Stack Workflow construct'");

    // Role and policies
    expect(text).toContain('Type: AWS::IAM::Role');
    expect(text).toContain('CdkChangesetRole:');
    expect(text).toContain('cloudformation:CreateChangeSet');
    expect(text).toContain('cloudformation:DescribeChangeSet');

    // Outputs
    expect(text).toContain('Outputs:');
    expect(text).toContain('CdkChangesetRoleArn:');
    expect(text).toContain('CdkChangesetRoleName:');
  });

  test('creates deploy task', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplate({
      project: app,
      roleName: 'test-role',
      oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);
    const tasksJson = out['.projen/tasks.json'] as any;

    expect(tasksJson.tasks['deploy-cdkdiff-iam-template']).toBeDefined();
    expect(tasksJson.tasks['deploy-cdkdiff-iam-template'].steps[0].exec).toContain('aws cloudformation deploy');
  });
});
