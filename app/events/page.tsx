"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

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

export default function EventsPage() {
  const supabase = createClient();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);

  const [registration, setRegistration] =
    useState<RegistrationForm>({
      name: "",
      phone: "",
      email: "",
      college: "",
    });

  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] =
    useState("");
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
      console.error("Public events lookup failed:", eventsError);

      setEvents([]);
      setError("Unable to load events right now.");
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
        new Date(
          `${event.event_date}T${event.start_time}`
        ) >= now
    );
  }, [events]);

  const pastEvents = useMemo(() => {
    return events
      .filter(
        (event) =>
          new Date(
            `${event.event_date}T${event.start_time}`
          ) < now
      )
      .reverse();
  }, [events]);

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
  formEvent: FormEvent<HTMLFormElement>,
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
      "Registration for this event is currently closed.",
    );
    return;
  }

  setRegistering(true);

  const { error: registrationError } = await supabase.rpc(
    "register_for_event",
    {
      p_event_id: selectedEvent.id,
      p_name: name,
      p_phone: phone,
      p_email: email || null,
      p_college: college || null,
    },
  );

  if (registrationError) {
    console.error(
      "Event registration RPC failed:",
      registrationError,
    );

    const message = registrationError.message ?? "";

    if (message.includes("ALREADY_REGISTERED")) {
      setRegistrationError(
        "This mobile number is already registered for this event.",
      );
    } else if (message.includes("EVENT_FULL")) {
      setRegistrationError(
        "This event has reached its registration capacity.",
      );
    } else if (message.includes("REGISTRATION_CLOSED")) {
      setRegistrationError(
        "Registration for this event is currently closed.",
      );
    } else if (message.includes("REGISTRATION_DEADLINE_PASSED")) {
      setRegistrationError(
        "The registration deadline for this event has passed.",
      );
    } else if (message.includes("EVENT_NOT_FOUND")) {
      setRegistrationError(
        "This event could not be found.",
      );
    } else if (message.includes("EVENT_NOT_OPEN")) {
      setRegistrationError(
        "This event is no longer open for registration.",
      );
    } else {
      setRegistrationError(
        "Unable to complete registration. Please try again.",
      );
    }

    setRegistering(false);
    return;
  }

  setRegistrationSuccess(
    `Registration confirmed for ${selectedEvent.title}.`,
  );

  setRegistering(false);
}

  return (
    <>
      <Navbar />

      <main className="events-page">
        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="events-hero">
          <div className="events-grid" />

          <div className="wide-container events-hero-inner">
            <div className="events-hero-content">
              <p className="events-eyebrow">
                S.I.R.U.S. / EVENTS
              </p>

              <h1>
                Where ideas
                <br />
                <span>move.</span>
              </h1>

              <p className="events-hero-description">
                Hackathons, research sessions, technical
                workshops, paper presentations, challenges,
                and collaborative events built around
                experimentation and innovation.
              </p>
            </div>

            <div className="events-coordinate">
              <span>EVENT SYSTEM</span>
              <span>
                {loading ? "LOADING" : "LIVE ARCHIVE"}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            UPCOMING EVENTS
            ===================================================== */}

        <section className="events-section">
          <div className="wide-container">
            <div className="events-section-header">
              <div>
                <span className="section-index">
                  01 — UPCOMING
                </span>

                <h2>
                  What&apos;s
                  <br />
                  next.
                </h2>
              </div>

              <p>
                Upcoming S.I.R.U.S. events, workshops,
                challenges, and research activities will appear
                here.
              </p>
            </div>

            <div className="events-list">
              {loading ? (
                <div className="events-empty-state">
                  <span>EVENTS / DATABASE</span>

                  <p>
                    Loading upcoming events...
                  </p>
                </div>
              ) : error ? (
                <div className="events-empty-state">
                  <span>EVENTS / DATABASE</span>

                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={loadEvents}
                    className="events-retry-button"
                  >
                    RETRY
                  </button>
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="events-empty-state">
                  <span>EVENTS / DATABASE</span>

                  <p>
                    No upcoming events available.
                  </p>
                </div>
              ) : (
                upcomingEvents.map((event, index) => (
                  <PublicEventCard
                    key={event.id}
                    event={event}
                    index={index}
                    onRegister={openRegistration}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            PAST EVENTS
            ===================================================== */}

        <section className="events-section events-past">
          <div className="wide-container">
            <div className="events-section-header">
              <div>
                <span className="section-index">
                  02 — ARCHIVE
                </span>

                <h2>
                  What we&apos;ve
                  <br />
                  done.
                </h2>
              </div>

              <p>
                Previous S.I.R.U.S. activities, research
                events, competitions, and community initiatives
                will be preserved here.
              </p>
            </div>

            <div className="events-list">
              {loading ? (
                <div className="events-empty-state">
                  <span>ARCHIVE / DATABASE</span>

                  <p>
                    Loading event archive...
                  </p>
                </div>
              ) : error ? (
                <div className="events-empty-state">
                  <span>ARCHIVE / DATABASE</span>

                  <p>{error}</p>
                </div>
              ) : pastEvents.length === 0 ? (
                <div className="events-empty-state">
                  <span>ARCHIVE / DATABASE</span>

                  <p>
                    No archived events available.
                  </p>
                </div>
              ) : (
                pastEvents.map((event, index) => (
                  <PublicEventCard
                    key={event.id}
                    event={event}
                    index={index}
                    past
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            JOIN CTA
            ===================================================== */}

        <section className="events-join">
          <div className="wide-container">
            <div className="events-join-inner">
              <span className="section-index">
                03 — PARTICIPATE
              </span>

              <h2>
                Build
                <br />
                <span>with us.</span>
              </h2>

              <p>
                Become part of S.I.R.U.S. and take part in the
                research, experiments, events, and projects
                that happen inside the community.
              </p>

              <Link
                href="/join"
                className="events-join-button"
              >
                JOIN S.I.R.U.S.
                <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          PUBLIC REGISTRATION MODAL
          ===================================================== */}

      {selectedEvent && (
        <div
          className="events-registration-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !registering
            ) {
              closeRegistration();
            }
          }}
        >
          <section className="events-registration-modal">
            <div className="events-registration-header">
              <div>
                <span>EVENT REGISTRATION</span>

                <h2>{selectedEvent.title}</h2>
              </div>

              <button
                type="button"
                onClick={closeRegistration}
                disabled={registering}
                aria-label="Close registration"
              >
                ×
              </button>
            </div>

            <div className="events-registration-meta">
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
              <div className="events-registration-success">
                <span>
                  REGISTRATION CONFIRMED
                </span>

                <h3>You&apos;re registered.</h3>

                <p>{registrationSuccess}</p>

                <button
                  type="button"
                  onClick={closeRegistration}
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <form
                className="events-registration-form"
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
                  <span>MOBILE NUMBER *</span>

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
                  <div className="events-registration-error">
                    {registrationError}
                  </div>
                )}

                <button
                  type="submit"
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

      <Footer />
    </>
  );
}

