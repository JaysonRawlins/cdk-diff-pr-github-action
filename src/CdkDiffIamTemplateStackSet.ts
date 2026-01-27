import { TextFile } from 'projen';

/**
 * Which roles to include in the StackSet
 */
export enum StackSetRoleSelection {
  /** Include only the changeset role (CdkChangesetRole) */
  CHANGESET_ONLY = 'CHANGESET_ONLY',
  /** Include only the drift role (CdkDriftRole) */
  DRIFT_ONLY = 'DRIFT_ONLY',
  /** Include both roles (default) */
  BOTH = 'BOTH',
}

/**
 * Configuration for StackSet auto-deployment
 */
export interface StackSetAutoDeployment {
  /** Enable auto-deployment to new accounts in target OUs (default: true) */
  readonly enabled?: boolean;
  /** Retain stacks when account leaves OU (default: false) */
  readonly retainStacksOnAccountRemoval?: boolean;
}

/**
 * GitHub repository restrictions for OIDC authentication
 */
export interface GitHubOidcConfig {
  /**
   * GitHub organization or username (e.g., 'my-org' or 'my-username')
   */
  readonly owner: string;

  /**
   * Repository names allowed to assume the role (e.g., ['repo1', 'repo2'])
   * Use ['*'] to allow all repos in the organization
   */
  readonly repositories: string[];

  /**
   * Branch patterns allowed (e.g., ['main', 'release/*'])
   * Default: ['*'] (all branches)
   */
  readonly branches?: string[];

  /**
   * Additional subject claims for fine-grained access
   * e.g., ['pull_request', 'environment:production']
   */
  readonly additionalClaims?: string[];
}

/**
 * Props for generating StackSet templates (no Projen dependency)
 */
export interface CdkDiffIamTemplateStackSetGeneratorProps {
  /** GitHub OIDC configuration for repo/branch restrictions */
  readonly githubOidc: GitHubOidcConfig;

  /** Name of the GitHub OIDC role (default: 'GitHubOIDCRole') */
  readonly oidcRoleName?: string;

  /** Name of the CdkChangesetRole (default: 'CdkChangesetRole') */
  readonly changesetRoleName?: string;

  /** Name of the CdkDriftRole (default: 'CdkDriftRole') */
  readonly driftRoleName?: string;

  /** Which roles to include (default: BOTH) */
  readonly roleSelection?: StackSetRoleSelection;

  /** Description for the StackSet */
  readonly description?: string;

  /**
   * Skip creating the OIDC provider (use existing one).
   * Set to true if accounts already have a GitHub OIDC provider.
   * The template will reference the existing provider by ARN.
   * Default: false
   */
  readonly skipOidcProviderCreation?: boolean;
}

/**
 * Props for generating StackSet CLI commands (no Projen dependency)
 */
export interface CdkDiffIamTemplateStackSetCommandsProps {
  /** Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset') */
  readonly stackSetName?: string;

  /** Path to the template file (default: 'cdk-diff-workflow-stackset-template.yaml') */
  readonly templatePath?: string;

  /** Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']) */
  readonly targetOrganizationalUnitIds?: string[];

  /** Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']) */
  readonly regions?: string[];

  /** Auto-deployment configuration */
  readonly autoDeployment?: StackSetAutoDeployment;

  /**
   * Whether to use delegated admin mode for StackSet operations.
   * If true, adds --call-as DELEGATED_ADMIN to commands.
   * Default: true
   */
  readonly delegatedAdmin?: boolean;
}

/**
 * Pure generator class for StackSet templates and commands.
 * No Projen dependency - can be used in any project.
 */
export class CdkDiffIamTemplateStackSetGenerator {
  /**
   * Generate the CloudFormation StackSet template as a YAML string.
   */
  static generateTemplate(props: CdkDiffIamTemplateStackSetGeneratorProps): string {
    const oidcRoleName = props.oidcRoleName ?? 'GitHubOIDCRole';
    const changesetRoleName = props.changesetRoleName ?? 'CdkChangesetRole';
    const driftRoleName = props.driftRoleName ?? 'CdkDriftRole';
    const roleSelection = props.roleSelection ?? StackSetRoleSelection.BOTH;
    const skipOidcProvider = props.skipOidcProviderCreation ?? false;

    const lines = this.generateTemplateLines(
      props.githubOidc,
      oidcRoleName,
      changesetRoleName,
      driftRoleName,
      roleSelection,
      props.description,
      skipOidcProvider,
    );

    return lines.join('\n');
  }

