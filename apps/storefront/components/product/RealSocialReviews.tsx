"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";

export type Review = {
  id: string;
  slug: string;
  rating: number;
  title: string;
  user: string;
  email: string;
  verified: boolean;
  text: string;
  date: string;
  reply?: {
    text: string;
    date: string;
  } | null;
};

export default function RealSocialReviews({
  slug,
  accent,
  bg,
  reviews,
  onRefresh,
  loading = false
}: {
  slug: string;
  accent: string;
  bg: string;
  reviews: Review[];
  onRefresh: () => Promise<void>;
  loading?: boolean;
}) {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | high | low
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Admin replies toggle map (reviewId -> boolean)
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, slug]);

  // Check if current logged-in user is admin
  const userEmail = user?.emailAddresses[0]?.emailAddress ?? "";
  const isAdmin = isLoaded && userEmail && (
    userEmail.toLowerCase().endsWith("@novapatch.care") ||
    userEmail.toLowerCase() === "esteban.mendezcasariego@gmail.com"
  );

  // Math metrics
  const totalCount = reviews.length;
  const averageRating = totalCount
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
    : 5.0;

  const starCounts = [0, 0, 0, 0, 0]; // Index 0 = 5★, Index 4 = 1★
  reviews.forEach((r) => {
    const starIdx = 5 - r.rating;
    if (starIdx >= 0 && starIdx < 5) {
      starCounts[starIdx]++;
    }
  });

  // Handle Review Submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formText) {
      setErrorMsg("Por favor, llena todos los campos.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          rating: formRating,
          title: formTitle,
          text: formText
        })
      });

      if (res.ok) {
        // Reset and reload
        setFormTitle("");
        setFormText("");
        setFormRating(5);
        setShowForm(false);
        await onRefresh();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Ocurrió un error.");
      }
    } catch (e) {
      setErrorMsg("Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Admin Reply Submit
  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setReplySubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          reviewId,
          text: replyText
        })
      });

      if (res.ok) {
        setReplyText("");
        setActiveReplyId(null);
        await onRefresh();
      }
    } catch (e) {
      console.error("Error submitting reply", e);
    } finally {
      setReplySubmitting(false);
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta opinión?")) return;

    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await onRefresh();
      }
    } catch (e) {
      console.error("Error deleting review", e);
    }
  };

  // Filter and Sort Reviews
  const filteredReviews = reviews
    .filter((r) => {
      const term = search.toLowerCase().trim();
      if (!term) return true;
      return (
        r.title.toLowerCase().includes(term) ||
        r.text.toLowerCase().includes(term) ||
        r.user.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "high") {
        return b.rating - a.rating;
      }
      if (sortBy === "low") {
        return a.rating - b.rating;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredReviews.length / 6);
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * 6, currentPage * 6);

  return (
    <section id="reviews-section" className="bg-[#FCFAF6] border-y border-[#E8E2D8] py-24 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* ── Summary & Stats Header ── */}
        <div className="grid gap-10 md:grid-cols-3 border-b border-[#E8E2D8] pb-12 mb-12">
          {/* Average Rating Block */}
          <div className="flex flex-col justify-center">
            <span 
              className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block"
              style={{ color: accent }}
            >
              Opiniones de la comunidad
            </span>
            <h2 className="text-[clamp(28px,3vw,38px)] font-black leading-none text-[#0D1B35]">
              Opiniones de clientes
            </h2>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#0D1B35]">{averageRating}</span>
              <span className="text-sm font-bold text-[#0D1B35]/40">/ 5</span>
            </div>
            <div className="text-[#F59E0B] text-xl font-bold tracking-tight mt-2">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <p className="mt-2 text-xs text-[#0D1B35]/50 font-medium">
              Basado en {totalCount} opiniones del mundo real
            </p>
          </div>

          {/* Bar Distribution Block */}
          <div className="flex flex-col justify-center gap-2.5">
            {starCounts.map((count, i) => {
              const stars = 5 - i;
              const percentage = totalCount ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs text-[#425066] font-medium">
                  <span className="w-6 shrink-0">{stars}★</span>
                  <div className="relative h-2 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8E2D8]/40 shadow-inner">
                    <div 
                      className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: stars === 5 ? accent : "#A0AEC0"
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right">{percentage}%</span>
                </div>
              );
            })}
          </div>

          {/* Review CTA Area */}
          <div className="flex flex-col justify-center items-start md:items-end">
            {showForm ? (
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full border border-[#0D1B35]/15 px-6 py-3 text-xs font-bold text-[#0D1B35] hover:bg-[#FAF7F2] transition active:scale-95 shadow-sm"
              >
                Cancelar opinión
              </button>
            ) : (
              <button
                onClick={() => {
                  if (user) {
                    setShowForm(true);
                  } else {
                    openSignIn();
                  }
                }}
                className="rounded-full px-7 py-3.5 text-xs font-black text-white transition active:scale-95 shadow-md uppercase tracking-wider"
                style={{ backgroundColor: accent }}
              >
                Escribir una opinión
              </button>
            )}
          </div>
        </div>

        {/* ── Add Review Form ── */}
        <AnimatePresence>
          {showForm && user && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <form 
                onSubmit={handleReviewSubmit}
                className="bg-white rounded-3xl border border-[#E8E2D8]/80 p-8 shadow-md grid gap-5 max-w-2xl"
              >
                <h3 className="text-base font-black text-[#0D1B35]">
                  Escribe tu opinión sobre el producto
                </h3>
                
                {/* Rating selection */}
                <div>
                  <label className="text-xs font-bold text-[#0D1B35] block mb-2">Calificación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="text-2xl transition hover:scale-110 active:scale-95"
                      >
                        {star <= formRating ? (
                          <span className="text-[#F59E0B]">★</span>
                        ) : (
                          <span className="text-gray-300">★</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title-input" className="text-xs font-bold text-[#0D1B35] block mb-2">Título de la opinión</label>
                  <input
                    id="title-input"
                    type="text"
                    placeholder="Ej. Increíble foco y energía"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E2D8] px-4 py-2.5 text-sm focus:border-black focus:outline-none"
                    required
                  />
                </div>

                {/* Text body */}
                <div>
                  <label htmlFor="text-input" className="text-xs font-bold text-[#0D1B35] block mb-2">Tu comentario</label>
                  <textarea
                    id="text-input"
                    rows={4}
                    placeholder="Cuéntanos sobre tu experiencia aplicando el parche en tu rutina..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E2D8] px-4 py-2.5 text-sm focus:border-black focus:outline-none"
                    required
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs font-bold text-red-500">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full px-6 py-3 text-xs font-bold text-white transition active:scale-95 self-start disabled:opacity-50"
                  style={{ backgroundColor: accent }}
                >
                  {submitting ? "Enviando..." : "Publicar opinión"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Search & Filter Controls ── */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Buscar opiniones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-[#E8E2D8] px-5 py-2.5 pl-11 text-xs focus:border-black focus:outline-none shadow-sm bg-white"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D1B35]/30" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
            </svg>
          </div>

          <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
            <select
              aria-label="Ordenar opiniones"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-[#E8E2D8] px-5 py-2.5 text-xs focus:border-black focus:outline-none shadow-sm bg-white cursor-pointer"
            >
              <option value="newest">Más recientes</option>
              <option value="high">Mayor calificación</option>
              <option value="low">Menor calificación</option>
            </select>
          </div>
        </div>

        {/* ── Reviews Grid / List ── */}
        {loading ? (
          <div className="text-center py-16 text-xs text-[#0D1B35]/50 font-bold uppercase tracking-wider">
            Cargando opiniones...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#0D1B35]/50 font-bold uppercase tracking-wider">
            No se encontraron opiniones.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-[24px] border border-[#E8E2D8]/60 p-6 flex flex-col justify-between shadow-sm relative group hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  {/* Rating + Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[#F59E0B] text-sm tracking-tight">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {review.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ width: "10px", height: "10px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Verificado
                        </span>
                      )}

                      {/* Admin action: delete */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          aria-label="Eliminar opinión"
                          className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded-full"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 className="text-sm font-extrabold text-[#0D1B35] leading-snug">
                    {review.title}
                  </h3>

                  {/* Review Body */}
                  <p className="mt-3 text-xs leading-relaxed text-[#425066] font-medium">
                    "{review.text}"
                  </p>

                  {/* Nested Admin Reply */}
                  {review.reply && (
                    <div className="mt-4 bg-[#FAF7F2] border border-[#E8E2D8]/80 rounded-2xl p-4 text-left">
                      <span className="text-[9px] font-black uppercase tracking-wider block mb-1 text-[#0D1B35]/70">
                        Respuesta oficial de Novapatch
                      </span>
                      <p className="text-xs leading-relaxed text-[#425066] font-medium italic">
                        "{review.reply.text}"
                      </p>
                    </div>
                  )}

                  {/* Admin inline reply form */}
                  {isAdmin && !review.reply && (
                    <div className="mt-4">
                      {activeReplyId === review.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            rows={2}
                            placeholder="Escribe tu respuesta como admin..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full rounded-xl border border-[#E8E2D8] px-3 py-2 text-xs focus:border-black focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReplySubmit(review.id)}
                              disabled={replySubmitting}
                              className="text-[10px] bg-[#0D1B35] text-white px-3 py-1 rounded-full font-bold hover:bg-[#0D1B35]/90 transition"
                            >
                              Enviar
                            </button>
                            <button
                              onClick={() => {
                                setActiveReplyId(null);
                                setReplyText("");
                              }}
                              className="text-[10px] border border-gray-300 px-3 py-1 rounded-full font-bold hover:bg-gray-50 transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveReplyId(review.id);
                            setReplyText("");
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#0D1B35]/60 hover:text-black mt-2"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: "14px", height: "14px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                          </svg>
                          Responder opinión
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between border-t border-[#0D1B35]/5 pt-4 mt-6 text-[11px] font-bold text-[#0D1B35]/40 uppercase tracking-wider">
                  <span>{review.user}</span>
                  <span>{new Date(review.date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 border-t border-[#E8E2D8]/50 pt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full px-4 py-2 text-xs font-bold border border-[#E8E2D8] text-[#0D1B35] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F2] transition active:scale-95 shadow-sm bg-white"
            >
              &lt; Anterior
            </button>
            
            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition active:scale-90 flex items-center justify-center ${
                      isActive 
                        ? "text-white shadow-sm" 
                        : "text-[#0d1b35]/70 hover:bg-[#FAF7F2] hover:text-[#0D1B35]"
                    }`}
                    style={isActive ? { backgroundColor: accent } : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-full px-4 py-2 text-xs font-bold border border-[#E8E2D8] text-[#0D1B35] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F2] transition active:scale-95 shadow-sm bg-white"
            >
              Siguiente &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
