"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vtuId, setVtuId] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError("");

    const supabase = createClient();

    const cleanedName = name.trim();
    const cleanedPhone = phone.trim();
    const cleanedVtuId = vtuId.trim();
    const year = Number(yearOfStudy);

    // Basic required-field validation
    if (!cleanedName || !cleanedPhone || !cleanedVtuId || !yearOfStudy) {
      setError("Please complete all required fields.");
      setLoading(false);
      return;
    }

    // VTU number must contain numbers only
    if (!/^\d+$/.test(cleanedVtuId)) {
      setError("VTU number must contain numbers only.");
      setLoading(false);
      return;
    }

    // Year validation
    if (![1, 2, 3, 4].includes(year)) {
      setError("Please select a valid year of study.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("students")
      .insert({
        name: cleanedName,
        phone: cleanedPhone,
        vtu_id: cleanedVtuId,
        year_of_study: year,
        status: "pending",
      });

    if (insertError) {
      console.error("Student onboarding error:", insertError);

      // Duplicate VTU number
      if (insertError.code === "23505") {
        setError(
          "An onboarding request already exists for this VTU number."
        );
      } else {
        setError(
          "Unable to submit your onboarding request. Please try again."
        );
      }

      setLoading(false);
      return;
    }

    // Successful submission
    setSuccess(true);

    setName("");
    setPhone("");
    setVtuId("");
    setYearOfStudy("");

    setLoading(false);
  }

  return (
    <>
      <Navbar />

      <main className="join-page">
        {/* HERO */}
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
                Become part of S.I.R.U.S. and take part in research,
                experimentation, technical projects, and innovation.
              </p>
            </div>

            <div className="join-coordinate">
              <span>ONBOARDING</span>
              <span>01 / 01</span>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="join-form-section">
          <div className="wide-container">
            <div className="join-section-header">
              <div>
                <span className="section-index">01 — ONBOARDING</span>
                <h2>Tell us about yourself.</h2>
              </div>

              <p>
                Enter your basic details below. Your onboarding request will
                be reviewed by an authorized S.I.R.U.S. administrator.
              </p>
            </div>

            <form className="join-form" onSubmit={handleSubmit}>
              {/* IDENTITY */}
              <div className="join-form-block">
                <div className="join-block-label">
                  <span>01</span>
                  <strong>IDENTITY</strong>
                </div>

                <div className="join-fields">
                  {/* NAME */}
                  <label>
                    <span>NAME</span>

                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      disabled={loading}
                    />
                  </label>

                  {/* MOBILE */}
                  <label>
                    <span>MOBILE NUMBER</span>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your mobile number"
                      autoComplete="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

              {/* ACADEMICS */}
              <div className="join-form-block">
                <div className="join-block-label">
                  <span>02</span>
                  <strong>ACADEMICS</strong>
                </div>

                <div className="join-fields">
                  {/* VTU NUMBER */}
                  <label>
                    <span>VTU NUMBER</span>

                    <input
                      type="text"
                      name="vtu_id"
                      placeholder="Enter your VTU number"
                      inputMode="numeric"
                      pattern="[0-9]+"
                      value={vtuId}
                      onChange={(event) => {
                        // Allow numbers only
                        const value = event.target.value.replace(/\D/g, "");
                        setVtuId(value);
                      }}
                      required
                      disabled={loading}
                    />
                  </label>

                  {/* YEAR */}
                  <label>
                    <span>YEAR OF STUDY</span>

                    <select
                      name="year_of_study"
                      value={yearOfStudy}
                      onChange={(event) =>
                        setYearOfStudy(event.target.value)
                      }
                      required
                      disabled={loading}
                    >
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

              {/* ERROR */}
              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="join-success" role="status">
                  <span>ONBOARDING SUBMITTED</span>

                  <p>
                    Your request has been submitted successfully and is now
                    pending administrator review.
                  </p>
                </div>
              )}

              {/* SUBMIT */}
              <div className="join-submit-area">
                <div>
                  <span className="join-submit-index">
                    ONBOARDING / PENDING REVIEW
                  </span>

                  <p>
                    Your details will remain pending until an authorized
                    S.I.R.U.S. administrator approves your onboarding.
                  </p>
                </div>

                <button
                  type="submit"
                  className="join-submit"
                  disabled={loading}
                >
                  <span>
                    {loading ? "SUBMITTING..." : "SUBMIT ONBOARDING"}
                  </span>

                  <strong>↗</strong>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* PROCESS */}
        <section className="join-process">
          <div className="wide-container">
            <div className="join-section-header">
              <div>
                <span className="section-index">02 — PROCESS</span>

                <h2>What happens next.</h2>
              </div>
            </div>

            <div className="join-process-grid">
              {/* STEP 01 */}
              <article>
                <span>01</span>

                <h3>SUBMIT</h3>

                <p>
                  Submit your basic details through the S.I.R.U.S. onboarding
                  portal.
                </p>
              </article>

              {/* STEP 02 */}
              <article>
                <span>02</span>

                <h3>REVIEW</h3>

                <p>
                  An authorized S.I.R.U.S. administrator reviews your
                  onboarding request.
                </p>
              </article>

              {/* STEP 03 */}
              <article>
                <span>03</span>

                <h3>DECISION</h3>

                <p>
                  Your onboarding request is either approved or rejected by
                  the administrator.
                </p>
              </article>

              {/* STEP 04 */}
              <article>
                <span>04</span>

                <h3>APPROVED</h3>

                <p>
                  Once approved, you become an authorized S.I.R.U.S. student
                  member.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}