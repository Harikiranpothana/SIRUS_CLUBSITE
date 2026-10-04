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
            Check in to active S.I.R.U.S. attendance sessions and view
            attendance records associated with your VTU number.
          </p>
        </div>

        <div className="student-attendance-status">
          <span>SESSION STATUS</span>
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

      {/* Student identification */}
      <section className="student-attendance-session">
        <div className="student-attendance-heading">
          <div>
            <span>01 / STUDENT IDENTIFICATION</span>

            <h2>Enter your VTU number.</h2>
          </div>

          <span className="student-attendance-db-status">
            DATABASE / NOT CONNECTED
          </span>
        </div>

        <div className="student-attendance-checkin">
          <div className="student-attendance-checkin-index">
            00
          </div>

          <div>
            <span>VTU IDENTIFICATION</span>

            <h3>Attendance is linked to your VTU number.</h3>

            <p>
              Enter your VTU number before checking in. The system will verify
              the student record and the active attendance session before
              recording attendance.
            </p>

            <label className="student-attendance-vtu-field">
              VTU NUMBER
              <input
                type="text"
                name="vtu_id"
                placeholder="Enter VTU number"
                inputMode="numeric"
                autoComplete="off"
              />
            </label>

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
              Enter your VTU number to retrieve attendance information after
              the attendance system is connected.
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