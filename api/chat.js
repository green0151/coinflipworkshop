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
          { role: 'system', content: 'You are a helpful assistant on a gambling website. Be friendly but brief.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      })
    });

    const data = await aiRes.json();

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error('No reply content:', data);
      return res.status(200).json({ reply: 'Sorry, I didn’t get that.' });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI fetch error:', error);
    return res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
}
