package cdkdiffprgithubaction


// Props for generating CDK Drift IAM templates (no Projen dependency).
// Experimental.
type CdkDriftIamTemplateGeneratorProps struct {
	// Region for the OIDC trust condition.
	// Experimental.
	OidcRegion *string `field:"required" json:"oidcRegion" yaml:"oidcRegion"`
	// ARN of the existing GitHub OIDC role that can assume this drift role.
	// Experimental.
	OidcRoleArn *string `field:"required" json:"oidcRoleArn" yaml:"oidcRoleArn"`
	// Name for the IAM role.
	// Experimental.
	RoleName *string `field:"required" json:"roleName" yaml:"roleName"`
}

