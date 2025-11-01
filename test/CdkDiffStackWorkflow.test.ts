import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { CdkDiffStackWorkflow } from '../src';

// Helper to create a minimal CDK TS app project for testing
function createProject() {
  return new awscdk.AwsCdkTypeScriptApp({
    defaultReleaseBranch: 'main',
    name: 'tmp',
    cdkVersion: '2.85.0',
    projenrcTs: false,
    github: true,
  });
}

test('generates script in .github/workflows/scripts and references it in workflow', () => {
  const project = createProject();

  new CdkDiffStackWorkflow({
    project: project,
    stackName: 'my-stack',
    stackRegion: 'us-east-1',
    stackAccount: '111111111111',
    cdkYarnCommand: 'cdk',
  });

  const snap = synthSnapshot(project);

  // Assert script file exists
  expect(Object.keys(snap)).toContain('.github/workflows/scripts/describe-cfn-changeset.ts');

  // Assert workflow exists with expected name and references the script path
  const wfPath = '.github/workflows/diff-my-stack.yml';
  expect(Object.keys(snap)).toContain(wfPath);
  const wf = snap[wfPath] as string;
  expect(wf).toContain('npx ts-node .github/workflows/scripts/describe-cfn-changeset.ts');
});
