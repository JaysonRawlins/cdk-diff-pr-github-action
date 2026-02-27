package cdkdiffprgithubaction

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-diff-pr-github-action/cdkdiffprgithubaction/jsii"
)

// Projen construct that creates a CloudFormation StackSet template for org-wide deployment of GitHub OIDC provider, OIDC role, and CDK Diff/Drift IAM roles.
//
// This provides a self-contained per-account deployment with no role chaining required.
//
// For non-Projen projects, use `CdkDiffIamTemplateStackSetGenerator` directly.
// Experimental.
type CdkDiffIamTemplateStackSet interface {
}

// The jsii proxy struct for CdkDiffIamTemplateStackSet
type jsiiProxy_CdkDiffIamTemplateStackSet struct {
	_ byte // padding
}

// Experimental.
func NewCdkDiffIamTemplateStackSet(props *CdkDiffIamTemplateStackSetProps) CdkDiffIamTemplateStackSet {
	_init_.Initialize()

	if err := validateNewCdkDiffIamTemplateStackSetParameters(props); err != nil {
		panic(err)
	}
	j := jsiiProxy_CdkDiffIamTemplateStackSet{}

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSet",
		[]interface{}{props},
		&j,
	)

	return &j
}

// Experimental.
func NewCdkDiffIamTemplateStackSet_Override(c CdkDiffIamTemplateStackSet, props *CdkDiffIamTemplateStackSetProps) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSet",
		[]interface{}{props},
		c,
	)
}

