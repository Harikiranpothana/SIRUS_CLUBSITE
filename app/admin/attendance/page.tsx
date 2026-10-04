/* Full replacement for app/admin/attendance/page.tsx */

"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";

type Event = {
  id: string;
  title: string;
  event_date: string;
  start_time: string;
  status: string;
};

type AttendanceSession = {
  id: string;
  event_id: string | null;
  session_type: "regular" | "event";
  session_token_hash: string;
  starts_at: string;
  expires_at: string;
  status: "scheduled" | "active" | "expired" | "closed" | "cancelled";
  created_at: string;
  closed_at: string | null;
};

type AttendanceRecord = {
  id: string;
  student_id: string;
  checked_in_at: string;
  method: "qr" | "admin" | "manual";
  status: "present" | "voided";
  students:
    | {
        vtu_id: string;
        name: string;
        phone: string;
        year_of_study: number;
      }[]
    | null;
};

const supabase = createClient();

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(value: string) {
  const encoded = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function AttendancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const [sessionType, setSessionType] =
    useState<"regular" | "event">("regular");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [activeSession, setActiveSession] =
    useState<AttendanceSession | null>(null);
  const [qrToken, setQrToken] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");

  const loadEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("events")
      .select("id,title,event_date,start_time,status")
      .eq("status", "published")
      .order("event_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setEvents(data ?? []);
  }, []);

  const loadSessions = useCallback(async () => {
    const { data, error } = await supabase
      .from("attendance_sessions")
      .select(
        "id,event_id,session_type,session_token_hash,starts_at,expires_at,status,created_at,closed_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    const loadedSessions = (data ?? []) as AttendanceSession[];
    setSessions(loadedSessions);

    const currentActive = loadedSessions.find(
      (session) =>
        session.status === "active" &&
        new Date(session.expires_at).getTime() > Date.now(),
    );

    if (currentActive) {
      setActiveSession(currentActive);

      if (currentActive.session_type === "event") {
        setSessionType("event");
        setSelectedEventId(currentActive.event_id ?? "");
      } else {
        setSessionType("regular");
        setSelectedEventId("");
      }
    } else {
      setActiveSession(null);
      setQrToken("");
    }
  }, []);

  const loadRecords = useCallback(async () => {
    const { data, error } = await supabase
      .from("attendance_records")
      .select(
        `
        id,
        student_id,
        checked_in_at,
        method,
        status,
        students (
          vtu_id,
          name,
          phone,
          year_of_study
        )
      `,
      )
      .eq("status", "present")
      .order("checked_in_at", { ascending: false })
      .limit(100);

    if (error) {
      setError(error.message);
      return;
    }

    setRecords((data as AttendanceRecord[]) ?? []);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");

    await Promise.all([loadEvents(), loadSessions(), loadRecords()]);

    setLoading(false);
  }, [loadEvents, loadSessions, loadRecords]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeSession?.event_id) ?? null,
    [events, activeSession],
  );

  const todayAttendance = useMemo(() => {
    const today = new Date();

    return records.filter((record) => {
      const date = new Date(record.checked_in_at);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [records]);

  const createSession = async () => {
    if (sessionType === "event" && !selectedEventId) {
      setError("Select an event before creating an event attendance session.");
      return;
    }

    if (activeSession) {
      setError("An attendance session is already active.");
      return;
    }

    const duration = Number(durationMinutes);

    if (!Number.isInteger(duration) || duration < 1 || duration > 240) {
      setError("Session duration must be between 1 and 240 minutes.");
      return;
    }

    setCreating(true);
    setError("");
    setMessage("");

    try {
      const rawToken = generateToken();
      const tokenHash = await sha256(rawToken);
      const startsAt = new Date();
      const expiresAt = new Date(
        startsAt.getTime() + duration * 60 * 1000,
      );

      const { data, error } = await supabase
        .from("attendance_sessions")
        .insert({
          event_id: sessionType === "event" ? selectedEventId : null,
          session_type: sessionType,
          session_token_hash: tokenHash,
          starts_at: startsAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          status: "active",
        })
        .select(
          "id,event_id,session_type,session_token_hash,starts_at,expires_at,status,created_at,closed_at",
        )
        .single();

      if (error) throw new Error(error.message);

      setActiveSession(data as AttendanceSession);
      setQrToken(rawToken);
      setMessage(
        sessionType === "regular"
          ? "Regular attendance session created successfully."
          : "Event attendance session created successfully.",
      );

      await loadSessions();

      // loadSessions intentionally cannot recover the raw QR token because
      // only its hash is stored in the database.
      setActiveSession(data as AttendanceSession);
      setQrToken(rawToken);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create attendance session.",
      );
    } finally {
      setCreating(false);
    }
  };

  const closeSession = async () => {
    if (!activeSession) return;

    if (
      !window.confirm(
        "Close this attendance session? Students will no longer be able to check in.",
      )
    ) {
      return;
    }

    setClosing(true);
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("attendance_sessions")
      .update({
        status: "closed",
        closed_at: new Date().toISOString(),
      })
      .eq("id", activeSession.id);

    if (error) {
      setError(error.message);
      setClosing(false);
      return;
    }

    setActiveSession(null);
    setQrToken("");
    setMessage("Attendance session closed.");

    await loadSessions();
    setClosing(false);
  };

  const qrUrl =
    typeof window !== "undefined" && qrToken
      ? `${window.location.origin}/attendance/check-in?token=${qrToken}`
      : "";

  if (loading) {
    return (
      <main className="attendance-admin-page">
        <section className="attendance-header">
          <div>
            <Link href="/admin" className="attendance-back-link">
              ← MANAGEMENT PORTAL
            </Link>
            <span className="attendance-eyebrow">ADMIN / ATTENDANCE</span>
            <h1>
              Attendance
              <br />
              <span>Control.</span>
            </h1>
          </div>

          <div className="attendance-access-badge">
            <span>ACCESS</span>
            <strong>ADMIN ONLY</strong>
          </div>
        </section>

        <div className="attendance-record-empty">
          <span>ATTENDANCE DATABASE</span>
          <h3>Loading attendance data.</h3>
          <p>Connecting to the S.I.R.U.S. database.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="attendance-admin-page">
      <section className="attendance-header">
        <div>
          <Link href="/admin" className="attendance-back-link">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="attendance-eyebrow">ADMIN / ATTENDANCE</span>

          <h1>
            Attendance
            <br />
            <span>Control.</span>
          </h1>

          <p>
            Create regular or event attendance sessions, activate dynamic QR
            verification and manage participation records.
          </p>
        </div>

        <div className="attendance-access-badge">
          <span>ACCESS</span>
          <strong>ADMIN ONLY</strong>
        </div>
      </section>

      {error && (
        <section className="attendance-message attendance-message-error">
          <strong>ERROR</strong>
          <span>{error}</span>
        </section>
      )}

      {message && (
        <section className="attendance-message attendance-message-success">
          <strong>SUCCESS</strong>
          <span>{message}</span>
        </section>
      )}

      <section className="attendance-overview">
        <div className="attendance-stat">
          <span>ACTIVE SESSION</span>
          <strong>{activeSession ? "01" : "00"}</strong>
          <small>
            {activeSession ? "Session currently active" : "No active session"}
          </small>
        </div>

        <div className="attendance-stat">
          <span>TODAY&apos;S ATTENDANCE</span>
          <strong>{todayAttendance}</strong>
          <small>Present records today</small>
        </div>

        <div className="attendance-stat">
          <span>SESSIONS</span>
          <strong>{sessions.length}</strong>
          <small>Total attendance sessions</small>
        </div>

        <div className="attendance-stat">
          <span>RECORDS</span>
          <strong>{records.length}</strong>
          <small>Latest attendance records</small>
        </div>
      </section>

      <section className="attendance-control">
        <div className="attendance-section-heading">
          <span>01 / SESSION CONTROL</span>
          <h2>
            Attendance
            <br />
            session.
          </h2>
        </div>

        <div className="attendance-control-panel">
          <div className="attendance-control-info">
            <span>SESSION STATUS</span>

            {activeSession ? (
              <>
                <h3>Session active.</h3>

                <p>
                  {activeSession.session_type === "regular"
                    ? "Regular S.I.R.U.S. attendance is currently accepting check-ins through the active verification window."
                    : `${activeEvent?.title ?? "Selected event"} is currently accepting attendance through the active verification window.`}
                </p>

                <div className="attendance-session-meta">
                  <div>
                    <span>TYPE</span>
                    <strong>
                      {activeSession.session_type === "regular"
                        ? "REGULAR"
                        : "EVENT"}
                    </strong>
                  </div>

                  <div>
                    <span>EVENT</span>
                    <strong>
                      {activeSession.session_type === "event"
                        ? activeEvent?.title ?? "Unknown event"
                        : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>STARTED</span>
                    <strong>{formatDateTime(activeSession.starts_at)}</strong>
                  </div>

                  <div>
                    <span>EXPIRES</span>
                    <strong>{formatDateTime(activeSession.expires_at)}</strong>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3>No active session.</h3>

                <p>
                  Create either a regular club attendance session or an event
                  attendance session. The session will immediately become
                  active.
                </p>

                <div className="attendance-session-form">
                  <label>
                    <span>SESSION TYPE</span>
                    <select
                      value={sessionType}
                      onChange={(event) => {
                        const value = event.target.value as
                          | "regular"
                          | "event";

                        setSessionType(value);

                        if (value === "regular") {
                          setSelectedEventId("");
                        }
                      }}
                    >
                      <option value="regular">REGULAR ATTENDANCE</option>
                      <option value="event">EVENT ATTENDANCE</option>
                    </select>
                  </label>

                  {sessionType === "event" && (
                    <label>
                      <span>EVENT</span>
                      <select
                        value={selectedEventId}
                        onChange={(event) =>
                          setSelectedEventId(event.target.value)
                        }
                      >
                        <option value="">SELECT EVENT</option>

                        {events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title} — {formatDate(event.event_date)}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label>
                    <span>DURATION</span>
                    <select
                      value={durationMinutes}
                      onChange={(event) =>
                        setDurationMinutes(event.target.value)
                      }
                    >
                      <option value="15">15 MINUTES</option>
                      <option value="30">30 MINUTES</option>
                      <option value="45">45 MINUTES</option>
                      <option value="60">60 MINUTES</option>
                      <option value="90">90 MINUTES</option>
                      <option value="120">120 MINUTES</option>
                    </select>
                  </label>
                </div>
              </>
            )}
          </div>

          {activeSession ? (
            <button
              type="button"
              className="attendance-create-button"
              onClick={closeSession}
              disabled={closing}
            >
              {closing ? "CLOSING..." : "CLOSE SESSION"}
              <span>×</span>
            </button>
          ) : (
            <button
              type="button"
              className="attendance-create-button"
              onClick={createSession}
              disabled={
                creating ||
                (sessionType === "event" && !selectedEventId)
              }
            >
              {creating ? "CREATING..." : "CREATE SESSION"}
              <span>+</span>
            </button>
          )}
        </div>
      </section>

      <section className="attendance-qr-section">
        <div className="attendance-section-heading compact">
          <span>02 / QR VERIFICATION</span>
          <h2>Dynamic QR.</h2>
        </div>

        <div className="attendance-qr-layout">
          <div className="attendance-qr-placeholder">
            {activeSession && qrUrl ? (
              <QRCodeSVG
                value={qrUrl}
                size={260}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            ) : (
              <>
                <div className="qr-corner qr-corner-top-left" />
                <div className="qr-corner qr-corner-top-right" />
                <div className="qr-corner qr-corner-bottom-left" />
                <div className="qr-corner qr-corner-bottom-right" />
                <span>QR</span>
                <small>NO ACTIVE SESSION</small>
              </>
            )}
          </div>

          <div className="attendance-qr-info">
            <span>VERIFICATION WINDOW</span>

            <h3>
              {activeSession
                ? "Attendance is active."
                : "Temporary access."}
            </h3>

            <p>
              {activeSession
                ? "Students can scan this QR code during the active verification window."
                : "Attendance QR codes are generated dynamically and remain valid only during the configured session window."}
            </p>

            <div className="attendance-qr-rules">
              <div>
                <span>TYPE</span>
                <strong>
                  {activeSession
                    ? activeSession.session_type === "regular"
                      ? "REGULAR"
                      : "EVENT"
                    : "—"}
                </strong>
              </div>

              <div>
                <span>GENERATED</span>
                <strong>
                  {activeSession
                    ? formatDateTime(activeSession.starts_at)
                    : "—"}
                </strong>
              </div>

              <div>
                <span>EXPIRES</span>
                <strong>
                  {activeSession
                    ? formatDateTime(activeSession.expires_at)
                    : "—"}
                </strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong>{activeSession ? "ACTIVE" : "INACTIVE"}</strong>
              </div>
            </div>

            {activeSession && (
              <div className="attendance-qr-note">
                <span>
                  {activeSession.session_type === "regular"
                    ? "SESSION"
                    : "ACTIVE EVENT"}
                </span>
                <strong>
                  {activeSession.session_type === "regular"
                    ? "Regular S.I.R.U.S. Attendance"
                    : activeEvent?.title ?? "Unknown event"}
                </strong>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="attendance-records">
        <div className="attendance-section-heading">
          <span>03 / ATTENDANCE DATABASE</span>
          <h2>Records.</h2>
        </div>

        {records.length === 0 ? (
          <div className="attendance-record-empty">
            <span>ATTENDANCE RECORDS</span>
            <h3>No attendance records available.</h3>
            <p>
              Student attendance records will appear here after students
              successfully check in.
            </p>
          </div>
        ) : (
          <div className="attendance-record-list">
            {records.map((record, index) => (
              <div className="attendance-record" key={record.id}>
                <span className="attendance-record-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <span>STUDENT</span>
                  <h3>
                    {record.students?.[0]?.name ?? "Unknown student"}
                  </h3>
                </div>

                <div>
                  <span>VTU ID</span>
                  <strong>{record.students?.[0]?.vtu_id ?? "—"}</strong>
                </div>

                <div>
                  <span>YEAR</span>
                  <strong>
                    {record.students?.[0]?.year_of_study ?? "—"}
                  </strong>
                </div>

                <div>
                  <span>CHECKED IN</span>
                  <strong>{formatDateTime(record.checked_in_at)}</strong>
                </div>

                <div>
                  <span>METHOD</span>
                  <strong>{record.method.toUpperCase()}</strong>
                </div>

                <div>
                  <span>STATUS</span>
                  <strong className="attendance-present-status">
                    {record.status.toUpperCase()}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="attendance-workflow">
        <div className="attendance-section-heading">
          <span>04 / SYSTEM WORKFLOW</span>
          <h2>
            How attendance
            <br />
            works.
          </h2>
        </div>

        <div className="attendance-workflow-grid">
          <div>
            <span>01</span>
            <h3>CREATE</h3>
            <p>
              An administrator creates either a regular club attendance
              session or an event attendance session.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>ACTIVATE</h3>
            <p>
              The system creates a temporary verification token and QR code.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>SCAN</h3>
            <p>
              Students scan the active QR and verify themselves using their
              VTU ID.
            </p>
          </div>

          <div>
            <span>04</span>
            <h3>RECORD</h3>
            <p>
              Verified attendance is stored against the active session.
            </p>
          </div>
        </div>
      </section>

      <section className="attendance-permission">
        <span>ACCESS CONTROL</span>
        <h2>Administrator authority.</h2>
        <p>
          Attendance session creation, QR activation, session closure and
          attendance management are restricted to administrators.
        </p>
      </section>
    </main>
  );
}
