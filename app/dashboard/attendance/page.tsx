"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AttendanceRecord = {
  id: string;
  eventTitle: string;
  eventDate: string;
  startTime: string;
  location: string | null;
  checkedInAt: string;
  method: "qr" | "admin" | "manual";
  status: "present" | "voided";
};

type AttendanceResponse = {
  student: {
    name: string;
    vtuId: string;
  };
  statistics: {
    sessions: number;
    present: number;
    absent: number;
    attendancePercentage: number;
  };
  attendance: AttendanceRecord[];
};

export default function StudentAttendancePage() {
  const [vtuId, setVtuId] = useState("");
  const [data, setData] = useState<AttendanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanVtuId = vtuId.trim();

    setError("");
    setData(null);

    if (!cleanVtuId) {
      setError("Enter your VTU number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/attendance/student?vtuId=${encodeURIComponent(cleanVtuId)}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to retrieve attendance information."
        );
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve attendance information."
      );
    } finally {
      setLoading(false);
    }
  }

  const statistics = data?.statistics;

  return (
    <main className="student-attendance-page">
      {/* Header */}
      <section className="student-attendance-header">
        <div>
          <Link href="/dashboard" className="student-attendance-back">
            ← STUDENT DASHBOARD
          </Link>

          <span className="student-attendance-eyebrow">
            STUDENT / ATTENDANCE
          </span>

          <h1>
            Attendance
            <br />
            <span>Portal.</span>
          </h1>

          <p>
            Check in to active S.I.R.U.S. attendance sessions and view
            attendance records associated with your VTU number.
          </p>
        </div>

        <div className="student-attendance-status">
          <span>SESSION STATUS</span>
          <strong>QR CHECK-IN ACTIVE</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="student-attendance-overview">
        <div className="student-attendance-stat">
          <span>ATTENDANCE</span>
          <strong>
            {statistics ? `${statistics.attendancePercentage}%` : "—"}
          </strong>
          <small>
            {statistics
              ? "Attendance percentage"
              : "Enter VTU number to retrieve"}
          </small>
        </div>

        <div className="student-attendance-stat">
          <span>SESSIONS</span>
          <strong>{statistics ? statistics.sessions : "—"}</strong>
          <small>
            {statistics ? "Recorded sessions" : "Awaiting attendance data"}
          </small>
        </div>

        <div className="student-attendance-stat">
          <span>PRESENT</span>
          <strong>{statistics ? statistics.present : "—"}</strong>
          <small>
            {statistics ? "Sessions attended" : "Awaiting attendance data"}
          </small>
        </div>

        <div className="student-attendance-stat">
          <span>ABSENT</span>
          <strong>{statistics ? statistics.absent : "—"}</strong>
          <small>
            {statistics ? "Recorded absences" : "Awaiting attendance data"}
          </small>
        </div>
      </section>

      {/* Student identification */}
      <section className="student-attendance-session">
        <div className="student-attendance-heading">
          <div>
            <span>01 / STUDENT IDENTIFICATION</span>

            <h2>Enter your VTU number.</h2>
          </div>

          <span className="student-attendance-db-status">
            DATABASE / CONNECTED
          </span>
        </div>

        <div className="student-attendance-checkin">
          <div className="student-attendance-checkin-index">
            00
          </div>

          <div>
            <span>VTU IDENTIFICATION</span>

            <h3>
              {data
                ? `Welcome, ${data.student.name}.`
                : "Attendance is linked to your VTU number."}
            </h3>

            <p>
              Enter your VTU number to retrieve your attendance records.
              Attendance check-in is completed through the active session QR
              code.
            </p>

            <form onSubmit={handleLookup}>
              <label className="student-attendance-vtu-field">
                VTU NUMBER

                <input
                  type="text"
                  name="vtu_id"
                  value={vtuId}
                  onChange={(event) => setVtuId(event.target.value)}
                  placeholder="Enter VTU number"
                  inputMode="numeric"
                  autoComplete="off"
                  disabled={loading}
                />
              </label>

              <button
                type="submit"
                className="student-attendance-scan-button"
                disabled={loading}
              >
                {loading ? "VERIFYING..." : "VIEW ATTENDANCE"}
                <span>↗</span>
              </button>
            </form>

            {error && (
              <div className="student-attendance-error">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QR check-in */}
      <section className="student-attendance-session">
        <div className="student-attendance-heading">
          <div>
            <span>02 / LIVE CHECK-IN</span>

            <h2>Scan an active session.</h2>
          </div>
        </div>

        <div className="student-attendance-empty">
          <div className="student-attendance-empty-index">
            01
          </div>

          <div>
            <span>QR ATTENDANCE</span>

            <h3>Have an active attendance QR code?</h3>

            <p>
              Scan the QR code displayed by the S.I.R.U.S. administrator.
              Your VTU number will be verified before attendance is recorded.
            </p>

            <Link
              href="/attendance/check-in"
              className="student-attendance-scan-button"
            >
              OPEN CHECK-IN
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Attendance history */}
      <section className="student-attendance-history">
        <div className="student-attendance-heading">
          <div>
            <span>03 / ATTENDANCE HISTORY</span>

            <h2>Your records.</h2>
          </div>

          <span className="student-attendance-db-status">
            DATABASE / CONNECTED
          </span>
        </div>

        {!data ? (
          <div className="student-attendance-empty">
            <div className="student-attendance-empty-index">
              00
            </div>

            <div>
              <span>ATTENDANCE RECORDS</span>

              <h3>No student selected.</h3>

              <p>
                Enter your VTU number above to retrieve your attendance
                information.
              </p>
            </div>
          </div>
        ) : data.attendance.length === 0 ? (
          <div className="student-attendance-empty">
            <div className="student-attendance-empty-index">
              00
            </div>

            <div>
              <span>ATTENDANCE RECORDS</span>

              <h3>No attendance records found.</h3>

              <p>
                No attendance has been recorded for this student yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="student-attendance-records">
            {data.attendance.map((record, index) => (
              <article
                key={record.id}
                className="student-attendance-record"
              >
                <div className="student-attendance-record-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="student-attendance-record-main">
                  <span>EVENT</span>

                  <h3>{record.eventTitle}</h3>

                  <p>
                    {formatEventDate(record.eventDate)} ·{" "}
                    {formatTime(record.startTime)}
                    {record.location
                      ? ` · ${record.location}`
                      : ""}
                  </p>
                </div>

                <div className="student-attendance-record-meta">
                  <span>CHECKED IN</span>

                  <strong>
                    {formatDateTime(record.checkedInAt)}
                  </strong>

                  <small>
                    {record.method.toUpperCase()} /{" "}
                    {record.status.toUpperCase()}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Attendance workflow */}
      <section className="student-attendance-workflow">
        <div className="student-attendance-heading">
          <div>
            <span>04 / CHECK-IN WORKFLOW</span>

            <h2>How attendance works.</h2>
          </div>
        </div>

        <div className="student-attendance-workflow-grid">
          <div>
            <span>01</span>

            <h3>SESSION</h3>

            <p>
              An administrator creates and activates an attendance session for
              an S.I.R.U.S. event or activity.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>QR CODE</h3>

            <p>
              A temporary QR code is generated for the active attendance
              session.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>VERIFY</h3>

            <p>
              The student provides their VTU number and scans the active QR
              code to request attendance.
            </p>
          </div>

          <div>
            <span>04</span>

            <h3>RECORD</h3>

            <p>
              The system validates the session, student and duplicate check-in
              before recording attendance.
            </p>
          </div>
        </div>
      </section>

      {/* System note */}
      <section className="student-attendance-note">
        <span>ATTENDANCE SYSTEM</span>

        <h2>
          One session.
          <br />
          One record.
        </h2>

        <p>
          Attendance is identified using the student's VTU number. An active
          administrator-created session must be valid before a check-in is
          recorded, and duplicate attendance for the same session is
          prevented.
        </p>
      </section>
    </main>
  );
}

function formatEventDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}