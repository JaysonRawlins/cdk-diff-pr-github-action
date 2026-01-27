import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { CdkDriftIamTemplate, CdkDriftIamTemplateGenerator } from '../src/CdkDriftIamTemplate';

describe('CdkDriftIamTemplateGenerator', () => {
  test('generateTemplate returns valid YAML string', () => {
    const template = CdkDriftIamTemplateGenerator.generateTemplate({
      roleName: 'test-drift-role',
      oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    expect(typeof template).toBe('string');
    expect(template).toContain("AWSTemplateFormatVersion: '2010-09-09'");
    expect(template).toContain("Description: 'IAM role for CDK Drift Detection Workflow'");
    expect(template).toContain('CdkDriftRole:');
    expect(template).toContain("RoleName: 'test-drift-role'");
    expect(template).toContain("Default: 'arn:aws:iam::123456789012:role/github-oidc-role'");
    expect(template).toContain("aws:RequestedRegion: 'us-east-1'");
    expect(template).toContain('cloudformation:DetectStackDrift');
    expect(template).toContain('CdkDriftRoleArn:');
  });

  test('generateDeployCommand returns correct AWS CLI command', () => {
    const command = CdkDriftIamTemplateGenerator.generateDeployCommand();
    expect(command).toContain('aws cloudformation deploy');
    expect(command).toContain('cdk-drift-workflow-iam-template.yaml');
    expect(command).toContain('CAPABILITY_NAMED_IAM');

    const customCommand = CdkDriftIamTemplateGenerator.generateDeployCommand('custom-path.yaml');
    expect(customCommand).toContain('custom-path.yaml');
  });
});

describe('CdkDriftIamTemplate', () => {
  test('emits IAM template file with expected resources and outputs', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDriftIamTemplate({
      project: app,
      roleName: 'test-cdk-drift-role',
      oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);

    const file = out['cdk-drift-workflow-iam-template.yaml'];
    expect(file).toBeDefined();

    const text = file.toString();

    // Basic template scaffolding
    expect(text).toContain("AWSTemplateFormatVersion: '2010-09-09'");
    expect(text).toContain("Description: 'IAM role for CDK Drift Detection Workflow'");

    // Role and policies
    expect(text).toContain('Type: AWS::IAM::Role');
    expect(text).toContain('CdkDriftRole:');
    expect(text).toContain('cloudformation:DetectStackDrift');
    expect(text).toContain('cloudformation:DescribeStackDriftDetectionStatus');

    // Outputs
    expect(text).toContain('Outputs:');
    expect(text).toContain('CdkDriftRoleArn:');
    expect(text).toContain('CdkDriftRoleName:');
  });

  test('creates deploy task', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDriftIamTemplate({
      project: app,
      roleName: 'test-role',
      oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      oidcRegion: 'us-east-1',
    });

    const out = synthSnapshot(app);
    const tasksJson = out['.projen/tasks.json'] as any;

    expect(tasksJson.tasks['deploy-cdkdrift-iam-template']).toBeDefined();
    expect(tasksJson.tasks['deploy-cdkdrift-iam-template'].steps[0].exec).toContain('aws cloudformation deploy');
  });

  test('uses custom output path when provided', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDriftIamTemplate({
      project: app,
      roleName: 'test-role',
      oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      oidcRegion: 'us-east-1',
      outputPath: 'custom-drift-template.yaml',
    });

    const out = synthSnapshot(app);
    expect(out['custom-drift-template.yaml']).toBeDefined();
    expect(out['cdk-drift-workflow-iam-template.yaml']).toBeUndefined();
  });
});
