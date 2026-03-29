# 🚀 PHANTOM

## Local AI Coding Assistant — Runs locally in Your Browser
---

 1. Project Name

**PHANTOM**

> A privacy-first, offline AI coding assistant that runs entirely in the browser.

---

## 2. Problem Statement

Modern AI coding tools (like Copilot, ChatGPT, etc.) depend heavily on cloud infrastructure. This creates three major issues:

* 🔐 **Privacy Risks** – Source code is sent to external servers
* 🌐 **Internet Dependency** – No connection = no AI
* 💸 **Cost & Rate Limits** – API usage is expensive and restricted

For enterprises, students, and developers working with sensitive code, this is a serious limitation.

---

## 3. Solution

**PHANTOM** solves this by bringing the AI directly to the user.

* Runs a **code-specialized language model inside the browser**
* Uses **WebAssembly + WebGPU** for near-native performance
* Requires **no backend, no API key, no internet (after initial load)**

> The AI comes to your code — not the other way around.

---

## 4. Features

✨ **Fully Local AI**

* Runs entirely in-browser
* No data leaves your machine

⚡ **Real-time Code Assistance** *(Prototype)*

* Code suggestions
* Code explanation
* Debugging help

🔄 **Streaming Responses**

* Token-by-token output for smooth UX

🧠 **Web Worker-based Execution**

* Prevents UI freezing
* Enables background inference

💾 **Model Caching (IndexedDB)**

* Load once, reuse instantly

🔌 **SDK-Ready Architecture (Planned)**

* Can be embedded into any web app

---

## 5. Tech Stack

**Frontend**

* React
* TypeScript
* Vite

**AI / Runtime**

* WebLLM
* MLC-LLM
* WebAssembly (WASM)
* WebGPU

**Browser APIs**

* Web Workers
* IndexedDB

---

## 6. How to Run

```bash
# Clone the repository
git clone https://github.com/Akash-Ashok-Dev/Phantom.git

# Navigate into project
cd Phantom

# Install dependencies
npm install

# Run development server
npm run dev
```

Then open.

## 7. Screenshots

/screenshots/interface.jpeg  
/screenshots/example1.jpeg  
/screenshots/example2.jpeg

---


## 🧪 Project Status

⚠️ **Prototype**

PHANTOM is currently in an early prototype stage demonstrating:

* In-browser LLM inference
* Local AI interaction flow
* Core architecture feasibility

Future work includes:

* Better model optimization
* Faster inference
* Full SDK release
* Advanced code intelligence features

---

## 💡 Vision

PHANTOM aims to become:

> **The AI runtime for the browser**

Enabling developers to build AI-powered applications with:

* Zero backend
* Zero API costs
* Complete privacy

---

## 🔥 Why PHANTOM Matters

* Own your AI
* Keep your code private
* Work without limits

---