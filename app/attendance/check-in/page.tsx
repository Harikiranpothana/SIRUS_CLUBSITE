"use client";

import { FormEvent, useEffect, useState } from "react";

type SessionInfo = {
  eventTitle: string;
  expiresAt: string;
};

export default function AttendanceCheckInPage() {
  const [token, setToken] = useState("");
  const [vtuId, setVtuId] = useState("");

  const [session, setSession] = useState<SessionInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrToken = params.get("token");

    if (!qrToken) {
      setError("Invalid attendance QR code.");
      setLoading(false);
      return;
    }

    setToken(qrToken);

    fetch(`/api/attendance/check-in?token=${encodeURIComponent(qrToken)}`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Attendance session is unavailable.");
        }

        setSession({
          eventTitle: data.eventTitle,
          expiresAt: data.expiresAt,
        });
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify attendance session.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanVtuId = vtuId.trim();

    if (!cleanVtuId) {
      setError("Enter your VTU ID.");
      return;
    }

    setCheckingIn(true);

    try {
      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          vtuId: cleanVtuId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Attendance check-in failed.");
      }

      setSuccess(data.message || "Attendance recorded successfully.");
      setVtuId("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to record attendance.",
      );
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <main className="attendance-checkin-page">
        <section className="attendance-checkin-card">
          <span className="attendance-checkin-eyebrow">
            S.I.R.U.S. / ATTENDANCE
          </span>

          <h1>
            Verifying
            <br />
            <span>session.</span>
          </h1>

          <p>Checking the attendance session.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="attendance-checkin-page">
      <section className="attendance-checkin-card">
        <span className="attendance-checkin-eyebrow">
          S.I.R.U.S. / ATTENDANCE
        </span>

        <h1>
          Attendance
          <br />
          <span>Check-in.</span>
        </h1>

        {session && !success && (
          <>
            <div className="attendance-checkin-event">
              <span>EVENT</span>
              <strong>{session.eventTitle}</strong>
            </div>

            <p>
              Enter your VTU ID to verify your identity and record your
              attendance for this session.
            </p>

            <form onSubmit={handleSubmit}>
              <label>
                <span>VTU ID</span>

                <input
                  type="text"
                  value={vtuId}
                  onChange={(event) => setVtuId(event.target.value)}
                  placeholder="ENTER VTU ID"
                  autoComplete="off"
                />
              </label>

              <button type="submit" disabled={checkingIn}>
                {checkingIn ? "VERIFYING..." : "MARK ATTENDANCE"}
                <span>→</span>
              </button>
            </form>
          </>
        )}

        {error && (
          <div className="attendance-checkin-error">
            <strong>ATTENDANCE ERROR</strong>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="attendance-checkin-success">
            <strong>ATTENDANCE RECORDED</strong>
            <p>{success}</p>
          </div>
        )}
      </section>
    </main>
  );
}