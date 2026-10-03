import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const roadmap = [
  {
    phase: "01",
    title: "DISCOVER",
    description:
      "Identify problems, explore emerging technologies and build foundational knowledge.",
  },
  {
    phase: "02",
    title: "BUILD",
    description:
      "Turn ideas into prototypes through challenges, hackathons and collaborative projects.",
  },
  {
    phase: "03",
    title: "RESEARCH",
    description:
      "Develop technical work into research papers, presentations and intellectual property.",
  },
  {
    phase: "04",
    title: "IMPACT",
    description:
      "Take promising ideas further through competitions, incubation and real-world applications.",
  },
];

export default function RoadmapPage() {
  return (
    <>
      <Navbar />

      <main className="inner-page">
        <section className="inner-hero">
          <span className="page-label">03 / ROADMAP</span>

          <h1>
            From idea
            <br />
            <em>to impact.</em>
          </h1>

          <p>
            A continuous journey from learning and experimentation
            towards research and innovation.
          </p>
        </section>

        <section className="inner-section">
          <div className="roadmap-list">
            {roadmap.map((item) => (
              <article className="roadmap-item" key={item.phase}>
                <span>{item.phase}</span>

                <h2>{item.title}</h2>

                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}