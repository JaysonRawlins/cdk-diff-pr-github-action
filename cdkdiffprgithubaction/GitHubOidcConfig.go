package cdkdiffprgithubaction


// GitHub repository restrictions for OIDC authentication.
// Experimental.
type GitHubOidcConfig struct {
	// GitHub organization or username (e.g., 'my-org' or 'my-username').
	// Experimental.
	Owner *string `field:"required" json:"owner" yaml:"owner"`
	// Repository names allowed to assume the role (e.g., ['repo1', 'repo2']) Use ['*'] to allow all repos in the organization.
	// Experimental.
	Repositories *[]*string `field:"required" json:"repositories" yaml:"repositories"`
	// Additional subject claims for fine-grained access e.g., ['pull_request', 'environment:production'].
	// Experimental.
	AdditionalClaims *[]*string `field:"optional" json:"additionalClaims" yaml:"additionalClaims"`
	// Branch patterns allowed (e.g., ['main', 'release/*']) Default: ['*'] (all branches).
	// Experimental.
	Branches *[]*string `field:"optional" json:"branches" yaml:"branches"`
}

