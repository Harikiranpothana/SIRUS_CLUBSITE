"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const eventFilters = ["ALL", "UPCOMING", "PAST"];

type Event = {
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
  status: "draft" | "published" | "archived" | "cancelled";
};

type RegistrationForm = {
  name: string;
  phone: string;
  email: string;
  college: string;
};

const EVENT_COLUMNS = `
  id,
  title,
  slug,
  description,
  category,
  event_date,
  start_time,
  end_time,
  registration_deadline,
  location,
  capacity,
  registration_enabled,
  cover_image_url,
  status
`;

export default function StudentEventsPage() {
  const supabase = createClient();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [registration, setRegistration] =
    useState<RegistrationForm>({
      name: "",
      phone: "",
      email: "",
      college: "",
    });

  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] =
    useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError("");

    const { data, error: eventsError } = await supabase
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("status", "published")
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (eventsError) {
      console.error("Student events lookup failed:", eventsError);

      setError("Unable to load events right now.");
      setEvents([]);
      setLoading(false);
      return;
    }

    setEvents((data ?? []) as Event[]);
    setLoading(false);
  }

  const now = new Date();

  const upcomingEvents = useMemo(() => {
    return events.filter(
      (event) =>
        new Date(`${event.event_date}T${event.start_time}`) >= now
    );
  }, [events]);

  const pastEvents = useMemo(() => {
    return events.filter(
      (event) =>
        new Date(`${event.event_date}T${event.start_time}`) < now
    );
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (activeFilter === "UPCOMING") {
      result = upcomingEvents;
    }

    if (activeFilter === "PAST") {
      result = pastEvents;
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((event) =>
        [
          event.title,
          event.description,
          event.category,
          event.location,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      );
    }

    return result;
  }, [
    events,
    upcomingEvents,
    pastEvents,
    activeFilter,
    search,
  ]);

  function openRegistration(event: Event) {
    setSelectedEvent(event);

    setRegistration({
      name: "",
      phone: "",
      email: "",
      college: "",
    });

    setRegistrationError("");
    setRegistrationSuccess("");
  }

  function closeRegistration() {
    if (registering) {
      return;
    }

    setSelectedEvent(null);
    setRegistrationError("");
    setRegistrationSuccess("");
  }

  async function handleRegistration(
    formEvent: FormEvent<HTMLFormElement>
  ) {
    formEvent.preventDefault();

    if (!selectedEvent) {
      return;
    }

    setRegistrationError("");
    setRegistrationSuccess("");

    const name = registration.name.trim();
    const phone = registration.phone.trim();
    const email = registration.email.trim();
    const college = registration.college.trim();

    if (!name) {
      setRegistrationError("Enter your name.");
      return;
    }

    if (!phone) {
      setRegistrationError("Enter your mobile number.");
      return;
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) {
      setRegistrationError("Enter a valid mobile number.");
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setRegistrationError("Enter a valid email address.");
      return;
    }

    if (!canRegister(selectedEvent)) {
      setRegistrationError(
        "Registration for this event is currently closed."
      );
      return;
    }

    setRegistering(true);

    /*
     * Check whether this phone number is already registered
     * for this event.
     *
     * This is an application-level duplicate check because the
     * current event_registrations schema does not have a unique
     * constraint on event_id + phone.
     */
    const { data: existingRegistration, error: lookupError } =
      await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", selectedEvent.id)
        .eq("phone", phone)
        .eq("status", "registered")
        .maybeSingle();

    if (lookupError) {
      console.error(
        "Registration lookup failed:",
        lookupError
      );

      setRegistrationError(
        "Unable to verify registration. Please try again."
      );

      setRegistering(false);
      return;
    }

    if (existingRegistration) {
      setRegistrationError(
        "This mobile number is already registered for this event."
      );

      setRegistering(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("event_registrations")
      .insert({
        event_id: selectedEvent.id,
        student_id: null,
        name,
        phone,
        email: email || null,
        college: college || null,
        status: "registered",
      });

    if (insertError) {
      console.error(
        "Event registration failed:",
        insertError
      );

      setRegistrationError(
        "Unable to complete registration. Please try again."
      );

      setRegistering(false);
      return;
    }

    setRegistrationSuccess(
      `Registration confirmed for ${selectedEvent.title}.`
    );

    setRegistering(false);
  }

  return (
    <main className="student-events-page">
      {/* Header */}
      <section className="student-events-header">
        <div>
          <Link
            href="/dashboard"
            className="student-events-back"
          >
            ← STUDENT DASHBOARD
          </Link>

          <span className="student-events-eyebrow">
            STUDENT / EVENTS
          </span>

          <h1>
            Club
            <br />
            <span>Events.</span>
          </h1>

          <p>
            Discover published S.I.R.U.S. events, activities and
            opportunities available to members.
          </p>
        </div>

        <div className="student-events-access">
          <span>ACCESS</span>
          <strong>STUDENT</strong>
        </div>
      </section>

      {/* Overview */}
      <section className="student-events-overview">
        <div className="student-events-stat">
          <span>UPCOMING</span>

          <strong>
            {loading ? "—" : upcomingEvents.length}
          </strong>

          <small>
            Published upcoming events
          </small>
        </div>

        <div className="student-events-stat">
          <span>REGISTERED</span>

          <strong>—</strong>

          <small>
            Student identity not available
          </small>
        </div>

        <div className="student-events-stat">
          <span>COMPLETED</span>

          <strong>
            {loading ? "—" : pastEvents.length}
          </strong>

          <small>
            Published past events
          </small>
        </div>

        <div className="student-events-stat">
          <span>AVAILABLE</span>

          <strong>
            {loading ? "—" : events.length}
          </strong>

          <small>
            Published events
          </small>
        </div>
      </section>

      {/* Events database */}
      <section className="student-events-database">
        <div className="student-events-heading">
          <div>
            <span>01 / EVENT DATABASE</span>

            <h2>Published events.</h2>
          </div>

          <span className="student-events-db-status">
            DATABASE / {loading ? "LOADING" : "CONNECTED"}
          </span>
        </div>

        {/* Filters */}
        <div className="student-events-toolbar">
          <div className="student-events-search">
            <span>SEARCH</span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search events..."
              aria-label="Search events"
            />
          </div>

          <div className="student-events-filters">
            {eventFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`student-event-filter ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() =>
                  setActiveFilter(filter)
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Database error */}
        {error && (
          <div className="student-events-error">
            <span>EVENT DATABASE ERROR</span>

            <p>{error}</p>

            <button
              type="button"
              onClick={loadEvents}
            >
              RETRY
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="student-events-empty">
            <div className="student-events-empty-index">
              00
            </div>

            <div>
              <span>PUBLISHED EVENTS</span>

              <h3>Loading events.</h3>

              <p>
                Retrieving published event records from the
                S.I.R.U.S. database.
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredEvents.length === 0 && (
            <div className="student-events-empty">
              <div className="student-events-empty-index">
                00
              </div>

              <div>
                <span>PUBLISHED EVENTS</span>

                <h3>
                  {events.length === 0
                    ? "No events available."
                    : "No matching events."}
                </h3>

                <p>
                  {events.length === 0
                    ? "Events published by S.I.R.U.S. administrators will appear here automatically."
                    : "Try another search term or change the event filter."}
                </p>
              </div>
            </div>
          )}

        {/* Event records */}
        {!loading &&
          !error &&
          filteredEvents.length > 0 && (
            <div className="student-event-list">
              {filteredEvents.map((event, index) => (
                <article
                  key={event.id}
                  className="student-event-card"
                >
                  <div className="student-event-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="student-event-date">
                    <span>
                      {formatMonth(event.event_date)}
                    </span>

                    <strong>
                      {formatDay(event.event_date)}
                    </strong>

                    <small>
                      {formatYear(event.event_date)}
                    </small>
                  </div>

                  <div className="student-event-main">
                    <span>
                      {event.category}
                    </span>

                    <h3>{event.title}</h3>

                    <p>
                      {event.description ||
                        "No event description available."}
                    </p>

                    <div className="student-event-details">
                      <span>
                        {formatTime(event.start_time)}

                        {event.end_time
                          ? ` — ${formatTime(
                              event.end_time
                            )}`
                          : ""}
                      </span>

                      <span>
                        {event.location ||
                          "LOCATION TBA"}
                      </span>
                    </div>
                  </div>

                  <div className="student-event-meta">
                    <span>REGISTRATION</span>

                    <strong>
                      {getRegistrationStatus(event)}
                    </strong>

                    <button
                      type="button"
                      disabled={!canRegister(event)}
                      onClick={() =>
                        openRegistration(event)
                      }
                    >
                      {canRegister(event)
                        ? "REGISTER"
                        : "CLOSED"}

                      <span>↗</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* Registration */}
      <section className="student-events-registration">
        <div className="student-events-heading">
          <div>
            <span>02 / EVENT PARTICIPATION</span>

            <h2>
              From discovery to participation.
            </h2>
          </div>
        </div>

        <div className="student-events-registration-grid">
          <div>
            <span>01</span>

            <h3>DISCOVER</h3>

            <p>
              Browse published S.I.R.U.S. events available
              to members.
            </p>
          </div>

          <div>
            <span>02</span>

            <h3>REGISTER</h3>

            <p>
              Register for events that require participant
              registration.
            </p>
          </div>

          <div>
            <span>03</span>

            <h3>PARTICIPATE</h3>

            <p>
              Attend the selected event and participate in
              the scheduled activity.
            </p>
          </div>

          <div>
            <span>04</span>

            <h3>ATTENDANCE</h3>

            <p>
              Attendance can be recorded through the
              S.I.R.U.S. attendance system when enabled for
              the event.
            </p>
          </div>
        </div>
      </section>

      {/* Event source */}
      <section className="student-events-source">
        <span>EVENT ARCHITECTURE</span>

        <h2>
          One event.
          <br />
          One source.
        </h2>

        <p>
          Student events are read from the same event records
          managed through the S.I.R.U.S. administrator portal.
          Only published events will appear here.
        </p>
      </section>

      {/* Registration modal */}
      {selectedEvent && (
        <div
          className="student-event-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !registering
            ) {
              closeRegistration();
            }
          }}
        >
          <section className="student-event-modal">
            <div className="student-event-modal-header">
              <div>
                <span>EVENT REGISTRATION</span>

                <h2>{selectedEvent.title}</h2>
              </div>

              <button
                type="button"
                className="student-event-modal-close"
                onClick={closeRegistration}
                disabled={registering}
                aria-label="Close registration"
              >
                ×
              </button>
            </div>

            <div className="student-event-modal-event">
              <span>
                {selectedEvent.category}
              </span>

              <strong>
                {formatEventDate(
                  selectedEvent.event_date
                )}
              </strong>

              <small>
                {formatTime(
                  selectedEvent.start_time
                )}

                {selectedEvent.location
                  ? ` · ${selectedEvent.location}`
                  : ""}
              </small>
            </div>

            {registrationSuccess ? (
              <div className="student-event-registration-success">
                <span>
                  REGISTRATION CONFIRMED
                </span>

                <h3>
                  You're registered.
                </h3>

                <p>
                  {registrationSuccess}
                </p>

                <button
                  type="button"
                  onClick={closeRegistration}
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <form
                className="student-event-registration-form"
                onSubmit={handleRegistration}
              >
                <label>
                  <span>NAME *</span>

                  <input
                    type="text"
                    value={registration.name}
                    onChange={(event) =>
                      setRegistration({
                        ...registration,
                        name: event.target.value,
                      })
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    disabled={registering}
                  />
                </label>

                <label>
                  <span>
                    MOBILE NUMBER *
                  </span>

                  <input
                    type="tel"
                    value={registration.phone}
                    onChange={(event) =>
                      setRegistration({
                        ...registration,
                        phone: event.target.value,
                      })
                    }
                    placeholder="Your mobile number"
                    inputMode="tel"
                    autoComplete="tel"
                    disabled={registering}
                  />
                </label>

                <label>
                  <span>EMAIL</span>

                  <input
                    type="email"
                    value={registration.email}
                    onChange={(event) =>
                      setRegistration({
                        ...registration,
                        email: event.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={registering}
                  />
                </label>

                <label>
                  <span>COLLEGE</span>

                  <input
                    type="text"
                    value={registration.college}
                    onChange={(event) =>
                      setRegistration({
                        ...registration,
                        college: event.target.value,
                      })
                    }
                    placeholder="College / Institution"
                    autoComplete="organization"
                    disabled={registering}
                  />
                </label>

                {registrationError && (
                  <div className="student-event-registration-error">
                    {registrationError}
                  </div>
                )}

                <button
                  type="submit"
                  className="student-event-register-submit"
                  disabled={registering}
                >
                  {registering
                    ? "REGISTERING..."
                    : "CONFIRM REGISTRATION"}

                  <span>↗</span>
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   Helpers
   ========================================================= */

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
  })
    .format(new Date(`${value}T00:00:00`))
    .toUpperCase();
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

function formatYear(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string) {
  const [hours, minutes] = value
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function canRegister(event: Event) {
  if (!event.registration_enabled) {
    return false;
  }

  if (
    event.registration_deadline &&
    new Date(event.registration_deadline).getTime() <
      Date.now()
  ) {
    return false;
  }

  return true;
}

function getRegistrationStatus(event: Event) {
  if (!event.registration_enabled) {
    return "CLOSED";
  }

  if (
    event.registration_deadline &&
    new Date(event.registration_deadline).getTime() <
      Date.now()
  ) {
    return "CLOSED";
  }

  return "OPEN";
}