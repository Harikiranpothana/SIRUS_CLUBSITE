import Link from "next/link";

export default function StudentAttendancePage() {
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
            View your attendance records and participate in active S.I.R.U.S.
            attendance sessions.
          </p>
        </div>

        <div className="student-attendance-status">
          <span>STATUS</span>
          <strong>NO ACTIVE SESSION</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="student-attendance-overview">
        <div className="student-attendance-stat">
          <span>ATTENDANCE</span>
          <strong>—</strong>
          <small>Awaiting attendance data</small>
        </div>

        <div className="student-attendance-stat">
          <span>SESSIONS</span>
          <strong>—</strong>
          <small>Awaiting attendance data</small>
        </div>

        <div className="student-attendance-stat">
          <span>PRESENT</span>
          <strong>—</strong>
          <small>Awaiting attendance data</small>
        </div>

        <div className="student-attendance-stat">
          <span>ABSENT</span>
          <strong>—</strong>
          <small>Awaiting attendance data</small>
        </div>
      </section>

      {/* Active attendance */}
      <section className="student-attendance-session">
        <div className="student-attendance-heading">
          <div>
            <span>01 / ACTIVE SESSION</span>

            <h2>Attendance check-in.</h2>
          </div>

          <span className="student-attendance-db-status">
            SESSION / NOT CONNECTED
          </span>
        </div>

        <div className="student-attendance-checkin">
          <div className="student-attendance-checkin-index">
            00
          </div>

          <div>
            <span>NO ACTIVE SESSION</span>

            <h3>There is no attendance session available.</h3>

            <p>
              When an administrator starts an attendance session, the
              check-in option will become available here.
            </p>

            <button
              type="button"
              className="student-attendance-scan-button"
              disabled
            >
              SCAN ATTENDANCE QR
              <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* Attendance history */}
      <section className="student-attendance-history">
        <div className="student-attendance-heading">
          <div>
            <span>02 / ATTENDANCE HISTORY</span>

            <h2>Your records.</h2>
          </div>

          <span className="student-attendance-db-status">
            DATABASE / NOT CONNECTED
          </span>
        </div>

        <div className="student-attendance-empty">
          <div className="student-attendance-empty-index">
            00
          </div>

          <div>
            <span>ATTENDANCE RECORDS</span>

            <h3>No attendance records available.</h3>

            <p>
              Your attendance history will appear here after the attendance
              system is connected.
            </p>
          </div>
        </div>
      </section>

      {/* Attendance workflow */}
      <section className="student-attendance-workflow">
        <div className="student-attendance-heading">
          <div>
            <span>03 / CHECK-IN WORKFLOW</span>

            <h2>How attendance works.</h2>
          </div>
        </div>

        <div className="student-attendance-workflow-grid">
          <div>
            <span>01</span>

            <h3>SESSION</h3>

            <p>
              An administrator starts an attendance session for a club
              activity or event.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>QR CODE</h3>

            <p>
              A temporary attendance QR code is generated for the active
              session.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>CHECK-IN</h3>

            <p>
              The student scans the active QR code through the S.I.R.U.S.
              portal.
            </p>
          </div>

          <div>
            <span>04</span>

            <h3>RECORD</h3>

            <p>
              The attendance record is stored and becomes part of the
              student's attendance history.
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
          Attendance will be tied to authenticated student accounts and
          administrator-created sessions. The system will validate the active
          session before recording attendance.
        </p>
      </section>
    </main>
  );
}