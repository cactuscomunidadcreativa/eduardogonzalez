"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  User,
  Calendar,
  Eye,
  EyeOff,
  Trash2,
  MessageSquare,
  Briefcase,
  Mic,
  Newspaper,
  HelpCircle,
  Loader2,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  CONFERENCE: { label: "Conferencia", icon: <Mic size={14} />, color: "bg-purple-100 text-purple-700" },
  CONSULTING: { label: "Consultoría", icon: <Briefcase size={14} />, color: "bg-blue-100 text-blue-700" },
  COLLABORATION: { label: "Colaboración", icon: <MessageSquare size={14} />, color: "bg-green-100 text-green-700" },
  MEDIA: { label: "Medios", icon: <Newspaper size={14} />, color: "bg-orange-100 text-orange-700" },
  OTHER: { label: "Otro", icon: <HelpCircle size={14} />, color: "bg-gray-100 text-gray-600" },
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        setContacts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function toggleRead(contact: Contact) {
    const newRead = !contact.read;
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, read: newRead } : c))
    );
    if (selectedContact?.id === contact.id) {
      setSelectedContact({ ...contact, read: newRead });
    }
    await fetch(`/api/contact/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: newRead }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este contacto?")) return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    }
  }

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl font-bold text-brand-blue">
            Contactos
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {contacts.length} mensaje{contacts.length !== 1 ? "s" : ""}
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-brand-orange px-2 py-0.5 text-xs text-white">
                {unreadCount} sin leer
              </span>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Mail className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500">No hay mensajes de contacto</p>
          <p className="mt-1 text-sm text-gray-400">
            Los mensajes aparecerán aquí cuando alguien use el formulario de contacto.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* List */}
          <div className="space-y-2">
            {contacts.map((contact) => {
              const typeConf = TYPE_CONFIG[contact.type] || TYPE_CONFIG.OTHER;
              const isSelected = selectedContact?.id === contact.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  } ${!contact.read ? "border-l-4 border-l-brand-orange" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-blue">
                          {contact.name}
                        </span>
                        {!contact.read && (
                          <span className="h-2 w-2 rounded-full bg-brand-orange" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400">{contact.email}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {contact.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${typeConf.color}`}>
                        {typeConf.icon}
                        {typeConf.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(contact.createdAt).toLocaleDateString("es")}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail */}
          {selectedContact ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-brand-blue">
                    {selectedContact.name}
                  </h2>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-sm text-brand-orange hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleRead(selectedContact)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-brand-blue"
                    title={selectedContact.read ? "Marcar como no leído" : "Marcar como leído"}
                  >
                    {selectedContact.read ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(selectedContact.createdAt).toLocaleString("es", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </span>
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${TYPE_CONFIG[selectedContact.type]?.color || TYPE_CONFIG.OTHER.color}`}>
                  {TYPE_CONFIG[selectedContact.type]?.icon || TYPE_CONFIG.OTHER.icon}
                  {TYPE_CONFIG[selectedContact.type]?.label || selectedContact.type}
                </span>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {selectedContact.message}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(selectedContact.email)}&su=${encodeURIComponent("Re: Contacto desde eduardogonzalez.coach")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-orange/90"
                >
                  <Mail size={14} />
                  Responder en Gmail
                </a>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: Contacto desde eduardogonzalez.coach`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <Mail size={14} />
                  Abrir en app de correo
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12">
              <p className="text-sm text-gray-400">
                Selecciona un mensaje para ver los detalles
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
