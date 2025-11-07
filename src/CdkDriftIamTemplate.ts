import { TextFile } from 'projen';

export interface CdkDriftIamTemplateProps {
  readonly project: any;
  readonly roleName: string;
  readonly outputPath?: string;
  readonly oidcRoleArn: string;
  readonly oidcRegion: string;
}

export class CdkDriftIamTemplate {
  constructor(props: CdkDriftIamTemplateProps) {
    const outputPath = props.outputPath ?? 'cdk-drift-workflow-iam-template.yaml';

    props.project.addTask('deploy-cdkdrift-iam-template', {
      description:
        'Deploy the CDK Drift Detection IAM template via CloudFormation (accepts extra AWS CLI args, e.g., --parameter-overrides Key=Value...)',
      receiveArgs: true,
      exec:
        `aws cloudformation deploy --template-file ${outputPath} --stack-name cdk-drift-workflow-iam-role --capabilities CAPABILITY_NAMED_IAM`,
    });

    new TextFile(props.project, outputPath, {
      lines: [
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
      ],
    });
  }
}
