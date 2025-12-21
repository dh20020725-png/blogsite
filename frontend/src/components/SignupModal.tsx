import { useState, useEffect } from "react";
import "../App.css";

export default function SignupModal({ onClose }: { onClose: () => void }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ESC close
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  // 🔹 Resize image BEFORE preview
  const resizeImage = (file: File, size = 160): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, size, size);

        // keep aspect ratio (center crop)
        const scale = Math.max(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;

        ctx.drawImage(
          img,
          x,
          y,
          img.width * scale,
          img.height * scale
        );

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;
    const resized = await resizeImage(e.target.files[0]);
    setAvatar(resized);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">Sign Up</h3>

        {/* AVATAR */}
        <label className="avatar-upload">
          <div className="avatar-preview">
            {avatar ? (
              <img src={avatar} alt="avatar" />
            ) : (
              <div className="avatar-placeholder">+</div>
            )}
          </div>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </label>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn confirm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