  /**
   * Generate AWS CLI commands for StackSet operations.
   * Returns a map of command names to shell commands.
   */
  static generateCommands(props: CdkDiffIamTemplateStackSetCommandsProps = {}): Record<string, string> {
    const stackSetName = props.stackSetName ?? 'cdk-diff-workflow-iam-stackset';
    const templatePath = props.templatePath ?? 'cdk-diff-workflow-stackset-template.yaml';
    const regions = props.regions ?? ['us-east-1'];
    const targetOUs = props.targetOrganizationalUnitIds ?? [];
    const autoDeployEnabled = props.autoDeployment?.enabled ?? true;
    const retainStacks = props.autoDeployment?.retainStacksOnAccountRemoval ?? false;
    const delegatedAdmin = props.delegatedAdmin ?? true;
    const callAs = delegatedAdmin ? ' --call-as DELEGATED_ADMIN' : '';

    const ouList = targetOUs.length > 0 ? targetOUs.join(',') : '<OU_IDS>';
    const regionList = regions.join(' ');

    return {
      'stackset-create': `aws cloudformation create-stack-set --stack-set-name ${stackSetName} --template-body file://${templatePath} --capabilities CAPABILITY_NAMED_IAM --permission-model SERVICE_MANAGED --auto-deployment Enabled=${autoDeployEnabled},RetainStacksOnAccountRemoval=${retainStacks}${callAs}`,
      'stackset-update': `aws cloudformation update-stack-set --stack-set-name ${stackSetName} --template-body file://${templatePath} --capabilities CAPABILITY_NAMED_IAM${callAs}`,
      'stackset-deploy-instances': `aws cloudformation create-stack-instances --stack-set-name ${stackSetName} --deployment-targets OrganizationalUnitIds=${ouList} --regions ${regionList}${callAs}`,
      'stackset-delete-instances': `aws cloudformation delete-stack-instances --stack-set-name ${stackSetName} --deployment-targets OrganizationalUnitIds=${ouList} --regions ${regionList} --no-retain-stacks${callAs}`,
      'stackset-delete': `aws cloudformation delete-stack-set --stack-set-name ${stackSetName}${callAs}`,
      'stackset-describe': `aws cloudformation describe-stack-set --stack-set-name ${stackSetName}${callAs}`,
      'stackset-list-instances': `aws cloudformation list-stack-instances --stack-set-name ${stackSetName}${callAs}`,
    };
  }

  private static generateTemplateLines(
    githubOidc: GitHubOidcConfig,
    oidcRoleName: string,
    changesetRoleName: string,
    driftRoleName: string,
    roleSelection: StackSetRoleSelection,
    description?: string,
    skipOidcProvider: boolean = false,
  ): string[] {
    const lines: string[] = [];
    const desc = description ?? 'GitHub OIDC and IAM roles for CDK Diff/Drift workflows (StackSet deployment)';

    const includeChangeset =
      roleSelection === StackSetRoleSelection.BOTH || roleSelection === StackSetRoleSelection.CHANGESET_ONLY;
    const includeDrift =
      roleSelection === StackSetRoleSelection.BOTH || roleSelection === StackSetRoleSelection.DRIFT_ONLY;

    // Header
    lines.push("AWSTemplateFormatVersion: '2010-09-09'");
    lines.push(`Description: '${desc}'`);
    lines.push('');

    // Resources
    lines.push('Resources:');

    // OIDC Provider (only if not skipping)
    if (!skipOidcProvider) {
      lines.push(...this.generateOidcProviderLines());
    }

    // OIDC Role
    lines.push(...this.generateOidcRoleLines(oidcRoleName, githubOidc, skipOidcProvider));

    // Changeset/Drift roles
    if (includeChangeset) {
      lines.push(...this.generateChangesetRoleLines(changesetRoleName));
    }

    if (includeDrift) {
      lines.push(...this.generateDriftRoleLines(driftRoleName));
    }

    // Outputs
    lines.push('');
    lines.push('Outputs:');
    if (!skipOidcProvider) {
      lines.push(...this.generateOidcOutputLines());
    }

    // Always output the OIDC role ARN
    lines.push(...this.generateOidcRoleOutputLines());

    if (includeChangeset) {
      lines.push(...this.generateChangesetOutputLines());
    }

    if (includeDrift) {
      lines.push(...this.generateDriftOutputLines());
    }

    return lines;
  }

