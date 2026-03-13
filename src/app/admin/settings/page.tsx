"use client";

import { useState, useEffect } from "react";
import { Save, Check, Loader2, Key, Eye, EyeOff, Brain } from "lucide-react";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [siteName, setSiteName] = useState("Eduardo González");
  const [siteDescription, setSiteDescription] = useState("Emotions · Decisions · Systems");
  const [contactEmail, setContactEmail] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [botPersonality, setBotPersonality] = useState("");
  const [botGreeting, setBotGreeting] = useState("");
  const [botName, setBotName] = useState("Pregúntale a Eduardo");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.siteName) setSiteName(data.siteName);
        if (data.siteDescription) setSiteDescription(data.siteDescription);
        if (data.contactEmail) setContactEmail(data.contactEmail);
        if (data.seoTitle) setSeoTitle(data.seoTitle);
        if (data.seoDescription) setSeoDescription(data.seoDescription);
        if (data.instagram) setInstagram(data.instagram);
        if (data.linkedin) setLinkedin(data.linkedin);
        if (data.youtube) setYoutube(data.youtube);
        if (data.twitter) setTwitter(data.twitter);
        if (data.whatsapp) setWhatsapp(data.whatsapp);
        if (data.anthropicKey) setAnthropicKey(data.anthropicKey);
        if (data.botPersonality) setBotPersonality(data.botPersonality);
        if (data.botGreeting) setBotGreeting(data.botGreeting);
        if (data.botName) setBotName(data.botName);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName, siteDescription, contactEmail,
          seoTitle, seoDescription,
          instagram, linkedin, youtube, twitter, whatsapp, anthropicKey,
          botPersonality, botGreeting, botName,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Error al guardar");
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Cargando configuración...</div>;
  }

  return (
    <div>
      <h1 className="mb-8 font-title text-2xl font-bold text-brand-blue">
        Ajustes
      </h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">General</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Nombre del sitio</label>
              <input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Descripción</label>
              <textarea
                rows={2}
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Correo de contacto</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hola@eduardogonzalez.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Título SEO</label>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Eduardo González — Coach de decisiones y emociones"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Descripción SEO</label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Descripción que aparecerá en los resultados de búsqueda de Google..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Redes Sociales</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Instagram</label>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/eduardogonzalez"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">LinkedIn</label>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/eduardogonzalez"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">YouTube</label>
              <input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@eduardogonzalez"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Twitter / X</label>
              <input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/eduardogonzalez"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">WhatsApp</label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+17863954654"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
              <p className="mt-1 text-xs text-gray-400">
                Número con código de país. Se usará para el enlace de WhatsApp en el footer.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Key size={16} className="text-brand-orange" />
            <h3 className="text-sm font-semibold text-gray-700">API Keys</h3>
          </div>
          <p className="mb-4 text-xs text-gray-400">
            Las API keys se usan para el chat IA y las traducciones automáticas. Se almacenan de forma segura.
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Anthropic API Key (Claude)</label>
              <div className="relative">
                <input
                  type={showAnthropicKey ? "text" : "password"}
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 pr-10 font-mono text-sm outline-none focus:border-brand-orange"
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showAnthropicKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Usada para el bot &quot;Pregúntale a Eduardo&quot; y las traducciones automáticas ES/EN/PT
              </p>
            </div>
          </div>
        </div>

        {/* Bot Configuration */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Brain size={16} className="text-brand-orange" />
            <h3 className="text-sm font-semibold text-gray-700">Configuración del Bot</h3>
          </div>
          <p className="mb-4 text-xs text-gray-400">
            Configura el comportamiento, personalidad y apariencia del bot &quot;Pregúntale a Eduardo&quot;.
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Nombre del Bot</label>
              <input
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Pregúntale a Eduardo"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
              <p className="mt-1 text-xs text-gray-400">
                El nombre que se muestra en el botón del chat y el encabezado.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Mensaje de bienvenida</label>
              <textarea
                rows={3}
                value={botGreeting}
                onChange={(e) => setBotGreeting(e.target.value)}
                placeholder="¡Hola! Soy el asistente de Eduardo González. Puedo ayudarte con preguntas sobre inteligencia emocional, Emotional Budgeting, sistemas humanos, liderazgo consciente y los proyectos de Eduardo. ¿Qué te gustaría explorar?"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
              <p className="mt-1 text-xs text-gray-400">
                El primer mensaje que ve el usuario al abrir el chat. Si se deja vacío, se usa el mensaje del archivo de traducciones.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Personalidad del Bot</label>
              <textarea
                rows={12}
                value={botPersonality}
                onChange={(e) => setBotPersonality(e.target.value)}
                placeholder={"Eres la representación digital de Eduardo González. Responde siempre en primera persona, como si fueras Eduardo hablando directamente con quien te escribe.\n\nSoy Eduardo González, Director para Latinoamérica en Six Seconds...\n\nPersonalidad: cálido, reflexivo, intelectualmente curioso. Uso metáforas y preguntas para provocar reflexión. Soy directo pero empático."}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
              <p className="mt-1 text-xs text-gray-400">
                Define cómo se comporta el bot &quot;Pregúntale a Eduardo&quot;. Incluye el tono, estilo de respuesta, información personal y cualquier instrucción especial. Si se deja vacío, se usa la personalidad predeterminada.
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar cambios
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
              <Check size={16} />
              Cambios guardados correctamente
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
