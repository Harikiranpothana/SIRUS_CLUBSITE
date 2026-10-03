import Link from "next/link";

const eventFilters = ["ALL", "UPCOMING", "PAST"];

export default function StudentEventsPage() {
  return (
    <main className="student-events-page">
      {/* Header */}
      <section className="student-events-header">
        <div>
          <Link href="/dashboard" className="student-events-back">
            ← STUDENT DASHBOARD
          </Link>

          <span className="student-events-eyebrow">
            STUDENT / EVENTS
          </span>

          <h1>
            Club
            <br />
            <span>Events.</span>
          </h1>

          <p>
            Discover published S.I.R.U.S. events, activities and opportunities
            available to members.
          </p>
        </div>

        <div className="student-events-access">
          <span>ACCESS</span>
          <strong>STUDENT</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="student-events-overview">
        <div className="student-events-stat">
          <span>UPCOMING</span>
          <strong>—</strong>
          <small>Awaiting event data</small>
        </div>

        <div className="student-events-stat">
          <span>REGISTERED</span>
          <strong>—</strong>
          <small>Awaiting registration data</small>
        </div>

        <div className="student-events-stat">
          <span>COMPLETED</span>
          <strong>—</strong>
          <small>Awaiting event data</small>
        </div>

        <div className="student-events-stat">
          <span>AVAILABLE</span>
          <strong>—</strong>
          <small>Awaiting event data</small>
        </div>
      </section>

      {/* Events database */}
      <section className="student-events-database">
        <div className="student-events-heading">
          <div>
            <span>01 / EVENT DATABASE</span>

            <h2>Published events.</h2>
          </div>

          <span className="student-events-db-status">
            DATABASE / NOT CONNECTED
          </span>
        </div>

        {/* Filters */}
        <div className="student-events-toolbar">
          <div className="student-events-search">
            <span>SEARCH</span>

            <input
              type="text"
              placeholder="Search events..."
              aria-label="Search events"
            />
          </div>

          <div className="student-events-filters">
            {eventFilters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={`student-event-filter ${
                  index === 0 ? "active" : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        <div className="student-events-empty">
          <div className="student-events-empty-index">00</div>

          <div>
            <span>PUBLISHED EVENTS</span>

            <h3>No events available.</h3>

            <p>
              Events published by S.I.R.U.S. administrators will appear here
              automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="student-events-registration">
        <div className="student-events-heading">
          <div>
            <span>02 / EVENT PARTICIPATION</span>

            <h2>From discovery to participation.</h2>
          </div>
        </div>

        <div className="student-events-registration-grid">
          <div>
            <span>01</span>

            <h3>DISCOVER</h3>

            <p>
              Browse published S.I.R.U.S. events available to members.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>REGISTER</h3>

            <p>
              Register for events that require participant registration.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>PARTICIPATE</h3>

            <p>
              Attend the selected event and participate in the scheduled
              activity.
            </p>
          </div>

          <div>
            <span>04</span>

            <h3>ATTENDANCE</h3>

            <p>
              Attendance can be recorded through the S.I.R.U.S. attendance
              system when enabled for the event.
            </p>
          </div>
        </div>
      </section>

      {/* Event source */}
      <section className="student-events-source">
        <span>EVENT ARCHITECTURE</span>

        <h2>
          One event.
          <br />
          One source.
        </h2>

        <p>
          Student events are read from the same event records managed through
          the S.I.R.U.S. administrator portal. Only events published for
          student visibility will appear here.
        </p>
      </section>
    </main>
  );
}