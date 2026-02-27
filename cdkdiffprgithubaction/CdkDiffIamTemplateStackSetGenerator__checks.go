//go:build !no_runtime_type_checking

package cdkdiffprgithubaction

import (
	"fmt"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
)

func validateCdkDiffIamTemplateStackSetGenerator_GenerateCommandsParameters(props *CdkDiffIamTemplateStackSetCommandsProps) error {
	if err := _jsii_.ValidateStruct(props, func() string { return "parameter props" }); err != nil {
		return err
	}

	return nil
}

func validateCdkDiffIamTemplateStackSetGenerator_GenerateTemplateParameters(props *CdkDiffIamTemplateStackSetGeneratorProps) error {
	if props == nil {
		return fmt.Errorf("parameter props is required, but nil was provided")
	}
	if err := _jsii_.ValidateStruct(props, func() string { return "parameter props" }); err != nil {
		return err
	}

	return nil
}

