import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const focusAreas = [
  {
    number: "01",
    title: "RESEARCH",
    description:
      "From technical investigation to publications, presentations and intellectual property.",
  },
  {
    number: "02",
    title: "BUILD",
    description:
      "Hackathons, challenges and projects that turn concepts into working systems.",
  },
  {
    number: "03",
    title: "INNOVATE",
    description:
      "Explore emerging technologies and develop ideas with real-world potential.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* ───────────────── HERO ───────────────── */}

        <section className="hero-v2">
          <div className="hero-v2-grid" />

          <div className="hero-coordinate hero-coordinate-top">
            13°05&apos;N / 80°16&apos;E
          </div>

          <div className="hero-coordinate hero-coordinate-bottom">
            S.I.R.U.S. / SYSTEM 01
          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />

            <div className="core-symbol">
              <div className="core-inner">S</div>
            </div>

            <div className="visual-point point-one" />
            <div className="visual-point point-two" />
            <div className="visual-point point-three" />

            <span className="visual-label label-one">RESEARCH</span>
            <span className="visual-label label-two">BUILD</span>
            <span className="visual-label label-three">IMPACT</span>
          </div>

          <div className="hero-v2-content">
            <div className="hero-v2-meta">
              <span>
                <i />
                STUDENT RESEARCH & INNOVATION
              </span>

              <span>EST. 2026</span>
            </div>

            <h1>
              SUPER
              <br />
              <span>INTELLIGENCE</span>
            </h1>

            <div className="hero-v2-footer">
              <p>
                A student-driven ecosystem for research, experimentation and
                technical innovation.
              </p>

              <div className="hero-v2-actions">
                <Link href="/join" className="hero-primary-action">
                  <span>JOIN S.I.R.U.S.</span>
                  <strong>↗</strong>
                </Link>

                <Link href="/about" className="hero-secondary-action">
                  EXPLORE S.I.R.U.S.
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hero-scroll-indicator">
            <span>SCROLL</span>
            <div />
          </div>

          <div className="hero-counter">
            <strong>01</strong>
            <span>/</span>
            <span>06</span>
          </div>
        </section>

        {/* ───────────────── STATEMENT ───────────────── */}

        <section className="statement-section">
          <div className="wide-container">
            <div className="section-index">
              <span>01</span>
              <span>THE IDEA</span>
            </div>

            <div className="statement-grid">
              <h2>
                Curiosity
                <br />
                <span>becomes</span>
                <br />
                capability.
              </h2>

              <div className="statement-copy">
                <p className="statement-lead">
                  S.I.R.U.S. is a platform where students move beyond learning
                  about technology and start building with it.
                </p>

                <p>
                  Research, experimentation, competitions, technical
                  challenges and collaboration create a continuous path from
                  an initial idea to something tangible.
                </p>

                <Link href="/about" className="line-link">
                  ABOUT S.I.R.U.S. <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── FOCUS ───────────────── */}

        <section className="focus-v2">
          <div className="wide-container">
            <div className="section-index">
              <span>02</span>
              <span>THE SYSTEM</span>
            </div>

            <div className="focus-v2-heading">
              <h2>
                Three directions.
                <br />
                <span>One ecosystem.</span>
              </h2>

              <p>
                The activities of S.I.R.U.S. are built around exploration,
                creation and measurable outcomes.
              </p>
            </div>

            <div className="focus-v2-list">
              {focusAreas.map((area) => (
                <article className="focus-v2-item" key={area.number}>
                  <span className="focus-v2-number">{area.number}</span>

                  <div className="focus-v2-title">
                    <h3>{area.title}</h3>
                    <span>↗</span>
                  </div>

                  <p>{area.description}</p>

                  <div className="focus-v2-line" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────── PROCESS ───────────────── */}

        <section className="process-section">
          <div className="wide-container">
            <div className="section-index">
              <span>03</span>
              <span>FROM IDEA TO IMPACT</span>
            </div>

            <div className="process-track">
              <div className="process-line" />

              <div className="process-node">
                <span>01</span>
                <strong>QUESTION</strong>
                <p>Find something worth solving.</p>
              </div>

              <div className="process-node active">
                <span>02</span>
                <strong>EXPERIMENT</strong>
                <p>Test ideas through technology.</p>
              </div>

              <div className="process-node">
                <span>03</span>
                <strong>RESEARCH</strong>
                <p>Develop evidence and knowledge.</p>
              </div>

              <div className="process-node">
                <span>04</span>
                <strong>IMPACT</strong>
                <p>Take the result further.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── EVENTS ───────────────── */}

        <section className="events-v2">
          <div className="wide-container">
            <div className="section-heading-v2">
              <div className="section-index">
                <span>04</span>
                <span>ACTIVITY</span>
              </div>

              <Link href="/events" className="line-link">
                ALL EVENTS <span>↗</span>
              </Link>
            </div>

            <div className="events-v2-empty">
              <div>
                <span>EVENT SYSTEM</span>
                <h3>Upcoming activities.</h3>
              </div>

              <p>
                Events published by S.I.R.U.S. will appear here automatically.
              </p>

              <Link href="/events" className="line-link">
                VIEW EVENTS <span>↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ───────────────── OUTPUT ───────────────── */}

        <section className="output-section">
          <div className="wide-container">
            <div className="section-index">
              <span>05</span>
              <span>OUTPUT</span>
            </div>

            <div className="output-heading">
              <h2>
                Ideas are only
                <br />
                the beginning.
              </h2>

              <p>
                S.I.R.U.S. tracks the work that emerges from the community —
                from early experiments to research, projects and innovation.
              </p>
            </div>

            <div className="output-grid">
              <div>
                <strong>—</strong>
                <span>RESEARCH PAPERS</span>
              </div>

              <div>
                <strong>—</strong>
                <span>PROJECTS</span>
              </div>

              <div>
                <strong>—</strong>
                <span>PATENTS</span>
              </div>

              <div>
                <strong>—</strong>
                <span>VENTURES</span>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── CTA ───────────────── */}

        <section className="final-section">
          <div className="final-symbol">
            <span>S</span>
          </div>

          <span className="final-label">06 / BEGIN HERE</span>

          <h2>
            Build
            <br />
            <span>something.</span>
          </h2>

          <p className="final-description">
            Bring your curiosity, ideas and technical skills into the S.I.R.U.S.
            research and innovation community.
          </p>

          <Link href="/join" className="final-button">
            JOIN S.I.R.U.S.
            <span>↗</span>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}