export default async function handler(req, res) {
  // CORS: permite llamadas desde tu dominio de Lovable
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const workatoRes = await fetch(process.env.WORKATO_API_URL, {
      method: req.method,
      headers: {
        "API-Token": process.env.WORKATO_API_KEY,
        "Content-Type": "application/json",
      },
      // Reenvía el body si es POST
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await workatoRes.json();
    return res.status(workatoRes.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Proxy error", detail: error.message });
  }
}