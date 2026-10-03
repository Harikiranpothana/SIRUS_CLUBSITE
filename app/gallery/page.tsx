import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main className="inner-page">
        <section className="inner-hero">
          <span className="page-label">05 / GALLERY</span>

          <h1>
            Moments from
            <br />
            <em>the community.</em>
          </h1>

          <p>
            Hackathons, workshops, presentations and activities from
            across S.I.R.U.S.
          </p>
        </section>

        <section className="inner-section">
          <div className="gallery-placeholder">
            <span>GALLERY</span>
            <p>Event photographs will appear here.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}