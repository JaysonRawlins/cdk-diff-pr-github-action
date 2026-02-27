package cdkdiffprgithubaction


// Props for the Projen-integrated StackSet construct.
// Experimental.
type CdkDiffIamTemplateStackSetProps struct {
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
	// Projen project instance.
	// Experimental.
	Project interface{} `field:"required" json:"project" yaml:"project"`
	// Auto-deployment configuration.
	// Experimental.
	AutoDeployment *StackSetAutoDeployment `field:"optional" json:"autoDeployment" yaml:"autoDeployment"`
	// Whether to use delegated admin mode for StackSet operations.
	//
	// If true, adds --call-as DELEGATED_ADMIN to commands.
	// If false, assumes running from the management account.
	// Default: true.
	// Experimental.
	DelegatedAdmin *bool `field:"optional" json:"delegatedAdmin" yaml:"delegatedAdmin"`
	// Output path for the template file (default: 'cdk-diff-workflow-stackset-template.yaml').
	// Experimental.
	OutputPath *string `field:"optional" json:"outputPath" yaml:"outputPath"`
	// Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']).
	// Experimental.
	Regions *[]*string `field:"optional" json:"regions" yaml:"regions"`
	// Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset').
	// Experimental.
	StackSetName *string `field:"optional" json:"stackSetName" yaml:"stackSetName"`
	// Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']).
	// Experimental.
	TargetOrganizationalUnitIds *[]*string `field:"optional" json:"targetOrganizationalUnitIds" yaml:"targetOrganizationalUnitIds"`
}

