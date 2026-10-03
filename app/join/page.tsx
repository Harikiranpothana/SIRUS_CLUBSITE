import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const interestOptions = [
  "Artificial Intelligence",
  "Machine Learning",
  "Computer Vision",
  "Research",
  "IoT",
  "Other",
];

export default function JoinPage() {
  return (
    <>
      <Navbar />

      <main className="join-page">
        <section className="join-hero">
          <div className="wide-container join-hero-inner">
            <div className="join-hero-content">
              <p className="join-eyebrow">S.I.R.U.S. / ONBOARDING</p>

              <h1>
                Join the
                <br />
                <span>system.</span>
              </h1>

              <p className="join-hero-description">
                S.I.R.U.S. is a research and innovation community built around
                curiosity, experimentation, collaboration, and meaningful
                technical work.
              </p>
            </div>

            <div className="join-coordinate">
              <span>APPLICATION</span>
              <span>01 / 01</span>
            </div>
          </div>
        </section>

        <section className="join-form-section">
          <div className="wide-container">
            <div className="join-section-header">
              <div>
                <span className="section-index">01 — APPLICATION</span>
                <h2>Tell us about yourself.</h2>
              </div>

              <p>
                Complete the application below. Your information will be
                reviewed by the S.I.R.U.S. faculty or administration team.
              </p>
            </div>

            <form className="join-form">
              <div className="join-form-block">
                <div className="join-block-label">
                  <span>01</span>
                  <strong>IDENTITY</strong>
                </div>

                <div className="join-fields">
                  <label>
                    <span>FULL NAME</span>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label>
                    <span>COLLEGE EMAIL</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@college.edu"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label>
                    <span>PHONE NUMBER</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your phone number"
                      autoComplete="tel"
                    />
                  </label>
                </div>
              </div>

              <div className="join-form-block">
                <div className="join-block-label">
                  <span>02</span>
                  <strong>ACADEMICS</strong>
                </div>

                <div className="join-fields">
                  <label>
                    <span>DEPARTMENT</span>
                    <input
                      type="text"
                      name="department"
                      placeholder="Your department"
                      required
                    />
                  </label>

                  <label>
                    <span>YEAR</span>
                    <select name="year" defaultValue="" required>
                      <option value="" disabled>
                        Select your year
                      </option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Fourth Year</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="join-form-block">
                <div className="join-block-label">
                  <span>03</span>
                  <strong>INTERESTS</strong>
                </div>

                <div className="join-fields">
                  <fieldset className="join-interest-field">
                    <legend>AREAS OF INTEREST</legend>

                    <div className="join-interest-grid">
                      {interestOptions.map((interest) => (
                        <label key={interest} className="join-interest-option">
                          <input
                            type="checkbox"
                            name="interests"
                            value={interest}
                          />
                          <span>{interest}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label>
                    <span>SKILLS</span>
                    <textarea
                      name="skills"
                      placeholder="Languages, frameworks, tools, research skills..."
                      rows={5}
                    />
                  </label>
                </div>
              </div>

              <div className="join-form-block">
                <div className="join-block-label">
                  <span>04</span>
                  <strong>EXPERIENCE</strong>
                </div>

                <div className="join-fields">
                  <label>
                    <span>GITHUB</span>
                    <input
                      type="url"
                      name="githubUrl"
                      placeholder="https://github.com/..."
                    />
                  </label>

                  <label>
                    <span>LINKEDIN</span>
                    <input
                      type="url"
                      name="linkedinUrl"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </label>

                  <label className="join-full-field">
                    <span>PROJECT / RESEARCH EXPERIENCE</span>
                    <textarea
                      name="experience"
                      placeholder="Tell us briefly about projects, research, competitions, or other technical work..."
                      rows={6}
                    />
                  </label>
                </div>
              </div>

              <div className="join-form-block">
                <div className="join-block-label">
                  <span>05</span>
                  <strong>MOTIVATION</strong>
                </div>

                <div className="join-fields">
                  <label className="join-full-field">
                    <span>WHY S.I.R.U.S.?</span>
                    <textarea
                      name="motivation"
                      placeholder="What do you want to explore, build, or contribute?"
                      rows={7}
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="join-submit-area">
                <div>
                  <span className="join-submit-index">APPLICATION / READY</span>
                  <p>
                    Applications are reviewed by authorized S.I.R.U.S.
                    administrators and faculty.
                  </p>
                </div>

                <button type="submit" className="join-submit">
                  <span>SUBMIT APPLICATION</span>
                  <strong>↗</strong>
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="join-process">
          <div className="wide-container">
            <div className="join-section-header">
              <div>
                <span className="section-index">06 — PROCESS</span>
                <h2>What happens next.</h2>
              </div>
            </div>

            <div className="join-process-grid">
              <article>
                <span>01</span>
                <h3>APPLY</h3>
                <p>Submit your application through the S.I.R.U.S. portal.</p>
              </article>

              <article>
                <span>02</span>
                <h3>REVIEW</h3>
                <p>
                  Your application is reviewed by an authorized faculty or
                  administrator.
                </p>
              </article>

              <article>
                <span>03</span>
                <h3>DECISION</h3>
                <p>
                  You receive an application status through the portal.
                </p>
              </article>

              <article>
                <span>04</span>
                <h3>MEMBER</h3>
                <p>
                  Accepted applicants receive access to the S.I.R.U.S. member
                  portal.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="join-login">
          <div className="wide-container">
            <div className="join-login-inner">
              <div>
                <span className="section-index">ALREADY APPLIED?</span>
                <h2>Check your application.</h2>
              </div>

              <Link href="/login" className="join-login-link">
                MEMBER LOGIN <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}