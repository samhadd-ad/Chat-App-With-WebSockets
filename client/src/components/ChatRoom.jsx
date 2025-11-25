import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: true
});

function ChatRoom({ username, room }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    socket.emit("join_room", { username, room });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("room_users", (userList) => {
      setUsers(userList);
    });

    socket.on("user_joined", ({ username }) => {
      setMessages((prev) => [
        ...prev,
        { system: true, message: `${username} joined the room` }
      ]);
    });

    socket.on("user_left", ({ username }) => {
      setMessages((prev) => [
        ...prev,
        { system: true, message: `${username} left the room` }
      ]);
    });

    socket.on("user_typing", ({ username, isTyping }) => {
      setTypingUser(isTyping ? username : null);
    });

    return () => {
      socket.off("receive_message");
      socket.off("room_users");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("user_typing");
    };
  }, [username, room]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload = {
      room,
      username,
      message
    };

    socket.emit("send_message", payload);
    setMessage("");
    socket.emit("typing", { room, username, isTyping: false });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", {
      room,
      username,
      isTyping: e.target.value.length > 0
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>{room}</h2>
          <p style={styles.sidebarSubtitle}>Online users</p>
          <ul style={styles.userList}>
            {users.map((u) => (
              <li key={u} style={styles.userItem}>
                <span style={styles.userDot} /> {u}
              </li>
            ))}
          </ul>
        </aside>

        <main style={styles.main}>
          <header style={styles.header}>
            <h1 style={styles.headerTitle}>Chat Room</h1>
            <span style={styles.headerUser}>You are: {username}</span>
          </header>

          <div style={styles.messages} id="messages">
            {messages.map((m, idx) =>
              m.system ? (
                <div key={idx} style={styles.systemMessage}>
                  {m.message}
                </div>
              ) : (
                <div
                  key={idx}
                  style={
                    m.username === username
                      ? styles.ownMessageWrapper
                      : styles.messageWrapper
                  }
                >
                  <div style={styles.messageMeta}>
                    <span style={styles.messageUser}>{m.username}</span>
                    <span style={styles.messageTime}>
                      {new Date(m.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <div style={styles.messageBubble}>{m.message}</div>
                </div>
              )
            )}
          </div>

          {typingUser && typingUser !== username && (
            <div style={styles.typingIndicator}>
              {typingUser} is typing...
            </div>
          )}

          <form style={styles.form} onSubmit={handleSendMessage}>
            <input
              style={styles.input}
              value={message}
              onChange={handleTyping}
              placeholder="Type a message..."
            />
            <button style={styles.sendButton} type="submit">
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    padding: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  chatContainer: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    height: "80vh",
    maxWidth: "1000px",
    width: "100%",
    borderRadius: "18px",
    overflow: "hidden",
    background: "#020617",
    border: "1px solid #1f2937",
    boxShadow: "0 24px 60px rgba(0,0,0,0.6)"
  },
  sidebar: {
    background: "linear-gradient(180deg, #111827, #020617)",
    padding: "16px",
    borderRight: "1px solid #1f2937",
    color: "#e5e7eb"
  },
  sidebarTitle: {
    fontSize: "1.2rem",
    marginBottom: "4px"
  },
  sidebarSubtitle: {
    fontSize: "0.85rem",
    color: "#9ca3af",
    marginBottom: "12px"
  },
  userList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  userItem: {
    fontSize: "0.9rem",
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  userDot: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: "#22c55e"
  },
  main: {
    display: "flex",
    flexDirection: "column",
    background: "#020617",
    color: "#e5e7eb"
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #1f2937",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  headerTitle: {
    fontSize: "1.2rem"
  },
  headerUser: {
    fontSize: "0.9rem",
    color: "#9ca3af"
  },
  messages: {
    flex: 1,
    padding: "12px 16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  systemMessage: {
    textAlign: "center",
    fontSize: "0.8rem",
    color: "#9ca3af",
    padding: "4px 0"
  },
  messageWrapper: {
    maxWidth: "70%",
    alignSelf: "flex-start"
  },
  ownMessageWrapper: {
    maxWidth: "70%",
    alignSelf: "flex-end"
  },
  messageMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.75rem",
    color: "#9ca3af",
    marginBottom: "2px"
  },
  messageUser: {
    fontWeight: 500
  },
  messageTime: {
    fontVariantNumeric: "tabular-nums"
  },
  messageBubble: {
    background: "#111827",
    borderRadius: "12px",
    padding: "8px 10px",
    fontSize: "0.9rem",
    border: "1px solid #1f2937"
  },
  typingIndicator: {
    padding: "4px 16px",
    fontSize: "0.8rem",
    color: "#9ca3af"
  },
  form: {
    display: "flex",
    padding: "10px 12px",
    borderTop: "1px solid #1f2937",
    gap: "8px"
  },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: "999px",
    border: "1px solid #374151",
    background: "#020617",
    color: "#e5e7eb",
    outline: "none",
    fontSize: "0.9rem"
  },
  sendButton: {
    padding: "8px 16px",
    borderRadius: "999px",
    border: "none",
    background: "#22c55e",
    color: "#020617",
    fontWeight: 600,
    cursor: "pointer"
  }
};

export default ChatRoom;
