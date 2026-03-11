import { Upload } from "lucide-react";

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="mb-8 font-title text-2xl font-bold text-brand-blue">
        Media
      </h1>
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <Upload size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Arrastra archivos aqu\u00ed o haz click para subir</p>
        <p className="mt-2 text-sm text-gray-400">
          Galer\u00eda de im\u00e1genes y archivos del sitio.
        </p>
      </div>
    </div>
  );
}
