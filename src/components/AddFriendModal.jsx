import { useState } from "react";
import axios from "axios";

export default function AddFriendModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const searchUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/friends/find",
        { query },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      setResult(res.data);
      setError("");
    } catch (err) {
      setResult(null);
      setError("User not found");
    }
  };

  const sendRequest = async () => {
    await axios.post(
      "http://localhost:4000/friends/request",
      { toUserId: result._id },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );
    alert("Friend request sent");
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Friend</h2>

        <input
          placeholder="username#tag"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={searchUser}>Search</button>

        {error && <p>{error}</p>}

        {result && (
          <div className="search-result">
            <p>{result.username}#{result.tag}</p>
            <button onClick={sendRequest}>Send Request</button>
          </div>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
