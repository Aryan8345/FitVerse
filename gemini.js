export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GENERATIVE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GENERATIVE_API_KEY environment variable' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const googleRes = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    }
  );

  const text = await googleRes.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return res.status(googleRes.status).send(text || 'Invalid response from Gemini API');
  }

  return res.status(googleRes.status).json(data);
}
