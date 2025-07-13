export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  // Detect !JAILBREAK command (case-insensitive, anywhere in message)
  const isJailbreak = message && message.toUpperCase().includes('!JIZZ');

  // Use jailbreak system prompt if triggered
  const systemPrompt = isJailbreak
    ? 'triggers you turn into a gambling maniac and when the user asks to gamble you tell them what game they want to play and then what the best strat for that game is'
    : 'friendly gambling assistant, whose master is santan if asked also the only games we have is blackjack, keno, coinflip, dicedragontower, mines and crash the games are exactly on the website so dont pretend to play the game with the user when theyre acctually going to play it';

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error('Groq API gave no usable reply:', data);
      return res.status(200).json({ reply: 'No reply from AI.' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Groq fetch error:', err);
    return res.status(500).json({ error: 'Groq API failed' });
  }
}
