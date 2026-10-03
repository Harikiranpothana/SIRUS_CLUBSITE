import Link from "next/link";

const dashboardSections = [
  {
    number: "01",
    title: "EVENTS",
    description: "Discover upcoming S.I.R.U.S. activities and manage your participation.",
    href: "/events",
  },
  {
    number: "02",
    title: "ATTENDANCE",
    description: "Your attendance records and participation history will appear here.",
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
            <span>Dashboard.</span>
          </h1>

          <p>
            Your workspace for research, innovation, collaboration and
            participation within S.I.R.U.S.
          </p>
        </div>

        <div className="dashboard-status">
          <span className="status-dot" />
          <span>PORTAL</span>
          <strong>ACTIVE</strong>
        </div>
      </section>

      {/* Profile / Stats */}
      <section className="dashboard-overview">
        <div className="student-profile-panel">
          <div className="profile-mark">S</div>

          <div>
            <span className="panel-label">MEMBER PROFILE</span>

            <h2>Welcome back.</h2>

            <p>
              Your member information will appear here after authentication
              and onboarding.
            </p>

            <Link href="/dashboard/profile" className="dashboard-link">
              VIEW PROFILE <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-panel">
            <span>CLUB XP</span>
            <strong>—</strong>
            <small>Awaiting activity data</small>
          </div>

          <div className="stat-panel">
            <span>ATTENDANCE</span>
            <strong>—</strong>
            <small>Awaiting attendance data</small>
          </div>

          <div className="stat-panel">
            <span>EVENTS</span>
            <strong>—</strong>
            <small>Participation data</small>
          </div>

          <div className="stat-panel">
            <span>PROJECTS</span>
            <strong>—</strong>
            <small>Project data</small>
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
          <span>02 / ACTIVITY</span>

          <h2>Upcoming events.</h2>
        </div>

        <div className="dashboard-empty-state">
          <div>
            <span>EVENT DATABASE</span>
            <h3>No upcoming events.</h3>
          </div>

          <p>
            Events published by S.I.R.U.S. will automatically appear in your
            dashboard.
          </p>

          <Link href="/events" className="dashboard-link">
            EXPLORE EVENTS <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="dashboard-activity">
        <div className="section-heading compact">
          <span>03 / ACTIVITY LOG</span>

          <h2>Recent activity.</h2>
        </div>

        <div className="activity-empty">
          <span>NO ACTIVITY RECORDED</span>

          <p>
            Your event participation, research activity, project updates and
            other club activity will appear here.
          </p>
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