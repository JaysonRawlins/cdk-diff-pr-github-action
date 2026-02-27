package cdkdiffprgithubaction


// Props for the Projen-integrated CDK Drift IAM template construct.
// Experimental.
type CdkDriftIamTemplateProps struct {
	// Region for the OIDC trust condition.
	// Experimental.
	OidcRegion *string `field:"required" json:"oidcRegion" yaml:"oidcRegion"`
	// ARN of the existing GitHub OIDC role that can assume this drift role.
	// Experimental.
	OidcRoleArn *string `field:"required" json:"oidcRoleArn" yaml:"oidcRoleArn"`
	// Name for the IAM role.
	// Experimental.
	RoleName *string `field:"required" json:"roleName" yaml:"roleName"`
	// Projen project instance.
	// Experimental.
	Project interface{} `field:"required" json:"project" yaml:"project"`
	// Output path for the template file (default: 'cdk-drift-workflow-iam-template.yaml').
	// Experimental.
	OutputPath *string `field:"optional" json:"outputPath" yaml:"outputPath"`
}

