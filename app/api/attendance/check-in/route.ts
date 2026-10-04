import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Validate the QR/session token and return event information.
|--------------------------------------------------------------------------
*/

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")?.trim();

    if (!token) {
      return NextResponse.json(
        { error: "Attendance token is missing." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const tokenHash = hashToken(token);

    const { data: session, error: sessionError } = await supabase
      .from("attendance_sessions")
      .select(`
        id,
        event_id,
        starts_at,
        expires_at,
        status,
        events (
          title
        )
      `)
      .eq("session_token_hash", tokenHash)
      .maybeSingle();

    if (sessionError) {
      console.error("Attendance session lookup failed:", sessionError);

      return NextResponse.json(
        { error: "Unable to verify attendance session." },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Invalid attendance QR code." },
        { status: 404 }
      );
    }

    const now = Date.now();
    const startsAt = new Date(session.starts_at).getTime();
    const expiresAt = new Date(session.expires_at).getTime();

    if (session.status !== "active") {
      return NextResponse.json(
        { error: "This attendance session is no longer active." },
        { status: 410 }
      );
    }

    if (now < startsAt) {
      return NextResponse.json(
        { error: "This attendance session has not started yet." },
        { status: 400 }
      );
    }

    if (now >= expiresAt) {
      return NextResponse.json(
        { error: "This attendance session has expired." },
        { status: 410 }
      );
    }

    const event = Array.isArray(session.events)
      ? session.events[0]
      : session.events;

    return NextResponse.json({
      valid: true,
      eventTitle: event?.title ?? "S.I.R.U.S. Event",
      expiresAt: session.expires_at,
    });
  } catch (error) {
    console.error("Attendance GET error:", error);

    return NextResponse.json(
      { error: "Unable to process attendance request." },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
| Verify an approved student and record attendance.
|--------------------------------------------------------------------------
*/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const token =
      typeof body.token === "string"
        ? body.token.trim()
        : "";

    const vtuId =
      typeof body.vtuId === "string"
        ? body.vtuId.trim()
        : "";

    if (!token) {
      return NextResponse.json(
        { error: "Attendance token is missing." },
        { status: 400 }
      );
    }

    if (!vtuId) {
      return NextResponse.json(
        { error: "VTU ID is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const tokenHash = hashToken(token);

    /*
    |--------------------------------------------------------------------------
    | 1. Verify attendance session
    |--------------------------------------------------------------------------
    */

    const { data: session, error: sessionError } = await supabase
      .from("attendance_sessions")
      .select(
        "id,event_id,starts_at,expires_at,status"
      )
      .eq("session_token_hash", tokenHash)
      .maybeSingle();

    if (sessionError) {
      console.error("Session lookup failed:", sessionError);

      return NextResponse.json(
        { error: "Unable to verify attendance session." },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Invalid attendance QR code." },
        { status: 404 }
      );
    }

    const now = Date.now();
    const startsAt = new Date(session.starts_at).getTime();
    const expiresAt = new Date(session.expires_at).getTime();

    if (session.status !== "active") {
      return NextResponse.json(
        { error: "This attendance session is no longer active." },
        { status: 410 }
      );
    }

    if (now < startsAt) {
      return NextResponse.json(
        { error: "This attendance session has not started yet." },
        { status: 400 }
      );
    }

    if (now >= expiresAt) {
      return NextResponse.json(
        { error: "This attendance session has expired." },
        { status: 410 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Find student
    |--------------------------------------------------------------------------
    */

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id,name,vtu_id,status")
      .eq("vtu_id", vtuId)
      .maybeSingle();

    if (studentError) {
      console.error("Student lookup failed:", studentError);

      return NextResponse.json(
        { error: "Unable to verify student information." },
        { status: 500 }
      );
    }

    if (!student) {
      return NextResponse.json(
        { error: "No student found with this VTU ID." },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Student must be approved
    |--------------------------------------------------------------------------
    */

    if (student.status !== "approved") {
      return NextResponse.json(
        {
          error:
            "Your S.I.R.U.S. membership is not approved for attendance.",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Prevent duplicate attendance
    |--------------------------------------------------------------------------
    */

    const { data: existingRecord, error: existingError } =
      await supabase
        .from("attendance_records")
        .select("id,status")
        .eq("session_id", session.id)
        .eq("student_id", student.id)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Duplicate attendance check failed:",
        existingError
      );

      return NextResponse.json(
        { error: "Unable to check previous attendance." },
        { status: 500 }
      );
    }

    if (
      existingRecord &&
      existingRecord.status === "present"
    ) {
      return NextResponse.json(
        {
          error:
            "Attendance has already been recorded for this session.",
        },
        { status: 409 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Record attendance
    |--------------------------------------------------------------------------
    */

    const { error: insertError } = await supabase
      .from("attendance_records")
      .insert({
        session_id: session.id,
        student_id: student.id,
        method: "qr",
        status: "present",
      });

    if (insertError) {
      console.error(
        "Attendance insert failed:",
        insertError
      );

      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "Attendance has already been recorded for this session.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Unable to record attendance." },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 6. Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      success: true,
      message: `Attendance recorded for ${student.name}.`,
    });
  } catch (error) {
    console.error("Attendance POST error:", error);

    return NextResponse.json(
      { error: "Invalid attendance request." },
      { status: 400 }
    );
  }
}