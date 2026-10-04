export const dynamic = "force-dynamic";

import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

const adminModules = [
  {
    number: "01",
    title: "MEMBERS",
    description:
      "Review student onboarding requests and manage approved S.I.R.U.S. students.",
    href: "/admin/members",
  },
  {
    number: "02",
    title: "EVENTS",
    description:
      "Create, publish, edit and manage events across the S.I.R.U.S. portal.",
    href: "/admin/events",
  },
  {
    number: "03",
    title: "ATTENDANCE",
    description:
      "Create attendance sessions, generate QR codes and review attendance records.",
    href: "/admin/attendance",
  },
  {
    number: "04",
    title: "GALLERY",
    description:
      "Upload, organize and publish photographs and media from S.I.R.U.S. activities.",
    href: "/admin/gallery",
  },
];

type ActivityItem = {
  id: string;
  type: string;
  label: string;
  description: string;
  created_at: string;
};

function formatActivityDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function getDashboardData() {
  const supabase = createAdminClient();

  const [
    studentsResult,
    pendingStudentsResult,
    eventsResult,
    attendanceResult,
    recentStudentsResult,
    recentEventsResult,
    recentAttendanceResult,
    recentGalleryResult,
  ] = await Promise.all([
    supabase
      .from("students")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("events")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("attendance_records")
      .select("id", { count: "exact", head: true })
      .eq("status", "present"),

    supabase
      .from("students")
      .select("id,name,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("events")
      .select("id,title,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("attendance_records")
      .select("id,checked_in_at,method,status")
      .order("checked_in_at", { ascending: false })
      .limit(5),

    supabase
      .from("gallery_media")
      .select("id,title,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const errors = [
    studentsResult.error,
    pendingStudentsResult.error,
    eventsResult.error,
    attendanceResult.error,
    recentStudentsResult.error,
    recentEventsResult.error,
    recentAttendanceResult.error,
    recentGalleryResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("Admin dashboard database error:", errors);
  }

  const activities: ActivityItem[] = [];

  for (const student of recentStudentsResult.data ?? []) {
    activities.push({
      id: `student-${student.id}`,
      type: "MEMBER",
      label: student.name,
      description:
        student.status === "pending"
          ? "Student onboarding request submitted."
          : `Student status: ${student.status}.`,
      created_at: student.created_at,
    });
  }

  for (const event of recentEventsResult.data ?? []) {
    activities.push({
      id: `event-${event.id}`,
      type: "EVENT",
      label: event.title,
      description: `Event status: ${event.status}.`,
      created_at: event.created_at,
    });
  }

  for (const attendance of recentAttendanceResult.data ?? []) {
    activities.push({
      id: `attendance-${attendance.id}`,
      type: "ATTENDANCE",
      label: "Attendance recorded",
      description: `Check-in method: ${attendance.method}.`,
      created_at: attendance.checked_in_at,
    });
  }

  for (const media of recentGalleryResult.data ?? []) {
    activities.push({
      id: `gallery-${media.id}`,
      type: "GALLERY",
      label: media.title || "Untitled media",
      description: `Gallery media status: ${media.status}.`,
      created_at: media.created_at,
    });
  }

  activities.sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime(),
  );

  return {
    students: studentsResult.count ?? 0,
    pendingStudents: pendingStudentsResult.count ?? 0,
    events: eventsResult.count ?? 0,
    attendance: attendanceResult.count ?? 0,
    activities: activities.slice(0, 8),
    hasError: errors.length > 0,
  };
}

export default async function AdminDashboard() {
  const dashboard = await getDashboardData();

  return (
    <main className="admin-dashboard">
      {/* Header */}
      <section className="admin-header">
        <div>
          <span className="admin-eyebrow">
            S.I.R.U.S. / ADMINISTRATION
          </span>

          <h1>
            Control
            <br />
            <span>Center.</span>
          </h1>

          <p>
            Manage students, events, attendance and media across the
            S.I.R.U.S. platform.
          </p>
        </div>

        <div className="admin-status">
          <span className="admin-status-dot" />
          <span>ADMIN ACCESS</span>
        </div>
      </section>

      {/* System Overview */}
      <section className="admin-overview">
        <div className="admin-overview-heading">
          <span>01 / SYSTEM OVERVIEW</span>

          <h2>
            S.I.R.U.S.
            <br />
            operations.
          </h2>
        </div>

        <div className="admin-overview-grid">
          <div className="admin-stat">
            <span>STUDENTS</span>

            <strong>{dashboard.students}</strong>

            <small>Total student records</small>
          </div>

          <div className="admin-stat">
            <span>PENDING ONBOARDING</span>

            <strong>{dashboard.pendingStudents}</strong>

            <small>Awaiting approval</small>
          </div>

          <div className="admin-stat">
            <span>EVENTS</span>

            <strong>{dashboard.events}</strong>

            <small>Total event records</small>
          </div>

          <div className="admin-stat">
            <span>ATTENDANCE</span>

            <strong>{dashboard.attendance}</strong>

            <small>Present check-ins</small>
          </div>
        </div>
      </section>

      {/* Management Modules */}
      <section className="admin-modules">
        <div className="admin-section-heading">
          <span>02 / MANAGEMENT</span>

          <h2>
            Club
            <br />
            systems.
          </h2>
        </div>

        <div className="admin-module-grid">
          {adminModules.map((module) => (
            <Link
              href={module.href}
              key={module.number}
              className="admin-module"
            >
              <div className="admin-module-top">
                <span>{module.number}</span>
                <span>↗</span>
              </div>

              <div className="admin-module-content">
                <h3>{module.title}</h3>

                <p>{module.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Administrative Access */}
      <section className="admin-access">
        <div className="admin-section-heading">
          <span>03 / ACCESS</span>

          <h2>
            Administrative
            <br />
            control.
          </h2>
        </div>

        <div className="role-grid">
          <div className="role-panel">
            <span>ROLE / ADMIN</span>

            <h3>Authorized management access.</h3>

            <p>
              Administrators can review student onboarding, manage events,
              control attendance sessions and manage published gallery media.
            </p>
          </div>
        </div>
      </section>

      {/* Activity */}
      <section className="admin-activity">
        <div className="admin-section-heading compact">
          <span>04 / ACTIVITY</span>

          <h2>Recent activity.</h2>
        </div>

        {dashboard.activities.length === 0 ? (
          <div className="admin-empty">
            <span>SYSTEM ACTIVITY</span>

            <h3>No activity available.</h3>

            <p>
              Administrative activity will appear here once records are
              created.
            </p>
          </div>
        ) : (
          <div className="admin-activity-list">
            {dashboard.activities.map((activity) => (
              <article
                key={activity.id}
                className="admin-activity-item"
              >
                <div className="admin-activity-type">
                  <span>{activity.type}</span>
                </div>

                <div className="admin-activity-content">
                  <h3>{activity.label}</h3>

                  <p>{activity.description}</p>
                </div>

                <time dateTime={activity.created_at}>
                  {formatActivityDate(activity.created_at)}
                </time>
              </article>
            ))}
          </div>
        )}

        {dashboard.hasError && (
          <p className="admin-dashboard-warning">
            Some dashboard data could not be loaded. Check the server logs
            for details.
          </p>
        )}
      </section>

      {/* Footer */}
      <section className="admin-footer">
        <span>S.I.R.U.S. / ADMINISTRATION</span>

        <p>
          Research.
          <br />
          Build.
          <br />
          Innovate.
        </p>
      </section>
    </main>
  );
}