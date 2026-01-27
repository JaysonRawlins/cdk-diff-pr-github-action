# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### CdkDiffIamTemplateGeneratorProps <a name="CdkDiffIamTemplateGeneratorProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps"></a>

Props for generating CDK Diff IAM templates (no Projen dependency).

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps.Initializer"></a>

```typescript
import { CdkDiffIamTemplateGeneratorProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffIamTemplateGeneratorProps: CdkDiffIamTemplateGeneratorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | Region for the OIDC trust condition. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | ARN of the existing GitHub OIDC role that can assume this changeset role. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps.property.roleName">roleName</a></code> | <code>string</code> | Name for the IAM role. |

---

##### `oidcRegion`<sup>Required</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

Region for the OIDC trust condition.

---

##### `oidcRoleArn`<sup>Required</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

ARN of the existing GitHub OIDC role that can assume this changeset role.

---

##### `roleName`<sup>Required</sup> <a name="roleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string

Name for the IAM role.

---

### CdkDiffIamTemplateProps <a name="CdkDiffIamTemplateProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps"></a>

Props for the Projen-integrated CDK Diff IAM template construct.

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.Initializer"></a>

```typescript
import { CdkDiffIamTemplateProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffIamTemplateProps: CdkDiffIamTemplateProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | Region for the OIDC trust condition. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | ARN of the existing GitHub OIDC role that can assume this changeset role. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.roleName">roleName</a></code> | <code>string</code> | Name for the IAM role. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.project">project</a></code> | <code>any</code> | Projen project instance. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.outputPath">outputPath</a></code> | <code>string</code> | Output path for the template file (default: 'cdk-diff-workflow-iam-template.yaml'). |

---

##### `oidcRegion`<sup>Required</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

Region for the OIDC trust condition.

---

##### `oidcRoleArn`<sup>Required</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

ARN of the existing GitHub OIDC role that can assume this changeset role.

---

##### `roleName`<sup>Required</sup> <a name="roleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string

Name for the IAM role.

---

##### `project`<sup>Required</sup> <a name="project" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.project"></a>

```typescript
public readonly project: any;
```

- *Type:* any

Projen project instance.

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string

Output path for the template file (default: 'cdk-diff-workflow-iam-template.yaml').

---

### CdkDiffIamTemplateStackSetCommandsProps <a name="CdkDiffIamTemplateStackSetCommandsProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps"></a>

Props for generating StackSet CLI commands (no Projen dependency).

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.Initializer"></a>

```typescript
import { CdkDiffIamTemplateStackSetCommandsProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffIamTemplateStackSetCommandsProps: CdkDiffIamTemplateStackSetCommandsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.autoDeployment">autoDeployment</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment">StackSetAutoDeployment</a></code> | Auto-deployment configuration. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.delegatedAdmin">delegatedAdmin</a></code> | <code>boolean</code> | Whether to use delegated admin mode for StackSet operations. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.regions">regions</a></code> | <code>string[]</code> | Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.stackSetName">stackSetName</a></code> | <code>string</code> | Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.targetOrganizationalUnitIds">targetOrganizationalUnitIds</a></code> | <code>string[]</code> | Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.templatePath">templatePath</a></code> | <code>string</code> | Path to the template file (default: 'cdk-diff-workflow-stackset-template.yaml'). |

---

##### `autoDeployment`<sup>Optional</sup> <a name="autoDeployment" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.autoDeployment"></a>

```typescript
public readonly autoDeployment: StackSetAutoDeployment;
```

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment">StackSetAutoDeployment</a>

Auto-deployment configuration.

---

##### `delegatedAdmin`<sup>Optional</sup> <a name="delegatedAdmin" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.delegatedAdmin"></a>

```typescript
public readonly delegatedAdmin: boolean;
```

- *Type:* boolean

Whether to use delegated admin mode for StackSet operations.

If true, adds --call-as DELEGATED_ADMIN to commands.
Default: true

---

##### `regions`<sup>Optional</sup> <a name="regions" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.regions"></a>

```typescript
public readonly regions: string[];
```

- *Type:* string[]

Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']).

---

##### `stackSetName`<sup>Optional</sup> <a name="stackSetName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.stackSetName"></a>

```typescript
public readonly stackSetName: string;
```

- *Type:* string

Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset').

---

##### `targetOrganizationalUnitIds`<sup>Optional</sup> <a name="targetOrganizationalUnitIds" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.targetOrganizationalUnitIds"></a>

```typescript
public readonly targetOrganizationalUnitIds: string[];
```

- *Type:* string[]

Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']).

---

##### `templatePath`<sup>Optional</sup> <a name="templatePath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps.property.templatePath"></a>

```typescript
public readonly templatePath: string;
```

- *Type:* string

Path to the template file (default: 'cdk-diff-workflow-stackset-template.yaml').

---

### CdkDiffIamTemplateStackSetGeneratorProps <a name="CdkDiffIamTemplateStackSetGeneratorProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps"></a>

Props for generating StackSet templates (no Projen dependency).

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.Initializer"></a>

```typescript
import { CdkDiffIamTemplateStackSetGeneratorProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffIamTemplateStackSetGeneratorProps: CdkDiffIamTemplateStackSetGeneratorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.githubOidc">githubOidc</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig">GitHubOidcConfig</a></code> | GitHub OIDC configuration for repo/branch restrictions. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.changesetRoleName">changesetRoleName</a></code> | <code>string</code> | Name of the CdkChangesetRole (default: 'CdkChangesetRole'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.description">description</a></code> | <code>string</code> | Description for the StackSet. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.driftRoleName">driftRoleName</a></code> | <code>string</code> | Name of the CdkDriftRole (default: 'CdkDriftRole'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.oidcRoleName">oidcRoleName</a></code> | <code>string</code> | Name of the GitHub OIDC role (default: 'GitHubOIDCRole'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.roleSelection">roleSelection</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection">StackSetRoleSelection</a></code> | Which roles to include (default: BOTH). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.skipOidcProviderCreation">skipOidcProviderCreation</a></code> | <code>boolean</code> | Skip creating the OIDC provider (use existing one). |

---

##### `githubOidc`<sup>Required</sup> <a name="githubOidc" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.githubOidc"></a>

```typescript
public readonly githubOidc: GitHubOidcConfig;
```

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig">GitHubOidcConfig</a>

GitHub OIDC configuration for repo/branch restrictions.

---

##### `changesetRoleName`<sup>Optional</sup> <a name="changesetRoleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.changesetRoleName"></a>

```typescript
public readonly changesetRoleName: string;
```

- *Type:* string

Name of the CdkChangesetRole (default: 'CdkChangesetRole').

---

##### `description`<sup>Optional</sup> <a name="description" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Description for the StackSet.

---

##### `driftRoleName`<sup>Optional</sup> <a name="driftRoleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.driftRoleName"></a>

```typescript
public readonly driftRoleName: string;
```

- *Type:* string

Name of the CdkDriftRole (default: 'CdkDriftRole').

---

##### `oidcRoleName`<sup>Optional</sup> <a name="oidcRoleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.oidcRoleName"></a>

```typescript
public readonly oidcRoleName: string;
```

- *Type:* string

Name of the GitHub OIDC role (default: 'GitHubOIDCRole').

---

##### `roleSelection`<sup>Optional</sup> <a name="roleSelection" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.roleSelection"></a>

```typescript
public readonly roleSelection: StackSetRoleSelection;
```

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection">StackSetRoleSelection</a>

Which roles to include (default: BOTH).

---

##### `skipOidcProviderCreation`<sup>Optional</sup> <a name="skipOidcProviderCreation" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps.property.skipOidcProviderCreation"></a>

```typescript
public readonly skipOidcProviderCreation: boolean;
```

- *Type:* boolean

Skip creating the OIDC provider (use existing one).

Set to true if accounts already have a GitHub OIDC provider.
The template will reference the existing provider by ARN.
Default: false

---

### CdkDiffIamTemplateStackSetProps <a name="CdkDiffIamTemplateStackSetProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps"></a>

Props for the Projen-integrated StackSet construct.

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.Initializer"></a>

```typescript
import { CdkDiffIamTemplateStackSetProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDiffIamTemplateStackSetProps: CdkDiffIamTemplateStackSetProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.githubOidc">githubOidc</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig">GitHubOidcConfig</a></code> | GitHub OIDC configuration for repo/branch restrictions. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.changesetRoleName">changesetRoleName</a></code> | <code>string</code> | Name of the CdkChangesetRole (default: 'CdkChangesetRole'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.description">description</a></code> | <code>string</code> | Description for the StackSet. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.driftRoleName">driftRoleName</a></code> | <code>string</code> | Name of the CdkDriftRole (default: 'CdkDriftRole'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.oidcRoleName">oidcRoleName</a></code> | <code>string</code> | Name of the GitHub OIDC role (default: 'GitHubOIDCRole'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.roleSelection">roleSelection</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection">StackSetRoleSelection</a></code> | Which roles to include (default: BOTH). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.skipOidcProviderCreation">skipOidcProviderCreation</a></code> | <code>boolean</code> | Skip creating the OIDC provider (use existing one). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.project">project</a></code> | <code>any</code> | Projen project instance. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.autoDeployment">autoDeployment</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment">StackSetAutoDeployment</a></code> | Auto-deployment configuration. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.delegatedAdmin">delegatedAdmin</a></code> | <code>boolean</code> | Whether to use delegated admin mode for StackSet operations. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.outputPath">outputPath</a></code> | <code>string</code> | Output path for the template file (default: 'cdk-diff-workflow-stackset-template.yaml'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.regions">regions</a></code> | <code>string[]</code> | Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.stackSetName">stackSetName</a></code> | <code>string</code> | Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.targetOrganizationalUnitIds">targetOrganizationalUnitIds</a></code> | <code>string[]</code> | Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']). |

---

##### `githubOidc`<sup>Required</sup> <a name="githubOidc" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.githubOidc"></a>

```typescript
public readonly githubOidc: GitHubOidcConfig;
```

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig">GitHubOidcConfig</a>

GitHub OIDC configuration for repo/branch restrictions.

---

##### `changesetRoleName`<sup>Optional</sup> <a name="changesetRoleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.changesetRoleName"></a>

```typescript
public readonly changesetRoleName: string;
```

- *Type:* string

Name of the CdkChangesetRole (default: 'CdkChangesetRole').

---

##### `description`<sup>Optional</sup> <a name="description" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Description for the StackSet.

---

##### `driftRoleName`<sup>Optional</sup> <a name="driftRoleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.driftRoleName"></a>

```typescript
public readonly driftRoleName: string;
```

- *Type:* string

Name of the CdkDriftRole (default: 'CdkDriftRole').

---

##### `oidcRoleName`<sup>Optional</sup> <a name="oidcRoleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.oidcRoleName"></a>

```typescript
public readonly oidcRoleName: string;
```

- *Type:* string

Name of the GitHub OIDC role (default: 'GitHubOIDCRole').

---

##### `roleSelection`<sup>Optional</sup> <a name="roleSelection" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.roleSelection"></a>

```typescript
public readonly roleSelection: StackSetRoleSelection;
```

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection">StackSetRoleSelection</a>

Which roles to include (default: BOTH).

---

##### `skipOidcProviderCreation`<sup>Optional</sup> <a name="skipOidcProviderCreation" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.skipOidcProviderCreation"></a>

```typescript
public readonly skipOidcProviderCreation: boolean;
```

- *Type:* boolean

Skip creating the OIDC provider (use existing one).

Set to true if accounts already have a GitHub OIDC provider.
The template will reference the existing provider by ARN.
Default: false

---

##### `project`<sup>Required</sup> <a name="project" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.project"></a>

```typescript
public readonly project: any;
```

- *Type:* any

Projen project instance.

---

##### `autoDeployment`<sup>Optional</sup> <a name="autoDeployment" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.autoDeployment"></a>

```typescript
public readonly autoDeployment: StackSetAutoDeployment;
```

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment">StackSetAutoDeployment</a>

Auto-deployment configuration.

---

##### `delegatedAdmin`<sup>Optional</sup> <a name="delegatedAdmin" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.delegatedAdmin"></a>

```typescript
public readonly delegatedAdmin: boolean;
```

- *Type:* boolean

Whether to use delegated admin mode for StackSet operations.

If true, adds --call-as DELEGATED_ADMIN to commands.
If false, assumes running from the management account.
Default: true

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string

Output path for the template file (default: 'cdk-diff-workflow-stackset-template.yaml').

---

##### `regions`<sup>Optional</sup> <a name="regions" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.regions"></a>

```typescript
public readonly regions: string[];
```

- *Type:* string[]

Target regions for deployment (e.g., ['us-east-1', 'eu-west-1']).

---

##### `stackSetName`<sup>Optional</sup> <a name="stackSetName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.stackSetName"></a>

```typescript
public readonly stackSetName: string;
```

- *Type:* string

Name of the StackSet (default: 'cdk-diff-workflow-iam-stackset').

---

##### `targetOrganizationalUnitIds`<sup>Optional</sup> <a name="targetOrganizationalUnitIds" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps.property.targetOrganizationalUnitIds"></a>

```typescript
public readonly targetOrganizationalUnitIds: string[];
```

- *Type:* string[]

Target OUs for deployment (e.g., ['ou-xxxx-xxxxxxxx', 'r-xxxx']).

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

### CdkDriftIamTemplateGeneratorProps <a name="CdkDriftIamTemplateGeneratorProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps"></a>

Props for generating CDK Drift IAM templates (no Projen dependency).

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps.Initializer"></a>

```typescript
import { CdkDriftIamTemplateGeneratorProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDriftIamTemplateGeneratorProps: CdkDriftIamTemplateGeneratorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | Region for the OIDC trust condition. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | ARN of the existing GitHub OIDC role that can assume this drift role. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps.property.roleName">roleName</a></code> | <code>string</code> | Name for the IAM role. |

---

##### `oidcRegion`<sup>Required</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

Region for the OIDC trust condition.

---

##### `oidcRoleArn`<sup>Required</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

ARN of the existing GitHub OIDC role that can assume this drift role.

---

##### `roleName`<sup>Required</sup> <a name="roleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string

Name for the IAM role.

---

### CdkDriftIamTemplateProps <a name="CdkDriftIamTemplateProps" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps"></a>

Props for the Projen-integrated CDK Drift IAM template construct.

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.Initializer"></a>

```typescript
import { CdkDriftIamTemplateProps } from '@jjrawlins/cdk-diff-pr-github-action'

const cdkDriftIamTemplateProps: CdkDriftIamTemplateProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.oidcRegion">oidcRegion</a></code> | <code>string</code> | Region for the OIDC trust condition. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.oidcRoleArn">oidcRoleArn</a></code> | <code>string</code> | ARN of the existing GitHub OIDC role that can assume this drift role. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.roleName">roleName</a></code> | <code>string</code> | Name for the IAM role. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.project">project</a></code> | <code>any</code> | Projen project instance. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.outputPath">outputPath</a></code> | <code>string</code> | Output path for the template file (default: 'cdk-drift-workflow-iam-template.yaml'). |

---

##### `oidcRegion`<sup>Required</sup> <a name="oidcRegion" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.oidcRegion"></a>

```typescript
public readonly oidcRegion: string;
```

- *Type:* string

Region for the OIDC trust condition.

---

##### `oidcRoleArn`<sup>Required</sup> <a name="oidcRoleArn" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.oidcRoleArn"></a>

```typescript
public readonly oidcRoleArn: string;
```

- *Type:* string

ARN of the existing GitHub OIDC role that can assume this drift role.

---

##### `roleName`<sup>Required</sup> <a name="roleName" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.roleName"></a>

```typescript
public readonly roleName: string;
```

- *Type:* string

Name for the IAM role.

---

##### `project`<sup>Required</sup> <a name="project" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.project"></a>

```typescript
public readonly project: any;
```

- *Type:* any

Projen project instance.

---

##### `outputPath`<sup>Optional</sup> <a name="outputPath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateProps.property.outputPath"></a>

```typescript
public readonly outputPath: string;
```

- *Type:* string

Output path for the template file (default: 'cdk-drift-workflow-iam-template.yaml').

---

### GitHubOidcConfig <a name="GitHubOidcConfig" id="@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig"></a>

GitHub repository restrictions for OIDC authentication.

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.Initializer"></a>

```typescript
import { GitHubOidcConfig } from '@jjrawlins/cdk-diff-pr-github-action'

const gitHubOidcConfig: GitHubOidcConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.property.owner">owner</a></code> | <code>string</code> | GitHub organization or username (e.g., 'my-org' or 'my-username'). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.property.repositories">repositories</a></code> | <code>string[]</code> | Repository names allowed to assume the role (e.g., ['repo1', 'repo2']) Use ['*'] to allow all repos in the organization. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.property.additionalClaims">additionalClaims</a></code> | <code>string[]</code> | Additional subject claims for fine-grained access e.g., ['pull_request', 'environment:production']. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.property.branches">branches</a></code> | <code>string[]</code> | Branch patterns allowed (e.g., ['main', 'release/*']) Default: ['*'] (all branches). |

---

##### `owner`<sup>Required</sup> <a name="owner" id="@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* string

GitHub organization or username (e.g., 'my-org' or 'my-username').

---

##### `repositories`<sup>Required</sup> <a name="repositories" id="@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.property.repositories"></a>

```typescript
public readonly repositories: string[];
```

- *Type:* string[]

Repository names allowed to assume the role (e.g., ['repo1', 'repo2']) Use ['*'] to allow all repos in the organization.

---

##### `additionalClaims`<sup>Optional</sup> <a name="additionalClaims" id="@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.property.additionalClaims"></a>

```typescript
public readonly additionalClaims: string[];
```

- *Type:* string[]

Additional subject claims for fine-grained access e.g., ['pull_request', 'environment:production'].

---

##### `branches`<sup>Optional</sup> <a name="branches" id="@jjrawlins/cdk-diff-pr-github-action.GitHubOidcConfig.property.branches"></a>

```typescript
public readonly branches: string[];
```

- *Type:* string[]

Branch patterns allowed (e.g., ['main', 'release/*']) Default: ['*'] (all branches).

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

### StackSetAutoDeployment <a name="StackSetAutoDeployment" id="@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment"></a>

Configuration for StackSet auto-deployment.

#### Initializer <a name="Initializer" id="@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment.Initializer"></a>

```typescript
import { StackSetAutoDeployment } from '@jjrawlins/cdk-diff-pr-github-action'

const stackSetAutoDeployment: StackSetAutoDeployment = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment.property.enabled">enabled</a></code> | <code>boolean</code> | Enable auto-deployment to new accounts in target OUs (default: true). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment.property.retainStacksOnAccountRemoval">retainStacksOnAccountRemoval</a></code> | <code>boolean</code> | Retain stacks when account leaves OU (default: false). |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean

Enable auto-deployment to new accounts in target OUs (default: true).

---

##### `retainStacksOnAccountRemoval`<sup>Optional</sup> <a name="retainStacksOnAccountRemoval" id="@jjrawlins/cdk-diff-pr-github-action.StackSetAutoDeployment.property.retainStacksOnAccountRemoval"></a>

```typescript
public readonly retainStacksOnAccountRemoval: boolean;
```

- *Type:* boolean

Retain stacks when account leaves OU (default: false).

---

## Classes <a name="Classes" id="Classes"></a>

### CdkDiffIamTemplate <a name="CdkDiffIamTemplate" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplate"></a>

Projen construct that emits a CloudFormation template with minimal IAM permissions for the CDK Diff Stack Workflow.

For non-Projen projects, use `CdkDiffIamTemplateGenerator` directly.

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





### CdkDiffIamTemplateGenerator <a name="CdkDiffIamTemplateGenerator" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator"></a>

Pure generator class for CDK Diff IAM templates.

No Projen dependency - can be used in any project.

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator.Initializer"></a>

```typescript
import { CdkDiffIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

new CdkDiffIamTemplateGenerator()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator.generateDeployCommand">generateDeployCommand</a></code> | Generate the AWS CLI deploy command for the IAM template. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator.generateTemplate">generateTemplate</a></code> | Generate the CloudFormation IAM template as a YAML string. |

---

##### `generateDeployCommand` <a name="generateDeployCommand" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator.generateDeployCommand"></a>

```typescript
import { CdkDiffIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

CdkDiffIamTemplateGenerator.generateDeployCommand(templatePath?: string)
```

Generate the AWS CLI deploy command for the IAM template.

###### `templatePath`<sup>Optional</sup> <a name="templatePath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator.generateDeployCommand.parameter.templatePath"></a>

- *Type:* string

---

##### `generateTemplate` <a name="generateTemplate" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator.generateTemplate"></a>

```typescript
import { CdkDiffIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

CdkDiffIamTemplateGenerator.generateTemplate(props: CdkDiffIamTemplateGeneratorProps)
```

Generate the CloudFormation IAM template as a YAML string.

###### `props`<sup>Required</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGenerator.generateTemplate.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateGeneratorProps">CdkDiffIamTemplateGeneratorProps</a>

---



### CdkDiffIamTemplateStackSet <a name="CdkDiffIamTemplateStackSet" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSet"></a>

Projen construct that creates a CloudFormation StackSet template for org-wide deployment of GitHub OIDC provider, OIDC role, and CDK Diff/Drift IAM roles.

This provides a self-contained per-account deployment with no role chaining required.

For non-Projen projects, use `CdkDiffIamTemplateStackSetGenerator` directly.

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSet.Initializer"></a>

```typescript
import { CdkDiffIamTemplateStackSet } from '@jjrawlins/cdk-diff-pr-github-action'

new CdkDiffIamTemplateStackSet(props: CdkDiffIamTemplateStackSetProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSet.Initializer.parameter.props">props</a></code> | <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps">CdkDiffIamTemplateStackSetProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSet.Initializer.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetProps">CdkDiffIamTemplateStackSetProps</a>

---





### CdkDiffIamTemplateStackSetGenerator <a name="CdkDiffIamTemplateStackSetGenerator" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator"></a>

Pure generator class for StackSet templates and commands.

No Projen dependency - can be used in any project.

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator.Initializer"></a>

```typescript
import { CdkDiffIamTemplateStackSetGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

new CdkDiffIamTemplateStackSetGenerator()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator.generateCommands">generateCommands</a></code> | Generate AWS CLI commands for StackSet operations. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator.generateTemplate">generateTemplate</a></code> | Generate the CloudFormation StackSet template as a YAML string. |

---

##### `generateCommands` <a name="generateCommands" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator.generateCommands"></a>

```typescript
import { CdkDiffIamTemplateStackSetGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

CdkDiffIamTemplateStackSetGenerator.generateCommands(props?: CdkDiffIamTemplateStackSetCommandsProps)
```

Generate AWS CLI commands for StackSet operations.

Returns a map of command names to shell commands.

###### `props`<sup>Optional</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator.generateCommands.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetCommandsProps">CdkDiffIamTemplateStackSetCommandsProps</a>

---

##### `generateTemplate` <a name="generateTemplate" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator.generateTemplate"></a>

```typescript
import { CdkDiffIamTemplateStackSetGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

CdkDiffIamTemplateStackSetGenerator.generateTemplate(props: CdkDiffIamTemplateStackSetGeneratorProps)
```

Generate the CloudFormation StackSet template as a YAML string.

###### `props`<sup>Required</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGenerator.generateTemplate.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDiffIamTemplateStackSetGeneratorProps">CdkDiffIamTemplateStackSetGeneratorProps</a>

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

Projen construct that emits a CloudFormation template with minimal IAM permissions for the CDK Drift Detection Workflow.

For non-Projen projects, use `CdkDriftIamTemplateGenerator` directly.

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





### CdkDriftIamTemplateGenerator <a name="CdkDriftIamTemplateGenerator" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator"></a>

Pure generator class for CDK Drift IAM templates.

No Projen dependency - can be used in any project.

#### Initializers <a name="Initializers" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator.Initializer"></a>

```typescript
import { CdkDriftIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

new CdkDriftIamTemplateGenerator()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator.generateDeployCommand">generateDeployCommand</a></code> | Generate the AWS CLI deploy command for the IAM template. |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator.generateTemplate">generateTemplate</a></code> | Generate the CloudFormation IAM template as a YAML string. |

---

##### `generateDeployCommand` <a name="generateDeployCommand" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator.generateDeployCommand"></a>

```typescript
import { CdkDriftIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

CdkDriftIamTemplateGenerator.generateDeployCommand(templatePath?: string)
```

Generate the AWS CLI deploy command for the IAM template.

###### `templatePath`<sup>Optional</sup> <a name="templatePath" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator.generateDeployCommand.parameter.templatePath"></a>

- *Type:* string

---

##### `generateTemplate` <a name="generateTemplate" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator.generateTemplate"></a>

```typescript
import { CdkDriftIamTemplateGenerator } from '@jjrawlins/cdk-diff-pr-github-action'

CdkDriftIamTemplateGenerator.generateTemplate(props: CdkDriftIamTemplateGeneratorProps)
```

Generate the CloudFormation IAM template as a YAML string.

###### `props`<sup>Required</sup> <a name="props" id="@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGenerator.generateTemplate.parameter.props"></a>

- *Type:* <a href="#@jjrawlins/cdk-diff-pr-github-action.CdkDriftIamTemplateGeneratorProps">CdkDriftIamTemplateGeneratorProps</a>

---




## Enums <a name="Enums" id="Enums"></a>

### StackSetRoleSelection <a name="StackSetRoleSelection" id="@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection"></a>

Which roles to include in the StackSet.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection.CHANGESET_ONLY">CHANGESET_ONLY</a></code> | Include only the changeset role (CdkChangesetRole). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection.DRIFT_ONLY">DRIFT_ONLY</a></code> | Include only the drift role (CdkDriftRole). |
| <code><a href="#@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection.BOTH">BOTH</a></code> | Include both roles (default). |

---

##### `CHANGESET_ONLY` <a name="CHANGESET_ONLY" id="@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection.CHANGESET_ONLY"></a>

Include only the changeset role (CdkChangesetRole).

---


##### `DRIFT_ONLY` <a name="DRIFT_ONLY" id="@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection.DRIFT_ONLY"></a>

Include only the drift role (CdkDriftRole).

---


##### `BOTH` <a name="BOTH" id="@jjrawlins/cdk-diff-pr-github-action.StackSetRoleSelection.BOTH"></a>

Include both roles (default).

---

