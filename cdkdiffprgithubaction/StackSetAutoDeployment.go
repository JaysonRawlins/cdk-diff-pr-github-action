package cdkdiffprgithubaction


// Configuration for StackSet auto-deployment.
// Experimental.
type StackSetAutoDeployment struct {
	// Enable auto-deployment to new accounts in target OUs (default: true).
	// Experimental.
	Enabled *bool `field:"optional" json:"enabled" yaml:"enabled"`
	// Retain stacks when account leaves OU (default: false).
	// Experimental.
	RetainStacksOnAccountRemoval *bool `field:"optional" json:"retainStacksOnAccountRemoval" yaml:"retainStacksOnAccountRemoval"`
}

