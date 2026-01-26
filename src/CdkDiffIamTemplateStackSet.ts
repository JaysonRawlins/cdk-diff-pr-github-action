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

export interface CdkDiffIamTemplateStackSetProps {
  /** Projen project instance */
  readonly project: any;

  /** Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset') */
  readonly stackSetName?: string;

  /** Name of the CdkChangesetRole (default: 'CdkChangesetRole') */
  readonly changesetRoleName?: string;

  /** Name of the CdkDriftRole (default: 'CdkDriftRole') */
  readonly driftRoleName?: string;

  /** Output path for the template file (default: 'cdk-diff-workflow-stackset-template.yaml') */
  readonly outputPath?: string;

  /** GitHub OIDC configuration for repo/branch restrictions */
  readonly githubOidc: GitHubOidcConfig;

  /** Name of the GitHub OIDC role (default: 'GitHubOIDCRole') */
  readonly oidcRoleName?: string;

  /** Which roles to include (default: BOTH) */
  readonly roleSelection?: StackSetRoleSelection;

  /** Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']) */
  readonly targetOrganizationalUnitIds?: string[];

  /** Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']) */
  readonly regions?: string[];

  /** Auto-deployment configuration */
  readonly autoDeployment?: StackSetAutoDeployment;

  /** Description for the StackSet */
  readonly description?: string;

  /**
   * Whether to use delegated admin mode for StackSet operations.
   * If true, adds --call-as DELEGATED_ADMIN to commands.
   * If false, assumes running from the management account.
   * Default: true
   */
  readonly delegatedAdmin?: boolean;
}

/**
 * Creates a CloudFormation StackSet template for org-wide deployment of
 * GitHub OIDC provider, OIDC role, and CDK Diff/Drift IAM roles.
 *
 * This provides a self-contained per-account deployment with no role chaining required.
 */
export class CdkDiffIamTemplateStackSet {
  constructor(props: CdkDiffIamTemplateStackSetProps) {
    const stackSetName = props.stackSetName ?? 'cdk-diff-workflow-iam-stackset';
    const outputPath = props.outputPath ?? 'cdk-diff-workflow-stackset-template.yaml';
    const changesetRoleName = props.changesetRoleName ?? 'CdkChangesetRole';
    const driftRoleName = props.driftRoleName ?? 'CdkDriftRole';
    const oidcRoleName = props.oidcRoleName ?? 'GitHubOIDCRole';
    const roleSelection = props.roleSelection ?? StackSetRoleSelection.BOTH;
    const regions = props.regions ?? ['us-east-1'];
    const targetOUs = props.targetOrganizationalUnitIds ?? [];
    const autoDeployEnabled = props.autoDeployment?.enabled ?? true;
    const retainStacks = props.autoDeployment?.retainStacksOnAccountRemoval ?? false;
    const delegatedAdmin = props.delegatedAdmin ?? true;
    const callAs = delegatedAdmin ? ' --call-as DELEGATED_ADMIN' : '';

    // Generate CloudFormation template
    const templateLines = this.generateTemplateLines(
      props.githubOidc,
      oidcRoleName,
      changesetRoleName,
      driftRoleName,
      roleSelection,
      props.description,
    );

    new TextFile(props.project, outputPath, { lines: templateLines });

    // Add Projen tasks
    this.addCreateStackSetTask(props.project, stackSetName, outputPath, autoDeployEnabled, retainStacks, callAs);
    this.addUpdateStackSetTask(props.project, stackSetName, outputPath, callAs);
    this.addDeployInstancesTask(props.project, stackSetName, targetOUs, regions, callAs);
    this.addDeleteInstancesTask(props.project, stackSetName, targetOUs, regions, callAs);
    this.addDeleteStackSetTask(props.project, stackSetName, callAs);
    this.addDescribeStackSetTask(props.project, stackSetName, callAs);
    this.addListInstancesTask(props.project, stackSetName, callAs);
  }

  private generateTemplateLines(
    githubOidc: GitHubOidcConfig,
    oidcRoleName: string,
    changesetRoleName: string,
    driftRoleName: string,
    roleSelection: StackSetRoleSelection,
    description?: string,
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

    // OIDC Provider
    lines.push(...this.generateOidcProviderLines());

    // OIDC Role
    lines.push(...this.generateOidcRoleLines(oidcRoleName, githubOidc));

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
    lines.push(...this.generateOidcOutputLines());

    if (includeChangeset) {
      lines.push(...this.generateChangesetOutputLines());
    }

    if (includeDrift) {
      lines.push(...this.generateDriftOutputLines());
    }

    return lines;
  }

