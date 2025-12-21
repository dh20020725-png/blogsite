import { useState } from "react";
import "../App.css";
import SignupModal from "./SignupModal.tsx";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="header">
        <h1 className="logo">Blog Site</h1>

        <p className="signbtn" onClick={() => setOpen(true)}>
          Sign up
        </p>
      </header>

      {open && <SignupModal onClose={() => setOpen(false)} />}
    </>
  );
}
