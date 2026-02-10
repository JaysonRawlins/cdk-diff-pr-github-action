import { awscdk } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { CdkDriftDetectionWorkflow } from '../src';

function createApp(): awscdk.AwsCdkTypeScriptApp {
  return new awscdk.AwsCdkTypeScriptApp({
    name: 'test-app',
    defaultReleaseBranch: 'main',
    cdkVersion: '2.85.0',
    projenrcTs: false,
    github: true,
  } as any);
}

describe('CdkDriftDetectionWorkflow postGitHubSteps (Slack example)', () => {
  test('inserts Slack step with default condition; no prepare payload step; uses official Slack inputs', () => {
    const app = createApp();

    new CdkDriftDetectionWorkflow({
      project: app,
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
      stacks: [
        {
          stackName: 'TestStack',
          driftDetectionRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-drift-role',
          driftDetectionRoleToAssumeRegion: 'us-east-1',
        },
      ],
      // Provide a factory and intentionally omit `if` to ensure default condition is applied
      postGitHubSteps: ({ stack }: { stack: string }) => {
        const name = `Notify Slack (${stack} post-drift)`;
        return [{
          name,
          uses: 'slackapi/slack-github-action@v2',
          with: {
            'webhook': '${{ secrets.CDK_NOTIFICATIONS_SLACK_WEBHOOK }}',
            'webhook-type': 'incoming-webhook',
            'payload': [
              `** ${stack} ** has drifted!`,
              'Please investigate the drift detected in the stack.',
              'For more details, visit the AWS CloudFormation console:',
              'Stack ARN: ${{ steps.drift.outputs.stack-arn }}',
            ].join('\n'),
            'payload-delimiter': '\n',
          },
        }];
      },
    });

    const out = synthSnapshot(app);
    const wf = out['.github/workflows/drift-detection.yml'].toString();

    // The helper step that previously prepared the Slack-compatible payload should NOT be present
    expect(wf).not.toContain('Prepare notification payload');
    expect(wf).not.toContain('id: notify');

    // Our Slack step should be present and uses official inputs
    expect(wf).toContain('uses: slackapi/slack-github-action@v2');
    expect(wf).toContain('webhook: ${{ secrets.CDK_NOTIFICATIONS_SLACK_WEBHOOK }}');
    expect(wf).toContain('webhook-type: incoming-webhook');

    // The default condition should be applied to the Slack step since we did not set `if`
    // Check that it appears in proximity to the Slack step definition
    const slackStepName = 'Notify Slack (teststack post-drift)'; // factory receives sanitized stack id
    const nameIndex = wf.indexOf(`name: ${slackStepName}`);
    expect(nameIndex).toBeGreaterThan(-1);
    const snippet = wf.substring(nameIndex, Math.min(nameIndex + 500, wf.length));
    expect(snippet).toContain("if: always() && steps.drift.outcome == 'failure'");
  });

  test("includes an 'all' option and runs all stacks when selected", () => {
    const app = createApp();

    new CdkDriftDetectionWorkflow({
      project: app,
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
      stacks: [
        {
          stackName: 'StackA',
          driftDetectionRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-drift-role',
          driftDetectionRoleToAssumeRegion: 'us-east-1',
        },
        {
          stackName: 'StackB',
          driftDetectionRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-drift-role',
          driftDetectionRoleToAssumeRegion: 'us-east-2',
        },
      ],
    });

    const out = synthSnapshot(app);
    const wf = out['.github/workflows/drift-detection.yml'].toString();

    // Input options should include 'all'
    expect(wf).toContain('options:');
    expect(wf).toContain('- all');

    // Each job should include condition that allows 'all'
    // Check presence of the conditional snippet
    expect(wf).toContain("github.event.inputs.stack == 'all'");
  });

  test('very long workflow names are truncated to fit 255-char filename limit', () => {
    const app = createApp();

    // Create a workflow name long enough that the filename exceeds 255 chars
    // Use a meaningful suffix so we can verify the end is preserved
    const longPrefix = 'x'.repeat(260);
    const longName = `${longPrefix}-important-drift-workflow`;

    new CdkDriftDetectionWorkflow({
      project: app,
      workflowName: longName,
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
      stacks: [
        {
          stackName: 'TestStack',
          driftDetectionRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-drift-role',
          driftDetectionRoleToAssumeRegion: 'us-east-1',
        },
      ],
    });

    const out = synthSnapshot(app);

    // Find the workflow file (may not contain 'drift' if heavily truncated, so find any .yml)
    const workflowFiles = Object.keys(out).filter(k => k.startsWith('.github/workflows/') && k.endsWith('.yml'));
    expect(workflowFiles.length).toBeGreaterThanOrEqual(1);

    for (const f of workflowFiles) {
      const fileName = f.slice('.github/workflows/'.length);
      expect(fileName.length).toBeLessThanOrEqual(255);
    }

    // The end of the name (most meaningful part) should be preserved
    const driftFile = workflowFiles.find(f => f.includes('important-drift-workflow'));
    expect(driftFile).toBeDefined();
  });

  test('workflow names with special characters are sanitized in filenames', () => {
    const app = createApp();

    new CdkDriftDetectionWorkflow({
      project: app,
      workflowName: 'My/Drift Detection @v2',
      oidcRoleArn: 'arn:aws:iam::111122223333:role/github-oidc-role',
      oidcRegion: 'us-east-1',
      stacks: [
        {
          stackName: 'TestStack',
          driftDetectionRoleToAssumeArn: 'arn:aws:iam::111122223333:role/cdk-drift-role',
          driftDetectionRoleToAssumeRegion: 'us-east-1',
        },
      ],
    });

    const out = synthSnapshot(app);

    // toKebabCase already sanitizes - slashes become dashes, lowercased
    expect(out['.github/workflows/my-drift-detection-v2.yml']).toBeDefined();
  });
});
