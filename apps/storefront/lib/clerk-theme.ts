/**
 * lib/clerk-theme.ts
 * Tema visual y localización en español (México) para todos los componentes de Clerk.
 * Se usa tanto en <ClerkProvider> (modales) como en las páginas /sign-in y /sign-up.
 *
 * Filosofía: "embedded" — el formulario forma parte de la página,
 * sin card chrome (sin borde, sin sombra, sin fondo propio).
 */

import { esMX, ptBR, esES } from "@clerk/localizations";
import type { Market } from "@/lib/markets";

// ─── Tema visual Novapatch ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const novapatchAppearance: Record<string, any> = {
  // ── Layout ─────────────────────────────────────────────────────────────────
  layout: {
    privacyPageUrl: "https://novapatch.mx/privacidad",
    termsPageUrl:   "https://novapatch.mx/terminos",
    helpPageUrl:    "https://novapatch.mx/faq",
    showOptionalFields: false,
  },

  // ── Variables globales ─────────────────────────────────────────────────────
  variables: {
    colorPrimary:                  "#0F0F0F",   // ink
    colorBackground:               "#FAF8F5",   // bone
    colorNeutral:                  "#0F0F0F",   // ink
    colorText:                     "#0F0F0F",
    colorTextSecondary:            "#3A3A37",
    colorTextOnPrimaryBackground:  "#FFFFFF",
    colorInputBackground:          "#FFFFFF",
    colorInputText:                "#0F0F0F",
    colorDanger:                   "#E8503A",
    colorSuccess:                  "#0F0F0F",
    colorWarning:                  "#D97706",
    borderRadius:                  "0.75rem",
    fontFamily:                    "inherit",
    fontSize:                      "14px",
    fontWeight: {
      normal: 400,
      medium: 500,
      bold:   700,
    },
    spacingUnit: "1rem",
  },

  // ── Elementos ──────────────────────────────────────────────────────────────
  elements: {
    // ── Modal backdrop ────────────────────────────────────────────────────────
    modalBackdrop: {
      backgroundColor: "rgba(13,27,53,0.65)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    },

    // Card — fondo cream para funcionar tanto en página embebida como en modales
    card: {
      boxShadow:       "0 8px 48px rgba(13,27,53,0.12)",
      border:          "1px solid rgba(13,27,53,0.07)",
      borderRadius:    "1.25rem",
      padding:         "2rem",
      backgroundColor: "#FAF7F2",
      width:           "100%",
      maxWidth:        "400px",
    },
    cardBox: {
      boxShadow:    "none",
      border:       "none",
      width:        "100%",
      maxWidth:     "860px",
      borderRadius: "1.25rem",
      overflow:     "hidden",
    },
    scrollBox: {
      backgroundColor: "#FAF7F2",
      padding:         "0",
    },
    // Panel de contenido del UserProfile (lado derecho)
    pageScrollBox: {
      backgroundColor: "#FAF7F2",
      padding:         "2rem",
    },
    navbar: {
      backgroundColor: "#FFFFFF",
      borderRight:     "1px solid rgba(13,27,53,0.07)",
      padding:         "1.5rem 1rem",
    },

    // Header
    headerTitle: {
      color:          "#0D1B35",
      fontSize:       "clamp(20px, 3vw, 24px)",
      fontWeight:     "900",
      letterSpacing:  "-0.025em",
      lineHeight:     "1.15",
    },
    headerSubtitle: {
      color:      "#5F7080",
      fontSize:   "14px",
      marginTop:  "0.35rem",
      lineHeight: "1.5",
    },
    header: {
      marginBottom: "1.75rem",
    },

    // Botones sociales (Google, Apple, etc.)
    socialButtonsBlockButton: {
      border:          "1.5px solid #E2E5EA",
      borderRadius:    "0.75rem",
      fontWeight:      "600",
      color:           "#0D1B35",
      backgroundColor: "#FFFFFF",
      padding:         "0.7rem 1rem",
      fontSize:        "14px",
      transition:      "border-color 0.15s ease, box-shadow 0.15s ease",
      boxShadow:       "none",
    },
    socialButtonsBlockButtonText: {
      color:      "#0D1B35",
      fontWeight: "600",
      fontSize:   "14px",
    },
    socialButtonsBlockButtonArrow: {
      display: "none",
    },
    socialButtonsProviderIcon: {
      width:  "18px",
      height: "18px",
    },

    // Divisor "o continúa con"
    dividerRow: {
      margin: "0.25rem 0",
    },
    dividerLine: {
      backgroundColor: "#E2E5EA",
    },
    dividerText: {
      color:          "#9CA3AF",
      fontSize:       "12px",
      textTransform:  "uppercase",
      letterSpacing:  "0.06em",
      fontWeight:     "600",
    },

    // Labels
    formFieldLabel: {
      color:          "#0D1B35",
      fontWeight:     "700",
      fontSize:       "11px",
      textTransform:  "uppercase",
      letterSpacing:  "0.08em",
      marginBottom:   "0.4rem",
    },
    formFieldLabelRow: {
      marginBottom: "0.35rem",
    },

    // Inputs
    formFieldInput: {
      border:          "1.5px solid #E2E5EA",
      borderRadius:    "0.75rem",
      color:           "#0D1B35",
      fontSize:        "15px",
      padding:         "0.75rem 1rem",
      backgroundColor: "#FFFFFF",
      transition:      "border-color 0.15s ease, box-shadow 0.15s ease",
      outline:         "none",
    },
    formFieldInputShowPasswordButton: {
      color: "#9CA3AF",
    },
    formFieldHintText: {
      color:    "#9CA3AF",
      fontSize: "12px",
    },
    formFieldErrorText: {
      color:      "#E8503A",
      fontSize:   "12px",
      fontWeight: "500",
    },
    formFieldSuccessText: {
      color:    "#059669",
      fontSize: "12px",
    },
    formFieldRow: {
      marginBottom: "0.25rem",
    },

    // Botón primario (Continuar / Crear cuenta)
    formButtonPrimary: {
      backgroundColor: "#E8503A",
      borderRadius:    "0.75rem",
      fontWeight:      "700",
      fontSize:        "15px",
      padding:         "0.9rem 1.5rem",
      transition:      "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
      boxShadow:       "0 4px 16px rgba(232,80,58,0.28)",
      letterSpacing:   "-0.01em",
      color:           "#FAF7F2",
      width:           "100%",
    },

    // Botón secundario / ghost
    formButtonReset: {
      color:      "#E8503A",
      fontWeight: "600",
      fontSize:   "13px",
    },

    // Footer — link de "¿Ya tienes cuenta? Inicia sesión"
    footerActionText: {
      color:    "#6B7280",
      fontSize: "14px",
    },
    footerActionLink: {
      color:      "#E8503A",
      fontWeight: "700",
      fontSize:   "14px",
    },
    footerPages: {
      backgroundColor: "transparent",
      marginTop:       "1.5rem",
    },
    footer: {
      backgroundColor: "transparent",
    },

    // Métodos alternativos
    alternativeMethodsBlockButton: {
      border:          "1.5px solid #E2E5EA",
      borderRadius:    "0.75rem",
      color:           "#0D1B35",
      fontWeight:      "600",
      backgroundColor: "#FFFFFF",
      fontSize:        "14px",
    },

    // OTP / código de verificación
    otpCodeFieldInput: {
      border:          "1.5px solid #E2E5EA",
      borderRadius:    "0.75rem",
      color:           "#0D1B35",
      fontWeight:      "800",
      fontSize:        "22px",
      backgroundColor: "#FFFFFF",
    },

    // Vista previa de identidad (email ya ingresado)
    identityPreviewText: {
      color:      "#0D1B35",
      fontWeight: "600",
      fontSize:   "14px",
    },
    identityPreviewEditButton: {
      color:      "#E8503A",
      fontWeight: "600",
    },
    identityPreviewEditButtonIcon: {
      color: "#E8503A",
    },

    // Badge
    badge: {
      backgroundColor: "#EBF4FB",
      color:           "#0D1B35",
      fontSize:        "11px",
    },

    // Reenviar código
    formResendCodeLink: {
      color:      "#E8503A",
      fontWeight: "600",
      fontSize:   "13px",
    },

    // Checkbox (recordarme)
    formFieldCheckboxInput: {
      accentColor: "#E8503A",
    },

    // Internal link (¿Olvidaste tu contraseña?)
    formFieldAction: {
      color:      "#E8503A",
      fontWeight: "600",
      fontSize:   "12px",
    },

  },
};

