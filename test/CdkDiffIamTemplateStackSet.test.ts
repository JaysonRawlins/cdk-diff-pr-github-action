import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import {
  CdkDiffIamTemplateStackSet,
  CdkDiffIamTemplateStackSetGenerator,
  StackSetRoleSelection,
} from '../src/CdkDiffIamTemplateStackSet';

describe('CdkDiffIamTemplateStackSetGenerator', () => {
  test('generateTemplate returns valid YAML string with all resources', () => {
    const template = CdkDiffIamTemplateStackSetGenerator.generateTemplate({
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
        branches: ['main'],
      },
    });

    expect(typeof template).toBe('string');
    expect(template).toContain("AWSTemplateFormatVersion: '2010-09-09'");
    expect(template).toContain('GitHubOIDCProvider:');
    expect(template).toContain('GitHubOIDCRole:');
    expect(template).toContain('CdkChangesetRole:');
    expect(template).toContain('CdkDriftRole:');
    expect(template).toContain("'repo:my-org/my-repo:ref:refs/heads/main'");
  });

  test('generateTemplate respects roleSelection', () => {
    const changesetOnly = CdkDiffIamTemplateStackSetGenerator.generateTemplate({
      githubOidc: { owner: 'org', repositories: ['repo'] },
      roleSelection: StackSetRoleSelection.CHANGESET_ONLY,
    });

    expect(changesetOnly).toContain('CdkChangesetRole:');
    expect(changesetOnly).not.toContain('CdkDriftRole:');

    const driftOnly = CdkDiffIamTemplateStackSetGenerator.generateTemplate({
      githubOidc: { owner: 'org', repositories: ['repo'] },
      roleSelection: StackSetRoleSelection.DRIFT_ONLY,
    });

    expect(driftOnly).not.toContain('CdkChangesetRole:');
    expect(driftOnly).toContain('CdkDriftRole:');
  });

  test('generateCommands returns all expected commands', () => {
    const commands = CdkDiffIamTemplateStackSetGenerator.generateCommands();

    expect(commands['stackset-create']).toBeDefined();
    expect(commands['stackset-update']).toBeDefined();
    expect(commands['stackset-deploy-instances']).toBeDefined();
    expect(commands['stackset-delete-instances']).toBeDefined();
    expect(commands['stackset-delete']).toBeDefined();
    expect(commands['stackset-describe']).toBeDefined();
    expect(commands['stackset-list-instances']).toBeDefined();
  });

  test('generateCommands respects custom options', () => {
    const commands = CdkDiffIamTemplateStackSetGenerator.generateCommands({
      stackSetName: 'custom-stackset',
      templatePath: 'custom-template.yaml',
      targetOrganizationalUnitIds: ['ou-1234', 'ou-5678'],
      regions: ['us-west-2', 'eu-central-1'],
      delegatedAdmin: false,
    });

    expect(commands['stackset-create']).toContain('custom-stackset');
    expect(commands['stackset-create']).toContain('custom-template.yaml');
    expect(commands['stackset-create']).not.toContain('--call-as DELEGATED_ADMIN');
    expect(commands['stackset-deploy-instances']).toContain('ou-1234,ou-5678');
    expect(commands['stackset-deploy-instances']).toContain('us-west-2 eu-central-1');
  });
});

