# Limuzic

Limuzic is a modern, high-performance web application designed to enhance the way users discover, manage, and listen to music. With a refined interface, intelligent discovery tools, and robust playlist capabilities, Limuzic delivers a streamlined and engaging music experience.

### [**Live App**](https://limuzic.pages.dev/)

---

## Features

### Playlist Management
Create, edit, organize, and personalize playlists with an intuitive workflow built for efficiency. Manage your "Favorites" and custom collections effortlessly.

### Music Discovery
Explore a wide range of tracks, artists, and genres through a simplified and effective discovery interface. Dedicated sections for **Trending Now** and **Top Artists** keep you in the loop.

### Search History
Limuzic automatically stores your recent searches, allowing you to quickly return to previously explored songs, artists, or genres.

### High-Quality Audio Playback
Experience smooth and reliable audio through an optimized playback system focused on clarity and performance, powered by YouTube.

### Clean and User-Friendly Interface
A thoughtfully designed interface that prioritizes ease of use, navigation, and a distraction-free listening experience. Features a sleek dark mode with glassmorphism effects.

### Fast and Responsive
Developed with modern web technologies to ensure quick load times, responsive layouts, and a seamless experience across devices, from desktops to mobile phones.

### Ad-Free Streaming
Enjoy uninterrupted music playback without any advertisements.

### Advanced Player Controls
Take full control of your music with Shuffle, Repeat (One/All), Volume control, and precise seeking.

### Privacy-Focused
No account creation required. All your playlists and search history are stored locally on your device, ensuring your data stays with you.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Lucide React
- **Backend:** Node.js, Express
- **API:** YouTube Search (No API Key required)

---

## Installation

Follow the steps below to install and run Limuzic locally:

### 1. Clone the Repository
```bash
git clone https://github.com/anujc21/limuzic.git
cd limuzic
```

### 2. Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Install Client Dependencies
```bash
cd client
npm install
cd ..
```

## Running Locally

### 1. Start the Server
```bash
cd server
node server.js
```

### 2. Start the Client
Open a new terminal window and run:
```bash
cd client
npm run dev
```

After both processes are running, visit `http://localhost:5173` to access the application.
