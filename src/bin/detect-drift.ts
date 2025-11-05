import {
  CloudFormationClient,
  DescribeStackDriftDetectionStatusCommand,
  DetectStackDriftCommand,
  DescribeStackResourceDriftsCommand,
  type DescribeStackResourceDriftsCommandOutput,
  type StackResourceDriftStatus,
} from '@aws-sdk/client-cloudformation';

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const stackName = process.env.STACK_NAME;
  if (!stackName) {
    console.error('STACK_NAME env var is required');
    process.exit(1);
  }

  // Region and credentials pulled from environment set by actions/configure-aws-credentials
  const client = new CloudFormationClient({});

  const detect = await client.send(new DetectStackDriftCommand({ StackName: stackName }));
  if (!detect.StackDriftDetectionId) {
    console.error('Failed to start drift detection');
    process.exit(1);
  }

  const id = detect.StackDriftDetectionId;
  console.log(`Drift detection started: ${id}`);

  let detectionStatus = 'DETECTION_IN_PROGRESS';
  let stackDriftStatus: string | undefined;

  while (detectionStatus === 'DETECTION_IN_PROGRESS') {
    await sleep(5000);
    const res = await client.send(
      new DescribeStackDriftDetectionStatusCommand({ StackDriftDetectionId: id }),
    );
    detectionStatus = res.DetectionStatus ?? 'UNKNOWN';
    stackDriftStatus = res.StackDriftStatus;
    console.log(`Detection status: ${detectionStatus}`);
  }

  // Helper to build an HTML report of drifted resources
  const buildHtml = (stack: string, drifts: any[]): string => {
    let body = `<h1>Drift report</h1><h2>Stack Name: ${stack}</h2><br>`;
    if (drifts.length === 0) {
      body += 'no drift.';
      return body;
    }
    body += '<table>' +
      '<tr><th>Status</th><th>ID</th><th>Type</th><th>Differences</th></tr>';
    for (const d of drifts) {
      const status = d.StackResourceDriftStatus ?? '-';
      const logicalId = d.LogicalResourceId ?? '-';
      const type = d.ResourceType ?? '-';
      const diffs = (d.PropertyDifferences ?? []).map((pd: any) => {
        const p = pd.PropertyPath ?? '-';
        const t = pd.DifferenceType ?? '-';
        return `- ${t}: ${p}`;
      }).join('<br>');
      const statusEmoji = status === 'MODIFIED' ? '🟠' : status === 'DELETED' ? '🔴' : status === 'NOT_CHECKED' ? '⚪' : '🟢';
      body += '<tr>' +
        `<td>${statusEmoji} ${status}</td>` +
        `<td>${logicalId}</td>` +
        `<td>${type}</td>` +
        `<td>${diffs}</td>` +
        '</tr>';
    }
    body += '</table>';
    return body;
  };

  async function listDriftedResources(): Promise<any[]> {
    const results: any[] = [];
    // Only include resources that are not IN_SYNC
    const filters: StackResourceDriftStatus[] = ['MODIFIED', 'DELETED', 'NOT_CHECKED'];
    let nextToken: string | undefined = undefined;
    do {
      const resp: DescribeStackResourceDriftsCommandOutput = await client.send(new DescribeStackResourceDriftsCommand({
        StackName: stackName,
        NextToken: nextToken,
        StackResourceDriftStatusFilters: filters,
      }));
      if (resp.StackResourceDrifts) results.push(...resp.StackResourceDrifts);
      nextToken = resp.NextToken;
    } while (nextToken);
    return results;
  }

  async function postGithubComment(url: string, token: string, body: string): Promise<void> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
      },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`Failed to post GitHub comment: ${res.status} ${res.statusText} ${text}`);
    }
  }

  // When there is drift, collect details and post a PR comment + step summary
  if (stackDriftStatus !== 'IN_SYNC') {
    console.error(`Drift detected (status: ${stackDriftStatus})`);
    const drifts = await listDriftedResources();
    const html = buildHtml(stackName, drifts);

    // Print to stdout and append to summary if available
    console.log(html);
    const stepSummary = process.env.GITHUB_STEP_SUMMARY;
    if (stepSummary) {
      try {
        const { appendFile } = await import('fs/promises');
        await appendFile(stepSummary, `${html}\n`, { encoding: 'utf8' });
      } catch (e: any) {
        console.error('Failed to append to GITHUB_STEP_SUMMARY:', e?.message || e);
      }
    }

    const commentUrl = process.env.GITHUB_COMMENT_URL;
    const token = process.env.GITHUB_TOKEN;
    if (commentUrl && token) {
      await postGithubComment(commentUrl, token, html);
    }

    process.exit(1);
  }
  console.log('No drift detected (IN_SYNC)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
