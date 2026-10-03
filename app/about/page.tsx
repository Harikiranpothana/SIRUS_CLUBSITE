import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="inner-page">
        <section className="inner-hero">
          <span className="page-label">01 / ABOUT</span>

          <h1>
            Built around
            <br />
            <em>curiosity.</em>
          </h1>

          <p>
            S.I.R.U.S. is a student-driven ecosystem focused on
            research, experimentation, innovation and technical
            excellence.
          </p>
        </section>

        <section className="inner-section">
          <span className="page-label">OUR PURPOSE</span>

          <div className="two-column">
            <h2>
              Learn.
              <br />
              Build.
              <br />
              Discover.
            </h2>

            <div>
              <p>
                S.I.R.U.S. creates an environment where students can
                move beyond classroom learning and work on real
                technical problems.
              </p>

              <p>
                Through hackathons, research activities, technical
                challenges, workshops and collaborative projects, the
                community encourages students to experiment and create.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}