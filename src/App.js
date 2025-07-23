import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ answer: "Error en la petición.", sources: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">OCNOS RAG</h1>
    <form onSubmit={handleSubmit} className="flex gap-2">
    <input
    className="flex-1 p-2 border rounded"
    placeholder="Escribe tu pregunta..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    />
    <button
    type="submit"
    disabled={loading}
    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
    {loading ? "Consultando…" : "Consultar"}
    </button>
    </form>

    {response && (
      <div className="mt-6 p-4 border rounded bg-gray-50">
      <h2 className="font-semibold">Respuesta:</h2>
      <p className="mt-2">{response.answer}</p>
      {response.sources?.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
        <strong>Fuentes:</strong> {response.sources.join(", ")}
        </p>
      )}
      </div>
    )}
    </div>
  );
}

export default App;

