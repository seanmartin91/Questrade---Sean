@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }

body {
  background: #080c08;
  color: #00ff88;
  font-family: 'Share Tech Mono', monospace;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: #080c08; }
::-webkit-scrollbar-thumb { background: #1a3a1a; border-radius: 2px; }

.scanline {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 136, 0.015) 2px,
    rgba(0, 255, 136, 0.015) 4px
  );
  pointer-events: none;
}
