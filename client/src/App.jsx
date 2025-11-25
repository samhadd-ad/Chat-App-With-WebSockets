import React, { useState } from "react";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username.trim() || !room.trim()) return;
    setJoined(true);
  };

  if (!joined) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Real-Time Chat App</h1>
          <form onSubmit={handleJoin} style={styles.form}>
            <label style={styles.label}>
              Username
              <input
                style={styles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a nickname"
              />
            </label>
            <label style={styles.label}>
              Room
              <input
                style={styles.input}
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. general, ee-courses"
              />
            </label>
            <button style={styles.button} type="submit">
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <ChatRoom username={username} room={room} />;
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    padding: "1rem"
  },
  card: {
    maxWidth: "400px",
    width: "100%",
    background: "#020617",
    borderRadius: "16px",
    padding: "24px",
    color: "#e5e7eb",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    border: "1px solid #1e293b"
  },
  title: {
    marginBottom: "16px",
    fontSize: "1.5rem",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.9rem",
    color: "#9ca3af"
  },
  input: {
    marginTop: "4px",
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#020617",
    color: "#e5e7eb",
    outline: "none"
  },
  button: {
    marginTop: "12px",
    padding: "10px",
    borderRadius: "999px",
    border: "none",
    background: "#22c55e",
    color: "#020617",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default App;