/* =========================================================
   EVENT CARD
   ========================================================= */

function PublicEventCard({
  event,
  index,
  past = false,
  onRegister,
}: {
  event: Event;
  index: number;
  past?: boolean;
  onRegister?: (event: Event) => void;
}) {
  return (
    <article className="public-event-card">
      <div className="public-event-index">
        {String(index + 1).padStart(2, "0")}
      </div>

      {event.cover_image_url ? (
        <div className="public-event-image">
          <img
            src={event.cover_image_url}
            alt={event.title}
          />
        </div>
      ) : (
        <div className="public-event-image public-event-image-empty">
          <span>{event.category}</span>
        </div>
      )}

      <div className="public-event-main">
        <span>{event.category}</span>

        <h3>{event.title}</h3>

        <p>
          {event.description ||
            "Event information will be available here."}
        </p>

        <div className="public-event-details">
          <span>
            {formatEventDate(event.event_date)}
          </span>

          <span>
            {formatTime(event.start_time)}
            {event.end_time
              ? ` — ${formatTime(event.end_time)}`
              : ""}
          </span>

          <span>
            {event.location || "LOCATION TBA"}
          </span>
        </div>
      </div>

      <div className="public-event-action">
        <span>
          {past ? "ARCHIVE" : "REGISTRATION"}
        </span>

        {past ? (
          <strong>COMPLETED</strong>
        ) : (
          <>
            <strong>
              {getRegistrationStatus(event)}
            </strong>

            {canRegister(event) && onRegister && (
              <button
                type="button"
                onClick={() => onRegister(event)}
              >
                REGISTER
                <span>↗</span>
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
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