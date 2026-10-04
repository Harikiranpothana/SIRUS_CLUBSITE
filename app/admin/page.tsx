import Link from "next/link";

const adminModules = [
  {
    number: "01",
    title: "MEMBERS",
    description:
      "Review student onboarding requests and manage approved S.I.R.U.S. students.",
    href: "/admin/members",
  },
  {
    number: "02",
    title: "EVENTS",
    description:
      "Create, publish, edit and manage events across the S.I.R.U.S. portal.",
    href: "/admin/events",
  },
  {
    number: "03",
    title: "ATTENDANCE",
    description:
      "Create attendance sessions, generate QR codes and review attendance records.",
    href: "/admin/attendance",
  },
  {
    number: "04",
    title: "GALLERY",
    description:
      "Upload, organize and publish photographs and media from S.I.R.U.S. activities.",
    href: "/admin/gallery",
  },
];

export default function AdminDashboard() {
  return (
    <main className="admin-dashboard">
      {/* Header */}
      <section className="admin-header">
        <div>
          <span className="admin-eyebrow">
            S.I.R.U.S. / ADMINISTRATION
          </span>

          <h1>
            Control
            <br />
            <span>Center.</span>
          </h1>

          <p>
            Manage students, events, attendance and media across the
            S.I.R.U.S. platform.
          </p>
        </div>

        <div className="admin-status">
          <span className="admin-status-dot" />
          <span>ADMIN ACCESS</span>
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
            <span>STUDENTS</span>
            <strong>—</strong>
            <small>Database data</small>
          </div>

          <div className="admin-stat">
            <span>PENDING ONBOARDING</span>
            <strong>—</strong>
            <small>Awaiting approval</small>
          </div>

          <div className="admin-stat">
            <span>EVENTS</span>
            <strong>—</strong>
            <small>Database data</small>
          </div>

          <div className="admin-stat">
            <span>ATTENDANCE</span>
            <strong>—</strong>
            <small>Database data</small>
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
                <span>↗</span>
              </div>

              <div className="admin-module-content">
                <h3>{module.title}</h3>

                <p>{module.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Administrative Access */}
      <section className="admin-access">
        <div className="admin-section-heading">
          <span>03 / ACCESS</span>

          <h2>
            Administrative
            <br />
            control.
          </h2>
        </div>

        <div className="role-grid">
          <div className="role-panel">
            <span>ROLE / ADMIN</span>

            <h3>Authorized management access.</h3>

            <p>
              Administrators can review student onboarding, manage events,
              control attendance sessions and manage published gallery media.
            </p>
          </div>
        </div>
      </section>

      {/* Activity */}
      <section className="admin-activity">
        <div className="admin-section-heading compact">
          <span>04 / ACTIVITY</span>

          <h2>Recent activity.</h2>
        </div>

        <div className="admin-empty">
          <span>SYSTEM ACTIVITY</span>

          <h3>No activity available.</h3>

          <p>
            Administrative activity will appear here once the backend is
            connected.
          </p>
        </div>
      </section>

      {/* Footer */}
      <section className="admin-footer">
        <span>S.I.R.U.S. / ADMINISTRATION</span>

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