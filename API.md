# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### CdkDiffIamTemplateProps <a name="CdkDiffIamTemplateProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps"></a>

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.Initializer"></a>

```typescript
import { CdkDiffIamTemplateProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffIamTemplateProps: CdkDiffIamTemplateProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.project">project</a></code> | <code>any</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.roleName">roleName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.outputPath">outputPath</a></code> | <code>string</code> | *No description.* |

---

##### `oidcRegion`<sup>Required</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

---

##### `oidcRoleArn`<sup>Required</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

---

##### `project`<sup>Required</sup> <a name="project" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.project"></a>

```typescript
public readonly project: any;
```

- *Type:* any

---

##### `roleName`<sup>Required</sup> <a name="roleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string

---

### CdkDiffStack <a name="CdkDiffStack" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack"></a>

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.Initializer"></a>

```typescript
import { CdkDiffStack } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffStack: CdkDiffStack = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.changesetRoleToAssumeArn">changesetRoleToAssumeArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.changesetRoleToAssumeRegion">changesetRoleToAssumeRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.stackName">stackName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | *No description.* |

---

##### `changesetRoleToAssumeArn`<sup>Required</sup> <a name="changesetRoleToAssumeArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.changesetRoleToAssumeArn"></a>

```typescript
public readonly changesetRoleToAssumeArn: string;
```

- *Type:* string

---

##### `changesetRoleToAssumeRegion`<sup>Required</sup> <a name="changesetRoleToAssumeRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.changesetRoleToAssumeRegion"></a>

```typescript
public readonly changesetRoleToAssumeRegion: string;
```

- *Type:* string

---

##### `stackName`<sup>Required</sup> <a name="stackName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string

---

##### `oidcRegion`<sup>Optional</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

---

##### `oidcRoleArn`<sup>Optional</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

---

### CdkDiffStackWorkflowProps <a name="CdkDiffStackWorkflowProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps"></a>

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.Initializer"></a>

