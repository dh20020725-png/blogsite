import { Todo } from "../types/todo";

export default function PlanCard({ todo }: { todo: Todo }) {
  return (
    <div className="plan">
      <span className="tag-badge">{todo.tag}</span>
      <h4>{todo.title}</h4>
      <p className="date">{todo.startDate} → {todo.endDate}</p>
      <p className="desc">{todo.description}</p>
    </div>
  );
}
