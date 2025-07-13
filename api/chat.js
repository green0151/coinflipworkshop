export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct',
        messages: [
          { role: 'system', content: 'You are a helpful assistant on a gambling website.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();

    console.log('OpenRouter raw response:', data); // 🧪 LOG the full reply

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(200).json({ reply: 'No reply from AI.' });
    }

    return res.status(200).json({ reply });
  } catch (error) {
