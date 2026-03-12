"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImageIcon,
  Code2,
  Undo2,
  Redo2,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-md p-1.5 transition-colors ${
        isActive
          ? "bg-brand-orange/15 text-brand-orange"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-gray-200" />;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Escribe aqui...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-orange underline underline-offset-2",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[300px] px-4 py-3 text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    immediatelyRender: false,
  });

  // Sync external content changes (e.g. from auto-translate)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      const currentContent = editor.getHTML();
      // Only update if the content is meaningfully different
      const normalizedContent = content || "";
      const normalizedCurrent =
        currentContent === "<p></p>" ? "" : currentContent;
      if (normalizedContent !== normalizedCurrent) {
        editor.commands.setContent(content || "");
      }
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL del enlace:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt(
      "URL de la imagen (puedes pegar la URL de la galeria de medios):"
    );

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="h-10 border-b border-gray-200 bg-gray-50" />
        <div className="min-h-[300px] px-4 py-3">
          <span className="text-sm text-gray-400">Cargando editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-white px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Negrita"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Cursiva"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Tachado"
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Titulo H2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Titulo H3"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Lista con vinetas"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Cita"
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Enlace"
        >
          <Link2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Imagen">
          <ImageIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Bloque de codigo"
        >
          <Code2 size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer"
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer"
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      {/* Editor content area */}
      <EditorContent editor={editor} />

      {/* Editor content styles */}
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .tiptap {
          outline: none;
        }

        .tiptap h2 {
          font-size: 1.375rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          font-family: var(--font-title);
        }

        .tiptap h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          font-family: var(--font-title);
        }

        .tiptap p {
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }

        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .tiptap li {
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }

        .tiptap li p {
          margin-bottom: 0;
        }

        .tiptap blockquote {
          border-left: 3px solid var(--color-brand-orange);
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
          font-style: italic;
        }

        .tiptap a {
          color: var(--color-brand-orange);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .tiptap a:hover {
          opacity: 0.8;
        }

        .tiptap img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .tiptap pre {
          background-color: #1e1e2e;
          color: #cdd6f4;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .tiptap code {
          background-color: #f3f4f6;
          padding: 0.15rem 0.35rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .tiptap pre code {
          background: none;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }

        .tiptap strong {
          font-weight: 700;
        }

        .tiptap em {
          font-style: italic;
        }

        .tiptap s {
          text-decoration: line-through;
        }

        .tiptap hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
}
