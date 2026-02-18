// frontend/src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/global.css";
import "./styles/themes.css";
import "./styles/settings.css";

import Settings from "./components/settings/Settings";
import Home from "./pages/Home.jsx";
import Login from "./components/Login";
import Signup from "./components/Signup";

// NEW: lastOpened system
import {
  getLastOpened,
  markServerOpened,
  markChannelOpened,
  markDMOpened,
} from "./utils/lastOpened";

export default function App() {
  // THEME
  const [theme, setTheme] = useState(
    localStorage.getItem("nw_theme") || "nerdwire"
  );

  // BUBBLE STYLE
  const [bubbleStyle, setBubbleStyle] = useState(
    localStorage.getItem("nw_bubble_style") || "clean"
  );

  // LAST OPENED (servers, channels, dms)
  const [lastOpened, setLastOpened] = useState(getLastOpened());

  // Update theme class on <body>
  useEffect(() => {
    document.body.classList.remove(
      "theme-cyberpunk",
      "theme-nerdwire",
      "theme-minimal"
    );
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("nw_theme", theme);
  }, [theme]);

  // Save bubble style
  useEffect(() => {
    localStorage.setItem("nw_bubble_style", bubbleStyle);
  }, [bubbleStyle]);

  // Helpers to update lastOpened + refresh state
  const handleServerOpened = (serverId) => {
    markServerOpened(serverId);
    setLastOpened(getLastOpened());
  };

  const handleChannelOpened = (channelId) => {
    markChannelOpened(channelId);
    setLastOpened(getLastOpened());
  };

  const handleDMOpened = (userId) => {
    markDMOpened(userId);
    setLastOpened(getLastOpened());
  };

  return (
    <Router>
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <Home
              bubbleStyle={bubbleStyle}
              lastOpened={lastOpened}
              onServerOpened={handleServerOpened}
              onChannelOpened={handleChannelOpened}
              onDMOpened={handleDMOpened}
            />
          }
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <Settings
              currentTheme={theme}
              onThemeChange={setTheme}
              bubbleStyle={bubbleStyle}
              onBubbleStyleChange={setBubbleStyle}
            />
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}