  private static generateOidcProviderLines(): string[] {
    return [
      '  # GitHub OIDC Provider',
      '  GitHubOIDCProvider:',
      '    Type: AWS::IAM::OIDCProvider',
      '    Properties:',
      '      Url: https://token.actions.githubusercontent.com',
      '      ClientIdList:',
      '        - sts.amazonaws.com',
      '      ThumbprintList:',
      '        - 6938fd4d98bab03faadb97b34396831e3780aea1',
      '        - 1c58a3a8518e8759bf075b76b750d4f2df264fcd',
      '',
    ];
  }

  private static generateOidcRoleLines(
    roleName: string,
    githubOidc: GitHubOidcConfig,
    skipOidcProvider: boolean = false,
  ): string[] {
    const subjectClaims = this.buildSubjectClaims(githubOidc);

    const lines = [
      '  # GitHub OIDC Role - authenticates GitHub Actions workflows',
      '  GitHubOIDCRole:',
      '    Type: AWS::IAM::Role',
    ];

    // Only add DependsOn if we're creating the provider
    if (!skipOidcProvider) {
      lines.push('    DependsOn: GitHubOIDCProvider');
    }

    lines.push(
      '    Properties:',
      "      RoleName: '" + roleName + "'",
      '      AssumeRolePolicyDocument:',
      "        Version: '2012-10-17'",
      '        Statement:',
      '          - Effect: Allow',
      '            Principal:',
      "              Federated: !Sub 'arn:aws:iam::${AWS::AccountId}:oidc-provider/token.actions.githubusercontent.com'",
      '            Action: sts:AssumeRoleWithWebIdentity',
      '            Condition:',
      '              StringEquals:',
      "                'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'",
      '              StringLike:',
      "                'token.actions.githubusercontent.com:sub':",
    );

    // Add subject claims
    for (const claim of subjectClaims) {
      lines.push(`                  - '${claim}'`);
    }

    lines.push('');
    return lines;
  }

  private static buildSubjectClaims(githubOidc: GitHubOidcConfig): string[] {
    const claims: string[] = [];
    const branches = githubOidc.branches ?? ['*'];

    for (const repo of githubOidc.repositories) {
      if (repo === '*') {
        // Wildcard repo - allow all repos with branch restrictions
        for (const branch of branches) {
          if (branch === '*') {
            claims.push(`repo:${githubOidc.owner}/*`);
          } else {
            claims.push(`repo:${githubOidc.owner}/*:ref:refs/heads/${branch}`);
          }
        }
      } else {
        // Specific repo
        for (const branch of branches) {
          if (branch === '*') {
            claims.push(`repo:${githubOidc.owner}/${repo}:*`);
          } else {
            claims.push(`repo:${githubOidc.owner}/${repo}:ref:refs/heads/${branch}`);
          }
        }
      }
    }

    // Add any additional claims
    if (githubOidc.additionalClaims) {
      for (const claim of githubOidc.additionalClaims) {
        for (const repo of githubOidc.repositories) {
          if (repo === '*') {
            claims.push(`repo:${githubOidc.owner}/*:${claim}`);
          } else {
            claims.push(`repo:${githubOidc.owner}/${repo}:${claim}`);
          }
        }
      }
    }

    return claims;
  }

