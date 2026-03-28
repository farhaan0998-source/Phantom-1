document.addEventListener("mouseup", () => {
  const selected = window.getSelection()?.toString().trim();
  console.log("Selected text:", selected); // ← add this

  if (!selected || selected.length < 10) return;

  chrome.runtime
    .sendMessage({ type: "GET_MODEL_READY" })
    .then((response) => {
      if (!response?.ready) {
        document.getElementById("phantom-btn")?.remove();
        return;
      }
      showExplainButton(selected);
    })
    .catch(() => {
      document.getElementById("phantom-btn")?.remove();
    });
});

// Hide button when clicking elsewhere
document.addEventListener("mousedown", (e) => {
  const btn = document.getElementById("phantom-btn");
  if (btn && e.target !== btn) btn.remove();
});

function showExplainButton(code: string) {
  document.getElementById("phantom-btn")?.remove();

  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const rect = selection.getRangeAt(0).getBoundingClientRect();

  const btn = document.createElement("button");
  btn.id = "phantom-btn";
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

  btn.onclick = () => {
    btn.remove();

    // Send code AND trigger explain in one message
    chrome.runtime.sendMessage({
      type: "EXPLAIN_NOW",
      code,
    });
  };

  document.body.appendChild(btn);
}
