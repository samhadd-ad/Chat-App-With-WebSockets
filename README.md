# 💬 Real-Time Chat App

A real-time chat application built with **Node.js, Express, Socket.io and React (Vite)**. Messages are pushed instantly over WebSockets, with no page refresh.

## ✨ Features
- Join with a username and pick or create a room
- Send and receive messages in real time
- See who is online in your room (updates when people join, leave or switch rooms)
- "Someone is typing…" indicator

## 🧰 Tech Stack
| Layer | Technology |
|---|---|
| Backend | Node.js, Express, Socket.io |
| Frontend | React 18 (Vite), Socket.io client |
| Communication | WebSockets (event-based: `join_room`, `send_message`, `typing`, `room_users`) |

## ▶️ How to Run

**1. Backend**
```bash
cd server
npm install
cp .env.example .env     # optional: change PORT / CLIENT_ORIGIN
npm run dev              # starts on http://localhost:5000
```

**2. Frontend** (in a second terminal)
```bash
cd client
npm install
npm run dev              # opens on http://localhost:5173
```

Open the app in two browser windows, join the same room, and chat between them.
To point the frontend at a different server, set `VITE_SOCKET_URL` (default `http://localhost:5000`).

## 📁 Project Structure
```
server/
├── .env.example
├── package.json
└── src/index.js            # Express + Socket.io server, rooms and online users
client/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx             # username and room selection
    └── components/
        └── ChatRoom.jsx    # messages, online users, typing indicator
```

## 🧠 How It Works
1. The client connects to the server with Socket.io and emits `join_room`.
2. The server adds the socket to that room and broadcasts the updated user list (`room_users`).
3. Messages are sent with `send_message` and broadcast to everyone in the room (`receive_message`).
4. When a user disconnects or switches rooms, the server removes them and updates the list.

## 🔮 Next Steps
- Save message history in a database (e.g. MongoDB)
- Add user authentication
- Deploy the server and client online
