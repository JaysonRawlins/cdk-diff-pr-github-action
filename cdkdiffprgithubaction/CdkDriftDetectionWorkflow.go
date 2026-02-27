package cdkdiffprgithubaction

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-diff-pr-github-action/cdkdiffprgithubaction/jsii"
)

// Experimental.
type CdkDriftDetectionWorkflow interface {
}

// The jsii proxy struct for CdkDriftDetectionWorkflow
type jsiiProxy_CdkDriftDetectionWorkflow struct {
	_ byte // padding
}

// Experimental.
func NewCdkDriftDetectionWorkflow(props *CdkDriftDetectionWorkflowProps) CdkDriftDetectionWorkflow {
	_init_.Initialize()

	if err := validateNewCdkDriftDetectionWorkflowParameters(props); err != nil {
		panic(err)
	}
	j := jsiiProxy_CdkDriftDetectionWorkflow{}

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflow",
		[]interface{}{props},
		&j,
	)

	return &j
}

// Experimental.
func NewCdkDriftDetectionWorkflow_Override(c CdkDriftDetectionWorkflow, props *CdkDriftDetectionWorkflowProps) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflow",
		[]interface{}{props},
		c,
	)
}

