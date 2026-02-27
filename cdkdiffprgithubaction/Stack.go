package cdkdiffprgithubaction


// Experimental.
type Stack struct {
	// Experimental.
	DriftDetectionRoleToAssumeArn *string `field:"required" json:"driftDetectionRoleToAssumeArn" yaml:"driftDetectionRoleToAssumeArn"`
	// Experimental.
	DriftDetectionRoleToAssumeRegion *string `field:"required" json:"driftDetectionRoleToAssumeRegion" yaml:"driftDetectionRoleToAssumeRegion"`
	// Experimental.
	StackName *string `field:"required" json:"stackName" yaml:"stackName"`
	// Experimental.
	FailOnDrift *bool `field:"optional" json:"failOnDrift" yaml:"failOnDrift"`
	// Experimental.
	OidcRegion *string `field:"optional" json:"oidcRegion" yaml:"oidcRegion"`
	// Experimental.
	OidcRoleArn *string `field:"optional" json:"oidcRoleArn" yaml:"oidcRoleArn"`
}

