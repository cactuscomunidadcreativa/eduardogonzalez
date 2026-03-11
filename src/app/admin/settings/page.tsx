export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-8 font-title text-2xl font-bold text-brand-blue">
        Ajustes
      </h1>
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">General</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Nombre del sitio
              </label>
              <input
                defaultValue="Eduardo Gonz\u00e1lez"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Descripci\u00f3n
              </label>
              <textarea
                rows={2}
                defaultValue="Emotions \u00b7 Decisions \u00b7 Systems"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            Redes Sociales
          </h3>
          <div className="space-y-4">
            <input
              placeholder="Instagram URL"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
            />
            <input
              placeholder="LinkedIn URL"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
            />
            <input
              placeholder="YouTube URL"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
