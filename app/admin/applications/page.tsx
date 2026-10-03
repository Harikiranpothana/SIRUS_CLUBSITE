import Link from "next/link";

const statusFilters = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "REJECTED",
];

export default function ApplicationsPage() {
  return (
    <main className="admin-subpage">
      <section className="admin-subpage-header">
        <div>
          <Link href="/admin" className="admin-back-link">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="admin-subpage-eyebrow">
            ADMIN / APPLICATIONS
          </span>

          <h1>
            Membership
            <br />
            <span>Applications.</span>
          </h1>

          <p>
            Review student applications and manage the membership onboarding
            process.
          </p>
        </div>

        <div className="admin-access-badge">
          <span>ACCESS</span>
          <strong>ADMIN ONLY</strong>
        </div>
      </section>

      {/* Status overview */}
      <section className="applications-overview">
        <div className="application-stat">
          <span>ALL APPLICATIONS</span>
          <strong>—</strong>
          <small>Awaiting database connection</small>
        </div>

        <div className="application-stat">
          <span>PENDING</span>
          <strong>—</strong>
          <small>Awaiting review</small>
        </div>

        <div className="application-stat">
          <span>ACCEPTED</span>
          <strong>—</strong>
          <small>Approved applications</small>
        </div>

        <div className="application-stat">
          <span>REJECTED</span>
          <strong>—</strong>
          <small>Rejected applications</small>
        </div>
      </section>

      {/* Applications */}
      <section className="applications-section">
        <div className="applications-heading">
          <div>
            <span>01 / APPLICATION DATABASE</span>

            <h2>Applications.</h2>
          </div>

          <span className="database-status">
            DATABASE / NOT CONNECTED
          </span>
        </div>

        {/* Filters */}
        <div className="application-filters">
          {statusFilters.map((status, index) => (
            <button
              key={status}
              type="button"
              className={`application-filter ${
                index === 0 ? "active" : ""
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="applications-empty">
          <div className="empty-index">00</div>

          <div>
            <span>APPLICATION RECORDS</span>

            <h3>No applications available.</h3>

            <p>
              Student applications submitted through the S.I.R.U.S. join
              portal will appear here once the database is connected.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="application-workflow">
        <div className="applications-heading">
          <div>
            <span>02 / ONBOARDING WORKFLOW</span>

            <h2>Review process.</h2>
          </div>
        </div>

        <div className="workflow-grid">
          <div className="workflow-step">
            <span>01</span>
            <h3>APPLY</h3>
            <p>
              A student submits the S.I.R.U.S. membership application.
            </p>
          </div>

          <div className="workflow-step">
            <span>02</span>
            <h3>REVIEW</h3>
            <p>
              An authorized administrator reviews the submitted information.
            </p>
          </div>

          <div className="workflow-step">
            <span>03</span>
            <h3>DECISION</h3>
            <p>
              The administrator accepts or rejects the application.
            </p>
          </div>

          <div className="workflow-step">
            <span>04</span>
            <h3>MEMBER</h3>
            <p>
              Accepted applicants become official S.I.R.U.S. members.
            </p>
          </div>
        </div>
      </section>

      {/* Permission notice */}
      <section className="application-permission">
        <span>ACCESS CONTROL</span>

        <h2>Administrator authority.</h2>

        <p>
          Application decisions are restricted to administrators. Faculty
          accounts will not be permitted to approve, reject or modify
          membership applications.
        </p>
      </section>
    </main>
  );
}