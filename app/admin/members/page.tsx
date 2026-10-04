"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MemberStatus = "pending" | "approved" | "rejected";

type Student = {
  id: string;
  vtu_id: string;
  name: string;
  phone: string;
  year_of_study: number;
  status: MemberStatus;
  created_at: string;
  updated_at: string;
};

const STUDENT_COLUMNS =
  "id, vtu_id, name, phone, year_of_study, status, created_at, updated_at";

const MEMBER_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatus(status: MemberStatus) {
  return status.toUpperCase();
}

export default function MembersAdminPage() {
  const supabase = useMemo(() => createClient(), []);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof MEMBER_FILTERS)[number]>("ALL");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("students")
      .select(STUDENT_COLUMNS)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Members fetch error:", fetchError);
      setStudents([]);
      setError(fetchError.message || "Unable to load member records.");
      setLoading(false);
      return;
    }

    setStudents((data ?? []) as Student[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  async function updateStatus(studentId: string, status: MemberStatus) {
    const student = students.find((item) => item.id === studentId);

    if (!student || student.status === status) return;

    const action =
      status === "approved"
        ? "approve this student application"
        : status === "rejected"
          ? "reject this student application"
          : "move this student back to pending";

    if (!window.confirm(`Are you sure you want to ${action}?`)) return;

    setActionLoading(studentId);
    setError("");

    const { error: updateError } = await supabase
      .from("students")
      .update({ status })
      .eq("id", studentId);

    if (updateError) {
      console.error("Member status update error:", updateError);
      setError(updateError.message || "Unable to update member status.");
      setActionLoading(null);
      return;
    }

    setStudents((current) =>
      current.map((item) =>
        item.id === studentId
          ? { ...item, status, updated_at: new Date().toISOString() }
          : item
      )
    );

    setActionLoading(null);
  }

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesStatus =
        activeFilter === "ALL" ||
        student.status === activeFilter.toLowerCase();

      const matchesSearch =
        !term ||
        student.name.toLowerCase().includes(term) ||
        student.vtu_id.toLowerCase().includes(term) ||
        student.phone.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [students, activeFilter, search]);

  const totalMembers = students.length;
  const pendingMembers = students.filter(
    (student) => student.status === "pending"
  ).length;
  const approvedMembers = students.filter(
    (student) => student.status === "approved"
  ).length;
  const rejectedMembers = students.filter(
    (student) => student.status === "rejected"
  ).length;

  return (
    <main className="members-admin-page">
      <section className="members-header">
        <div>
          <Link href="/admin" className="members-back-link">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="members-eyebrow">MANAGEMENT / MEMBERS</span>

          <h1>
            Member
            <br />
            <span>Manager.</span>
          </h1>

          <p>
            Review student applications, approve membership and manage the
            S.I.R.U.S. student directory.
          </p>
        </div>

        <div className="members-access-badge">
          <span>ACCESS</span>
          <strong>ADMIN</strong>
        </div>
      </section>

      <section className="members-overview">
        <div className="member-stat">
          <span>TOTAL MEMBERS</span>
          <strong>{loading ? "—" : totalMembers}</strong>
          <small>All student records</small>
        </div>

        <div className="member-stat">
          <span>PENDING</span>
          <strong>{loading ? "—" : pendingMembers}</strong>
          <small>Awaiting review</small>
        </div>

        <div className="member-stat">
          <span>APPROVED</span>
          <strong>{loading ? "—" : approvedMembers}</strong>
          <small>Active members</small>
        </div>

        <div className="member-stat">
          <span>REJECTED</span>
          <strong>{loading ? "—" : rejectedMembers}</strong>
          <small>Rejected applications</small>
        </div>
      </section>

      <section className="members-directory">
        <div className="members-section-heading">
          <div>
            <span>01 / MEMBER DATABASE</span>
            <h2>Students.</h2>
          </div>

          <span className="members-database-status">
            {loading ? "DATABASE / LOADING" : "DATABASE / CONNECTED"}
          </span>
        </div>

        <div className="members-toolbar">
          <div className="members-search">
            <span>SEARCH</span>
            <input
              type="text"
              placeholder="Name, VTU ID or mobile..."
              aria-label="Search students"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="members-filters">
            {MEMBER_FILTERS.map((filter) => (
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

        {error && (
          <div className="members-error" role="alert">
            <span>DATABASE ERROR</span>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="members-empty">
            <div className="members-empty-index">01</div>
            <div>
              <span>DATABASE / LOADING</span>
              <h3>Loading student records.</h3>
              <p>Fetching the current S.I.R.U.S. member database.</p>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="members-empty">
            <div className="members-empty-index">00</div>
            <div>
              <span>
                {students.length === 0
                  ? "DATABASE / EMPTY"
                  : "SEARCH / NO MATCH"}
              </span>
              <h3>
                {students.length === 0
                  ? "No student applications yet."
                  : "No matching students."}
              </h3>
              <p>
                {students.length === 0
                  ? "Students submitted through the public Join page will appear here after submission."
                  : "Try another name, VTU ID, mobile number or status filter."}
              </p>
            </div>
          </div>
        ) : (
          <div className="members-record-list">
            {filteredStudents.map((student, index) => {
              const busy = actionLoading === student.id;

              return (
                <article className="member-record" key={student.id}>
                  <div className="member-record-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="member-record-main">
                    <div className="member-record-heading">
                      <div>
                        <span className="member-record-label">STUDENT</span>
                        <h3>{student.name}</h3>
                      </div>

                      <span
                        className={`member-status member-status-${student.status}`}
                      >
                        {formatStatus(student.status)}
                      </span>
                    </div>

                    <div className="member-record-details">
                      <div>
                        <span>VTU ID</span>
                        <strong>{student.vtu_id}</strong>
                      </div>

                      <div>
                        <span>MOBILE</span>
                        <strong>{student.phone}</strong>
                      </div>

                      <div>
                        <span>YEAR</span>
                        <strong>{student.year_of_study}</strong>
                      </div>

                      <div>
                        <span>SUBMITTED</span>
                        <strong>{formatDate(student.created_at)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="member-record-actions">
                    <div className="member-action-buttons">
                      {student.status !== "approved" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => updateStatus(student.id, "approved")}
                        >
                          {busy ? "SAVING..." : "APPROVE"}
                        </button>
                      )}

                      {student.status !== "rejected" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => updateStatus(student.id, "rejected")}
                        >
                          {busy ? "SAVING..." : "REJECT"}
                        </button>
                      )}

                      {student.status !== "pending" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => updateStatus(student.id, "pending")}
                        >
                          {busy ? "SAVING..." : "PENDING"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="member-lifecycle">
        <span>02 / APPLICATION LIFECYCLE</span>
        <h2>One controlled path.</h2>

        <div className="member-lifecycle-grid">
          <div>
            <span>01</span>
            <h3>SUBMIT</h3>
            <p>Student submits the required onboarding information.</p>
          </div>

          <div>
            <span>02</span>
            <h3>REVIEW</h3>
            <p>Application enters the administrator review queue.</p>
          </div>

          <div>
            <span>03</span>
            <h3>DECISION</h3>
            <p>Administrator approves or rejects the application.</p>
          </div>

          <div>
            <span>04</span>
            <h3>APPROVED</h3>
            <p>Approved students become active S.I.R.U.S. members.</p>
          </div>
        </div>
      </section>

      <section className="members-permissions">
        <span>03 / ACCESS CONTROL</span>
        <h2>Administrator membership management.</h2>

        <div className="member-permission-grid">
          <div>
            <span>ADMIN</span>
            <p>
              Administrators can review student applications and change their
              membership status.
            </p>
          </div>

          <div>
            <span>STUDENT</span>
            <p>
              Students submit applications publicly and do not receive an
              administrative login.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
