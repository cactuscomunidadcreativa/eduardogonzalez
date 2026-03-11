import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "pt"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/quien-soy": {
      es: "/quien-soy",
      en: "/about",
      pt: "/sobre-mim",
    },
    "/que-hago": {
      es: "/que-hago",
      en: "/what-i-do",
      pt: "/o-que-faco",
    },
    "/proyectos": {
      es: "/proyectos",
      en: "/projects",
      pt: "/projetos",
    },
    "/proyectos/[slug]": {
      es: "/proyectos/[slug]",
      en: "/projects/[slug]",
      pt: "/projetos/[slug]",
    },
    "/ideas": {
      es: "/ideas",
      en: "/ideas",
      pt: "/ideias",
    },
    "/ideas/[slug]": {
      es: "/ideas/[slug]",
      en: "/ideas/[slug]",
      pt: "/ideias/[slug]",
    },
    "/libros": {
      es: "/libros",
      en: "/books",
      pt: "/livros",
    },
    "/libros/[slug]": {
      es: "/libros/[slug]",
      en: "/books/[slug]",
      pt: "/livros/[slug]",
    },
    "/lab": "/lab",
    "/lab/[slug]": "/lab/[slug]",
    "/contacto": {
      es: "/contacto",
      en: "/contact",
      pt: "/contato",
    },
  },
});
