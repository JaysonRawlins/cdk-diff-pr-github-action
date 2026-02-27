package cdkdiffprgithubaction

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-diff-pr-github-action/cdkdiffprgithubaction/jsii"
)

// Pure generator class for CDK Drift IAM templates.
//
// No Projen dependency - can be used in any project.
// Experimental.
type CdkDriftIamTemplateGenerator interface {
}

// The jsii proxy struct for CdkDriftIamTemplateGenerator
type jsiiProxy_CdkDriftIamTemplateGenerator struct {
	_ byte // padding
}

// Experimental.
func NewCdkDriftIamTemplateGenerator() CdkDriftIamTemplateGenerator {
	_init_.Initialize()

	j := jsiiProxy_CdkDriftIamTemplateGenerator{}

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator",
		nil, // no parameters
		&j,
	)

	return &j
}

// Experimental.
func NewCdkDriftIamTemplateGenerator_Override(c CdkDriftIamTemplateGenerator) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator",
		nil, // no parameters
		c,
	)
}

// Generate the AWS CLI deploy command for the IAM template.
// Experimental.
func CdkDriftIamTemplateGenerator_GenerateDeployCommand(templatePath *string) *string {
	_init_.Initialize()

	var returns *string

	_jsii_.StaticInvoke(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator",
		"generateDeployCommand",
		[]interface{}{templatePath},
		&returns,
	)

	return returns
}

// Generate the CloudFormation IAM template as a YAML string.
// Experimental.
func CdkDriftIamTemplateGenerator_GenerateTemplate(props *CdkDriftIamTemplateGeneratorProps) *string {
	_init_.Initialize()

	if err := validateCdkDriftIamTemplateGenerator_GenerateTemplateParameters(props); err != nil {
		panic(err)
	}
	var returns *string

	_jsii_.StaticInvoke(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator",
		"generateTemplate",
		[]interface{}{props},
		&returns,
	)

	return returns
}

