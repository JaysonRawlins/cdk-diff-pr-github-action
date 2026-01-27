import { TextFile } from 'projen';

/**
 * Props for generating CDK Drift IAM templates (no Projen dependency)
 */
export interface CdkDriftIamTemplateGeneratorProps {
  /** Name for the IAM role */
  readonly roleName: string;
  /** ARN of the existing GitHub OIDC role that can assume this drift role */
  readonly oidcRoleArn: string;
  /** Region for the OIDC trust condition */
  readonly oidcRegion: string;
}

/**
 * Pure generator class for CDK Drift IAM templates.
 * No Projen dependency - can be used in any project.
 */
export class CdkDriftIamTemplateGenerator {
  /**
   * Generate the CloudFormation IAM template as a YAML string.
   */
  static generateTemplate(props: CdkDriftIamTemplateGeneratorProps): string {
    const lines = [
      "AWSTemplateFormatVersion: '2010-09-09'",
      "Description: 'IAM role for CDK Drift Detection Workflow'",
      '',
      'Parameters:',
      '  GitHubOIDCRoleArn:',
      '    Type: String',
      "    Description: 'ARN of the existing GitHub OIDC role that can assume this drift role'",
      `    Default: '${props.oidcRoleArn}'`,
      '',
      'Resources:',
      '  # CloudFormation Drift Detection Role - minimal permissions for drift detection operations',
      '  CdkDriftRole:',
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
      'Outputs:',
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

    return lines.join('\n');
  }

  /**
   * Generate the AWS CLI deploy command for the IAM template.
   */
  static generateDeployCommand(templatePath: string = 'cdk-drift-workflow-iam-template.yaml'): string {
    return `aws cloudformation deploy --template-file ${templatePath} --stack-name cdk-drift-workflow-iam-role --capabilities CAPABILITY_NAMED_IAM`;
  }
}

/**
 * Props for the Projen-integrated CDK Drift IAM template construct
 */
export interface CdkDriftIamTemplateProps extends CdkDriftIamTemplateGeneratorProps {
  /** Projen project instance */
  readonly project: any;
  /** Output path for the template file (default: 'cdk-drift-workflow-iam-template.yaml') */
  readonly outputPath?: string;
}

/**
 * Projen construct that emits a CloudFormation template with minimal IAM permissions
 * for the CDK Drift Detection Workflow.
 *
 * For non-Projen projects, use `CdkDriftIamTemplateGenerator` directly.
 */
export class CdkDriftIamTemplate {
  constructor(props: CdkDriftIamTemplateProps) {
    const outputPath = props.outputPath ?? 'cdk-drift-workflow-iam-template.yaml';

    // Generate template using the generator
    const template = CdkDriftIamTemplateGenerator.generateTemplate(props);
    new TextFile(props.project, outputPath, { lines: template.split('\n') });

    // Add deploy task
    props.project.addTask('deploy-cdkdrift-iam-template', {
      description:
        'Deploy the CDK Drift Detection IAM template via CloudFormation (accepts extra AWS CLI args, e.g., --parameter-overrides Key=Value...)',
      receiveArgs: true,
      exec: CdkDriftIamTemplateGenerator.generateDeployCommand(outputPath),
    });
  }
}
