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
	// Additional GitHub Actions steps to run before drift detection (after install, before AWS creds).
	//
	// Accepts a static array of steps, or a factory function receiving context:
	// `(ctx: { stack: string; workingDirectory?: string }) => GitHubStep[]`
	//
	// When `workingDirectory` is set, all `run:` steps inherit that directory.
	// To run a step at the repository root, add `working-directory: '.'` to that step.
	//
	// Pre-steps automatically receive the stack-selection condition (`if`) so they
	// only run when the stack is selected via dispatch.
	// Experimental.
	PreGitHubSteps interface{} `field:"optional" json:"preGitHubSteps" yaml:"preGitHubSteps"`
	// Experimental.
	Schedule *string `field:"optional" json:"schedule" yaml:"schedule"`
	// Experimental.
	ScriptOutputPath *string `field:"optional" json:"scriptOutputPath" yaml:"scriptOutputPath"`
	// Experimental.
	WorkflowName *string `field:"optional" json:"workflowName" yaml:"workflowName"`
	// Working directory for the CDK app, relative to the repository root.
	//
	// Useful for monorepos where infrastructure lives in a subdirectory (e.g., 'infra').
	//
	// When set, all workflow run steps will use `defaults.run.working-directory`
	// and artifact/script paths will be adjusted accordingly.
	// Default: - repository root.
	//
	// Experimental.
	WorkingDirectory *string `field:"optional" json:"workingDirectory" yaml:"workingDirectory"`
}

