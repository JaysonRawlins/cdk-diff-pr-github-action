package cdkdiffprgithubaction


// Props for generating StackSet CLI commands (no Projen dependency).
// Experimental.
type CdkDiffIamTemplateStackSetCommandsProps struct {
	// Auto-deployment configuration.
	// Experimental.
	AutoDeployment *StackSetAutoDeployment `field:"optional" json:"autoDeployment" yaml:"autoDeployment"`
	// Whether to use delegated admin mode for StackSet operations.
	//
	// If true, adds --call-as DELEGATED_ADMIN to commands.
	// Default: true.
	// Experimental.
	DelegatedAdmin *bool `field:"optional" json:"delegatedAdmin" yaml:"delegatedAdmin"`
	// Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']).
	// Experimental.
	Regions *[]*string `field:"optional" json:"regions" yaml:"regions"`
	// Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset').
	// Experimental.
	StackSetName *string `field:"optional" json:"stackSetName" yaml:"stackSetName"`
	// Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']).
	// Experimental.
	TargetOrganizationalUnitIds *[]*string `field:"optional" json:"targetOrganizationalUnitIds" yaml:"targetOrganizationalUnitIds"`
	// Path to the template file (default: 'cdk-diff-workflow-stackset-template.yaml').
	// Experimental.
	TemplatePath *string `field:"optional" json:"templatePath" yaml:"templatePath"`
}

