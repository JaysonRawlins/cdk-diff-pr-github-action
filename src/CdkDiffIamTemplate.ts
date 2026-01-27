import { TextFile } from 'projen';

/**
 * Props for generating CDK Diff IAM templates (no Projen dependency)
 */
export interface CdkDiffIamTemplateGeneratorProps {
  /** Name for the IAM role */
  readonly roleName: string;
  /** ARN of the existing GitHub OIDC role that can assume this changeset role */
  readonly oidcRoleArn: string;
  /** Region for the OIDC trust condition */
  readonly oidcRegion: string;
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

  /**
   * Generate the AWS CLI deploy command for the IAM template.
   */
  static generateDeployCommand(templatePath: string = 'cdk-diff-workflow-iam-template.yaml'): string {
    return `aws cloudformation deploy --template-file ${templatePath} --stack-name cdk-diff-workflow-iam-role --capabilities CAPABILITY_NAMED_IAM`;
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