// ─── Localización en español (México) ─────────────────────────────────────────

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T extends Record<string, any>>(base: T, overrides: DeepPartial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(overrides) as Array<keyof T>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ov = (overrides as any)[key];
    const bv = base[key];
    if (ov && typeof ov === "object" && !Array.isArray(ov) && bv && typeof bv === "object") {
      result[key] = deepMerge(bv as object, ov as DeepPartial<object>) as T[keyof T];
    } else if (ov !== undefined) {
      result[key] = ov as T[keyof T];
    }
  }
  return result;
}

const baseLocalizations = {
  mx: esMX,
  br: ptBR,
  ar: esES,
  cl: esES,
  co: esES,
};

const novapatchOverrides = {
  signIn: {
    start: {
      subtitle: "Ingresa a tu cuenta de Novapatch",
    },
    alternativeMethods: {
      getHelp: {
        content: "Si tienes problemas para acceder, escríbenos a soporte@novapatch.mx",
      },
    },
  },
  signUp: {
    start: {
      subtitle: "Regístrate para gestionar tus pedidos y suscripciones",
    },
  },
  formFieldInputPlaceholder__emailAddress: "tu@correo.com",
  formFieldInputPlaceholder__phoneNumber:  "+52 55 0000 0000",
  formFieldInputPlaceholder__firstName:    "María",
  formFieldInputPlaceholder__lastName:     "García",
};

// Keep the existing esLocalization export for backwards compatibility
// during migration (remove once app/layout.tsx is updated)
export const esLocalization = deepMerge(
  esMX as object,
  novapatchOverrides as object
) as typeof esMX;

export function getClerkLocalization(locale: Market) {
  const base = baseLocalizations[locale];
  const isPortuguese = locale === "br";
  return {
    ...base,
    signIn: {
      ...base?.signIn,
      start: {
        ...base?.signIn?.start,
        subtitle: isPortuguese
          ? "Entre na sua conta Novapatch"
          : "Ingresa a tu cuenta de Novapatch",
      },
    },
    signUp: {
      ...base?.signUp,
      start: {
        ...base?.signUp?.start,
        subtitle: isPortuguese
          ? "Cadastre-se para gerenciar seus pedidos e assinaturas"
          : "Regístrate para gestionar tus pedidos y suscripciones",
      },
    },
  };
}
