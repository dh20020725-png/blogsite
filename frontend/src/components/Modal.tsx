import { useEffect, useRef, useState } from "react";
import "./Modal.css";

interface PlanData {
  title: string;
  tag: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ModalProps {
  onClose: () => void;
  onSubmit: (plan: PlanData) => void;
  initialData?: PlanData;
  mode?: "create" | "edit" | "view";
  onDelete?: () => void;
  onEdit?: () => void;
}

const DEFAULT_TAGS = [
  "BUSINESS",
  "HOUSEWORK",
  "HOLIDAY",
  "MEETING",
  "BIRTHDAY",
  "FRIENDS",
  "PROJECT",
  "PERSONAL",
];

export default function Modal({
  onClose,
  onSubmit,
  initialData,
  mode = "create",
  onDelete,
  onEdit,
}: ModalProps) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTag(initialData.tag);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setDescription(initialData.description);
    }
  }, [initialData]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredTags = DEFAULT_TAGS.filter((t) =>
    t.startsWith(tag.toUpperCase())
  );

  const canCreate =
    tag.trim() &&
    !DEFAULT_TAGS.includes(tag.toUpperCase());

  const handleSubmit = () => {
    if (!title.trim() || !tag.trim()) return;

    onSubmit({
      title,
      tag: tag.toUpperCase(),
      startDate,
      endDate,
      description,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {mode === "view" ? (
          <>
            <div className="modal-body">
              <h2>Plan Details</h2>
              <h3>{initialData?.title}</h3>
              <p>
                <strong>From:</strong> {initialData?.startDate}
              </p>
              <p>
                <strong>To:</strong> {initialData?.endDate}
              </p>
              <div className="desc">{initialData?.description}</div>
            </div>

            <div className="modal-actions">
              <button onClick={onEdit}>Edit</button>
              <button className="delete" onClick={onDelete}>
                Delete
              </button>
              <button className="close-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-body">
              <h2>{initialData ? "Edit Plan" : "Create Plan"}</h2>

              {/* TAG SELECT */}
              <label>Plan Type</label>
              <div className="tag-select" ref={wrapperRef}>
                <input
                  placeholder="Type or select"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />

                {showDropdown && (
                  <div className="tag-dropdown">
                    {filteredTags.map((t) => (
                      <div
                        key={t}
                        className="tag-option"
                        onClick={() => {
                          setTag(t);
                          setShowDropdown(false);
                        }}
                      >
                        {t}
                      </div>
                    ))}

                    {canCreate && (
                      <div
                        className="tag-option new"
                        onClick={() => {
                          setTag(tag.toUpperCase());
                          setShowDropdown(false);
                        }}
                      >
                        + Create "{tag.toUpperCase()}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />

              <label>Beginning Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label>Deadline</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleSubmit}>
                {initialData ? "Update" : "Create"}
              </button>
              <button className="close-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