  private generateOidcProviderLines(): string[] {
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

  private generateOidcRoleLines(roleName: string, githubOidc: GitHubOidcConfig): string[] {
    const subjectClaims = this.buildSubjectClaims(githubOidc);

    const lines = [
      '  # GitHub OIDC Role - authenticates GitHub Actions workflows',
      '  GitHubOIDCRole:',
      '    Type: AWS::IAM::Role',
      '    DependsOn: GitHubOIDCProvider',
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
    ];

    // Add subject claims
    for (const claim of subjectClaims) {
      lines.push(`                  - '${claim}'`);
    }

    lines.push('');
    return lines;
  }

  private buildSubjectClaims(githubOidc: GitHubOidcConfig): string[] {
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

  private generateChangesetRoleLines(roleName: string): string[] {
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

  private generateDriftRoleLines(roleName: string): string[] {
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

  private generateOidcOutputLines(): string[] {
    return [
      '  GitHubOIDCProviderArn:',
      "    Description: 'ARN of the GitHub OIDC provider'",
      '    Value: !GetAtt GitHubOIDCProvider.Arn',
      '    Export:',
      "      Name: !Sub '${AWS::StackName}-GitHubOIDCProviderArn'",
      '',
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

  private generateChangesetOutputLines(): string[] {
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

  private generateDriftOutputLines(): string[] {
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

  private addCreateStackSetTask(
    project: any,
    stackSetName: string,
    outputPath: string,
    autoDeployEnabled: boolean,
    retainStacks: boolean,
    callAs: string,
  ): void {
    project.addTask('stackset-create', {
      description: 'Create the StackSet for org-wide IAM role deployment',
      receiveArgs: true,
      exec: `aws cloudformation create-stack-set --stack-set-name ${stackSetName} --template-body file://${outputPath} --capabilities CAPABILITY_NAMED_IAM --permission-model SERVICE_MANAGED --auto-deployment Enabled=${autoDeployEnabled},RetainStacksOnAccountRemoval=${retainStacks}${callAs}`,
    });
  }

  private addUpdateStackSetTask(project: any, stackSetName: string, outputPath: string, callAs: string): void {
    project.addTask('stackset-update', {
      description: 'Update the StackSet template',
      receiveArgs: true,
      exec: `aws cloudformation update-stack-set --stack-set-name ${stackSetName} --template-body file://${outputPath} --capabilities CAPABILITY_NAMED_IAM${callAs}`,
    });
  }

  private addDeployInstancesTask(
    project: any,
    stackSetName: string,
    targetOUs: string[],
    regions: string[],
    callAs: string,
  ): void {
    const ouList = targetOUs.length > 0 ? targetOUs.join(',') : '<OU_IDS>';
    const regionList = regions.join(' ');
    project.addTask('stackset-deploy-instances', {
      description:
        'Deploy stack instances to target OUs and regions (pass --deployment-targets OrganizationalUnitIds=<ou-ids> to override)',
      receiveArgs: true,
      exec: `aws cloudformation create-stack-instances --stack-set-name ${stackSetName} --deployment-targets OrganizationalUnitIds=${ouList} --regions ${regionList}${callAs}`,
    });
  }

  private addDeleteInstancesTask(
    project: any,
    stackSetName: string,
    targetOUs: string[],
    regions: string[],
    callAs: string,
  ): void {
    const ouList = targetOUs.length > 0 ? targetOUs.join(',') : '<OU_IDS>';
    const regionList = regions.join(' ');
    project.addTask('stackset-delete-instances', {
      description: 'Delete stack instances from target OUs and regions',
      receiveArgs: true,
      exec: `aws cloudformation delete-stack-instances --stack-set-name ${stackSetName} --deployment-targets OrganizationalUnitIds=${ouList} --regions ${regionList} --no-retain-stacks${callAs}`,
    });
  }

  private addDeleteStackSetTask(project: any, stackSetName: string, callAs: string): void {
    project.addTask('stackset-delete', {
      description: 'Delete the StackSet (requires all instances to be deleted first)',
      exec: `aws cloudformation delete-stack-set --stack-set-name ${stackSetName}${callAs}`,
    });
  }

  private addDescribeStackSetTask(project: any, stackSetName: string, callAs: string): void {
    project.addTask('stackset-describe', {
      description: 'Describe the StackSet status and configuration',
      exec: `aws cloudformation describe-stack-set --stack-set-name ${stackSetName}${callAs}`,
    });
  }

  private addListInstancesTask(project: any, stackSetName: string, callAs: string): void {
    project.addTask('stackset-list-instances', {
      description: 'List all stack instances and their statuses',
      exec: `aws cloudformation list-stack-instances --stack-set-name ${stackSetName}${callAs}`,
    });
  }
}
