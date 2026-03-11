import { FileText, MessageSquare, Mail, Users } from "lucide-react";

const stats = [
  { label: "Posts", value: "0", icon: FileText, color: "bg-brand-orange" },
  { label: "Comentarios", value: "0", icon: MessageSquare, color: "bg-brand-green" },
  { label: "Suscriptores", value: "0", icon: Mail, color: "bg-brand-blue" },
  { label: "Contactos", value: "0", icon: Users, color: "bg-brand-gray" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-8 font-title text-2xl font-bold text-brand-blue">
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-brand-blue">
                  {value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white`}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">
          Bienvenido al panel de administraci\u00f3n de Eduardo Gonz\u00e1lez.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Conecta tu base de datos Neon para comenzar a gestionar contenido.
        </p>
      </div>
    </div>
  );
}
