package cdkdiffprgithubaction

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/JaysonRawlins/cdk-diff-pr-github-action/cdkdiffprgithubaction/jsii"
)

// Pure generator class for StackSet templates and commands.
//
// No Projen dependency - can be used in any project.
// Experimental.
type CdkDiffIamTemplateStackSetGenerator interface {
}

// The jsii proxy struct for CdkDiffIamTemplateStackSetGenerator
type jsiiProxy_CdkDiffIamTemplateStackSetGenerator struct {
	_ byte // padding
}

// Experimental.
func NewCdkDiffIamTemplateStackSetGenerator() CdkDiffIamTemplateStackSetGenerator {
	_init_.Initialize()

	j := jsiiProxy_CdkDiffIamTemplateStackSetGenerator{}

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator",
		nil, // no parameters
		&j,
	)

	return &j
}

// Experimental.
func NewCdkDiffIamTemplateStackSetGenerator_Override(c CdkDiffIamTemplateStackSetGenerator) {
	_init_.Initialize()

	_jsii_.Create(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator",
		nil, // no parameters
		c,
	)
}

// Generate AWS CLI commands for StackSet operations.
//
// Returns a map of command names to shell commands.
// Experimental.
func CdkDiffIamTemplateStackSetGenerator_GenerateCommands(props *CdkDiffIamTemplateStackSetCommandsProps) *map[string]*string {
	_init_.Initialize()

	if err := validateCdkDiffIamTemplateStackSetGenerator_GenerateCommandsParameters(props); err != nil {
		panic(err)
	}
	var returns *map[string]*string

	_jsii_.StaticInvoke(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator",
		"generateCommands",
		[]interface{}{props},
		&returns,
	)

	return returns
}

// Generate the CloudFormation StackSet template as a YAML string.
// Experimental.
func CdkDiffIamTemplateStackSetGenerator_GenerateTemplate(props *CdkDiffIamTemplateStackSetGeneratorProps) *string {
	_init_.Initialize()

	if err := validateCdkDiffIamTemplateStackSetGenerator_GenerateTemplateParameters(props); err != nil {
		panic(err)
	}
	var returns *string

	_jsii_.StaticInvoke(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator",
		"generateTemplate",
		[]interface{}{props},
		&returns,
	)

	return returns
}

