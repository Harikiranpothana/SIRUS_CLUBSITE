import Link from "next/link";

const dashboardSections = [
  {
    number: "01",
    title: "EVENTS",
    description:
      "Explore upcoming S.I.R.U.S. events and register for activities.",
    href: "/dashboard/events",
  },
  {
    number: "02",
    title: "ATTENDANCE",
    description:
      "Check your S.I.R.U.S. attendance using your VTU number.",
    href: "/dashboard/attendance",
  },
];

export default function StudentDashboard() {
  return (
    <main className="student-dashboard">
      {/* Dashboard Header */}
      <section className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            S.I.R.U.S. / STUDENT PORTAL
          </span>

          <h1>
            Student
            <br />
            <span>Portal.</span>
          </h1>

          <p>
            Access S.I.R.U.S. events and check your participation and
            attendance.
          </p>
        </div>

        <div className="dashboard-status">
          <span className="status-dot" />
          <span>PORTAL</span>
          <strong>ACTIVE</strong>
        </div>
      </section>

      {/* Student Access */}
      <section className="dashboard-overview">
        <div className="student-profile-panel">
          <div className="profile-mark">S</div>

          <div>
            <span className="panel-label">STUDENT ACCESS</span>

            <h2>Welcome.</h2>

            <p>
              Use your VTU number to access attendance information and
              participate in S.I.R.U.S. activities.
            </p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-panel">
            <span>EVENTS</span>
            <strong>—</strong>
            <small>Database connected later</small>
          </div>

          <div className="stat-panel">
            <span>ATTENDANCE</span>
            <strong>—</strong>
            <small>Attendance data</small>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="dashboard-workspace">
        <div className="section-heading">
          <span>01 / WORKSPACE</span>

          <h2>
            Your S.I.R.U.S.
            <br />
            workspace.
          </h2>
        </div>

        <div className="dashboard-grid">
          {dashboardSections.map((section) => (
            <Link
              href={section.href}
              key={section.number}
              className="dashboard-module"
            >
              <div className="module-top">
                <span>{section.number}</span>
                <span>↗</span>
              </div>

              <div className="module-content">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="dashboard-events">
        <div className="section-heading compact">
          <span>02 / EVENTS</span>

          <h2>Upcoming events.</h2>
        </div>

        <div className="dashboard-empty-state">
          <div>
            <span>EVENT DATABASE</span>
            <h3>No upcoming events.</h3>
          </div>

          <p>
            Published S.I.R.U.S. events will automatically appear here.
          </p>

          <Link href="/events" className="dashboard-link">
            EXPLORE EVENTS <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Attendance */}
      <section className="dashboard-activity">
        <div className="section-heading compact">
          <span>03 / ATTENDANCE</span>

          <h2>Attendance access.</h2>
        </div>

        <div className="activity-empty">
          <span>VTU NUMBER REQUIRED</span>

          <p>
            Enter your VTU number in the attendance portal to view your
            attendance records.
          </p>

          <Link href="/dashboard/attendance" className="dashboard-link">
            CHECK ATTENDANCE <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="dashboard-footer">
        <span>S.I.R.U.S. / STUDENT PORTAL</span>

        <p>
          Research.
          <br />
          Build.
          <br />
          Innovate.
        </p>
      </section>
    </main>
  );
}