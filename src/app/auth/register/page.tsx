'use client';

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear la cuenta");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Error al iniciar sesión");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050710] bg-gradient-to-br from-gray-950 via-purple-950/30 to-blue-950/20 flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEzOSwgOTIsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
          
          <h1 className="mb-3 text-7xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              NEETCODE
            </span>
          </h1>
          
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-300/80">
            Google L4 Preparation
          </p>
        </div>

        <div className="rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-gray-900/80 to-purple-950/40 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.2)]">
          <h2 className="mb-6 text-2xl font-black text-white text-center">
            Crear Cuenta
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-purple-500/30 bg-gray-900/60 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-purple-500/30 bg-gray-900/60 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-purple-500/30 bg-gray-900/60 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-purple-500/30 bg-gray-900/60 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl border-2 border-purple-500/50 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link 
              href="/auth/signin" 
              className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}