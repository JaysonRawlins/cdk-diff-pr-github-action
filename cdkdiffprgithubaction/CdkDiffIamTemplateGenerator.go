package cdkdiffprgithubaction

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-diff-pr-github-action/cdkdiffprgithubaction/jsii"
)

// Pure generator class for CDK Diff IAM templates.
//
// No Projen dependency - can be used in any project.
// Experimental.
type CdkDiffIamTemplateGenerator interface {
}

// The jsii proxy struct for CdkDiffIamTemplateGenerator
type jsiiProxy_CdkDiffIamTemplateGenerator struct {
	_ byte // padding
}

// Experimental.
func NewCdkDiffIamTemplateGenerator() CdkDiffIamTemplateGenerator {
	_init_.Initialize()

	j := jsiiProxy_CdkDiffIamTemplateGenerator{}

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator",
		nil, // no parameters
		&j,
	)

	return &j
}

// Experimental.
func NewCdkDiffIamTemplateGenerator_Override(c CdkDiffIamTemplateGenerator) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator",
		nil, // no parameters
		c,
	)
}

// Generate the AWS CLI deploy command for the IAM template.
// Experimental.
func CdkDiffIamTemplateGenerator_GenerateDeployCommand(templatePath *string) *string {
	_init_.Initialize()

	var returns *string

	_jsii_.StaticInvoke(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator",
		"generateDeployCommand",
		[]interface{}{templatePath},
		&returns,
	)

	return returns
}

// Generate the CloudFormation IAM template as a YAML string.
// Experimental.
func CdkDiffIamTemplateGenerator_GenerateTemplate(props *CdkDiffIamTemplateGeneratorProps) *string {
	_init_.Initialize()

	if err := validateCdkDiffIamTemplateGenerator_GenerateTemplateParameters(props); err != nil {
		panic(err)
	}
	var returns *string

	_jsii_.StaticInvoke(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator",
		"generateTemplate",
		[]interface{}{props},
		&returns,
	)

	return returns
}

