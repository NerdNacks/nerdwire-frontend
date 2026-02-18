import { useState } from "react";
import axios from "axios";

export default function CreateChannelModal({ server, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("text");

  const createChannel = async () => {
    if (!name.trim()) return;

    const res = await axios.post(
      "http://localhost:4000/channels/create",
      {
        serverId: server._id,
        name,
        type
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    onCreated(res.data);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Channel</h2>

        <input
          placeholder="Channel name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <label>
            <input
              type="radio"
              value="text"
              checked={type === "text"}
              onChange={() => setType("text")}
            />
            Text
          </label>

          <label>
            <input
              type="radio"
              value="voice"
              checked={type === "voice"}
              onChange={() => setType("voice")}
            />
            Voice
          </label>
        </div>

        <button onClick={createChannel}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
