// pages/api/track.js
export default async function handler(req, res) {
  const webhookUrl = process.env.WEBHOOK_URL;

  // Get IP address from headers
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    "Unknown";

  const event = req.body.event || "Page Visit";

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📡 **Event:** ${event}\n🌍 **IP Address:** \`${ip}\``,
      }),
    });
    res.status(200).json({ status: "Logged" });
  } catch (err) {
    res.status(500).json({ error: "Webhook failed" });
  }
}
