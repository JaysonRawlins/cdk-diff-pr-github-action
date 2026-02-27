// A GitHub Action that creates a CDK diff for a pull request.
package cdkdiffprgithubaction

import (
	"reflect"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
)

func init() {
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplate",
		reflect.TypeOf((*CdkDiffIamTemplate)(nil)).Elem(),
		nil, // no members
		func() interface{} {
			return &jsiiProxy_CdkDiffIamTemplate{}
		},
	)
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator",
		reflect.TypeOf((*CdkDiffIamTemplateGenerator)(nil)).Elem(),
		nil, // no members
		func() interface{} {
			return &jsiiProxy_CdkDiffIamTemplateGenerator{}
		},
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps",
		reflect.TypeOf((*CdkDiffIamTemplateGeneratorProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps",
		reflect.TypeOf((*CdkDiffIamTemplateProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSet",
		reflect.TypeOf((*CdkDiffIamTemplateStackSet)(nil)).Elem(),
		nil, // no members
		func() interface{} {
			return &jsiiProxy_CdkDiffIamTemplateStackSet{}
		},
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps",
		reflect.TypeOf((*CdkDiffIamTemplateStackSetCommandsProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator",
		reflect.TypeOf((*CdkDiffIamTemplateStackSetGenerator)(nil)).Elem(),
		nil, // no members
		func() interface{} {
			return &jsiiProxy_CdkDiffIamTemplateStackSetGenerator{}
		},
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps",
		reflect.TypeOf((*CdkDiffIamTemplateStackSetGeneratorProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps",
		reflect.TypeOf((*CdkDiffIamTemplateStackSetProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack",
		reflect.TypeOf((*CdkDiffStack)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflow",
		reflect.TypeOf((*CdkDiffStackWorkflow)(nil)).Elem(),
		nil, // no members
		func() interface{} {
			return &jsiiProxy_CdkDiffStackWorkflow{}
		},
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps",
		reflect.TypeOf((*CdkDiffStackWorkflowProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflow",
		reflect.TypeOf((*CdkDriftDetectionWorkflow)(nil)).Elem(),
		nil, // no members
		func() interface{} {
			return &jsiiProxy_CdkDriftDetectionWorkflow{}
		},
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps",
		reflect.TypeOf((*CdkDriftDetectionWorkflowProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplate",
		reflect.TypeOf((*CdkDriftIamTemplate)(nil)).Elem(),
		nil, // no members
		func() interface{} {
			return &jsiiProxy_CdkDriftIamTemplate{}
		},
	)
	_jsii_.RegisterClass(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator",
		reflect.TypeOf((*CdkDriftIamTemplateGenerator)(nil)).Elem(),
		nil, // no members
		func() interface{} {
			return &jsiiProxy_CdkDriftIamTemplateGenerator{}
		},
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps",
		reflect.TypeOf((*CdkDriftIamTemplateGeneratorProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps",
		reflect.TypeOf((*CdkDriftIamTemplateProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig",
		reflect.TypeOf((*GitHubOidcConfig)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.Stack",
		reflect.TypeOf((*Stack)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment",
		reflect.TypeOf((*StackSetAutoDeployment)(nil)).Elem(),
	)
	_jsii_.RegisterEnum(
		"@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection",
		reflect.TypeOf((*StackSetRoleSelection)(nil)).Elem(),
		map[string]interface{}{
			"CHANGESET_ONLY": StackSetRoleSelection_CHANGESET_ONLY,
			"DRIFT_ONLY": StackSetRoleSelection_DRIFT_ONLY,
			"BOTH": StackSetRoleSelection_BOTH,
		},
	)
}
