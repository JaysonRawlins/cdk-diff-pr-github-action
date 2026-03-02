package cdkdiffprgithubaction


// Experimental.
type CdkDiffStackWorkflowProps struct {
	// Experimental.
	Project interface{} `field:"required" json:"project" yaml:"project"`
	// Experimental.
	Stacks *[]*CdkDiffStack `field:"required" json:"stacks" yaml:"stacks"`
	// Experimental.
	CdkYarnCommand *string `field:"optional" json:"cdkYarnCommand" yaml:"cdkYarnCommand"`
	// Experimental.
	NodeVersion *string `field:"optional" json:"nodeVersion" yaml:"nodeVersion"`
	// Experimental.
	OidcRegion *string `field:"optional" json:"oidcRegion" yaml:"oidcRegion"`
	// Experimental.
	OidcRoleArn *string `field:"optional" json:"oidcRoleArn" yaml:"oidcRoleArn"`
	// Additional GitHub Actions steps to run after all CDK operations complete.
	//
	// Accepts a static array of steps, or a factory function receiving context:
	// `(ctx: { stack: string; workingDirectory?: string }) => GitHubStep[]`
	//
	// When `workingDirectory` is set, all `run:` steps inherit that directory.
	// To run a step at the repository root, add `working-directory: '.'` to that step.
	// Experimental.
	PostGitHubSteps interface{} `field:"optional" json:"postGitHubSteps" yaml:"postGitHubSteps"`
	// Additional GitHub Actions steps to run before CDK operations (after install, before AWS creds).
	//
	// Accepts a static array of steps, or a factory function receiving context:
	// `(ctx: { stack: string; workingDirectory?: string }) => GitHubStep[]`
	//
	// When `workingDirectory` is set, all `run:` steps inherit that directory.
	// To run a step at the repository root, add `working-directory: '.'` to that step.
	// Experimental.
	PreGitHubSteps interface{} `field:"optional" json:"preGitHubSteps" yaml:"preGitHubSteps"`
	// Experimental.
	ScriptOutputPath *string `field:"optional" json:"scriptOutputPath" yaml:"scriptOutputPath"`
	// Working directory for the CDK app, relative to the repository root.
	//
	// Useful for monorepos where infrastructure lives in a subdirectory (e.g., 'infra').
	//
	// When set, all workflow run steps will use `defaults.run.working-directory`
	// and script paths will be adjusted to use absolute references.
	// Default: - repository root.
	//
	// Experimental.
	WorkingDirectory *string `field:"optional" json:"workingDirectory" yaml:"workingDirectory"`
}

