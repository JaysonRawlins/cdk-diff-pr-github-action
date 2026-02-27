package cdkdiffprgithubaction

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-diff-pr-github-action/cdkdiffprgithubaction/jsii"
)

// Projen construct that emits a CloudFormation template with minimal IAM permissions for the CDK Drift Detection Workflow.
//
// For non-Projen projects, use `CdkDriftIamTemplateGenerator` directly.
// Experimental.
type CdkDriftIamTemplate interface {
}

// The jsii proxy struct for CdkDriftIamTemplate
type jsiiProxy_CdkDriftIamTemplate struct {
	_ byte // padding
}

// Experimental.
func NewCdkDriftIamTemplate(props *CdkDriftIamTemplateProps) CdkDriftIamTemplate {
	_init_.Initialize()

	if err := validateNewCdkDriftIamTemplateParameters(props); err != nil {
		panic(err)
	}
	j := jsiiProxy_CdkDriftIamTemplate{}

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplate",
		[]interface{}{props},
		&j,
	)

	return &j
}

// Experimental.
func NewCdkDriftIamTemplate_Override(c CdkDriftIamTemplate, props *CdkDriftIamTemplateProps) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplate",
		[]interface{}{props},
		c,
	)
}

