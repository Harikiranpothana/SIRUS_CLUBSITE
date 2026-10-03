import Link from "next/link";

const adminModules = [
  {
    number: "01",
    title: "APPLICATIONS",
    description:
      "Review and manage student applications to join S.I.R.U.S.",
    href: "/admin/applications",
    adminOnly: true,
  },
  {
    number: "02",
    title: "MEMBERS",
    description:
      "View and manage the registered S.I.R.U.S. member directory.",
    href: "/admin/members",
    adminOnly: false,
  },
  {
    number: "03",
    title: "ATTENDANCE",
    description:
      "Create attendance sessions, manage QR attendance and review records.",
    href: "/admin/attendance",
    adminOnly: true,
  },
  {
    number: "04",
    title: "EVENTS",
    description:
      "Create, edit and manage events displayed across the S.I.R.U.S. portal.",
    href: "/admin/events",
    adminOnly: false,
  },
  {
    number: "05",
    title: "GALLERY",
    description:
      "Upload and manage photographs and media from S.I.R.U.S. activities.",
    href: "/admin/gallery",
    adminOnly: false,
  },

];

export default function AdminDashboard() {
  return (
    <main className="admin-dashboard">
      {/* Header */}
      <section className="admin-header">
        <div>
          <span className="admin-eyebrow">
            S.I.R.U.S. / MANAGEMENT PORTAL
          </span>

          <h1>
            Control
            <br />
            <span>Center.</span>
          </h1>

          <p>
            Manage the systems, activities and member operations that keep
            S.I.R.U.S. moving.
          </p>
        </div>

        <div className="admin-status">
          <span className="admin-status-dot" />
          <span>MANAGEMENT PORTAL</span>
        </div>
      </section>

      {/* System Overview */}
      <section className="admin-overview">
        <div className="admin-overview-heading">
          <span>01 / SYSTEM OVERVIEW</span>

          <h2>
            S.I.R.U.S.
            <br />
            operations.
          </h2>
        </div>

        <div className="admin-overview-grid">
          <div className="admin-stat">
            <span>MEMBERS</span>
            <strong>—</strong>
            <small>Awaiting member data</small>
          </div>

          <div className="admin-stat">
            <span>PENDING APPLICATIONS</span>
            <strong>—</strong>
            <small>Awaiting application data</small>
          </div>

          <div className="admin-stat">
            <span>EVENTS</span>
            <strong>—</strong>
            <small>Awaiting event data</small>
          </div>

          <div className="admin-stat">
            <span>ATTENDANCE</span>
            <strong>—</strong>
            <small>Awaiting attendance data</small>
          </div>
        </div>
      </section>

      {/* Management Modules */}
      <section className="admin-modules">
        <div className="admin-section-heading">
          <span>02 / MANAGEMENT</span>

          <h2>
            Club
            <br />
            systems.
          </h2>
        </div>

        <div className="admin-module-grid">
          {adminModules.map((module) => (
            <Link
              href={module.href}
              key={module.number}
              className="admin-module"
            >
              <div className="admin-module-top">
                <span>{module.number}</span>

                {module.adminOnly ? (
                  <span className="admin-only-label">ADMIN</span>
                ) : (
                  <span>↗</span>
                )}
              </div>

              <div className="admin-module-content">
                <h3>{module.title}</h3>

                <p>{module.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Role Information */}
      <section className="admin-access">
        <div className="admin-section-heading">
          <span>03 / ACCESS CONTROL</span>

          <h2>
            Role-based
            <br />
            operations.
          </h2>
        </div>

        <div className="role-grid">
          <div className="role-panel">
            <span>ROLE / ADMIN</span>

            <h3>Full management access.</h3>

            <p>
              Administrators manage applications, members, attendance,
              events, gallery and club analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Empty Activity */}
      <section className="admin-activity">
        <div className="admin-section-heading compact">
          <span>04 / ACTIVITY</span>

          <h2>Recent activity.</h2>
        </div>

        <div className="admin-empty">
          <span>SYSTEM ACTIVITY</span>

          <h3>No activity available.</h3>

          <p>
            Administrative actions, event updates, application decisions and
            other system activity will appear here once the backend is
            connected.
          </p>
        </div>
      </section>

      {/* Footer */}
      <section className="admin-footer">
        <span>S.I.R.U.S. / MANAGEMENT PORTAL</span>

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