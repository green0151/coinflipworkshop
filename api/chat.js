export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  try {
    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a friendly AI assistant on a gambling website.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await aiRes.json();

    // 🪵 Log the full OpenAI response for debugging
    console.log('OpenAI raw response:', data);

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(200).json({ reply: 'Sorry, I didn’t get that.' });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
}
