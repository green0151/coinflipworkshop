export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_OPENROUTER_API_KEY`
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct', // or try 'meta-llama/llama-2-13b-chat'
        messages: [
          { role: 'system', content: 'You are a friendly gambling assistant.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'No reply from AI.';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenRouter error:', error);
    return res.status(500).json({ error: 'OpenRouter API failed' });
  }
}
