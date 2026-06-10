import { notFound } from "next/navigation"

// Catch-all del segmento [locale]: cualquier ruta que no matchee una página
// real termina acá y responde con status HTTP 404 de verdad. Sin esto, el
// rewrite del middleware de next-intl hace que las rutas desconocidas bajo
// segmentos dinámicos (p. ej. /mx/tienda/<handle-inexistente>) devuelvan 200
// con la UI de not-found (soft-404). Patrón recomendado por next-intl.
export default function CatchAllPage() {
  notFound()
}
