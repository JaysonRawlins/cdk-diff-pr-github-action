import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { CdkDiffIamTemplate, CdkDiffIamTemplateGenerator } from '../src/CdkDiffIamTemplate';

describe('CdkDiffIamTemplateGenerator', () => {
  describe('with external OIDC role (original behavior)', () => {
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

    test('throws error when oidcRoleArn is missing', () => {
      expect(() => CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        oidcRegion: 'us-east-1',
      })).toThrow('oidcRoleArn is required when createOidcRole is false');
    });

    test('throws error when oidcRegion is missing', () => {
      expect(() => CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        oidcRoleArn: 'arn:aws:iam::123456789012:role/github-oidc-role',
      })).toThrow('oidcRegion is required when createOidcRole is false');
    });
  });

  describe('with createOidcRole (self-contained template)', () => {
    test('generateTemplate creates OIDC provider and role', () => {
      const template = CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        createOidcRole: true,
        oidcRoleName: 'MyGitHubOIDCRole',
        githubOidc: {
          owner: 'my-org',
          repositories: ['my-repo'],
          branches: ['main'],
        },
      });

      expect(typeof template).toBe('string');
      expect(template).toContain("AWSTemplateFormatVersion: '2010-09-09'");
      expect(template).toContain("Description: 'GitHub OIDC and IAM roles for CDK Diff Stack Workflow construct'");

      // OIDC Provider
      expect(template).toContain('GitHubOIDCProvider:');
      expect(template).toContain('Type: AWS::IAM::OIDCProvider');
      expect(template).toContain('https://token.actions.githubusercontent.com');

      // OIDC Role
      expect(template).toContain('GitHubOIDCRole:');
      expect(template).toContain("RoleName: 'MyGitHubOIDCRole'");
      expect(template).toContain('sts:AssumeRoleWithWebIdentity');
      expect(template).toContain('repo:my-org/my-repo:ref:refs/heads/main');

      // Changeset Role (references OIDC role)
      expect(template).toContain('CdkChangesetRole:');
      expect(template).toContain("RoleName: 'test-changeset-role'");
      expect(template).toContain('!GetAtt GitHubOIDCRole.Arn');

      // Outputs
      expect(template).toContain('GitHubOIDCProviderArn:');
      expect(template).toContain('GitHubOIDCRoleArn:');
      expect(template).toContain('CdkChangesetRoleArn:');
    });

    test('uses default oidcRoleName when not specified', () => {
      const template = CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        createOidcRole: true,
        githubOidc: {
          owner: 'my-org',
          repositories: ['my-repo'],
        },
      });

      expect(template).toContain("RoleName: 'GitHubOIDCRole'");
    });

    test('skips OIDC provider when skipOidcProviderCreation is true', () => {
      const template = CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        createOidcRole: true,
        skipOidcProviderCreation: true,
        githubOidc: {
          owner: 'my-org',
          repositories: ['my-repo'],
        },
      });

      // Should NOT contain OIDC Provider
      expect(template).not.toContain('GitHubOIDCProvider:');
      expect(template).not.toContain('Type: AWS::IAM::OIDCProvider');
      expect(template).not.toContain('GitHubOIDCProviderArn:');

      // Should still have OIDC Role
      expect(template).toContain('GitHubOIDCRole:');
      expect(template).not.toContain('DependsOn: GitHubOIDCProvider');
    });

    test('handles wildcard repositories', () => {
      const template = CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        createOidcRole: true,
        githubOidc: {
          owner: 'my-org',
          repositories: ['*'],
          branches: ['main', 'develop'],
        },
      });

      expect(template).toContain('repo:my-org/*:ref:refs/heads/main');
      expect(template).toContain('repo:my-org/*:ref:refs/heads/develop');
    });

    test('handles wildcard branches', () => {
      const template = CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        createOidcRole: true,
        githubOidc: {
          owner: 'my-org',
          repositories: ['my-repo'],
          branches: ['*'],
        },
      });

      expect(template).toContain('repo:my-org/my-repo:*');
    });

    test('handles additional claims', () => {
      const template = CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        createOidcRole: true,
        githubOidc: {
          owner: 'my-org',
          repositories: ['my-repo'],
          additionalClaims: ['environment:production'],
        },
      });

      expect(template).toContain('repo:my-org/my-repo:environment:production');
    });

    test('throws error when githubOidc is missing with createOidcRole', () => {
      expect(() => CdkDiffIamTemplateGenerator.generateTemplate({
        roleName: 'test-changeset-role',
        createOidcRole: true,
      })).toThrow('githubOidc configuration is required when createOidcRole is true');
    });
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

  test('emits self-contained template with createOidcRole option', () => {
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
      createOidcRole: true,
      oidcRoleName: 'MyGitHubOIDCRole',
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
        branches: ['main'],
      },
    });

    const out = synthSnapshot(app);

    const file = out['cdk-diff-workflow-iam-template.yaml'];
    expect(file).toBeDefined();

    const text = file.toString();

    // Self-contained template description
    expect(text).toContain("Description: 'GitHub OIDC and IAM roles for CDK Diff Stack Workflow construct'");

    // OIDC Provider
    expect(text).toContain('GitHubOIDCProvider:');
    expect(text).toContain('Type: AWS::IAM::OIDCProvider');

    // OIDC Role
    expect(text).toContain('GitHubOIDCRole:');
    expect(text).toContain("RoleName: 'MyGitHubOIDCRole'");

    // Changeset Role
    expect(text).toContain('CdkChangesetRole:');
    expect(text).toContain("RoleName: 'test-cdk-changeset-role'");

    // Outputs
    expect(text).toContain('GitHubOIDCProviderArn:');
    expect(text).toContain('GitHubOIDCRoleArn:');
    expect(text).toContain('CdkChangesetRoleArn:');
  });
});
