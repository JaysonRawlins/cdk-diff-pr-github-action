package cdkdiffprgithubaction


// Props for the Projen-integrated CDK Diff IAM template construct.
// Experimental.
type CdkDiffIamTemplateProps struct {
	// Name for the changeset IAM role.
	// Experimental.
	RoleName *string `field:"required" json:"roleName" yaml:"roleName"`
	// Create a GitHub OIDC role within this template instead of using an existing one.
	//
	// When true, githubOidc configuration is required and oidcRoleArn is ignored.
	// Default: false.
	// Experimental.
	CreateOidcRole *bool `field:"optional" json:"createOidcRole" yaml:"createOidcRole"`
	// GitHub OIDC configuration for repo/branch restrictions.
	//
	// Required when createOidcRole is true.
	// Experimental.
	GithubOidc *GitHubOidcConfig `field:"optional" json:"githubOidc" yaml:"githubOidc"`
	// Region for the OIDC trust condition.
	//
	// Only used when oidcRoleArn is provided (external OIDC role).
	// Experimental.
	OidcRegion *string `field:"optional" json:"oidcRegion" yaml:"oidcRegion"`
	// ARN of the existing GitHub OIDC role that can assume this changeset role.
	//
	// Required when createOidcRole is false or undefined.
	// Experimental.
	OidcRoleArn *string `field:"optional" json:"oidcRoleArn" yaml:"oidcRoleArn"`
	// Name of the GitHub OIDC role to create.
	//
	// Only used when createOidcRole is true.
	// Default: 'GitHubOIDCRole'.
	// Experimental.
	OidcRoleName *string `field:"optional" json:"oidcRoleName" yaml:"oidcRoleName"`
	// Skip creating the OIDC provider (use existing one).
	//
	// Set to true if the account already has a GitHub OIDC provider.
	// Only used when createOidcRole is true.
	// Default: false.
	// Experimental.
	SkipOidcProviderCreation *bool `field:"optional" json:"skipOidcProviderCreation" yaml:"skipOidcProviderCreation"`
	// Projen project instance.
	// Experimental.
	Project interface{} `field:"required" json:"project" yaml:"project"`
	// Output path for the template file (default: 'cdk-diff-workflow-iam-template.yaml').
	// Experimental.
	OutputPath *string `field:"optional" json:"outputPath" yaml:"outputPath"`
}

