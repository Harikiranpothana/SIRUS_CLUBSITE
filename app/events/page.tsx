import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function EventsPage() {
  return (
    <>
      <Navbar />

      <main className="events-page">
        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="events-hero">
          <div className="events-grid" />

          <div className="wide-container events-hero-inner">
            <div className="events-hero-content">
              <p className="events-eyebrow">S.I.R.U.S. / EVENTS</p>

              <h1>
                Where ideas
                <br />
                <span>move.</span>
              </h1>

              <p className="events-hero-description">
                Hackathons, research sessions, technical workshops, paper
                presentations, challenges, and collaborative events built
                around experimentation and innovation.
              </p>
            </div>

            <div className="events-coordinate">
              <span>EVENT SYSTEM</span>
              <span>LIVE ARCHIVE</span>
            </div>
          </div>
        </section>

        {/* =====================================================
            UPCOMING EVENTS
            ===================================================== */}

        <section className="events-section">
          <div className="wide-container">
            <div className="events-section-header">
              <div>
                <span className="section-index">01 — UPCOMING</span>

                <h2>
                  What&apos;s
                  <br />
                  next.
                </h2>
              </div>

              <p>
                Upcoming S.I.R.U.S. events, workshops, challenges, and
                research activities will appear here.
              </p>
            </div>

            <div className="events-list">
              {/* Event records will be rendered from the backend here. */}

              <div className="events-empty-state">
                <span>EVENTS / DATABASE</span>
                <p>No upcoming events available.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PAST EVENTS
            ===================================================== */}

        <section className="events-section events-past">
          <div className="wide-container">
            <div className="events-section-header">
              <div>
                <span className="section-index">02 — ARCHIVE</span>

                <h2>
                  What we&apos;ve
                  <br />
                  done.
                </h2>
              </div>

              <p>
                Previous S.I.R.U.S. activities, research events, competitions,
                and community initiatives will be preserved here.
              </p>
            </div>

            <div className="events-list">
              {/* Archived event records will be rendered from the backend here. */}

              <div className="events-empty-state">
                <span>ARCHIVE / DATABASE</span>
                <p>No archived events available.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            JOIN CTA
            ===================================================== */}

        <section className="events-join">
          <div className="wide-container">
            <div className="events-join-inner">
              <span className="section-index">03 — PARTICIPATE</span>

              <h2>
                Build
                <br />
                <span>with us.</span>
              </h2>

              <p>
                Become part of S.I.R.U.S. and take part in the research,
                experiments, events, and projects that happen inside the
                community.
              </p>

              <Link href="/join" className="events-join-button">
                JOIN S.I.R.U.S.
                <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}