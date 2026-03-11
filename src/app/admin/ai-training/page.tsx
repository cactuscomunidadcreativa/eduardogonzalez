"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

export default function AdminAITrainingPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            IA Training
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Documentos que alimentan el chat &quot;Preg\u00fantale a Eduardo&quot;
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-orange/90"
        >
          <Plus size={16} />
          Nuevo documento
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="space-y-4">
            <input
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-orange"
              placeholder="T\u00edtulo del documento"
            />
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none">
              <option value="about">Sobre Eduardo</option>
              <option value="methodology">Metodolog\u00eda</option>
              <option value="project">Proyecto</option>
              <option value="philosophy">Filosof\u00eda</option>
            </select>
            <textarea
              rows={8}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-orange"
              placeholder="Contenido del documento de entrenamiento..."
            />
            <button className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white">
              Guardar documento
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">
          A\u00f1ade documentos para entrenar la IA con el conocimiento de Eduardo.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Categor\u00edas: Sobre Eduardo, Metodolog\u00eda, Proyectos, Filosof\u00eda
        </p>
      </div>
    </div>
  );
}
