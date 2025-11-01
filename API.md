# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### CdkDiffStackWorkflowProps <a name="CdkDiffStackWorkflowProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps"></a>

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.Initializer"></a>

```typescript
import { CdkDiffStackWorkflowProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffStackWorkflowProps: CdkDiffStackWorkflowProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.project">project</a></code> | <code>projen.awscdk.AwsCdkTypeScriptApp</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.stackAccount">stackAccount</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.stackName">stackName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.stackRegion">stackRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.cdkYarnCommand">cdkYarnCommand</a></code> | <code>string</code> | *No description.* |

---

##### `project`<sup>Required</sup> <a name="project" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.project"></a>

```typescript
public readonly project: AwsCdkTypeScriptApp;
```

- *Type:* projen.awscdk.AwsCdkTypeScriptApp

---

##### `stackAccount`<sup>Required</sup> <a name="stackAccount" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.stackAccount"></a>

```typescript
public readonly stackAccount: string;
```

- *Type:* string

---

##### `stackName`<sup>Required</sup> <a name="stackName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string

---

##### `stackRegion`<sup>Required</sup> <a name="stackRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.stackRegion"></a>

```typescript
public readonly stackRegion: string;
```

- *Type:* string

---

##### `cdkYarnCommand`<sup>Optional</sup> <a name="cdkYarnCommand" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffStackWorkflowProps.property.cdkYarnCommand"></a>

```typescript
public readonly cdkYarnCommand: string;
```

- *Type:* string

---

## Classes <a name="Classes" id="Classes"></a>

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






