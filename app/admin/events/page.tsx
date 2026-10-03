import Link from "next/link";

const eventFilters = ["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"];

export default function EventsManagerPage() {
  return (
    <main className="events-manager-page">
      {/* Header */}
      <section className="events-manager-header">
        <div>
          <Link href="/admin" className="events-manager-back">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="events-manager-eyebrow">
            MANAGEMENT / EVENTS
          </span>

          <h1>
            Event
            <br />
            <span>Manager.</span>
          </h1>

          <p>
            Create and manage S.I.R.U.S. events, activities, workshops,
            challenges and other club programs.
          </p>
        </div>

        <div className="events-manager-access">
          <span>ACCESS</span>
          <strong>ADMIN</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="events-manager-overview">
        <div className="event-manager-stat">
          <span>TOTAL EVENTS</span>
          <strong>—</strong>
          <small>Awaiting event data</small>
        </div>

        <div className="event-manager-stat">
          <span>DRAFTS</span>
          <strong>—</strong>
          <small>Awaiting event data</small>
        </div>

        <div className="event-manager-stat">
          <span>PUBLISHED</span>
          <strong>—</strong>
          <small>Awaiting event data</small>
        </div>

        <div className="event-manager-stat">
          <span>ARCHIVED</span>
          <strong>—</strong>
          <small>Awaiting event data</small>
        </div>
      </section>

      {/* Event database */}
      <section className="events-manager-database">
        <div className="events-manager-heading">
          <div>
            <span>01 / EVENT DATABASE</span>

            <h2>Events.</h2>
          </div>

          <span className="events-manager-db-status">
            DATABASE / NOT CONNECTED
          </span>
        </div>

        {/* Toolbar */}
        <div className="events-manager-toolbar">
          <div className="event-search">
            <span>SEARCH</span>

            <input
              type="text"
              placeholder="Search events..."
              aria-label="Search events"
            />
          </div>

          <div className="event-filters">
            {eventFilters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={`event-filter ${
                  index === 0 ? "active" : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button type="button" className="create-event-button">
            CREATE EVENT
            <span>+</span>
          </button>
        </div>

        {/* Empty state */}
        <div className="events-manager-empty">
          <div className="events-empty-index">00</div>

          <div>
            <span>EVENT RECORDS</span>

            <h3>No events available.</h3>

            <p>
              Events created by authorized S.I.R.U.S. administrators will
              appear here and can then be published to the public events page.
            </p>
          </div>
        </div>
      </section>

      {/* Event publishing flow */}
      <section className="event-publishing">
        <div className="events-manager-heading">
          <div>
            <span>02 / PUBLISHING WORKFLOW</span>

            <h2>From draft to public.</h2>
          </div>
        </div>

        <div className="event-publishing-grid">
          <div>
            <span>01</span>

            <h3>CREATE</h3>

            <p>
              An authorized administrator creates the event and enters its
              information.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>DRAFT</h3>

            <p>
              The event remains private while its details are being prepared
              and reviewed.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>PUBLISH</h3>

            <p>
              A published event becomes available on the public S.I.R.U.S.
              events page.
            </p>
          </div>

          <div>
            <span>04</span>

            <h3>ARCHIVE</h3>

            <p>
              Completed events can be archived while remaining available in
              the event history.
            </p>
          </div>
        </div>
      </section>

      {/* Event data structure */}
      <section className="event-fields">
        <div className="events-manager-heading">
          <div>
            <span>03 / EVENT INFORMATION</span>

            <h2>One source of truth.</h2>
          </div>
        </div>

        <div className="event-fields-grid">
          <div>
            <span>IDENTITY</span>
            <p>Title, slug, description and event category.</p>
          </div>

          <div>
            <span>SCHEDULE</span>
            <p>Date, start time, end time and registration deadline.</p>
          </div>

          <div>
            <span>LOCATION</span>
            <p>Venue or online event information.</p>
          </div>

          <div>
            <span>MEDIA</span>
            <p>Event cover image and supporting media.</p>
          </div>

          <div>
            <span>REGISTRATION</span>
            <p>Registration availability and participant limits.</p>
          </div>

          <div>
            <span>STATUS</span>
            <p>Draft, published or archived state.</p>
          </div>
        </div>
      </section>

      {/* Permissions */}
      <section className="events-manager-permissions">
        <span>ACCESS CONTROL</span>

        <h2>Administrator event management.</h2>

        <div className="event-permission-grid">
          <div>
            <span>ADMIN</span>

            <p>
              Administrators can create, edit, publish, archive and manage
              S.I.R.U.S. events.
            </p>
          </div>

          <div>
            <span>PUBLIC OUTPUT</span>

            <p>
              Published events automatically become available on the public
              S.I.R.U.S. events page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}