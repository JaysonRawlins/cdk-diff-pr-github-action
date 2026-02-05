import { TextFile } from 'projen';
import { GitHubOidcConfig } from './CdkDiffIamTemplateStackSet';

/**
 * Props for generating CDK Diff IAM templates (no Projen dependency)
 */
export interface CdkDiffIamTemplateGeneratorProps {
  /** Name for the changeset IAM role */
  readonly roleName: string;

  /**
   * ARN of the existing GitHub OIDC role that can assume this changeset role.
   * Required when createOidcRole is false or undefined.
   */
  readonly oidcRoleArn?: string;

  /**
   * Region for the OIDC trust condition.
   * Only used when oidcRoleArn is provided (external OIDC role).
   */
  readonly oidcRegion?: string;

  /**
   * Create a GitHub OIDC role within this template instead of using an existing one.
   * When true, githubOidc configuration is required and oidcRoleArn is ignored.
   * Default: false
   */
  readonly createOidcRole?: boolean;

  /**
   * Name of the GitHub OIDC role to create.
   * Only used when createOidcRole is true.
   * Default: 'GitHubOIDCRole'
   */
  readonly oidcRoleName?: string;

  /**
   * GitHub OIDC configuration for repo/branch restrictions.
   * Required when createOidcRole is true.
   */
  readonly githubOidc?: GitHubOidcConfig;

  /**
   * Skip creating the OIDC provider (use existing one).
   * Set to true if the account already has a GitHub OIDC provider.
   * Only used when createOidcRole is true.
   * Default: false
   */
  readonly skipOidcProviderCreation?: boolean;
}

/**
 * Pure generator class for CDK Diff IAM templates.
 * No Projen dependency - can be used in any project.
 */
export class CdkDiffIamTemplateGenerator {
  /**
   * Generate the CloudFormation IAM template as a YAML string.
   */
  static generateTemplate(props: CdkDiffIamTemplateGeneratorProps): string {
    const createOidcRole = props.createOidcRole ?? false;

    // Validate props
    if (createOidcRole) {
      if (!props.githubOidc) {
        throw new Error('githubOidc configuration is required when createOidcRole is true');
      }
    } else {
      if (!props.oidcRoleArn) {
        throw new Error('oidcRoleArn is required when createOidcRole is false');
      }
      if (!props.oidcRegion) {
        throw new Error('oidcRegion is required when createOidcRole is false');
      }
    }

    if (createOidcRole) {
      return this.generateTemplateWithOidcRole(props);
    } else {
      return this.generateTemplateWithExternalOidcRole(props);
    }
  }

  /**
   * Generate the AWS CLI deploy command for the IAM template.
   */
  static generateDeployCommand(templatePath: string = 'cdk-diff-workflow-iam-template.yaml'): string {
    return `aws cloudformation deploy --template-file ${templatePath} --stack-name cdk-diff-workflow-iam-role --capabilities CAPABILITY_NAMED_IAM`;
  }

  /**
   * Generate template that creates OIDC provider and role (self-contained)
   */
  private static generateTemplateWithOidcRole(props: CdkDiffIamTemplateGeneratorProps): string {
    const oidcRoleName = props.oidcRoleName ?? 'GitHubOIDCRole';
    const skipOidcProvider = props.skipOidcProviderCreation ?? false;
    const githubOidc = props.githubOidc!;

    const lines: string[] = [
      "AWSTemplateFormatVersion: '2010-09-09'",
      "Description: 'GitHub OIDC and IAM roles for CDK Diff Stack Workflow construct'",
      '',
      'Resources:',
    ];

    // OIDC Provider (only if not skipping)
    if (!skipOidcProvider) {
      lines.push(...this.generateOidcProviderLines());
    }

    // OIDC Role (needs permission to assume the changeset role)
    lines.push(...this.generateOidcRoleLines(oidcRoleName, githubOidc, skipOidcProvider, props.roleName));

    // Changeset Role (trusts the created OIDC role)
    lines.push(...this.generateChangesetRoleWithOidcRef(props.roleName));

    // Outputs
    lines.push('');
    lines.push('Outputs:');

    if (!skipOidcProvider) {
      lines.push(...this.generateOidcProviderOutputLines());
    }

    lines.push(...this.generateOidcRoleOutputLines());
    lines.push(...this.generateChangesetOutputLines());

    return lines.join('\n');
  }

