import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const vtuId = request.nextUrl.searchParams.get("vtuId")?.trim();

    if (!vtuId) {
      return NextResponse.json(
        { error: "VTU number is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // ---------------------------------------------------------
    // 1. Find student
    // ---------------------------------------------------------

    const {
      data: student,
      error: studentError,
    } = await supabase
      .from("students")
      .select("id, name, vtu_id, status")
      .eq("vtu_id", vtuId)
      .maybeSingle();

    if (studentError) {
      console.error("Student attendance lookup failed:", {
        code: studentError.code,
        message: studentError.message,
        details: studentError.details,
        hint: studentError.hint,
      });

      return NextResponse.json(
        { error: "Unable to retrieve student information." },
        { status: 500 }
      );
    }

    if (!student) {
      return NextResponse.json(
        { error: "No student found with this VTU number." },
        { status: 404 }
      );
    }

    // ---------------------------------------------------------
    // 2. Check approval
    // ---------------------------------------------------------

    if (student.status !== "approved") {
      return NextResponse.json(
        {
          error:
            "Your S.I.R.U.S. membership is not approved for attendance access.",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // 3. Get attendance records
    // ---------------------------------------------------------

    const {
      data: records,
      error: recordsError,
    } = await supabase
      .from("attendance_records")
      .select(
        `
          id,
          session_id,
          checked_in_at,
          method,
          status
        `
      )
      .eq("student_id", student.id)
      .order("checked_in_at", { ascending: false });

    if (recordsError) {
      console.error("Attendance records lookup failed:", {
        code: recordsError.code,
        message: recordsError.message,
        details: recordsError.details,
        hint: recordsError.hint,
      });

      return NextResponse.json(
        { error: "Unable to retrieve attendance records." },
        { status: 500 }
      );
    }

    // No attendance records yet.
    if (!records || records.length === 0) {
      return NextResponse.json({
        student: {
          name: student.name,
          vtuId: student.vtu_id,
        },
        statistics: {
          sessions: 0,
          present: 0,
          absent: 0,
          attendancePercentage: 0,
        },
        attendance: [],
      });
    }

    // ---------------------------------------------------------
    // 4. Get attendance sessions
    // ---------------------------------------------------------

    const sessionIds = [
      ...new Set(records.map((record) => record.session_id)),
    ];

    const {
      data: sessions,
      error: sessionsError,
    } = await supabase
      .from("attendance_sessions")
      .select(
        `
          id,
          event_id,
          starts_at
        `
      )
      .in("id", sessionIds);

    if (sessionsError) {
      console.error("Attendance session lookup failed:", {
        code: sessionsError.code,
        message: sessionsError.message,
        details: sessionsError.details,
        hint: sessionsError.hint,
      });

      return NextResponse.json(
        { error: "Unable to retrieve attendance sessions." },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 5. Get related events
    // ---------------------------------------------------------

    const eventIds = [
      ...new Set(
        (sessions ?? [])
          .map((session) => session.event_id)
          .filter(Boolean)
      ),
    ];

    const {
      data: events,
      error: eventsError,
    } = await supabase
      .from("events")
      .select(
        `
          id,
          title,
          event_date,
          start_time,
          location
        `
      )
      .in("id", eventIds);

    if (eventsError) {
      console.error("Attendance event lookup failed:", {
        code: eventsError.code,
        message: eventsError.message,
        details: eventsError.details,
        hint: eventsError.hint,
      });

      return NextResponse.json(
        { error: "Unable to retrieve event information." },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 6. Build lookup maps
    // ---------------------------------------------------------

    const sessionMap = new Map(
      (sessions ?? []).map((session) => [
        session.id,
        session,
      ])
    );

    const eventMap = new Map(
      (events ?? []).map((event) => [
        event.id,
        event,
      ])
    );

    // ---------------------------------------------------------
    // 7. Build student attendance history
    // ---------------------------------------------------------

    const attendance = records
      .map((record) => {
        const session = sessionMap.get(record.session_id);

        if (!session) {
          console.warn(
            "Attendance record references missing session:",
            record.id
          );

          return null;
        }

        const event = eventMap.get(session.event_id);

        if (!event) {
          console.warn(
            "Attendance session references missing event:",
            session.id
          );

          return null;
        }

        return {
          id: record.id,
          eventTitle: event.title,
          eventDate: event.event_date,
          startTime: event.start_time,
          location: event.location,
          checkedInAt: record.checked_in_at,
          method: record.method,
          status: record.status,
        };
      })
      .filter(
        (
          record
        ): record is {
          id: string;
          eventTitle: string;
          eventDate: string;
          startTime: string;
          location: string | null;
          checkedInAt: string;
          method: "qr" | "admin" | "manual";
          status: "present" | "voided";
        } => record !== null
      );

    // ---------------------------------------------------------
    // 8. Calculate statistics
    // ---------------------------------------------------------

    const presentCount = attendance.filter(
      (record) => record.status === "present"
    ).length;

    const voidedCount = attendance.filter(
      (record) => record.status === "voided"
    ).length;

    const attendancePercentage =
      attendance.length > 0
        ? Math.round((presentCount / attendance.length) * 100)
        : 0;

    // ---------------------------------------------------------
    // 9. Return response
    // ---------------------------------------------------------

    return NextResponse.json({
      student: {
        name: student.name,
        vtuId: student.vtu_id,
      },

      statistics: {
        sessions: attendance.length,
        present: presentCount,
        absent: voidedCount,
        attendancePercentage,
      },

      attendance,
    });
  } catch (error) {
    console.error("Student attendance API error:", error);

    return NextResponse.json(
      {
        error: "Unable to process attendance request.",
      },
      { status: 500 }
    );
  }
}