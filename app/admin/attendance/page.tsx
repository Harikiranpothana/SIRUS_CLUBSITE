import Link from "next/link";

export default function AttendancePage() {
  return (
    <main className="attendance-admin-page">
      <section className="attendance-header">
        <div>
          <Link href="/admin" className="attendance-back-link">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="attendance-eyebrow">
            ADMIN / ATTENDANCE
          </span>

          <h1>
            Attendance
            <br />
            <span>Control.</span>
          </h1>

          <p>
            Create attendance sessions, activate dynamic QR verification and
            manage participation records.
          </p>
        </div>

        <div className="attendance-access-badge">
          <span>ACCESS</span>
          <strong>ADMIN ONLY</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="attendance-overview">
        <div className="attendance-stat">
          <span>ACTIVE SESSION</span>
          <strong>—</strong>
          <small>No active session</small>
        </div>

        <div className="attendance-stat">
          <span>TODAY'S ATTENDANCE</span>
          <strong>—</strong>
          <small>Awaiting attendance data</small>
        </div>

        <div className="attendance-stat">
          <span>SESSIONS</span>
          <strong>—</strong>
          <small>Awaiting session data</small>
        </div>

        <div className="attendance-stat">
          <span>RECORDS</span>
          <strong>—</strong>
          <small>Awaiting attendance data</small>
        </div>
      </section>

      {/* Session Control */}
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

            <h3>No active session.</h3>

            <p>
              Create an attendance session for an event or activity. Once
              activated, the system will generate a temporary QR code for
              student verification.
            </p>
          </div>

          <button type="button" className="attendance-create-button">
            CREATE SESSION
            <span>+</span>
          </button>
        </div>
      </section>

      {/* QR Control */}
      <section className="attendance-qr-section">
        <div className="attendance-section-heading compact">
          <span>02 / QR VERIFICATION</span>

          <h2>Dynamic QR.</h2>
        </div>

        <div className="attendance-qr-layout">
          <div className="attendance-qr-placeholder">
            <div className="qr-corner qr-corner-top-left" />
            <div className="qr-corner qr-corner-top-right" />
            <div className="qr-corner qr-corner-bottom-left" />
            <div className="qr-corner qr-corner-bottom-right" />

            <span>QR</span>
            <small>NO ACTIVE SESSION</small>
          </div>

          <div className="attendance-qr-info">
            <span>VERIFICATION WINDOW</span>

            <h3>Temporary access.</h3>

            <p>
              Attendance QR codes will be generated dynamically and will only
              remain valid during the configured attendance window.
            </p>

            <div className="attendance-qr-rules">
              <div>
                <span>GENERATED</span>
                <strong>—</strong>
              </div>

              <div>
                <span>EXPIRES</span>
                <strong>—</strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong>INACTIVE</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance Records */}
      <section className="attendance-records">
        <div className="attendance-section-heading">
          <span>03 / ATTENDANCE DATABASE</span>

          <h2>Records.</h2>
        </div>

        <div className="attendance-record-empty">
          <span>ATTENDANCE RECORDS</span>

          <h3>No attendance records available.</h3>

          <p>
            Student attendance records will appear here after an attendance
            session has been created and students have checked in.
          </p>
        </div>
      </section>

      {/* Workflow */}
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
              An administrator creates an attendance session.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>ACTIVATE</h3>
            <p>
              The attendance session generates a temporary verification QR.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>SCAN</h3>
            <p>
              Students scan the active QR through the S.I.R.U.S. portal.
            </p>
          </div>

          <div>
            <span>04</span>
            <h3>RECORD</h3>
            <p>
              The verified attendance record is stored in the database.
            </p>
          </div>
        </div>
      </section>

      {/* Permission */}
      <section className="attendance-permission">
        <span>ACCESS CONTROL</span>

        <h2>Administrator authority.</h2>

        <p>
          Attendance session creation, QR activation, attendance records and
          attendance corrections are restricted to administrators. Faculty
          accounts cannot manage attendance.
        </p>
      </section>
    </main>
  );
}