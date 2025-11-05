import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { CdkDiffIamTemplate } from '../src/CdkDiffIamTemplate';

describe('CdkDiffIamTemplate', () => {
  test('emits IAM template file with expected resources and outputs', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplate({ project: app, roleName: 'test-cdk-changeset-role', oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role', oidcRegion: 'us-east-1' });

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
});
