import { useState } from "react";
import axios from "axios";

export default function CreateServerModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);

  const createServer = async () => {
    const form = new FormData();
    form.append("name", name);
    if (icon) form.append("icon", icon);

    const res = await axios.post(
      "http://localhost:4000/servers/create",
      form,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    onCreated(res.data);
    onClose();
  };

  return (
    <div className="modal">
      <h2>Create Server</h2>

      <input
        placeholder="Server Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setIcon(e.target.files[0])}
      />

      <button onClick={createServer}>Create</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
