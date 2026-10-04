"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EventStatus = "draft" | "published" | "archived" | "cancelled";

type EventRecord = {
  id: string;
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
  status: EventStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

const eventFilters = ["ALL", "DRAFT", "PUBLISHED", "ARCHIVED", "CANCELLED"] as const;

type EventFilter = (typeof eventFilters)[number];

type EventForm = {
  title: string;
  slug: string;
  description: string;
  category: string;
  event_date: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  location: string;
  capacity: string;
  registration_enabled: boolean;
  cover_image_url: string;
};

const emptyForm: EventForm = {
  title: "",
  slug: "",
  description: "",
  category: "",
  event_date: "",
  start_time: "",
  end_time: "",
  registration_deadline: "",
  location: "",
  capacity: "",
  registration_enabled: true,
  cover_image_url: "",
};

const EVENT_COLUMNS =
  "id, title, slug, description, category, event_date, start_time, end_time, registration_deadline, location, capacity, registration_enabled, cover_image_url, status, created_at, updated_at, published_at";

/* ---------- Pure helpers (kept outside the component) ---------- */

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatEventDateInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function isValidCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function formatRegistrationDeadlineInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);

  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;

  if (digits.length <= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  }

  if (digits.length <= 10) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)} ${digits.slice(8)}`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)} ${digits.slice(8, 10)}:${digits.slice(10)}`;
}

function isValidRegistrationDeadline(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(value);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hours = Number(match[4]);
  const minutes = Number(match[5]);

  if (hours > 23 || minutes > 59) return false;

  const date = new Date(year, month - 1, day, hours, minutes);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hours &&
    date.getMinutes() === minutes
  );
}

function registrationDeadlineToIso(value: string): string | null {
  if (!isValidRegistrationDeadline(value)) return null;

  const [datePart, timePart] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes).toISOString();
}

