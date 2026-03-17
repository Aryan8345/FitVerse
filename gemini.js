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

  // Use a model that is available for this API key.
  // If you want to change models, set GEMINI_MODEL (e.g. "gemini-2.5-pro" or "gemini-2.5-flash").
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const apiVersion = process.env.GENERATIVE_API_VERSION || 'v1';

  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
  console.log('Calling Gemini endpoint:', url);
  const googleRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await googleRes.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return res.status(googleRes.status).send(text || 'Invalid response from Gemini API');
  }

  return res.status(googleRes.status).json(data);
}
