import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-container">
        <Link href="/" className="login-brand">
          S.I.R.U.S.
        </Link>

        <div className="login-heading">
          <span className="page-label">MEMBER ACCESS</span>

          <h1>
            Welcome
            <br />
            <em>back.</em>
          </h1>
        </div>

        <form className="login-form">
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>

          <button type="submit">
            Sign in
            <span>↗</span>
          </button>
        </form>

        <p className="login-note">
          Authentication will be connected to the S.I.R.U.S. backend
          later.
        </p>
      </div>
    </main>
  );
}