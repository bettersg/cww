export const notifySlackError = async (message: string): Promise<void> => {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");

  if (!webhookUrl) {
    console.error("SLACK_WEBHOOK_URL environment variable is not set");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      console.error(`Failed to send slack notification: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(`Response details: ${text}`);
    }
  } catch (error) {
    console.error("Error sending slack notification:", error);
  }
};
