import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";
import Modal from "./components/Modal";

export interface Plan {
  id: string;
  title: string;
  tag: string;
  startDate: string;
  endDate: string;
  description: string;
}

/* DEFAULT TAGS */
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

export default function App() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [modalMode, setModalMode] =
    useState<"create" | "edit" | "view">("create");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  /* 🔹 SORT BY TAG STATE */
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const api = axios.create({ baseURL: "http://localhost:4000/api" });

  /* LOAD */
  useEffect(() => {
    api.get("/todos").then((res) => {
      setPlans(
        res.data.map((t: any) => ({
          id: t._id,
          title: t.title,
          tag: t.tag,
          startDate: t.startDate,
          endDate: t.endDate,
          description: t.description,
        }))
      );
    });
  }, []);

  /* FILTER + SORT */
  const visiblePlans = useMemo(() => {
    let filtered = [...plans];

    if (selectedTag === "Other") {
      filtered = filtered.filter(
        (p) => !DEFAULT_TAGS.includes(p.tag)
      );
    } else if (selectedTag !== "All") {
      filtered = filtered.filter((p) => p.tag === selectedTag);
    }

    return filtered.sort(
      (a, b) =>
        new Date(a.endDate).getTime() -
        new Date(b.endDate).getTime()
    );
  }, [plans, selectedTag]);

  /* CRUD */
  const handleCreate = async (data: Omit<Plan, "id">) => {
    const res = await api.post("/todos", data);
    setPlans((p) => [...p, { ...res.data, id: res.data._id }]);
  };

  const handleUpdate = async (data: Omit<Plan, "id">) => {
    if (!editingPlan) return;
    const res = await api.put(`/todos/${editingPlan.id}`, data);
    setPlans((p) =>
      p.map((x) => (x.id === editingPlan.id ? res.data : x))
    );
    setEditingPlan(null);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/todos/${id}`);
    setPlans((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className="app">
      <div className="toolbar">
        {/* CREATE */}
        <button
          className="create-btn"
          onClick={() => {
            setEditingPlan(null);
            setModalMode("create");
            setOpen(true);
          }}
        >
          + Create
        </button>

        {/* 🔽 FILTER BY DROPDOWN */}
        <div className="sort-dropdown">
          <button className="sort-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M10 20v-7L2.95 4h18.1L14 13v7z"
              />
            </svg>

            Filter by

            {/* 🔹 SELECTED TAG LABEL */}
            <span className="selected-tag">
              {selectedTag === "All" ? "ALL" : selectedTag}
            </span>

            ▾
          </button>

          <div className="sort-menu">
            <div onClick={() => setSelectedTag("All")}>All</div>

            {DEFAULT_TAGS.map((tag) => (
              <div
                key={tag}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </div>
            ))}

            <div onClick={() => setSelectedTag("Other")}>
              Other
            </div>
          </div>
        </div>

        {/* VIEW SWITCH */}
        <div className="view-switch">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21h4.675v-4.675H3zm6.675 0h4.65v-4.675h-4.65zm6.65 0H21v-4.675h-4.675zM3 14.325h4.675v-4.65H3zm6.675 0h4.65v-4.65h-4.65zm6.65 0H21v-4.65h-4.675zM3 7.675h4.675V3H3zm6.675 0h4.65V3h-4.65zm6.65 0H21V3h-4.675z"/></svg>Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 20v-4h4v4zm6 0v-4h14v4zm-6-6v-4h4v4zm6 0v-4h14v4zM2 8V4h4v4zm6 0V4h14v4z"/></svg>List
          </button>
        </div>
      </div>

      {viewMode === "list" && (
        <div className="list-header">
          <span>Title</span>
          <span>Tag</span>
          <span>Description</span>
          <span>Actions</span>
        </div>
      )}

      <div className={`plans ${viewMode}`}>
        {visiblePlans.map((plan) => (
          <div
            key={plan.id}
            className={`plan ${viewMode}`}
            onClick={() => {
              setEditingPlan(plan);
              setModalMode("view");
              setOpen(true);
            }}
          >
            <div className="col title">{plan.title}</div>
            <div className="col tag change">{plan.tag}</div>
            <div className="col desc">{plan.description}</div>

            <div className="col actions">
              <button
                className="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingPlan(plan);
                  setModalMode("edit");
                  setOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(plan.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <Modal
          onClose={() => {
            setOpen(false);
            setEditingPlan(null);
            setModalMode("create");
          }}
          onSubmit={editingPlan ? handleUpdate : handleCreate}
          initialData={editingPlan ?? undefined}
          mode={modalMode}
          onDelete={() =>
            editingPlan && handleDelete(editingPlan.id)
          }
          onEdit={() => setModalMode("edit")}
        />
      )}
    </div>
  );
}
