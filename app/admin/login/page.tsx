"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError("Invalid administrator email or password.");
      return;
    }

    const role = data.user?.app_metadata?.role;

    if (role !== "admin") {
      await supabase.auth.signOut();

      setLoading(false);
      setError("This account is not authorized for administration.");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <Link href="/" className="login-brand">
          S.I.R.U.S.
        </Link>

        <div className="login-heading">
          <span className="page-label">ADMINISTRATION</span>

          <h1>
            Admin
            <br />
            <em>access.</em>
          </h1>

          <p className="login-description">
            Sign in to manage S.I.R.U.S. students, events, attendance,
            and gallery content.
          </p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label>
            Admin Email

            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />
          </label>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in as admin"}
            <span>↗</span>
          </button>
        </form>

        <div className="login-security-note">
          <span>AUTHORIZED ACCESS ONLY</span>

          <p>
            This area is restricted to authorized S.I.R.U.S. administrators.
          </p>
        </div>
      </div>
    </main>
  );
}