  private static generateChangesetRoleLines(roleName: string): string[] {
    return [
      '  # CloudFormation ChangeSet Role - minimal permissions for changeset operations',
      '  CdkChangesetRole:',
      '    Type: AWS::IAM::Role',
      '    DependsOn: GitHubOIDCRole',
      '    Properties:',
      "      RoleName: '" + roleName + "'",
      '      AssumeRolePolicyDocument:',
      "        Version: '2012-10-17'",
      '        Statement:',
      '          - Effect: Allow',
      '            Principal:',
      '              AWS: !GetAtt GitHubOIDCRole.Arn',
      '            Action: sts:AssumeRole',
      '      Policies:',
      '        - PolicyName: CloudFormationChangeSetAccess',
      '          PolicyDocument:',
      "            Version: '2012-10-17'",
      '            Statement:',
      '              # CloudFormation changeset operations',
      '              - Effect: Allow',
      '                Action:',
      '                  - cloudformation:CreateChangeSet',
      '                  - cloudformation:DescribeChangeSet',
      '                  - cloudformation:DeleteChangeSet',
      '                  - cloudformation:ListChangeSets',
      '                  - cloudformation:DescribeStacks',
      "                Resource: '*'",
      '              # CDK bootstrap bucket access (for changeset creation)',
      '              - Effect: Allow',
      '                Action:',
      '                  - s3:GetObject',
      '                  - s3:PutObject',
      '                  - s3:DeleteObject',
      '                  - s3:ListBucket',
      '                Resource:',
      "                  - !Sub 'arn:aws:s3:::cdk-${AWS::AccountId}-${AWS::Region}-*'",
      "                  - !Sub 'arn:aws:s3:::cdk-${AWS::AccountId}-${AWS::Region}-*/*'",
      '              # CDK bootstrap parameter access',
      '              - Effect: Allow',
      '                Action:',
      '                  - ssm:GetParameter',
      '                  - ssm:GetParameters',
      '                  - ssm:GetParametersByPath',
      "                Resource: !Sub 'arn:aws:ssm:${AWS::Region}:${AWS::AccountId}:parameter/cdk-bootstrap/*'",
      '              # IAM PassRole for CDK operations',
      '              - Effect: Allow',
      '                Action:',
      '                  - iam:PassRole',
      "                Resource: '*'",
      '                Condition:',
      '                  StringEquals:',
      "                    'iam:PassedToService': 'cloudformation.amazonaws.com'",
      '',
    ];
  }

  private static generateDriftRoleLines(roleName: string): string[] {
    return [
      '  # CloudFormation Drift Detection Role - minimal permissions for drift detection operations',
      '  CdkDriftRole:',
      '    Type: AWS::IAM::Role',
      '    DependsOn: GitHubOIDCRole',
      '    Properties:',
      "      RoleName: '" + roleName + "'",
      '      AssumeRolePolicyDocument:',
      "        Version: '2012-10-17'",
      '        Statement:',
      '          - Effect: Allow',
      '            Principal:',
      '              AWS: !GetAtt GitHubOIDCRole.Arn',
      '            Action: sts:AssumeRole',
      '      Policies:',
      '        - PolicyName: CloudFormationDriftAccess',
      '          PolicyDocument:',
      "            Version: '2012-10-17'",
      '            Statement:',
      '              # CloudFormation drift detection operations',
      '              - Effect: Allow',
      '                Action:',
      '                  - cloudformation:DetectStackDrift',
      '                  - cloudformation:DescribeStackDriftDetectionStatus',
      '                  - cloudformation:DescribeStackResourceDrifts',
      '                  - cloudformation:DescribeStacks',
      '                  - cloudformation:ListStackResources',
      '                  - cloudformation:DetectStackResourceDrift',
      "                Resource: '*'",
      '',
    ];
  }

  private static generateOidcOutputLines(): string[] {
    return [
      '  GitHubOIDCProviderArn:',
      "    Description: 'ARN of the GitHub OIDC provider'",
      '    Value: !GetAtt GitHubOIDCProvider.Arn',
      '    Export:',
      "      Name: !Sub '${AWS::StackName}-GitHubOIDCProviderArn'",
      '',
    ];
  }

  private static generateOidcRoleOutputLines(): string[] {
    return [
      '  GitHubOIDCRoleArn:',
      "    Description: 'ARN of the GitHub OIDC role'",
      '    Value: !GetAtt GitHubOIDCRole.Arn',
      '    Export:',
      "      Name: !Sub '${AWS::StackName}-GitHubOIDCRoleArn'",
      '',
      '  GitHubOIDCRoleName:',
      "    Description: 'Name of the GitHub OIDC role'",
      '    Value: !Ref GitHubOIDCRole',
      '    Export:',
      "      Name: !Sub '${AWS::StackName}-GitHubOIDCRoleName'",
      '',
    ];
  }

