import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

type EventPayload = {
  title: string;
  slug: string;
  description: string | null;
  category: string;
  event_date: string;
  start_time: string;
  end_time: string | null;
  registration_deadline: string | null;
  location: string | null;
  capacity: number | null;
  registration_enabled: boolean;
  cover_image_url: string | null;
};

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookie writes are not required for this request.
          }
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (user.app_metadata?.role !== "admin") {
    return null;
  }

  return user;
}

export async function POST(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as EventPayload;

    if (
      !body.title?.trim() ||
      !body.slug?.trim() ||
      !body.category?.trim() ||
      !body.event_date ||
      !body.start_time
    ) {
      return NextResponse.json(
        { error: "Missing required event fields." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("events")
      .insert({
        title: body.title.trim(),
        slug: body.slug.trim(),
        description: body.description,
        category: body.category.trim(),
        event_date: body.event_date,
        start_time: body.start_time,
        end_time: body.end_time,
        registration_deadline: body.registration_deadline,
        location: body.location,
        capacity: body.capacity,
        registration_enabled: body.registration_enabled,
        cover_image_url: body.cover_image_url,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Admin event creation error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "An event with this slug already exists." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        event: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin event API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create the event.",
      },
      { status: 500 },
    );
  }
}