function isoToRegistrationDeadline(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/* ---------- Page ---------- */

export default function EventsManagerPage() {
  const supabase = useMemo(() => createClient(), []);

  const [events, setEvents] = useState<EventRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<EventFilter>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("events")
      .select(EVENT_COLUMNS)
      .order("event_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (fetchError) {
      console.error("Events fetch error:", fetchError);
      setError("Unable to load event records.");
      setEvents([]);
      setLoading(false);
      return;
    }

    setEvents((data ?? []) as EventRecord[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  function updateForm<K extends keyof EventForm>(field: K, value: EventForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateForm() {
    setEditingEventId(null);
    setForm(emptyForm);
    setError("");
    setFormOpen(true);
  }

  function openEditForm(event: EventRecord) {
    setEditingEventId(event.id);
    setError("");
    setForm({
      title: event.title,
      slug: event.slug,
      description: event.description ?? "",
      category: event.category,
      event_date: event.event_date,
      start_time: event.start_time.slice(0, 5),
      end_time: event.end_time ? event.end_time.slice(0, 5) : "",
      registration_deadline: isoToRegistrationDeadline(event.registration_deadline),
      location: event.location ?? "",
      capacity: event.capacity !== null ? String(event.capacity) : "",
      registration_enabled: event.registration_enabled,
      cover_image_url: event.cover_image_url ?? "",
    });
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingEventId(null);
    setForm(emptyForm);
    setError("");
  }

  /** Returns either a payload or a validation error message. */
  function buildPayload():
    | { error: string }
    | { payload: Record<string, unknown> } {
    const title = form.title.trim();
    const slug = form.slug.trim() || createSlug(form.title);
    const category = form.category.trim();

    if (!title || !slug || !category || !form.event_date || !form.start_time) {
      return { error: "Please complete all required event fields." };
    }

    if (!isValidCalendarDate(form.event_date)) {
      return {
        error: "Event date must be in YYYY-MM-DD format and be a valid date.",
      };
    }

    if (
      form.registration_deadline &&
      !isValidRegistrationDeadline(form.registration_deadline)
    ) {
      return {
        error:
          "Registration deadline must be in YYYY-MM-DD HH:MM format and be a valid date and time.",
      };
    }

    if (
      form.registration_deadline &&
      form.registration_deadline >= `${form.event_date} ${form.start_time}`
    ) {
      return { error: "Registration deadline must be before the event start time." };
    }

    if (form.end_time && form.end_time <= form.start_time) {
      return { error: "End time must be later than the start time." };
    }

    let capacity: number | null = null;

    if (form.capacity.trim()) {
      const parsed = Number(form.capacity);

      if (!Number.isInteger(parsed) || parsed <= 0) {
        return { error: "Capacity must be a positive whole number." };
      }

      capacity = parsed;
    }

    return {
      payload: {
        title,
        slug,
        description: form.description.trim() || null,
        category,
        event_date: form.event_date,
        start_time: form.start_time,
        end_time: form.end_time || null,
        registration_deadline: form.registration_deadline
          ? registrationDeadlineToIso(form.registration_deadline)
          : null,
        location: form.location.trim() || null,
        capacity,
        registration_enabled: form.registration_enabled,
        cover_image_url: form.cover_image_url.trim() || null,
      },
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");

  const result = buildPayload();

  if ("error" in result) {
    setError(result.error);
    return;
  }

  setSaving(true);

  try {
    if (editingEventId) {
      // Editing existing event
      const { error: updateError } = await supabase
        .from("events")
        .update(result.payload)
        .eq("id", editingEventId);

      if (updateError) {
        console.error("Event update error:", updateError);

        setError(
          updateError.code === "23505"
            ? "An event with this slug already exists."
            : updateError.message || "Unable to update the event."
        );

        return;
      }
    } else {
      // Creating a NEW draft
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(result.payload),
      });

      const responseText = await response.text();

      let responseData: {
        success?: boolean;
        event?: EventRecord;
        error?: string;
      } = {};

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        console.error(
          "Non-JSON response from /api/admin/events:",
          responseText
        );

        setError(
          `Server returned an invalid response (${response.status}).`
        );

        return;
      }

      if (!response.ok) {
        console.error(
          "Event creation API error:",
          response.status,
          responseData
        );

        setError(
          responseData.error ||
            `Unable to create the event (${response.status}).`
        );

        return;
      }

      if (!responseData.success || !responseData.event) {
        console.error(
          "Invalid event creation response:",
          responseData
        );

        setError("Event was not created.");
        return;
      }
    }
  } catch (err) {
    console.error("Event save error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong while saving the event."
    );

    return;
  } finally {
    setSaving(false);
  }

  setFormOpen(false);
  setEditingEventId(null);
  setForm(emptyForm);

  await loadEvents();
}

  async function updateEventStatus(
    eventId: string,
    status: "published" | "archived" | "cancelled"
  ) {
    if (status === "cancelled") {
      const confirmed = window.confirm("Cancel this event?");
      if (!confirmed) return;
    }

    setActionLoading(eventId);
    setError("");

    const updateData: { status: EventStatus; published_at?: string } = { status };

    if (status === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", eventId);

    if (updateError) {
      console.error("Event status update error:", updateError);
      setError("Unable to update the event status.");
      setActionLoading(null);
      return;
    }

    setEvents((current) =>
      current.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              status,
              published_at: updateData.published_at ?? ev.published_at,
            }
          : ev
      )
    );

    setActionLoading(null);
  }

  async function deleteEvent(eventId: string) {
    const confirmed = window.confirm("Delete this draft event permanently?");
    if (!confirmed) return;

    setActionLoading(eventId);
    setError("");

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)
      .eq("status", "draft");

    if (deleteError) {
      console.error("Event deletion error:", deleteError);
      setError("Unable to delete the event.");
      setActionLoading(null);
      return;
    }

    setEvents((current) => current.filter((ev) => ev.id !== eventId));
    setActionLoading(null);
  }

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return events.filter((ev) => {
      const matchesStatus =
        activeFilter === "ALL" || ev.status === activeFilter.toLowerCase();

      const matchesSearch =
        !term ||
        ev.title.toLowerCase().includes(term) ||
        ev.category.toLowerCase().includes(term) ||
        ev.slug.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [events, activeFilter, search]);

  const totalEvents = events.length;
  const draftEvents = events.filter((e) => e.status === "draft").length;
  const publishedEvents = events.filter((e) => e.status === "published").length;
  const archivedEvents = events.filter((e) => e.status === "archived").length;

  return (
    <main className="events-manager-page">
      {/* Header */}
      <section className="events-manager-header">
        <div>
          <Link href="/admin" className="events-manager-back">
            ← MANAGEMENT PORTAL
          </Link>

          <span className="events-manager-eyebrow">MANAGEMENT / EVENTS</span>

          <h1>
            Event
            <br />
            <span>Manager.</span>
          </h1>

          <p>
            Create and manage S.I.R.U.S. events, activities, workshops,
            challenges and other club programs.
          </p>
        </div>

        <div className="events-manager-access">
          <span>ACCESS</span>
          <strong>ADMIN</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="events-manager-overview">
        <div className="event-manager-stat">
          <span>TOTAL EVENTS</span>
          <strong>{loading ? "—" : totalEvents}</strong>
          <small>All event records</small>
        </div>

        <div className="event-manager-stat">
          <span>DRAFTS</span>
          <strong>{loading ? "—" : draftEvents}</strong>
          <small>Private events</small>
        </div>

        <div className="event-manager-stat">
          <span>PUBLISHED</span>
          <strong>{loading ? "—" : publishedEvents}</strong>
          <small>Public events</small>
        </div>

        <div className="event-manager-stat">
          <span>ARCHIVED</span>
          <strong>{loading ? "—" : archivedEvents}</strong>
          <small>Event history</small>
        </div>
      </section>

      {/* Event database */}
      <section className="events-manager-database">
        <div className="events-manager-heading">
          <div>
            <span>01 / EVENT DATABASE</span>
            <h2>Events.</h2>
          </div>

          <span className="events-manager-db-status">
            {loading ? "DATABASE / LOADING" : "DATABASE / CONNECTED"}
          </span>
        </div>

        {/* Toolbar */}
        <div className="events-manager-toolbar">
          <div className="event-search">
            <span>SEARCH</span>
            <input
              type="text"
              placeholder="Search events..."
              aria-label="Search events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="event-filters">
            {eventFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`event-filter ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="create-event-button"
            onClick={openCreateForm}
          >
            CREATE EVENT
            <span>+</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        {/* Create / Edit form */}
        {formOpen && (
          <div className="event-form-panel">
            <div className="event-form-header">
              <div>
                <span>{editingEventId ? "EVENT / EDIT" : "EVENT / CREATE"}</span>
                <h3>{editingEventId ? "Edit event." : "Create event."}</h3>
              </div>

              <button type="button" onClick={closeForm} disabled={saving}>
                CLOSE
              </button>
            </div>

            <form className="event-form" onSubmit={handleSubmit} noValidate>
              <div className="event-form-grid">
                <label>
                  <span>TITLE *</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      const value = e.target.value;

                      setForm((current) => ({
                        ...current,
                        title: value,
                        slug: editingEventId ? current.slug : createSlug(value),
                      }));
                    }}
                    placeholder="Event title"
                    required
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>SLUG *</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateForm("slug", createSlug(e.target.value))}
                    placeholder="event-slug"
                    required
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>CATEGORY *</span>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    placeholder="Workshop, Hackathon, Talk..."
                    required
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>LOCATION</span>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateForm("location", e.target.value)}
                    placeholder="Venue or online"
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>EVENT DATE *</span>
                  <input
                    type="text"
                    value={form.event_date}
                    onChange={(e) =>
                      updateForm("event_date", formatEventDateInput(e.target.value))
                    }
                    placeholder="YYYY-MM-DD"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={10}
                    required
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>START TIME *</span>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => updateForm("start_time", e.target.value)}
                    required
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>END TIME</span>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => updateForm("end_time", e.target.value)}
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>REGISTRATION DEADLINE</span>
                  <input
                    type="text"
                    value={form.registration_deadline}
                    onChange={(e) =>
                      updateForm(
                        "registration_deadline",
                        formatRegistrationDeadlineInput(e.target.value)
                      )
                    }
                    placeholder="YYYY-MM-DD HH:MM"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={16}
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>CAPACITY</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.capacity}
                    onChange={(e) => updateForm("capacity", e.target.value)}
                    placeholder="Leave empty for unlimited"
                    disabled={saving}
                  />
                </label>

                <label>
                  <span>COVER IMAGE URL</span>
                  <input
                    type="url"
                    value={form.cover_image_url}
                    onChange={(e) => updateForm("cover_image_url", e.target.value)}
                    placeholder="https://..."
                    disabled={saving}
                  />
                </label>

                <label className="event-form-full">
                  <span>DESCRIPTION</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Describe the event..."
                    rows={5}
                    disabled={saving}
                  />
                </label>

                <label className="event-checkbox">
                  <input
                    type="checkbox"
                    checked={form.registration_enabled}
                    onChange={(e) =>
                      updateForm("registration_enabled", e.target.checked)
                    }
                    disabled={saving}
                  />
                  <span>REGISTRATION ENABLED</span>
                </label>
              </div>

              <div className="event-form-actions">
                <button type="button" onClick={closeForm} disabled={saving}>
                  CANCEL
                </button>

                <button type="submit" disabled={saving}>
                  {saving
                    ? "SAVING..."
                    : editingEventId
                      ? "SAVE CHANGES"
                      : "CREATE DRAFT"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="events-manager-empty">
            <div className="events-empty-index">...</div>
            <div>
              <span>EVENT RECORDS</span>
              <h3>Loading events.</h3>
              <p>Retrieving event data from the S.I.R.U.S. database.</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredEvents.length === 0 && (
          <div className="events-manager-empty">
            <div className="events-empty-index">00</div>
            <div>
              <span>EVENT RECORDS</span>
              <h3>
                {events.length === 0 ? "No events available." : "No matching events."}
              </h3>
              <p>
                {events.length === 0
                  ? "Create an event to begin building the S.I.R.U.S. event database."
                  : "Try another search term or event status filter."}
              </p>
            </div>
          </div>
        )}

        {/* Event records */}
        {!loading && filteredEvents.length > 0 && (
          <div className="event-record-list">
            {filteredEvents.map((event) => {
              const busy = actionLoading === event.id;

              return (
                <article className="event-record" key={event.id}>
                  <div className="event-record-main">
                    <div className="event-record-date">
                      <span>{formatDate(event.event_date)}</span>
                      <strong>{formatTime(event.start_time)}</strong>
                    </div>

                    <div className="event-record-info">
                      <span>{event.category}</span>
                      <h3>{event.title}</h3>
                      <p>{event.location || "Location not specified"}</p>
                    </div>
                  </div>

                  <div className="event-record-actions">
                    <span className={`event-status event-status-${event.status}`}>
                      {event.status.toUpperCase()}
                    </span>

                    <div className="event-action-buttons">
                      <button
                        type="button"
                        onClick={() => openEditForm(event)}
                        disabled={busy}
                      >
                        EDIT
                      </button>

                      {event.status === "draft" && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateEventStatus(event.id, "published")}
                            disabled={busy}
                          >
                            PUBLISH
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteEvent(event.id)}
                            disabled={busy}
                          >
                            DELETE
                          </button>
                        </>
                      )}

                      {event.status === "published" && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateEventStatus(event.id, "archived")}
                            disabled={busy}
                          >
                            ARCHIVE
                          </button>

                          <button
                            type="button"
                            onClick={() => updateEventStatus(event.id, "cancelled")}
                            disabled={busy}
                          >
                            CANCEL
                          </button>
                        </>
                      )}

                      {event.status === "archived" && (
                        <button
                          type="button"
                          onClick={() => updateEventStatus(event.id, "published")}
                          disabled={busy}
                        >
                          REPUBLISH
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

      {/* Event publishing flow */}
      <section className="event-publishing">
        <div className="events-manager-heading">
          <div>
            <span>02 / PUBLISHING WORKFLOW</span>
            <h2>From draft to public.</h2>
          </div>
        </div>

        <div className="event-publishing-grid">
          <div>
            <span>01</span>
            <h3>CREATE</h3>
            <p>
              An authorized administrator creates the event and enters its
              information.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>DRAFT</h3>
            <p>
              The event remains private while its details are being prepared and
              reviewed.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>PUBLISH</h3>
            <p>
              A published event becomes available on the public S.I.R.U.S.
              events page.
            </p>
          </div>

          <div>
            <span>04</span>
            <h3>ARCHIVE</h3>
            <p>
              Completed events can be archived while remaining available in the
              event history.
            </p>
          </div>
        </div>
      </section>

      {/* Event data structure */}
      <section className="event-fields">
        <div className="events-manager-heading">
          <div>
            <span>03 / EVENT INFORMATION</span>
            <h2>One source of truth.</h2>
          </div>
        </div>

        <div className="event-fields-grid">
          <div>
            <span>IDENTITY</span>
            <p>Title, slug, description and event category.</p>
          </div>

          <div>
            <span>SCHEDULE</span>
            <p>Date, start time, end time and registration deadline.</p>
          </div>

          <div>
            <span>LOCATION</span>
            <p>Venue or online event information.</p>
          </div>

          <div>
            <span>MEDIA</span>
            <p>Event cover image and supporting media.</p>
          </div>

          <div>
            <span>REGISTRATION</span>
            <p>Registration availability and participant limits.</p>
          </div>

          <div>
            <span>STATUS</span>
            <p>Draft, published, archived or cancelled state.</p>
          </div>
        </div>
      </section>

      {/* Permissions */}
      <section className="events-manager-permissions">
        <span>ACCESS CONTROL</span>
        <h2>Administrator event management.</h2>

        <div className="event-permission-grid">
          <div>
            <span>ADMIN</span>
            <p>
              Administrators can create, edit, publish, archive, cancel and
              manage S.I.R.U.S. events.
            </p>
          </div>

          <div>
            <span>PUBLIC OUTPUT</span>
            <p>
              Published events automatically become available on the public
              S.I.R.U.S. events page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}