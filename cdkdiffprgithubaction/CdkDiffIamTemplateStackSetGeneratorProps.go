package cdkdiffprgithubaction


// Props for generating StackSet templates (no Projen dependency).
// Experimental.
type CdkDiffIamTemplateStackSetGeneratorProps struct {
	// GitHub OIDC configuration for repo/branch restrictions.
	// Experimental.
	GithubOidc *GitHubOidcConfig `field:"required" json:"githubOidc" yaml:"githubOidc"`
	// Name of the CdkChangesetRole (default: 'CdkChangesetRole').
	// Experimental.
	ChangesetRoleName *string `field:"optional" json:"changesetRoleName" yaml:"changesetRoleName"`
	// Description for the StackSet.
	// Experimental.
	Description *string `field:"optional" json:"description" yaml:"description"`
	// Name of the CdkDriftRole (default: 'CdkDriftRole').
	// Experimental.
	DriftRoleName *string `field:"optional" json:"driftRoleName" yaml:"driftRoleName"`
	// Name of the GitHub OIDC role (default: 'GitHubOIDCRole').
	// Experimental.
	OidcRoleName *string `field:"optional" json:"oidcRoleName" yaml:"oidcRoleName"`
	// Which roles to include (default: BOTH).
	// Experimental.
	RoleSelection StackSetRoleSelection `field:"optional" json:"roleSelection" yaml:"roleSelection"`
	// Skip creating the OIDC provider (use existing one).
	//
	// Set to true if accounts already have a GitHub OIDC provider.
	// The template will reference the existing provider by ARN.
	// Default: false.
	// Experimental.
	SkipOidcProviderCreation *bool `field:"optional" json:"skipOidcProviderCreation" yaml:"skipOidcProviderCreation"`
}

