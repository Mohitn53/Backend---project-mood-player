🎧 Mood-Based Music Recommendation Web App

A full-stack web application that detects a user’s mood through real-time facial analysis using MediaPipe Face Landmarker and recommends music accordingly.
The entire AI inference runs locally in the browser, ensuring user privacy.

🚀 Features

🎥 Real-time face detection using webcam
🧠 Mood detection based on facial blendshapes
🎶 Mood-based music recommendation
⚡ Smooth, responsive UI with animations
🔒 Privacy-first (no face data sent to server)
📱 Fully responsive (desktop & mobile)

🛠 Tech Stack
Frontend

React
Tailwind CSS
Framer Motion
MediaPipe Face Landmarker (WASM)
Axios

Backend
Node.js
Express
ImageKit (media storage)
REST APIs

🧠 How Mood Detection Works

User allows camera access
MediaPipe detects facial landmarks
Facial blendshape values (smile, frown, brow movement) are extracted
Blendshapes are mapped to moods like:
Happy
Neutral
Sad
Angry
Mood is sent to backend API
Backend responds with mood-based song recommendations
All facial analysis runs entirely in the browser — no images or videos are stored or transmitted.

Project structure
frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── context/
 │   ├── hooks/
 │   ├── utils/
 │   └── App.jsx

backend/
 ├── src/
 │   ├── routes/
 │   ├── services/
 │   ├── db/
 │   └── app.js
 └── server.js

