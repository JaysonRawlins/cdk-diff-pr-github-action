package cdkdiffprgithubaction

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-diff-pr-github-action/cdkdiffprgithubaction/jsii"
)

// Experimental.
type CdkDiffStackWorkflow interface {
}

// The jsii proxy struct for CdkDiffStackWorkflow
type jsiiProxy_CdkDiffStackWorkflow struct {
	_ byte // padding
}

// Experimental.
func NewCdkDiffStackWorkflow(props *CdkDiffStackWorkflowProps) CdkDiffStackWorkflow {
	_init_.Initialize()

	if err := validateNewCdkDiffStackWorkflowParameters(props); err != nil {
		panic(err)
	}
	j := jsiiProxy_CdkDiffStackWorkflow{}

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflow",
		[]interface{}{props},
		&j,
	)

	return &j
}

// Experimental.
func NewCdkDiffStackWorkflow_Override(c CdkDiffStackWorkflow, props *CdkDiffStackWorkflowProps) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflow",
		[]interface{}{props},
		c,
	)
}

