"use client";

import { useState } from "react";

export default function SendMailPage() {
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ type: "ok" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          asunto,
          mensajeHtml: `<p>${mensaje}</p>`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse({ type: "ok", message: data.message || data.res });
      } else {
        setResponse({ type: "error", message: data.error || "Error al enviar el correo" });
      }
    } catch (error: any) {
      setResponse({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Enviar Correo</h1>

        <label className="block">
          <span className="text-gray-700 font-medium">Destinatario</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="ejemplo@correo.com"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Asunto</span>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Asunto del correo"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Mensaje</span>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={4}
            required
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Escribe el mensaje aquí..."
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar correo"}
        </button>

        {response && (
          <p
            className={`text-center font-medium ${
              response.type === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {response.message}
          </p>
        )}
      </form>
    </main>
  );
}
