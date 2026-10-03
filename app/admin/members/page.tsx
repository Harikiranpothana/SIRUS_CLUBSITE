import Link from "next/link";

const memberFilters = ["ALL", "ACTIVE", "INACTIVE"];

export default function MembersPage() {
  return (
    <main className="members-admin-page">
      <section className="members-header">
        <div>
          <Link href="/admin" className="members-back-link">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="members-eyebrow">
            ADMIN / MEMBERS
          </span>

          <h1>
            Member
            <br />
            <span>Directory.</span>
          </h1>

          <p>
            View the official S.I.R.U.S. member directory and manage member
            status and access information.
          </p>
        </div>

        <div className="members-access-badge">
          <span>ACCESS</span>
          <strong>ADMIN</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="members-overview">
        <div className="member-stat">
          <span>TOTAL MEMBERS</span>
          <strong>—</strong>
          <small>Awaiting member data</small>
        </div>

        <div className="member-stat">
          <span>ACTIVE MEMBERS</span>
          <strong>—</strong>
          <small>Awaiting member data</small>
        </div>

        <div className="member-stat">
          <span>INACTIVE MEMBERS</span>
          <strong>—</strong>
          <small>Awaiting member data</small>
        </div>

        <div className="member-stat">
          <span>NEW MEMBERS</span>
          <strong>—</strong>
          <small>Awaiting member data</small>
        </div>
      </section>

      {/* Directory */}
      <section className="members-directory">
        <div className="members-section-heading">
          <div>
            <span>01 / MEMBER DATABASE</span>

            <h2>Directory.</h2>
          </div>

          <span className="members-database-status">
            DATABASE / NOT CONNECTED
          </span>
        </div>

        {/* Search / filters */}
        <div className="members-toolbar">
          <div className="members-search">
            <span>SEARCH</span>

            <input
              type="text"
              placeholder="Search members..."
              aria-label="Search members"
            />
          </div>

          <div className="members-filters">
            {memberFilters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={`member-filter ${
                  index === 0 ? "active" : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        <div className="members-empty">
          <div className="members-empty-index">00</div>

          <div>
            <span>MEMBER RECORDS</span>

            <h3>No members available.</h3>

            <p>
              Students accepted through the membership application process
              will appear in the official member directory.
            </p>
          </div>
        </div>
      </section>

      {/* Member lifecycle */}
      <section className="member-lifecycle">
        <div className="members-section-heading">
          <div>
            <span>02 / MEMBER LIFECYCLE</span>

            <h2>From applicant to member.</h2>
          </div>
        </div>

        <div className="member-lifecycle-grid">
          <div>
            <span>01</span>

            <h3>APPLICATION</h3>

            <p>
              A student submits a membership application through the public
              S.I.R.U.S. portal.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>REVIEW</h3>

            <p>
              An administrator reviews the submitted application.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>ACCEPTANCE</h3>

            <p>
              An accepted applicant becomes an official S.I.R.U.S. member.
            </p>
          </div>

          <div>
            <span>04</span>

            <h3>MEMBERSHIP</h3>

            <p>
              The member receives access to the student portal and club
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Access */}
      <section className="members-permissions">
        <span>ACCESS CONTROL</span>

        <h2>Administrator member management.</h2>

        <div className="member-permission-grid">
          <div>
            <span>ADMIN</span>

            <p>
              Administrators can view the member directory and manage member
              status, access and membership information.
            </p>
          </div>

          <div>
            <span>STUDENT</span>

            <p>
              Students can access their own membership information through the
              student portal.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}