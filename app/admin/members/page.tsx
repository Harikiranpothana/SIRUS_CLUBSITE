"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type StudentStatus = "pending" | "approved" | "rejected";

type Student = {
  id: string;
  vtu_id: string;
  name: string;
  phone: string;
  year_of_study: number;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
};

const memberFilters = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

type MemberFilter = (typeof memberFilters)[number];

export default function MembersPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<MemberFilter>("ALL");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");

  const supabase = createClient();

  async function loadStudents() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("students")
      .select(
        "id, vtu_id, name, phone, year_of_study, status, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Student fetch error:", fetchError);
      setError("Unable to load student records.");
      setStudents([]);
      setLoading(false);
      return;
    }

    setStudents((data ?? []) as Student[]);
    setLoading(false);
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function updateStudentStatus(
    studentId: string,
    status: "approved" | "rejected"
  ) {
    setActionLoading(studentId);
    setError("");

    const { error: updateError } = await supabase
      .from("students")
      .update({ status })
      .eq("id", studentId);

    if (updateError) {
      console.error("Student status update error:", updateError);
      setError("Unable to update the student status.");
      setActionLoading(null);
      return;
    }

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status,
            }
          : student
      )
    );

    setActionLoading(null);
  }

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesStatus =
        activeFilter === "ALL" ||
        student.status === activeFilter.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.vtu_id.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [students, activeFilter, search]);

  const totalStudents = students.length;

  const pendingStudents = students.filter(
    (student) => student.status === "pending"
  ).length;

  const approvedStudents = students.filter(
    (student) => student.status === "approved"
  ).length;

  const rejectedStudents = students.filter(
    (student) => student.status === "rejected"
  ).length;

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function getYearLabel(year: number) {
    const labels: Record<number, string> = {
      1: "FIRST YEAR",
      2: "SECOND YEAR",
      3: "THIRD YEAR",
      4: "FOURTH YEAR",
    };

    return labels[year] ?? `YEAR ${year}`;
  }

  return (
    <main className="members-admin-page">
      {/* Header */}
      <section className="members-header">
        <div>
          <Link href="/admin" className="members-back-link">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="members-eyebrow">
            ADMIN / STUDENTS
          </span>

          <h1>
            Student
            <br />
            <span>Management.</span>
          </h1>

          <p>
            Review student onboarding requests and manage approved
            S.I.R.U.S. students.
          </p>
        </div>

        <div className="members-access-badge">
          <span>ACCESS</span>
          <strong>ADMIN</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="members-overview">
        <div className="member-stat">
          <span>TOTAL STUDENTS</span>

          <strong>
            {loading ? "—" : totalStudents}
          </strong>

          <small>All student records</small>
        </div>

        <div className="member-stat">
          <span>PENDING</span>

          <strong>
            {loading ? "—" : pendingStudents}
          </strong>

          <small>Awaiting admin review</small>
        </div>

        <div className="member-stat">
          <span>APPROVED</span>

          <strong>
            {loading ? "—" : approvedStudents}
          </strong>

          <small>Approved students</small>
        </div>

        <div className="member-stat">
          <span>REJECTED</span>

          <strong>
            {loading ? "—" : rejectedStudents}
          </strong>

          <small>Rejected submissions</small>
        </div>
      </section>

      {/* Student Database */}
      <section className="members-directory">
        <div className="members-section-heading">
          <div>
            <span>01 / STUDENT DATABASE</span>

            <h2>Students.</h2>
          </div>

          <span className="members-database-status">
            DATABASE / CONNECTED
          </span>
        </div>

        {/* Search / filters */}
        <div className="members-toolbar">
          <div className="members-search">
            <span>SEARCH</span>

            <input
              type="text"
              placeholder="Search by name or VTU number..."
              aria-label="Search students"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="members-filters">
            {memberFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`member-filter ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="members-empty">
            <div className="members-empty-index">...</div>

            <div>
              <span>STUDENT RECORDS</span>

              <h3>Loading student records.</h3>

              <p>
                Retrieving student data from the S.I.R.U.S.
                database.
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredStudents.length === 0 && (
          <div className="members-empty">
            <div className="members-empty-index">00</div>

            <div>
              <span>STUDENT RECORDS</span>

              <h3>
                {students.length === 0
                  ? "No student records available."
                  : "No matching students."}
              </h3>

              <p>
                {students.length === 0
                  ? "Student onboarding submissions will appear here once they are submitted."
                  : "Try changing the search term or selecting a different status filter."}
              </p>
            </div>
          </div>
        )}

        {/* Student records */}
        {!loading && filteredStudents.length > 0 && (
          <div className="members-table">
            {filteredStudents.map((student) => (
              <article
                className="member-record"
                key={student.id}
              >
                <div className="member-record-main">
                  <div className="member-record-number">
                    {student.vtu_id}
                  </div>

                  <div className="member-record-info">
                    <h3>{student.name}</h3>

                    <div className="member-record-meta">
                      <span>{student.phone}</span>

                      <span>
                        {getYearLabel(student.year_of_study)}
                      </span>

                      <span>
                        SUBMITTED {formatDate(student.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="member-record-actions">
                  <span
                    className={`member-status member-status-${student.status}`}
                  >
                    {student.status.toUpperCase()}
                  </span>

                  {student.status === "pending" && (
                    <div className="member-action-buttons">
                      <button
                        type="button"
                        onClick={() =>
                          updateStudentStatus(
                            student.id,
                            "approved"
                          )
                        }
                        disabled={actionLoading === student.id}
                      >
                        {actionLoading === student.id
                          ? "UPDATING..."
                          : "APPROVE"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateStudentStatus(
                            student.id,
                            "rejected"
                          )
                        }
                        disabled={actionLoading === student.id}
                      >
                        {actionLoading === student.id
                          ? "UPDATING..."
                          : "REJECT"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Onboarding Process */}
      <section className="member-lifecycle">
        <div className="members-section-heading">
          <div>
            <span>02 / STUDENT ONBOARDING</span>

            <h2>Review process.</h2>
          </div>
        </div>

        <div className="member-lifecycle-grid">
          <div>
            <span>01</span>

            <h3>SUBMIT</h3>

            <p>
              A student submits their name, mobile number, VTU
              number and year of study through the public S.I.R.U.S.
              portal.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>REVIEW</h3>

            <p>
              The submitted student record enters the pending state
              and is reviewed by an administrator.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>DECISION</h3>

            <p>
              The administrator approves or rejects the onboarding
              request.
            </p>
          </div>

          <div>
            <span>04</span>

            <h3>APPROVED</h3>

            <p>
              Approved students become official S.I.R.U.S.
              students and can use the student portal.
            </p>
          </div>
        </div>
      </section>

      {/* Student Record Information */}
      <section className="members-permissions">
        <span>STUDENT MANAGEMENT</span>

        <h2>Administrator control.</h2>

        <div className="member-permission-grid">
          <div>
            <span>PENDING</span>

            <p>
              Pending student submissions can be reviewed by
              administrators before onboarding is approved.
            </p>
          </div>

          <div>
            <span>APPROVED</span>

            <p>
              Approved student records are retained in the official
              student database and can be managed by administrators.
            </p>
          </div>

          <div>
            <span>REJECTED</span>

            <p>
              Rejected submissions remain recorded with a rejected
              status and are not treated as approved students.
            </p>
          </div>

          <div>
            <span>IDENTITY</span>

            <p>
              Student records are identified primarily through the
              VTU number, with name, mobile number and year of study
              stored alongside it.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}