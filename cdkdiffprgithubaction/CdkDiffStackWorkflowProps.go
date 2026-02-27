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
}

