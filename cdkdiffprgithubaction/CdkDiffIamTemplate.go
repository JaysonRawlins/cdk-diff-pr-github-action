package cdkdiffprgithubaction

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-diff-pr-github-action/cdkdiffprgithubaction/jsii"
)

// Projen construct that emits a CloudFormation template with minimal IAM permissions for the CDK Diff Stack Workflow.
//
// For non-Projen projects, use `CdkDiffIamTemplateGenerator` directly.
// Experimental.
type CdkDiffIamTemplate interface {
}

// The jsii proxy struct for CdkDiffIamTemplate
type jsiiProxy_CdkDiffIamTemplate struct {
	_ byte // padding
}

// Experimental.
func NewCdkDiffIamTemplate(props *CdkDiffIamTemplateProps) CdkDiffIamTemplate {
	_init_.Initialize()

	if err := validateNewCdkDiffIamTemplateParameters(props); err != nil {
		panic(err)
	}
	j := jsiiProxy_CdkDiffIamTemplate{}

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplate",
		[]interface{}{props},
		&j,
	)

	return &j
}

// Experimental.
func NewCdkDiffIamTemplate_Override(c CdkDiffIamTemplate, props *CdkDiffIamTemplateProps) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplate",
		[]interface{}{props},
		c,
	)
}