  private static generateChangesetOutputLines(): string[] {
    return [
      '  CdkChangesetRoleArn:',
      "    Description: 'ARN of the CDK changeset role'",
      '    Value: !GetAtt CdkChangesetRole.Arn',
      '    Export:',
      "      Name: !Sub '${AWS::StackName}-CdkChangesetRoleArn'",
      '',
      '  CdkChangesetRoleName:',
      "    Description: 'Name of the CDK changeset role'",
      '    Value: !Ref CdkChangesetRole',
      '    Export:',
      "      Name: !Sub '${AWS::StackName}-CdkChangesetRoleName'",
      '',
    ];
  }

  private static generateDriftOutputLines(): string[] {
    return [
      '  CdkDriftRoleArn:',
      "    Description: 'ARN of the CDK drift detection role'",
      '    Value: !GetAtt CdkDriftRole.Arn',
      '    Export:',
      "      Name: !Sub '${AWS::StackName}-CdkDriftRoleArn'",
      '',
      '  CdkDriftRoleName:',
      "    Description: 'Name of the CDK drift detection role'",
      '    Value: !Ref CdkDriftRole',
      '    Export:',
      "      Name: !Sub '${AWS::StackName}-CdkDriftRoleName'",
    ];
  }
}

/**
 * Props for the Projen-integrated StackSet construct
 */
export interface CdkDiffIamTemplateStackSetProps extends CdkDiffIamTemplateStackSetGeneratorProps {
  /** Projen project instance */
  readonly project: any;

  /** Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset') */
  readonly stackSetName?: string;

  /** Output path for the template file (default: 'cdk-diff-workflow-stackset-template.yaml') */
  readonly outputPath?: string;

  /** Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']) */
  readonly targetOrganizationalUnitIds?: string[];

  /** Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']) */
  readonly regions?: string[];

  /** Auto-deployment configuration */
  readonly autoDeployment?: StackSetAutoDeployment;

  /**
   * Whether to use delegated admin mode for StackSet operations.
   * If true, adds --call-as DELEGATED_ADMIN to commands.
   * If false, assumes running from the management account.
   * Default: true
   */
  readonly delegatedAdmin?: boolean;
}

/**
 * Projen construct that creates a CloudFormation StackSet template for org-wide deployment of
 * GitHub OIDC provider, OIDC role, and CDK Diff/Drift IAM roles.
 *
 * This provides a self-contained per-account deployment with no role chaining required.
 *
 * For non-Projen projects, use `CdkDiffIamTemplateStackSetGenerator` directly.
 */
export class CdkDiffIamTemplateStackSet {
  constructor(props: CdkDiffIamTemplateStackSetProps) {
    const outputPath = props.outputPath ?? 'cdk-diff-workflow-stackset-template.yaml';
    const stackSetName = props.stackSetName ?? 'cdk-diff-workflow-iam-stackset';

    // Generate template using the generator
    const template = CdkDiffIamTemplateStackSetGenerator.generateTemplate(props);
    new TextFile(props.project, outputPath, { lines: template.split('\n') });

    // Generate commands and add as Projen tasks
    const commands = CdkDiffIamTemplateStackSetGenerator.generateCommands({
      stackSetName,
      templatePath: outputPath,
      targetOrganizationalUnitIds: props.targetOrganizationalUnitIds,
      regions: props.regions,
      autoDeployment: props.autoDeployment,
      delegatedAdmin: props.delegatedAdmin,
    });

    const taskDescriptions: Record<string, string> = {
      'stackset-create': 'Create the StackSet for org-wide IAM role deployment',
      'stackset-update': 'Update the StackSet template',
      'stackset-deploy-instances':
        'Deploy stack instances to target OUs and regions (pass --deployment-targets OrganizationalUnitIds=<ou-ids> to override)',
      'stackset-delete-instances': 'Delete stack instances from target OUs and regions',
      'stackset-delete': 'Delete the StackSet (requires all instances to be deleted first)',
      'stackset-describe': 'Describe the StackSet status and configuration',
      'stackset-list-instances': 'List all stack instances and their statuses',
    };

    for (const [taskName, command] of Object.entries(commands)) {
      props.project.addTask(taskName, {
        description: taskDescriptions[taskName],
        receiveArgs: taskName !== 'stackset-delete',
        exec: command,
      });
    }
  }
}
