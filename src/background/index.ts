import { ServiceWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

new ServiceWorkerMLCEngineHandler();

const MODEL_READY_KEY = "modelReady";
let isModelReady = false;

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id! });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "MODEL_READY") {
    isModelReady = true;
    chrome.storage.local.set({ [MODEL_READY_KEY]: true }).catch(() => {});
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === "GET_MODEL_READY") {
    if (isModelReady) {
      sendResponse({ ready: true });
      return true;
    }

    chrome.storage.local
      .get(MODEL_READY_KEY)
      .then((data) => {
        const ready = Boolean(data?.[MODEL_READY_KEY]);
        if (ready) isModelReady = true;
        sendResponse({ ready });
      })
      .catch(() => sendResponse({ ready: false }));

    return true;
  }

  if (message.type === "EXPLAIN_NOW") {
    if (!isModelReady) {
      sendResponse({ ok: false, reason: "model-not-ready" });
      return true;
    }

    // Open sidebar
    chrome.sidePanel.open({ tabId: sender.tab!.id! });
    // Forward to sidebar
    chrome.runtime.sendMessage(message).catch(() => {});
    sendResponse({ ok: true });
    return true;
  }

  return undefined;
});