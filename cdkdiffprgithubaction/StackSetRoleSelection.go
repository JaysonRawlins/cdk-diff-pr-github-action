package cdkdiffprgithubaction


// Which roles to include in the StackSet.
// Experimental.
type StackSetRoleSelection string

const (
	// Include only the changeset role (CdkChangesetRole).
	// Experimental.
	StackSetRoleSelection_CHANGESET_ONLY StackSetRoleSelection = "CHANGESET_ONLY"
	// Include only the drift role (CdkDriftRole).
	// Experimental.
	StackSetRoleSelection_DRIFT_ONLY StackSetRoleSelection = "DRIFT_ONLY"
	// Include both roles (default).
	// Experimental.
	StackSetRoleSelection_BOTH StackSetRoleSelection = "BOTH"
)

