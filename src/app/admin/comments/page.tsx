export default function AdminCommentsPage() {
  return (
    <div>
      <h1 className="mb-8 font-title text-2xl font-bold text-brand-blue">
        Comentarios
      </h1>
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Cola de moderación de comentarios.</p>
        <p className="mt-2 text-sm text-gray-400">
          Los comentarios aparecerán aquí cuando los usuarios los envíen.
        </p>
      </div>
    </div>
  );
}
