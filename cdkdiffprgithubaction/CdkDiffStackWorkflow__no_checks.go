//go:build no_runtime_type_checking

package cdkdiffprgithubaction

// Building without runtime type checking enabled, so all the below just return nil

func validateNewCdkDiffStackWorkflowParameters(props *CdkDiffStackWorkflowProps) error {
	return nil
}