```typescript
import { CdkDiffStackWorkflowProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffStackWorkflowProps: CdkDiffStackWorkflowProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.project">project</a></code> | <code>any</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.stacks">stacks</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack">CdkDiffStack</a>[]</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.cdkYarnCommand">cdkYarnCommand</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.nodeVersion">nodeVersion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.scriptOutputPath">scriptOutputPath</a></code> | <code>string</code> | *No description.* |

---

##### `oidcRegion`<sup>Required</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

---

##### `oidcRoleArn`<sup>Required</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

---

##### `project`<sup>Required</sup> <a name="project" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.project"></a>

```typescript
public readonly project: any;
```

- *Type:* any

---

##### `stacks`<sup>Required</sup> <a name="stacks" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.stacks"></a>

```typescript
public readonly stacks: CdkDiffStack[];
```

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack">CdkDiffStack</a>[]

---

##### `cdkYarnCommand`<sup>Optional</sup> <a name="cdkYarnCommand" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.cdkYarnCommand"></a>

```typescript
public readonly cdkYarnCommand: string;
```

- *Type:* string

---

##### `nodeVersion`<sup>Optional</sup> <a name="nodeVersion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.nodeVersion"></a>

```typescript
public readonly nodeVersion: string;
```

- *Type:* string

---

##### `scriptOutputPath`<sup>Optional</sup> <a name="scriptOutputPath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.scriptOutputPath"></a>

```typescript
public readonly scriptOutputPath: string;
```

- *Type:* string

---

### CdkDriftDetectionWorkflowProps <a name="CdkDriftDetectionWorkflowProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps"></a>

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.Initializer"></a>

```typescript
import { CdkDriftDetectionWorkflowProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDriftDetectionWorkflowProps: CdkDriftDetectionWorkflowProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.project">project</a></code> | <code>any</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.stacks">stacks</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.Stack">Stack</a>[]</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.createIssues">createIssues</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.nodeVersion">nodeVersion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.postGitHubSteps">postGitHubSteps</a></code> | <code>any</code> | Optional additional GitHub Action steps to run after drift detection for each stack. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.schedule">schedule</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.scriptOutputPath">scriptOutputPath</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.workflowName">workflowName</a></code> | <code>string</code> | *No description.* |

---

##### `oidcRegion`<sup>Required</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

---

##### `oidcRoleArn`<sup>Required</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

---

##### `project`<sup>Required</sup> <a name="project" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.project"></a>

```typescript
public readonly project: any;
```

- *Type:* any

---

##### `stacks`<sup>Required</sup> <a name="stacks" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.stacks"></a>

```typescript
public readonly stacks: Stack[];
```

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.Stack">Stack</a>[]

---

##### `createIssues`<sup>Optional</sup> <a name="createIssues" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.createIssues"></a>

```typescript
public readonly createIssues: boolean;
```

- *Type:* boolean

---

##### `nodeVersion`<sup>Optional</sup> <a name="nodeVersion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.nodeVersion"></a>

```typescript
public readonly nodeVersion: string;
```

- *Type:* string

---

##### `postGitHubSteps`<sup>Optional</sup> <a name="postGitHubSteps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.postGitHubSteps"></a>

```typescript
public readonly postGitHubSteps: any;
```

- *Type:* any

Optional additional GitHub Action steps to run after drift detection for each stack.

These steps run after results are uploaded for each stack. You can include
any notifications you like (e.g., Slack). Provide explicit inputs (e.g., payload/markdown)
directly in your step without relying on a pre-generated payload.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.schedule"></a>

```typescript
public readonly schedule: string;
```

- *Type:* string

---

##### `scriptOutputPath`<sup>Optional</sup> <a name="scriptOutputPath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.scriptOutputPath"></a>

```typescript
public readonly scriptOutputPath: string;
```

- *Type:* string

---

##### `workflowName`<sup>Optional</sup> <a name="workflowName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps.property.workflowName"></a>

```typescript
public readonly workflowName: string;
```

- *Type:* string

---

### CdkDriftIamTemplateProps <a name="CdkDriftIamTemplateProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps"></a>

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.Initializer"></a>

```typescript
import { CdkDriftIamTemplateProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDriftIamTemplateProps: CdkDriftIamTemplateProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.project">project</a></code> | <code>any</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.roleName">roleName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.outputPath">outputPath</a></code> | <code>string</code> | *No description.* |

---

##### `oidcRegion`<sup>Required</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

---

##### `oidcRoleArn`<sup>Required</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

---

##### `project`<sup>Required</sup> <a name="project" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.project"></a>

```typescript
public readonly project: any;
```

- *Type:* any

---

##### `roleName`<sup>Required</sup> <a name="roleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string

---

### Stack <a name="Stack" id="@jjrawlins/cdk-diff-pr-github-action.Stack"></a>

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.Stack.Initializer"></a>

```typescript
import { Stack } from '@jjrawlins/cdk-diff-pr-github-action'

const stack: Stack = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.Stack.property.driftDetectionRoleToAssumeArn">driftDetectionRoleToAssumeArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.Stack.property.driftDetectionRoleToAssumeRegion">driftDetectionRoleToAssumeRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.Stack.property.stackName">stackName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.Stack.property.failOnDrift">failOnDrift</a></code> | <code>boolean</code> | *No description.* |

---

##### `driftDetectionRoleToAssumeArn`<sup>Required</sup> <a name="driftDetectionRoleToAssumeArn" id="@jjrawlins/cdk-diff-pr-github-action.Stack.property.driftDetectionRoleToAssumeArn"></a>

```typescript
public readonly driftDetectionRoleToAssumeArn: string;
```

- *Type:* string

---

##### `driftDetectionRoleToAssumeRegion`<sup>Required</sup> <a name="driftDetectionRoleToAssumeRegion" id="@jjrawlins/cdk-diff-pr-github-action.Stack.property.driftDetectionRoleToAssumeRegion"></a>

```typescript
public readonly driftDetectionRoleToAssumeRegion: string;
```

- *Type:* string

---

##### `stackName`<sup>Required</sup> <a name="stackName" id="@jjrawlins/cdk-diff-pr-github-action.Stack.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string

---

##### `failOnDrift`<sup>Optional</sup> <a name="failOnDrift" id="@jjrawlins/cdk-diff-pr-github-action.Stack.property.failOnDrift"></a>

```typescript
public readonly failOnDrift: boolean;
```

- *Type:* boolean

---

## Classes <a name="Classes" id="Classes"></a>

### CdkDiffIamTemplate <a name="CdkDiffIamTemplate" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplate"></a>

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplate.Initializer"></a>

```typescript
import { CdkDiffIamTemplate } from '@jjrawlins/cdk-diff-pr-github-action'

new CdkDiffIamTemplate(props: CdkDiffIamTemplateProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplate.Initializer.parameter.props">props</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps">CdkDiffIamTemplateProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplate.Initializer.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps">CdkDiffIamTemplateProps</a>

---





### CdkDiffStackWorkflow <a name="CdkDiffStackWorkflow" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflow"></a>

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflow.Initializer"></a>

```typescript
import { CdkDiffStackWorkflow } from '@jjrawlins/cdk-diff-pr-github-action'

new CdkDiffStackWorkflow(props: CdkDiffStackWorkflowProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflow.Initializer.parameter.props">props</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps">CdkDiffStackWorkflowProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflow.Initializer.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps">CdkDiffStackWorkflowProps</a>

---





### CdkDriftDetectionWorkflow <a name="CdkDriftDetectionWorkflow" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflow"></a>

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflow.Initializer"></a>

```typescript
import { CdkDriftDetectionWorkflow } from '@jjrawlins/cdk-diff-pr-github-action'

new CdkDriftDetectionWorkflow(props: CdkDriftDetectionWorkflowProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflow.Initializer.parameter.props">props</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps">CdkDriftDetectionWorkflowProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflow.Initializer.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftDetectionWorkflowProps">CdkDriftDetectionWorkflowProps</a>

---





### CdkDriftIamTemplate <a name="CdkDriftIamTemplate" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplate"></a>

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplate.Initializer"></a>

```typescript
import { CdkDriftIamTemplate } from '@jjrawlins/cdk-diff-pr-github-action'

new CdkDriftIamTemplate(props: CdkDriftIamTemplateProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplate.Initializer.parameter.props">props</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps">CdkDriftIamTemplateProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplate.Initializer.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps">CdkDriftIamTemplateProps</a>

---






