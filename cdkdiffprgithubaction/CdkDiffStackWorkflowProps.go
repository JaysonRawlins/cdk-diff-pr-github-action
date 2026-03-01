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

