const EXPLAIN_BUTTON_ID = "phantom-btn";

function isRuntimeAvailable() {
  return Boolean(globalThis.chrome?.runtime?.id && chrome.runtime.sendMessage);
}

async function safeSendMessage(message: unknown) {
  if (!isRuntimeAvailable()) return null;

  try {
    return await chrome.runtime.sendMessage(message);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes("Extension context invalidated")) {
      console.warn("Extension message failed:", error);
    }
    return null;
  }
}

document.addEventListener("mouseup", () => {
  const selected = window.getSelection()?.toString().trim();

  if (!selected || selected.length < 10) return;

  safeSendMessage({ type: "GET_MODEL_READY" })
    .then((response) => {
      if (!(response as { ready?: boolean } | null)?.ready) {
        document.getElementById(EXPLAIN_BUTTON_ID)?.remove();
        return;
      }
      showExplainButton(selected);
    })
    .catch(() => {
      document.getElementById(EXPLAIN_BUTTON_ID)?.remove();
    });
});

// Hide button when clicking elsewhere
document.addEventListener("mousedown", (e) => {
  const btn = document.getElementById(EXPLAIN_BUTTON_ID);
  const target = e.target as Node | null;
  if (btn && target && !btn.contains(target)) btn.remove();
});

function showExplainButton(code: string) {
  document.getElementById(EXPLAIN_BUTTON_ID)?.remove();

  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const rect = selection.getRangeAt(0).getBoundingClientRect();

  const btn = document.createElement("button");
  btn.id = EXPLAIN_BUTTON_ID;
  btn.innerText = "⚡ Explain";
  Object.assign(btn.style, {
    position: "fixed",
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`,
    background: "#7b61ff",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "monospace",
    zIndex: "999999",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    letterSpacing: "1px",
  });

  btn.onclick = async () => {
    btn.remove();

    // Send code AND trigger explain in one message
    await safeSendMessage({
      type: "EXPLAIN_NOW",
      code,
    });
  };

  document.body.appendChild(btn);
}
