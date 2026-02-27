package cdkdiffprgithubaction


// Experimental.
type CdkDriftDetectionWorkflowProps struct {
	// Experimental.
	Project interface{} `field:"required" json:"project" yaml:"project"`
	// Experimental.
	Stacks *[]*Stack `field:"required" json:"stacks" yaml:"stacks"`
	// Experimental.
	CreateIssues *bool `field:"optional" json:"createIssues" yaml:"createIssues"`
	// Experimental.
	NodeVersion *string `field:"optional" json:"nodeVersion" yaml:"nodeVersion"`
	// Experimental.
	OidcRegion *string `field:"optional" json:"oidcRegion" yaml:"oidcRegion"`
	// Experimental.
	OidcRoleArn *string `field:"optional" json:"oidcRoleArn" yaml:"oidcRoleArn"`
	// Optional additional GitHub Action steps to run after drift detection for each stack.
	//
	// These steps run after results are uploaded for each stack. You can include
	// any notifications you like (e.g., Slack). Provide explicit inputs (e.g., payload/markdown)
	// directly in your step without relying on a pre-generated payload.
	// Experimental.
	PostGitHubSteps interface{} `field:"optional" json:"postGitHubSteps" yaml:"postGitHubSteps"`
	// Experimental.
	Schedule *string `field:"optional" json:"schedule" yaml:"schedule"`
	// Experimental.
	ScriptOutputPath *string `field:"optional" json:"scriptOutputPath" yaml:"scriptOutputPath"`
	// Experimental.
	WorkflowName *string `field:"optional" json:"workflowName" yaml:"workflowName"`
}

