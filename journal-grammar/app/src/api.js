const API_BASE = "http://localhost:8787"; 

export async function analyze({ languageHint, text, imageBase64, imageMime }) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ languageHint, text, imageBase64, imageMime })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}
