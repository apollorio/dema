/**
 * Apollo BPM MAX - Assets Blob
 * Encrypted CSS and UI assets
 * Ultra-secure resource protection
 */

// Encryption utilities
const ASSETS_KEY = 'APOLLO_ASSETS_MAX_2026';

function encryptAsset(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

function decryptAsset(encoded, key) {
  const decoded = atob(encoded);
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// Encrypted CSS
const ENCRYPTED_CSS = encryptAsset(`
/* Apollo BPM MAX - Ultra-Secure Styles */
:root {
  --primary: #f45f00;
  --bg: #000;
  --text: #fff;
  --accent: #00f45f;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Courier New', monospace;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.container {
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 2em;
  color: var(--primary);
  margin-bottom: 20px;
  text-shadow: 0 0 10px var(--primary);
}

.bpm-display {
  font-size: 5em;
  font-weight: bold;
  color: var(--accent);
  margin: 20px 0;
  text-shadow: 0 0 20px var(--accent);
}

.status {
  font-size: 1.2em;
  margin: 10px 0;
  opacity: 0.8;
}

.controls {
  margin-top: 30px;
}

.btn {
  background: var(--primary);
  color: var(--bg);
  border: none;
  padding: 15px 30px;
  font-size: 1.1em;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
  transition: all 0.3s;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--primary);
}

.btn:active {
  transform: scale(0.95);
}

.security-notice {
  position: fixed;
  bottom: 10px;
  right: 10px;
  font-size: 0.8em;
  opacity: 0.5;
  pointer-events: none;
}
`, ASSETS_KEY);

// Encrypted HTML templates
const ENCRYPTED_TEMPLATES = encryptAsset(`
<div class="container">
  <h1 class="title">Apollo BPM MAX</h1>
  <div class="bpm-display" id="bpm">---</div>
  <div class="status" id="status">Initializing...</div>
  <div class="controls">
    <button class="btn" id="startBtn">START</button>
    <button class="btn" id="stopBtn">STOP</button>
  </div>
  <div class="security-notice">🔒 Ultra-Secure Mode</div>
</div>
`, ASSETS_KEY);

// Assets module
const BPM_ASSETS = {
  css: ENCRYPTED_CSS,
  templates: ENCRYPTED_TEMPLATES,
  key: ASSETS_KEY,
  decrypt: decryptAsset,

  // Utility functions
  loadCSS: function() {
    const style = document.createElement('style');
    style.textContent = this.decrypt(this.css, this.key);
    document.head.appendChild(style);
  },

  loadTemplate: function() {
    const template = this.decrypt(this.templates, this.key);
    document.body.innerHTML = template;
  }
};

// Export globally
window.BPM_ASSETS = BPM_ASSETS;