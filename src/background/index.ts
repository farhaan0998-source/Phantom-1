import { ServiceWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

new ServiceWorkerMLCEngineHandler();

let isModelReady = false;

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id! });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "MODEL_READY") {
    isModelReady = true;
    return;
  }

  if (message.type === "GET_MODEL_READY") {
    return Promise.resolve({ ready: isModelReady });
  }

  if (message.type === "EXPLAIN_NOW") {
    if (!isModelReady) return;

    // Open sidebar
    chrome.sidePanel.open({ tabId: sender.tab!.id! });
    // Forward to sidebar
    chrome.runtime.sendMessage(message).catch(() => {});
  }
});