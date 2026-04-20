const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notifySlackError = async (
  message: string,
  maxRetries = 3
): Promise<void> => {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");

  if (!webhookUrl) {
    console.error("SLACK_WEBHOOK_URL environment variable is not set");
    return;
  }

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });

      if (response.ok) {
        return; // Success
      }

      if (response.status === 429) {
        attempt++;
        if (attempt > maxRetries) {
          console.error(`Failed to send slack notification after ${maxRetries} retries due to rate limiting`);
          const text = await response.text().catch(() => "");
          if (text) console.error(`Response details: ${text}`);
          return;
        }

        // Prioritize Slack's Retry-After header, fallback to exponential backoff
        const retryAfter = response.headers.get("Retry-After");
        // Exponential backoff: 1000ms, 2000ms, 4000ms
        let waitMs = 1000 * Math.pow(2, attempt - 1);

        if (retryAfter) {
          const parsedRetryAfter = parseInt(retryAfter, 10);
          if (!isNaN(parsedRetryAfter)) {
            waitMs = parsedRetryAfter * 1000;
          }
        }

        console.warn(`Rate limited by Slack (429). Retrying in ${waitMs}ms (Attempt ${attempt} of ${maxRetries})`);
        await sleep(waitMs);
        continue;
      }

      console.error(`Failed to send slack notification: ${response.status} ${response.statusText}`);
      const text = await response.text().catch(() => "");
      if (text) console.error(`Response details: ${text}`);
      return;
    } catch (error) {
      console.error("Error sending slack notification:", error);
      return;
    }
  }
};
