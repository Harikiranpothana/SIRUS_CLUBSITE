import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const categories = [
  "RESEARCH PAPERS",
  "PATENTS",
  "PROJECTS",
  "STARTUPS",
];

export default function HallOfFamePage() {
  return (
    <>
      <Navbar />

      <main className="inner-page">
        <section className="inner-hero">
          <span className="page-label">04 / HALL OF FAME</span>

          <h1>
            Work that
            <br />
            <em>made an impact.</em>
          </h1>

          <p>
            A record of research, projects, intellectual property and
            ventures created through the S.I.R.U.S. community.
          </p>
        </section>

        <section className="inner-section">
          <div className="hall-page-grid">
            {categories.map((category, index) => (
              <article key={category}>
                <span>0{index + 1}</span>

                <h2>{category}</h2>

                <p>Coming this semester.</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}