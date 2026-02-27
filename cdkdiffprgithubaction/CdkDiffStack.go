package cdkdiffprgithubaction


// Experimental.
type CdkDiffStack struct {
	// Experimental.
	ChangesetRoleToAssumeArn *string `field:"required" json:"changesetRoleToAssumeArn" yaml:"changesetRoleToAssumeArn"`
	// Experimental.
	ChangesetRoleToAssumeRegion *string `field:"required" json:"changesetRoleToAssumeRegion" yaml:"changesetRoleToAssumeRegion"`
	// Experimental.
	StackName *string `field:"required" json:"stackName" yaml:"stackName"`
	// Experimental.
	OidcRegion *string `field:"optional" json:"oidcRegion" yaml:"oidcRegion"`
	// Experimental.
	OidcRoleArn *string `field:"optional" json:"oidcRoleArn" yaml:"oidcRoleArn"`
}