describe('CdkDiffIamTemplateStackSet', () => {
  test('emits StackSet template with OIDC provider, OIDC role, and both workflow roles by default', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
        branches: ['main'],
      },
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    expect(file).toBeDefined();

    const text = file.toString();

    // Basic template scaffolding
    expect(text).toContain("AWSTemplateFormatVersion: '2010-09-09'");
    expect(text).toContain('GitHub OIDC and IAM roles for CDK Diff/Drift workflows');

    // OIDC Provider
    expect(text).toContain('GitHubOIDCProvider:');
    expect(text).toContain('Type: AWS::IAM::OIDCProvider');
    expect(text).toContain('https://token.actions.githubusercontent.com');

    // OIDC Role with subject claims
    expect(text).toContain('GitHubOIDCRole:');
    expect(text).toContain('sts:AssumeRoleWithWebIdentity');
    expect(text).toContain("'repo:my-org/my-repo:ref:refs/heads/main'");

    // Both workflow roles should be present
    expect(text).toContain('CdkChangesetRole:');
    expect(text).toContain('CdkDriftRole:');

    // Roles should trust the OIDC role
    expect(text).toContain('!GetAtt GitHubOIDCRole.Arn');

    // Outputs for all resources
    expect(text).toContain('GitHubOIDCProviderArn:');
    expect(text).toContain('GitHubOIDCRoleArn:');
    expect(text).toContain('CdkChangesetRoleArn:');
    expect(text).toContain('CdkDriftRoleArn:');
  });

  test('emits only changeset role when CHANGESET_ONLY selected', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
      },
      roleSelection: StackSetRoleSelection.CHANGESET_ONLY,
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    const text = file.toString();

    // OIDC resources should always be present
    expect(text).toContain('GitHubOIDCProvider:');
    expect(text).toContain('GitHubOIDCRole:');

    // Changeset role should be present
    expect(text).toContain('CdkChangesetRole:');
    expect(text).toContain('CdkChangesetRoleArn:');

    // Drift role should NOT be present
    expect(text).not.toContain('CdkDriftRole:');
    expect(text).not.toContain('CdkDriftRoleArn:');
  });

  test('emits only drift role when DRIFT_ONLY selected', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
      },
      roleSelection: StackSetRoleSelection.DRIFT_ONLY,
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    const text = file.toString();

    // OIDC resources should always be present
    expect(text).toContain('GitHubOIDCProvider:');
    expect(text).toContain('GitHubOIDCRole:');

    // Drift role should be present
    expect(text).toContain('CdkDriftRole:');
    expect(text).toContain('CdkDriftRoleArn:');

    // Changeset role should NOT be present
    expect(text).not.toContain('CdkChangesetRole:');
    expect(text).not.toContain('CdkChangesetRoleArn:');
  });

  test('uses custom role names when provided', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
      },
      oidcRoleName: 'MyCustomOIDCRole',
      changesetRoleName: 'MyCustomChangesetRole',
      driftRoleName: 'MyCustomDriftRole',
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    const text = file.toString();

    expect(text).toContain("RoleName: 'MyCustomOIDCRole'");
    expect(text).toContain("RoleName: 'MyCustomChangesetRole'");
    expect(text).toContain("RoleName: 'MyCustomDriftRole'");
  });

  test('generates correct subject claims for multiple repos and branches', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['repo1', 'repo2'],
        branches: ['main', 'develop'],
      },
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    const text = file.toString();

    // Should have claims for all repo/branch combinations
    expect(text).toContain("'repo:my-org/repo1:ref:refs/heads/main'");
    expect(text).toContain("'repo:my-org/repo1:ref:refs/heads/develop'");
    expect(text).toContain("'repo:my-org/repo2:ref:refs/heads/main'");
    expect(text).toContain("'repo:my-org/repo2:ref:refs/heads/develop'");
  });

  test('generates wildcard claims when branches not specified', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
        // branches not specified - defaults to ['*']
      },
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    const text = file.toString();

    // Should use wildcard for all branches
    expect(text).toContain("'repo:my-org/my-repo:*'");
  });

  test('generates claims for wildcard repository', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['*'],
        branches: ['main'],
      },
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    const text = file.toString();

    // Should use wildcard for repo with specific branch
    expect(text).toContain("'repo:my-org/*:ref:refs/heads/main'");
  });

  test('includes additional claims when provided', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
        branches: ['main'],
        additionalClaims: ['pull_request', 'environment:production'],
      },
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    const text = file.toString();

    // Should include additional claims
    expect(text).toContain("'repo:my-org/my-repo:pull_request'");
    expect(text).toContain("'repo:my-org/my-repo:environment:production'");
  });

  test('uses custom output path when provided', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
      },
      outputPath: 'custom-stackset-template.yaml',
    });

    const out = synthSnapshot(app);
    expect(out['custom-stackset-template.yaml']).toBeDefined();
    expect(out['cdk-diff-workflow-stackset-template.yaml']).toBeUndefined();
  });

  test('creates expected projen tasks', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
      },
    });

    const out = synthSnapshot(app);
    const tasksJson = out['.projen/tasks.json'] as any;
    expect(tasksJson).toBeDefined();

    // Verify all tasks are created
    expect(tasksJson.tasks['stackset-create']).toBeDefined();
    expect(tasksJson.tasks['stackset-update']).toBeDefined();
    expect(tasksJson.tasks['stackset-deploy-instances']).toBeDefined();
    expect(tasksJson.tasks['stackset-delete-instances']).toBeDefined();
    expect(tasksJson.tasks['stackset-delete']).toBeDefined();
    expect(tasksJson.tasks['stackset-describe']).toBeDefined();
    expect(tasksJson.tasks['stackset-list-instances']).toBeDefined();
  });

  test('tasks include --call-as DELEGATED_ADMIN by default', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
      },
    });

    const out = synthSnapshot(app);
    const tasksJson = out['.projen/tasks.json'] as any;

    expect(tasksJson.tasks['stackset-create'].steps[0].exec).toContain('--call-as DELEGATED_ADMIN');
    expect(tasksJson.tasks['stackset-describe'].steps[0].exec).toContain('--call-as DELEGATED_ADMIN');
  });

  test('tasks exclude --call-as DELEGATED_ADMIN when delegatedAdmin is false', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
      },
      delegatedAdmin: false,
    });

    const out = synthSnapshot(app);
    const tasksJson = out['.projen/tasks.json'] as any;

    expect(tasksJson.tasks['stackset-create'].steps[0].exec).not.toContain('--call-as DELEGATED_ADMIN');
    expect(tasksJson.tasks['stackset-describe'].steps[0].exec).not.toContain('--call-as DELEGATED_ADMIN');
  });

  test('deploy instances task includes target OUs when provided', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
      },
      targetOrganizationalUnitIds: ['ou-xxxx-xxxxxxxx', 'r-xxxx'],
      regions: ['us-east-1', 'eu-west-1'],
    });

    const out = synthSnapshot(app);
    const tasksJson = out['.projen/tasks.json'] as any;

    expect(tasksJson.tasks['stackset-deploy-instances'].steps[0].exec).toContain(
      'OrganizationalUnitIds=ou-xxxx-xxxxxxxx,r-xxxx',
    );
    expect(tasksJson.tasks['stackset-deploy-instances'].steps[0].exec).toContain('--regions us-east-1 eu-west-1');
  });

  test('skips OIDC provider creation when skipOidcProviderCreation is true', () => {
    const app = new awscdk.AwsCdkTypeScriptApp({
      name: 'test-app',
      defaultReleaseBranch: 'main',
      cdkVersion: '2.85.0',
      projenrcTs: false,
      github: false,
    } as any);

    new CdkDiffIamTemplateStackSet({
      project: app,
      githubOidc: {
        owner: 'my-org',
        repositories: ['my-repo'],
        branches: ['main'],
      },
      skipOidcProviderCreation: true,
    });

    const out = synthSnapshot(app);
    const file = out['cdk-diff-workflow-stackset-template.yaml'];
    const text = file.toString();

    // OIDC Provider should NOT be present
    expect(text).not.toContain('GitHubOIDCProvider:');
    expect(text).not.toContain('Type: AWS::IAM::OIDCProvider');
    expect(text).not.toContain('GitHubOIDCProviderArn:');

    // OIDC Role should still be present (references existing provider)
    expect(text).toContain('GitHubOIDCRole:');
    expect(text).toContain('sts:AssumeRoleWithWebIdentity');
    expect(text).toContain('GitHubOIDCRoleArn:');

    // OIDC Role should NOT have DependsOn GitHubOIDCProvider
    expect(text).not.toContain('DependsOn: GitHubOIDCProvider');

    // Workflow roles should still be present and trust the OIDC role
    expect(text).toContain('CdkChangesetRole:');
    expect(text).toContain('CdkDriftRole:');
    expect(text).toContain('!GetAtt GitHubOIDCRole.Arn');
  });
});
