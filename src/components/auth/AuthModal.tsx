"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { downloadSave } from "@/lib/supabase/cloudSave";
import { useGameStore } from "@/lib/store/gameStore";
import type { User } from "@supabase/supabase-js";

type Tab = "login" | "register";

function AuthForm({ onSuccess }: { onSuccess: (user: User) => void }) {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (tab === "register") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && !data.session) {
          setInfo("Revisá tu correo para confirmar tu cuenta.");
        } else if (data.user) {
          onSuccess(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) onSuccess(data.user);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-black/30 rounded-xl">
        {(["login", "register"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(null); setInfo(null); }}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? "bg-purple-600 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t === "login" ? "Iniciar Sesión" : "Registrarse"}
          </button>
        ))}
      </div>

      <input
        type="email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400"
      />

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
      {info && <p className="text-green-400 text-xs text-center">{info}</p>}

      <button
        type="submit"
        disabled={loading}
        className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 font-bold text-white transition-all active:scale-95"
      >
        {loading ? "Cargando..." : tab === "login" ? "Entrar" : "Crear cuenta"}
      </button>
    </form>
  );
}

function UserPanel({ user, onClose }: { user: User; onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    onClose();
  };

  const username = user.email?.split("@")[0] ?? "Mago";

  return (
    <div className="flex flex-col gap-4 text-center">
      <div className="text-5xl">🧙</div>
      <div>
        <p className="text-white font-bold text-lg">{username}</p>
        <p className="text-white/40 text-xs">{user.email}</p>
      </div>
      <div className="rounded-xl bg-green-500/10 border border-green-500/20 py-2 px-4">
        <p className="text-green-400 text-xs">☁️ Partida sincronizada en la nube</p>
      </div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 text-sm transition-all disabled:opacity-50"
      >
        {loading ? "Saliendo..." : "Cerrar sesión"}
      </button>
    </div>
  );
}

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const applyCloudSave = useGameStore((s) => s.applyCloudSave);

  const handleLoginSuccess = async (loggedUser: User) => {
    setUser(loggedUser);
    const cloudData = await downloadSave(loggedUser.id);
    if (cloudData && cloudData.highestZone > useGameStore.getState().highestZone) {
      applyCloudSave(cloudData);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl border border-purple-500/30 bg-[#120924] p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-xl">
                {user ? "Mi cuenta" : "☁️ Cloud Save"}
              </h2>
              <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">✕</button>
            </div>

            {user ? (
              <UserPanel user={user} onClose={onClose} />
            ) : (
              <>
                <p className="text-white/40 text-xs text-center mb-4">
                  Sincronizá tu partida entre dispositivos y aparecé en el ranking global.
                </p>
                <AuthForm onSuccess={handleLoginSuccess} />
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