  /**
   * Generate template that uses an external OIDC role (original behavior)
   */
  private static generateTemplateWithExternalOidcRole(props: CdkDiffIamTemplateGeneratorProps): string {
    const lines = [
      "AWSTemplateFormatVersion: '2010-09-09'",
      "Description: 'IAM role for CDK Diff Stack Workflow construct'",
      '',
      'Parameters:',
      '  GitHubOIDCRoleArn:',
      '    Type: String',
      "    Description: 'ARN of the existing GitHub OIDC role that can assume this changeset role'",
      `    Default: '${props.oidcRoleArn}'`,
      '',
      'Resources:',
      '  # CloudFormation ChangeSet Role - minimal permissions for changeset operations',
      '  CdkChangesetRole:',
      '    Type: AWS::IAM::Role',
      '    Properties:',
      "      RoleName: '" + props.roleName + "'",
      '      AssumeRolePolicyDocument:',
      "        Version: '2012-10-17'",
      '        Statement:',
      '          - Effect: Allow',
      '            Principal:',
      '              AWS: !Ref GitHubOIDCRoleArn',
      '            Action: sts:AssumeRole',
      '            Condition:',
      '              StringEquals:',
      "                aws:RequestedRegion: '" + props.oidcRegion + "'",
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
      '                  - cloudformation:GetTemplate',
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
      'Outputs:',
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
    ];

    return lines.join('\n');
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
    changesetRoleName?: string,
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

    // Add policies for assuming changeset role and CDK bootstrap roles, plus CDK diff permissions
    lines.push('      Policies:');

    // Policy 1: AssumeChangesetRole - allows assuming changeset role and CDK bootstrap roles
    lines.push('        - PolicyName: AssumeChangesetRole');
    lines.push('          PolicyDocument:');
    lines.push("            Version: '2012-10-17'");
    lines.push('            Statement:');
    lines.push('              - Effect: Allow');
    lines.push('                Action: sts:AssumeRole');
    lines.push('                Resource:');
    if (changesetRoleName) {
      lines.push(`                  - !Sub 'arn:aws:iam::\${AWS::AccountId}:role/${changesetRoleName}'`);
    }
    // CDK bootstrap roles
    lines.push('                  # CDK bootstrap roles');
    lines.push("                  - !Sub 'arn:aws:iam::${AWS::AccountId}:role/cdk-hnb659fds-deploy-role-${AWS::AccountId}-${AWS::Region}'");
    lines.push("                  - !Sub 'arn:aws:iam::${AWS::AccountId}:role/cdk-hnb659fds-file-publishing-role-${AWS::AccountId}-${AWS::Region}'");
    lines.push("                  - !Sub 'arn:aws:iam::${AWS::AccountId}:role/cdk-hnb659fds-image-publishing-role-${AWS::AccountId}-${AWS::Region}'");
    lines.push("                  - !Sub 'arn:aws:iam::${AWS::AccountId}:role/cdk-hnb659fds-lookup-role-${AWS::AccountId}-${AWS::Region}'");

    // Policy 2: CdkDiffPermissions - direct permissions for CDK diff operations
    lines.push('        - PolicyName: CdkDiffPermissions');
    lines.push('          PolicyDocument:');
    lines.push("            Version: '2012-10-17'");
    lines.push('            Statement:');
    lines.push('              # CDK bootstrap parameter access (needed for cdk deploy/diff)');
    lines.push('              - Effect: Allow');
    lines.push('                Action:');
    lines.push('                  - ssm:GetParameter');
    lines.push('                  - ssm:GetParameters');
    lines.push("                Resource: !Sub 'arn:aws:ssm:${AWS::Region}:${AWS::AccountId}:parameter/cdk-bootstrap/*'");
    lines.push('              # CloudFormation operations for changeset creation');
    lines.push('              - Effect: Allow');
    lines.push('                Action:');
    lines.push('                  - cloudformation:CreateChangeSet');
    lines.push('                  - cloudformation:DescribeChangeSet');
    lines.push('                  - cloudformation:DeleteChangeSet');
    lines.push('                  - cloudformation:ListChangeSets');
    lines.push('                  - cloudformation:DescribeStacks');
    lines.push('                  - cloudformation:GetTemplate');
    lines.push("                Resource: '*'");
    lines.push('              # CDK bootstrap bucket access');
    lines.push('              - Effect: Allow');
    lines.push('                Action:');
    lines.push('                  - s3:GetObject');
    lines.push('                  - s3:PutObject');
    lines.push('                  - s3:ListBucket');
    lines.push('                  - s3:GetBucketLocation');
    lines.push('                Resource:');
    lines.push("                  - !Sub 'arn:aws:s3:::cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}'");
    lines.push("                  - !Sub 'arn:aws:s3:::cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/*'");
    lines.push('              # IAM PassRole for CDK operations');
    lines.push('              - Effect: Allow');
    lines.push('                Action:');
    lines.push('                  - iam:PassRole');
    lines.push("                Resource: !Sub 'arn:aws:iam::${AWS::AccountId}:role/cdk-hnb659fds-*'");
    lines.push('                Condition:');
    lines.push('                  StringEquals:');
    lines.push("                    'iam:PassedToService': 'cloudformation.amazonaws.com'");

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

  private static generateChangesetRoleWithOidcRef(roleName: string): string[] {
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
      '                  - cloudformation:GetTemplate',
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

  private static generateOidcProviderOutputLines(): string[] {
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
    ];
  }
}

/**
 * Props for the Projen-integrated CDK Diff IAM template construct
 */
export interface CdkDiffIamTemplateProps extends CdkDiffIamTemplateGeneratorProps {
  /** Projen project instance */
  readonly project: any;
  /** Output path for the template file (default: 'cdk-diff-workflow-iam-template.yaml') */
  readonly outputPath?: string;
}

/**
 * Projen construct that emits a CloudFormation template with minimal IAM permissions
 * for the CDK Diff Stack Workflow.
 *
 * For non-Projen projects, use `CdkDiffIamTemplateGenerator` directly.
 */
export class CdkDiffIamTemplate {
  constructor(props: CdkDiffIamTemplateProps) {
    const outputPath = props.outputPath ?? 'cdk-diff-workflow-iam-template.yaml';

    // Generate template using the generator
    const template = CdkDiffIamTemplateGenerator.generateTemplate(props);
    new TextFile(props.project, outputPath, { lines: template.split('\n') });

    // Add deploy task
    props.project.addTask('deploy-cdkdiff-iam-template', {
      description:
        'Deploy the CDK Diff IAM template via CloudFormation (accepts extra AWS CLI args, e.g., --parameter-overrides Key=Value...)',
      receiveArgs: true,
      exec: CdkDiffIamTemplateGenerator.generateDeployCommand(outputPath),
    });
  }
}
