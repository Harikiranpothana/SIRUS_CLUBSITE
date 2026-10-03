import Link from "next/link";

const galleryFilters = [
  "ALL",
  "EVENTS",
  "PROJECTS",
  "COMMUNITY",
];

export default function GalleryManagerPage() {
  return (
    <main className="gallery-manager-page">
      {/* Header */}
      <section className="gallery-manager-header">
        <div>
          <Link href="/admin" className="gallery-manager-back">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="gallery-manager-eyebrow">
            MANAGEMENT / GALLERY
          </span>

          <h1>
            Gallery
            <br />
            <span>Manager.</span>
          </h1>

          <p>
            Upload and manage visual records from S.I.R.U.S. events,
            research, projects and community activities.
          </p>
        </div>

        <div className="gallery-manager-access">
          <span>ACCESS</span>
          <strong>ADMIN</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="gallery-manager-overview">
        <div className="gallery-manager-stat">
          <span>TOTAL MEDIA</span>
          <strong>—</strong>
          <small>Awaiting gallery data</small>
        </div>

        <div className="gallery-manager-stat">
          <span>EVENTS</span>
          <strong>—</strong>
          <small>Awaiting gallery data</small>
        </div>

        <div className="gallery-manager-stat">
          <span>RESEARCH</span>
          <strong>—</strong>
          <small>Awaiting gallery data</small>
        </div>

        <div className="gallery-manager-stat">
          <span>PROJECTS</span>
          <strong>—</strong>
          <small>Awaiting gallery data</small>
        </div>
      </section>

      {/* Media Database */}
      <section className="gallery-manager-database">
        <div className="gallery-manager-heading">
          <div>
            <span>01 / MEDIA DATABASE</span>

            <h2>Gallery.</h2>
          </div>

          <span className="gallery-manager-db-status">
            STORAGE / NOT CONNECTED
          </span>
        </div>

        {/* Toolbar */}
        <div className="gallery-manager-toolbar">
          <div className="gallery-manager-search">
            <span>SEARCH</span>

            <input
              type="text"
              placeholder="Search media..."
              aria-label="Search gallery media"
            />
          </div>

          <div className="gallery-manager-filters">
            {galleryFilters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={`gallery-manager-filter ${
                  index === 0 ? "active" : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button type="button" className="gallery-upload-button">
            UPLOAD MEDIA
            <span>+</span>
          </button>
        </div>

        {/* Empty State */}
        <div className="gallery-manager-empty">
          <div className="gallery-empty-index">00</div>

          <div>
            <span>MEDIA RECORDS</span>

            <h3>No media available.</h3>

            <p>
              Images uploaded by authorized S.I.R.U.S. administrators will
              appear here after storage is connected.
            </p>
          </div>
        </div>
      </section>

      {/* Upload Workflow */}
      <section className="gallery-upload-section">
        <div className="gallery-manager-heading">
          <div>
            <span>02 / MEDIA WORKFLOW</span>

            <h2>From upload to archive.</h2>
          </div>
        </div>

        <div className="gallery-upload-grid">
          <div>
            <span>01</span>

            <h3>UPLOAD</h3>

            <p>
              An authorized administrator uploads an image through the
              management portal.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>DESCRIBE</h3>

            <p>
              Media receives its title, category, description and optional
              event or project association.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>PUBLISH</h3>

            <p>
              Published media becomes available on the public S.I.R.U.S.
              gallery.
            </p>
          </div>

          <div>
            <span>04</span>

            <h3>ARCHIVE</h3>

            <p>
              Older media can be archived without removing the underlying
              record.
            </p>
          </div>
        </div>
      </section>

      {/* Metadata */}
      <section className="gallery-metadata-section">
        <div className="gallery-manager-heading">
          <div>
            <span>03 / MEDIA METADATA</span>

            <h2>Organized records.</h2>
          </div>
        </div>

        <div className="gallery-metadata-grid">
          <div>
            <span>MEDIA</span>
            <p>Original file and optimized display version.</p>
          </div>

          <div>
            <span>TITLE</span>
            <p>Human-readable title for the image.</p>
          </div>

          <div>
            <span>CATEGORY</span>
            <p>Events, research, projects or community.</p>
          </div>

          <div>
            <span>DESCRIPTION</span>
            <p>Context describing what the image represents.</p>
          </div>

          <div>
            <span>ASSOCIATION</span>
            <p>Optional connection to an event or project.</p>
          </div>

          <div>
            <span>STATUS</span>
            <p>Draft, published or archived.</p>
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="gallery-storage-section">
        <div className="gallery-storage-content">
          <span>04 / STORAGE ARCHITECTURE</span>

          <h2>
            Media storage
            <br />
            stays separate.
          </h2>

          <p>
            Image files will be stored in Supabase Storage. The database will
            store the media metadata and the corresponding storage reference.
            This keeps the gallery manageable without embedding image data
            directly into the application.
          </p>
        </div>

        <div className="gallery-storage-flow">
          <div>ADMIN</div>

          <span>↓</span>

          <div>UPLOAD</div>

          <span>↓</span>

          <div>SUPABASE STORAGE</div>

          <span>↓</span>

          <div>DATABASE METADATA</div>

          <span>↓</span>

          <div>PUBLIC GALLERY</div>
        </div>
      </section>

      {/* Permissions */}
      <section className="gallery-manager-permissions">
        <span>ACCESS CONTROL</span>

        <h2>Administrator gallery management.</h2>

        <div className="gallery-permission-grid">
          <div>
            <span>ADMIN</span>

            <p>
              Administrators can upload, edit, publish, archive and manage
              S.I.R.U.S. gallery media.
            </p>
          </div>

          <div>
            <span>PUBLIC OUTPUT</span>

            <p>
              Published media automatically becomes available on the public
              S.I.R.U.S. gallery.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}