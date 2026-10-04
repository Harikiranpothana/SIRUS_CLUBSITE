"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const BUCKET = "sirus-gallery";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const FILTERS = ["ALL", "EVENTS", "PROJECTS", "COMMUNITY"] as const;

type Category = "events" | "projects" | "community";
type Status = "draft" | "published" | "archived";

type GalleryMedia = {
  id: string;
  storage_path: string;
  storage_bucket: string;
  title: string | null;
  description: string | null;
  category: Category;
  event_id: string | null;
  status: Status;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  signed_url?: string | null;
};

type EventOption = {
  id: string;
  title: string;
  event_date: string;
};

type FormState = {
  title: string;
  description: string;
  category: Category;
  event_id: string;
  status: Status;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  category: "events",
  event_id: "",
  status: "draft",
};

export default function GalleryManagerPage() {
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] =
    useState<GalleryMedia | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * ============================================================
   * LOAD MEDIA
   * ============================================================
   */

  const loadMedia = useCallback(async () => {
    setLoading(true);

    const { data, error: loadError } = await supabase
      .from("gallery_media")
      .select(
        `
          id,
          storage_path,
          storage_bucket,
          title,
          description,
          category,
          event_id,
          status,
          uploaded_by,
          created_at,
          updated_at
        `,
      )
      .order("created_at", { ascending: false });

    if (loadError) {
      console.error("Gallery media error:", loadError);
      setError("Unable to load gallery media.");
      setMedia([]);
      setLoading(false);
      return;
    }

    const records = (data ?? []) as GalleryMedia[];

    const recordsWithUrls = await Promise.all(
      records.map(async (item) => {
        const { data: signedData } = await supabase.storage
          .from(item.storage_bucket)
          .createSignedUrl(item.storage_path, 3600);

        return {
          ...item,
          signed_url: signedData?.signedUrl ?? null,
        };
      }),
    );

    setMedia(recordsWithUrls);
    setLoading(false);
  }, []);

  /*
   * ============================================================
   * LOAD EVENTS
   * ============================================================
   */

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);

    const { data, error: eventError } = await supabase
      .from("events")
      .select("id,title,event_date")
      .order("event_date", { ascending: false });

    if (eventError) {
      console.error("Events lookup error:", eventError);
      setEvents([]);
      setEventsLoading(false);
      return;
    }

    setEvents((data ?? []) as EventOption[]);
    setEventsLoading(false);
  }, []);

  useEffect(() => {
    void loadMedia();
    void loadEvents();
  }, [loadMedia, loadEvents]);

  /*
   * ============================================================
   * FILTER
   * ============================================================
   */

  const filteredMedia = useMemo(() => {
    const query = search.trim().toLowerCase();

    return media.filter((item) => {
      const categoryMatch =
        activeFilter === "ALL" ||
        item.category.toUpperCase() === activeFilter;

      if (!categoryMatch) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        item.title,
        item.description,
        item.category,
        item.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query),
        );
    });
  }, [media, activeFilter, search]);

  /*
   * ============================================================
   * STATS
   * ============================================================
   */

  const stats = useMemo(
    () => ({
      total: media.length,
      events: media.filter(
        (item) => item.category === "events",
      ).length,
      projects: media.filter(
        (item) => item.category === "projects",
      ).length,
      community: media.filter(
        (item) => item.category === "community",
      ).length,
    }),
    [media],
  );

  /*
   * ============================================================
   * OPEN UPLOAD
   * ============================================================
   */

  function openUpload() {
    setEditingMedia(null);
    setForm({ ...EMPTY_FORM });
    setSelectedFile(null);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  /*
   * ============================================================
   * OPEN EDIT
   * ============================================================
   */

  function openEdit(item: GalleryMedia) {
    setEditingMedia(item);

    setForm({
      title: item.title ?? "",
      description: item.description ?? "",
      category: item.category,
      event_id: item.event_id ?? "",
      status: item.status,
    });

    setSelectedFile(null);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  /*
   * ============================================================
   * CLOSE MODAL
   * ============================================================
   */

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingMedia(null);
    setForm({ ...EMPTY_FORM });
    setSelectedFile(null);
  }

  /*
   * ============================================================
   * FILE
   * ============================================================
   */

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError("");

    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      setSelectedFile(null);
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      event.target.value = "";
      setSelectedFile(null);
      setError("Image size must be 10 MB or smaller.");
      return;
    }

    setSelectedFile(file);
  }

  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) {
      setError("Media title is required.");
      return;
    }

    if (!editingMedia && !selectedFile) {
      setError("Please select an image.");
      return;
    }

    setSaving(true);

    try {
      /*
       * EDIT
       */

      if (editingMedia) {
        const { error: updateError } = await supabase
          .from("gallery_media")
          .update({
            title,
            description: description || null,
            category: form.category,
            event_id:
              form.category === "events" && form.event_id
                ? form.event_id
                : null,
            status: form.status,
          })
          .eq("id", editingMedia.id);

        if (updateError) {
          throw new Error(
            updateError.message ||
              "Unable to update gallery media.",
          );
        }

        setSuccess("Gallery record updated.");

        await loadMedia();

        setModalOpen(false);
        setEditingMedia(null);
        setForm({ ...EMPTY_FORM });
        setSelectedFile(null);

        return;
      }

      /*
       * CURRENT ADMIN
       */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Administrator session could not be verified.",
        );
      }

      /*
       * FILE PATH
       */

      const file = selectedFile!;

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeExtension =
        extension.replace(/[^a-z0-9]/g, "") || "jpg";

      const storagePath =
        `${form.category}/${crypto.randomUUID()}.${safeExtension}`;

      /*
       * STORAGE UPLOAD
       */

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(
          uploadError.message ||
            "Unable to upload image to storage.",
        );
      }

      /*
       * DATABASE RECORD
       */

      const { error: insertError } = await supabase
        .from("gallery_media")
        .insert({
          storage_path: storagePath,
          storage_bucket: BUCKET,
          title,
          description: description || null,
          category: form.category,
          event_id:
            form.category === "events" && form.event_id
              ? form.event_id
              : null,
          status: form.status,
          uploaded_by: user.id,
        });

      if (insertError) {
        /*
         * Remove orphaned storage file.
         */
        await supabase.storage
          .from(BUCKET)
          .remove([storagePath]);

        throw new Error(
          insertError.message ||
            "Unable to save gallery metadata.",
        );
      }

      setSuccess("Media uploaded successfully.");

      await loadMedia();

      setModalOpen(false);
      setForm({ ...EMPTY_FORM });
      setSelectedFile(null);
    } catch (submitError) {
      console.error("Gallery submit error:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save gallery media.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ============================================================
   * STATUS
   * ============================================================
   */

  async function updateStatus(
    item: GalleryMedia,
    status: Status,
  ) {
    setActionId(item.id);
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("gallery_media")
      .update({ status })
      .eq("id", item.id);

    if (updateError) {
      console.error("Status error:", updateError);
      setError("Unable to update media status.");
      setActionId(null);
      return;
    }

    setSuccess(
      `Media marked as ${status.toUpperCase()}.`,
    );

    await loadMedia();
    setActionId(null);
  }

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  async function deleteMedia(item: GalleryMedia) {
    const confirmed = window.confirm(
      `Delete "${item.title || "this media"}"?\n\nThis will remove the image and database record.`,
    );

    if (!confirmed) {
      return;
    }

    setActionId(item.id);
    setError("");
    setSuccess("");

    const { error: storageError } = await supabase.storage
      .from(item.storage_bucket)
      .remove([item.storage_path]);

    if (storageError) {
      setError(
        storageError.message ||
          "Unable to remove image from storage.",
      );
      setActionId(null);
      return;
    }

    const { error: databaseError } = await supabase
      .from("gallery_media")
      .delete()
      .eq("id", item.id);

    if (databaseError) {
      setError(
        "Image was removed from storage, but the database record could not be deleted.",
      );

      await loadMedia();
      setActionId(null);
      return;
    }

    setSuccess("Media deleted.");

    await loadMedia();
    setActionId(null);
  }

  return (
    <main className="gallery-manager-page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="gallery-manager-header">
        <div>
          <Link
            href="/admin"
            className="gallery-manager-back"
          >
            ← MANAGEMENT PORTAL
          </Link>

          <span className="gallery-manager-eyebrow">
            MANAGEMENT / GALLERY
          </span>

          <h1>
            Gallery
            <br />
            <span>Manager.</span>
          </h1>

          <p>
            Upload and manage visual records from S.I.R.U.S.
            events, projects and community activities.
          </p>
        </div>

        <div className="gallery-manager-access">
          <span>ACCESS</span>
          <strong>ADMIN</strong>
        </div>
      </section>

      {/* ======================================================
          OVERVIEW
      ====================================================== */}

      <section className="gallery-manager-overview">
        <div className="gallery-manager-stat">
          <span>TOTAL MEDIA</span>
          <strong>{stats.total}</strong>
          <small>Stored gallery records</small>
        </div>

        <div className="gallery-manager-stat">
          <span>EVENTS</span>
          <strong>{stats.events}</strong>
          <small>Event media</small>
        </div>

        <div className="gallery-manager-stat">
          <span>PROJECTS</span>
          <strong>{stats.projects}</strong>
          <small>Project media</small>
        </div>

        <div className="gallery-manager-stat">
          <span>COMMUNITY</span>
          <strong>{stats.community}</strong>
          <small>Community media</small>
        </div>
      </section>

      {/* ======================================================
          MEDIA DATABASE
      ====================================================== */}

      <section className="gallery-manager-database">
        <div className="gallery-manager-heading">
          <div>
            <span>01 / MEDIA DATABASE</span>
            <h2>Gallery.</h2>
          </div>

          <span className="gallery-manager-db-status">
            STORAGE / CONNECTED
          </span>
        </div>

        <div className="gallery-manager-toolbar">
          <div className="gallery-manager-search">
            <span>SEARCH</span>

            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="gallery-manager-filters">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={`gallery-manager-filter ${
                  activeFilter === item ? "active" : ""
                }`}
                onClick={() =>
                  setActiveFilter(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="gallery-upload-button"
            onClick={openUpload}
            style={{
              position: "relative",
              zIndex: 10000,
              pointerEvents: "auto",
              cursor: "pointer",
            }}
          >
            UPLOAD MEDIA
            <span>+</span>
          </button>
        </div>

        {error && (
          <div className="gallery-manager-alert gallery-manager-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="gallery-manager-alert gallery-manager-alert-success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="gallery-manager-empty">
            <div className="gallery-empty-index">
              ··
            </div>

            <div>
              <span>MEDIA RECORDS</span>
              <h3>Loading gallery.</h3>
              <p>
                Reading media records from the S.I.R.U.S.
                database.
              </p>
            </div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="gallery-manager-empty">
            <div className="gallery-empty-index">
              00
            </div>

            <div>
              <span>MEDIA RECORDS</span>

              <h3>
                {media.length === 0
                  ? "No media available."
                  : "No matching media."}
              </h3>

              <p>
                {media.length === 0
                  ? "Images uploaded by authorized S.I.R.U.S. administrators will appear here."
                  : "Try another search term or category."}
              </p>
            </div>
          </div>
        ) : (
          <div className="gallery-media-grid">
            {filteredMedia.map((item) => (
              <article
                key={item.id}
                className="gallery-media-card"
              >
                <div className="gallery-media-preview">
                  {item.signed_url ? (
                    <img
                      src={item.signed_url}
                      alt={
                        item.title ||
                        "S.I.R.U.S. gallery media"
                      }
                    />
                  ) : (
                    <div className="gallery-media-no-preview">
                      PREVIEW
                      <br />
                      UNAVAILABLE
                    </div>
                  )}

                  <span className="gallery-media-status">
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <div className="gallery-media-content">
                  <div className="gallery-media-meta">
                    <span>
                      {item.category.toUpperCase()}
                    </span>

                    <span>
                      {new Date(
                        item.created_at,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3>
                    {item.title || "Untitled media"}
                  </h3>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  {item.event_id && (
                    <span className="gallery-media-association">
                      EVENT ASSOCIATED
                    </span>
                  )}

                  <div className="gallery-media-actions">
                    <button
                      type="button"
                      onClick={() =>
                        openEdit(item)
                      }
                      disabled={actionId === item.id}
                    >
                      EDIT
                    </button>

                    {item.status === "draft" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            item,
                            "published",
                          )
                        }
                        disabled={actionId === item.id}
                      >
                        PUBLISH
                      </button>
                    )}

                    {item.status === "published" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            item,
                            "archived",
                          )
                        }
                        disabled={actionId === item.id}
                      >
                        ARCHIVE
                      </button>
                    )}

                    {item.status === "archived" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            item,
                            "published",
                          )
                        }
                        disabled={actionId === item.id}
                      >
                        RESTORE
                      </button>
                    )}

                    <button
                      type="button"
                      className="gallery-media-delete"
                      onClick={() =>
                        deleteMedia(item)
                      }
                      disabled={actionId === item.id}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ======================================================
          WORKFLOW
      ====================================================== */}

      <section className="gallery-upload-section">
        <div className="gallery-manager-heading">
          <div>
            <span>02 / MEDIA WORKFLOW</span>
            <h2>From upload to archive.</h2>
          </div>
        </div>

        <div className="gallery-upload-grid">
          <div>
            <span>01</span>
            <h3>UPLOAD</h3>
            <p>
              An authorized administrator uploads an image
              through the management portal.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>DESCRIBE</h3>
            <p>
              Media receives its title, category,
              description and optional event association.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>PUBLISH</h3>
            <p>
              Published media becomes available on the
              public S.I.R.U.S. gallery.
            </p>
          </div>

          <div>
            <span>04</span>
            <h3>ARCHIVE</h3>
            <p>
              Older media can be archived without removing
              the underlying record.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          METADATA
      ====================================================== */}

      <section className="gallery-metadata-section">
        <div className="gallery-manager-heading">
          <div>
            <span>03 / MEDIA METADATA</span>
            <h2>Organized records.</h2>
          </div>
        </div>

        <div className="gallery-metadata-grid">
          <div>
            <span>MEDIA</span>
            <p>
              Original file stored in Supabase Storage.
            </p>
          </div>

          <div>
            <span>TITLE</span>
            <p>
              Human-readable title for the image.
            </p>
          </div>

          <div>
            <span>CATEGORY</span>
            <p>
              Events, projects or community.
            </p>
          </div>

          <div>
            <span>DESCRIPTION</span>
            <p>
              Context describing what the image represents.
            </p>
          </div>

          <div>
            <span>ASSOCIATION</span>
            <p>
              Optional connection to an existing event.
            </p>
          </div>

          <div>
            <span>STATUS</span>
            <p>
              Draft, published or archived.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          STORAGE
      ====================================================== */}

      <section className="gallery-storage-section">
        <div className="gallery-storage-content">
          <span>04 / STORAGE ARCHITECTURE</span>

          <h2>
            Media storage
            <br />
            stays separate.
          </h2>

          <p>
            Image files are stored in Supabase Storage.
            The database stores media metadata and the
            corresponding storage reference.
          </p>
        </div>

        <div className="gallery-storage-flow">
          <div>ADMIN</div>
          <span>↓</span>
          <div>UPLOAD</div>
          <span>↓</span>
          <div>SUPABASE STORAGE</div>
          <span>↓</span>
          <div>DATABASE METADATA</div>
          <span>↓</span>
          <div>PUBLIC GALLERY</div>
        </div>
      </section>

      {/* ======================================================
          PERMISSIONS
      ====================================================== */}

      <section className="gallery-manager-permissions">
        <span>ACCESS CONTROL</span>

        <h2>
          Administrator gallery management.
        </h2>

        <div className="gallery-permission-grid">
          <div>
            <span>ADMIN</span>

            <p>
              Administrators can upload, edit, publish,
              archive and manage S.I.R.U.S. gallery media.
            </p>
          </div>

          <div>
            <span>PUBLIC OUTPUT</span>

            <p>
              Only published media is intended to become
              available on the public S.I.R.U.S. gallery.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {modalOpen && (
        <div
          className="gallery-modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "rgba(0, 0, 0, 0.78)",
            pointerEvents: "auto",
          }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeModal();
            }
          }}
        >
          <section
            className="gallery-modal"
            style={{
              position: "relative",
              zIndex: 100000,
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#080808",
              border: "1px solid rgba(255,255,255,0.16)",
              pointerEvents: "auto",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal header */}

            <div className="gallery-modal-header">
              <div>
                <span>
                  {editingMedia
                    ? "MEDIA / EDIT"
                    : "MEDIA / UPLOAD"}
                </span>

                <h2 id="gallery-modal-title">
                  {editingMedia
                    ? "Edit media."
                    : "Upload media."}
                </h2>
              </div>

              <button
                type="button"
                className="gallery-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            {/* Form */}

            <form
              className="gallery-modal-form"
              onSubmit={handleSubmit}
            >
              {!editingMedia && (
                <label className="gallery-form-field gallery-file-field">
                  <span>IMAGE FILE</span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={saving}
                  />

                  {selectedFile && (
                    <strong>
                      {selectedFile.name}
                    </strong>
                  )}

                  <small>
                    Image files only. Maximum size 10 MB.
                  </small>
                </label>
              )}

              <label className="gallery-form-field">
                <span>TITLE</span>

                <input
                  type="text"
                  value={form.title}
                  placeholder="Media title"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  disabled={saving}
                />
              </label>

              <label className="gallery-form-field">
                <span>DESCRIPTION</span>

                <textarea
                  value={form.description}
                  placeholder="Describe the media..."
                  rows={4}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }))
                  }
                  disabled={saving}
                />
              </label>

              <div className="gallery-form-row">
                <label className="gallery-form-field">
                  <span>CATEGORY</span>

                  <select
                    value={form.category}
                    onChange={(event) => {
                      const category =
                        event.target.value as Category;

                      setForm((current) => ({
                        ...current,
                        category,
                        event_id:
                          category === "events"
                            ? current.event_id
                            : "",
                      }));
                    }}
                    disabled={saving}
                  >
                    <option value="events">
                      Events
                    </option>

                    <option value="projects">
                      Projects
                    </option>

                    <option value="community">
                      Community
                    </option>
                  </select>
                </label>

                <label className="gallery-form-field">
                  <span>STATUS</span>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status:
                          event.target.value as Status,
                      }))
                    }
                    disabled={saving}
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>

                    <option value="archived">
                      Archived
                    </option>
                  </select>
                </label>
              </div>

              {form.category === "events" && (
                <label className="gallery-form-field">
                  <span>EVENT ASSOCIATION</span>

                  <select
                    value={form.event_id}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        event_id:
                          event.target.value,
                      }))
                    }
                    disabled={
                      saving || eventsLoading
                    }
                  >
                    <option value="">
                      No event association
                    </option>

                    {events.map((event) => (
                      <option
                        key={event.id}
                        value={event.id}
                      >
                        {event.title} —{" "}
                        {event.event_date}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {error && (
                <div className="gallery-modal-error">
                  {error}
                </div>
              )}

              <div className="gallery-modal-actions">
                <button
                  type="button"
                  className="gallery-modal-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="gallery-modal-primary"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : editingMedia
                      ? "SAVE CHANGES"
                      : "UPLOAD MEDIA"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}