import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main className="gallery-page">
        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="gallery-hero">
          <div className="gallery-grid" />

          <div className="wide-container gallery-hero-inner">
            <div className="gallery-hero-content">
              <p className="gallery-eyebrow">S.I.R.U.S. / ARCHIVE</p>

              <h1>
                Moments
                <br />
                <span>in motion.</span>
              </h1>

              <p className="gallery-hero-description">
                A visual archive of the people, experiments, events, projects,
                and moments that shape the S.I.R.U.S. community.
              </p>
            </div>

            <div className="gallery-coordinate">
              <span>VISUAL ARCHIVE</span>
              <span>LIVE COLLECTION</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            ARCHIVE
            ===================================================== */}

        <section className="gallery-archive">
          <div className="wide-container">
            <div className="gallery-section-header">
              <div>
                <span className="section-index">01 — ARCHIVE</span>

                <h2>
                  Captured
                  <br />
                  moments.
                </h2>
              </div>

              <p>
                Photos published by authorized S.I.R.U.S. administrators and
                faculty will appear here.
              </p>
            </div>

            <div className="gallery-empty-state">
              <div className="gallery-empty-symbol">
                <span>S</span>
              </div>

              <div className="gallery-empty-content">
                <span>GALLERY / STORAGE</span>

                <h3>The archive is waiting.</h3>

                <p>
                  S.I.R.U.S. event photographs, project documentation, research
                  activities, and community moments will be displayed here once
                  they are published.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATEGORIES
            ===================================================== */}

        <section className="gallery-categories">
          <div className="wide-container">
            <div className="gallery-section-header">
              <div>
                <span className="section-index">02 — COLLECTIONS</span>

                <h2>
                  One archive.
                  <br />
                  Many stories.
                </h2>
              </div>
            </div>

            <div className="gallery-category-grid">
              <article>
                <span>01</span>
                <h3>EVENTS</h3>
                <p>
                  Hackathons, workshops, quizzes, presentations, and technical
                  activities.
                </p>
              </article>

              <article>
                <span>02</span>
                <h3>RESEARCH</h3>
                <p>
                  Research sessions, experiments, demonstrations, and technical
                  exploration.
                </p>
              </article>

              <article>
                <span>03</span>
                <h3>PROJECTS</h3>
                <p>
                  The people and work behind projects developed through the
                  community.
                </p>
              </article>

              <article>
                <span>04</span>
                <h3>COMMUNITY</h3>
                <p>
                  The people, collaborations, and moments that make S.I.R.U.S.
                  a community.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* =====================================================
            EVENTS CONNECTION
            ===================================================== */}

        <section className="gallery-events">
          <div className="wide-container">
            <div className="gallery-events-inner">
              <div>
                <span className="section-index">03 — EVENTS</span>

                <h2>
                  See what&apos;s
                  <br />
                  happening.
                </h2>

                <p>
                  Explore upcoming and previous S.I.R.U.S. events and activities.
                </p>
              </div>

              <Link href="/events" className="gallery-events-link">
                EXPLORE EVENTS
                <span>↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            JOIN CTA
            ===================================================== */}

        <section className="gallery-join">
          <div className="wide-container">
            <span className="section-index">04 — PARTICIPATE</span>

            <h2>
              Be part of
              <br />
              <span>the archive.</span>
            </h2>

            <p>
              Join S.I.R.U.S. and contribute to the research, projects,
              experiments, and events that become part of the community.
            </p>

            <Link href="/join" className="gallery-join-button">
              JOIN S.I.R.U.S.
              <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}