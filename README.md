# Real-Time Chat App (Node.js, Socket.io, React)

This is a simple real-time chat application built with **Node.js**, **Express**, **Socket.io**, and **React (Vite)**.

Users can:
- Join with a username
- Select or create a room
- Send and receive messages in real-time
- See who is online in their room
- See when someone is typing

## Tech Stack

- Backend: Node.js, Express, Socket.io
- Frontend: React (Vite), Socket.io client
- Communication: WebSockets

---



### 1. Backend (server)

```bash
cd server
npm install
npm run dev
```

The server listens on port `5000` by default.



### 2. Frontend (client)

In a second terminal:

```bash
cd client
npm install
npm run dev
```



### 3. Connect frontend to backend

The frontend is already configured to connect to `http://localhost:5000` for Socket.io.  
Make sure the backend is running before opening the frontend in the browser.

---

## Project Structure

```text
realtime-chat-app/
  server/
    package.json
    .env.example
    src/
      index.js           # Express + Socket.io server
  client/
    package.json
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      components/
        ChatRoom.jsx
  .gitignore
  README.md
```

You can use this project as a portfolio piece to demonstrate:
- Real-time WebSocket communication
- Backend API + Socket.io server
- Frontend React state management and Socket.io client usage
