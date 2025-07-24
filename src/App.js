import React, { useState } from "react";
import "./App.css";

// Componentes para UX mejorada
function Navbar() {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
    <h1 className="text-2xl font-bold">OCNOS RAG</h1>
    <img src="/logo.png" alt="Logotipo CEPLI" className="h-8" />
    </header>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center items-center mt-10">
    <svg className="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    </div>
  );
}

function ResponseCard({ response }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
    <p className="mb-2 whitespace-pre-line">{response.text}</p>
    {response.sources?.length > 0 && (
      <ul className="mt-4 text-sm text-gray-600 list-disc list-inside">
      {response.sources.map((src, idx) => (
        <li key={idx}>{src}</li>
      ))}
      </ul>
    )}
    </div>
  );
}

function ResponseList({ responses }) {
  if (!responses.length) {
    return <p className="text-center text-lg text-gray-500">Introduce una consulta para comenzar.</p>;
  }
  return (
    <div className="space-y-4">
    {responses.map((resp, i) => (
      <ResponseCard key={i} response={resp} />
    ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white shadow-inner p-4 text-center text-xs text-gray-500">
    Versión 1.0 · © CEPLI 2025 · Asistente RAG para OCNOS
    </footer>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponses([]);
    try {
      const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      const formatted = [{ text: data.answer, sources: data.sources || [] }];
      setResponses(formatted);
    } catch (err) {
      console.error(err);
      setResponses([{ text: "Error en la petición.", sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-serif bg-gray-50 text-gray-800">
    <Navbar />
    <main className="flex-1 px-8 py-6 max-w-3xl ml-10">
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
    <textarea
    rows={4}
    className="flex-1 p-4 border rounded-lg text-lg placeholder-gray-500 resize-y"
    placeholder="Escribe tu pregunta..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    />
    <button
    type="submit"
    disabled={loading}
    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
    >
    {loading ? "Consultando…" : "Consultar"}
    </button>
    </form>
    {loading ? <Spinner /> : <ResponseList responses={responses} />}
    </main>
    <Footer />
    </div>
  );
}

export default App;
