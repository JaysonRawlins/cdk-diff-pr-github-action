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
  test('inserts Prepare notification payload and Slack step with default condition and payload wiring', () => {
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
          uses: 'slackapi/slack-github-action@v1',
          with: {
            payload: '${{ steps.notify.outputs.result }}',
          },
          env: {
            SLACK_WEBHOOK_URL: '${{ secrets.CDK_NOTIFICATIONS_SLACK_WEBHOOK }}',
            SLACK_WEBHOOK_TYPE: 'INCOMING_WEBHOOK',
          },
        }];
      },
    });

    const out = synthSnapshot(app);
    const wf = out['.github/workflows/drift-detection.yml'].toString();

    // The helper step that prepares the Slack-compatible payload must be present
    expect(wf).toContain('Prepare notification payload');
    expect(wf).toContain('id: notify');

    // Our Slack step should be present and wired to the prepared payload
    expect(wf).toContain('uses: slackapi/slack-github-action@v1');
    expect(wf).toContain('payload: ${{ steps.notify.outputs.result }}');
    expect(wf).toContain('SLACK_WEBHOOK_URL: ${{ secrets.CDK_NOTIFICATIONS_SLACK_WEBHOOK }}');
    expect(wf).toContain('SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK');

    // The default condition should be applied to the Slack step since we did not set `if`
    // Check that it appears in proximity to the Slack step definition
    const slackStepName = 'Notify Slack (teststack post-drift)'; // factory receives sanitized stack id
    const nameIndex = wf.indexOf(`name: ${slackStepName}`);
    expect(nameIndex).toBeGreaterThan(-1);
    const snippet = wf.substring(nameIndex, Math.min(nameIndex + 500, wf.length));
    expect(snippet).toContain("if: always() && steps.drift.outcome == 'failure'");
  });
});
