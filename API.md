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
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.cdkDiffRoleToAssumeArn">cdkDiffRoleToAssumeArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.cdkDiffRoleToAssumeRegion">cdkDiffRoleToAssumeRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.stackName">stackName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | *No description.* |

---

##### `cdkDiffRoleToAssumeArn`<sup>Required</sup> <a name="cdkDiffRoleToAssumeArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.cdkDiffRoleToAssumeArn"></a>

```typescript
public readonly cdkDiffRoleToAssumeArn: string;
```

- *Type:* string

---

##### `cdkDiffRoleToAssumeRegion`<sup>Required</sup> <a name="cdkDiffRoleToAssumeRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStack.property.cdkDiffRoleToAssumeRegion"></a>

```typescript
public readonly cdkDiffRoleToAssumeRegion: string;
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






