const startRecordingOffscreen = async (tabId: number) => {
  const existingContexts = await chrome.runtime.getContexts({});
  let recording = false;

  const offscreenDocument = existingContexts.find((c) => c.contextType === 'OFFSCREEN_DOCUMENT');

  // If an offscreen document is not already open, create one.
  if (!offscreenDocument) {
    console.error('OFFSCREEN no offscreen document');
    // Create an offscreen document.
    await chrome.offscreen.createDocument({
      url: 'pages/offscreen/index.html',
      reasons: [chrome.offscreen.Reason.USER_MEDIA, chrome.offscreen.Reason.DISPLAY_MEDIA],
      justification: 'Recording from chrome.tabCapture API',
    });
  } else {
    recording = offscreenDocument.documentUrl?.endsWith('#recording') ?? false;
  }

  if (recording) {
    chrome.runtime.sendMessage({
      type: 'stop-recording',
      target: 'offscreen',
    });
    chrome.action.setIcon({ path: 'icons/not-recording.png' });
    return;
  }

  // Get a MediaStream for the active tab.
  console.error('BACKGROUND getMediaStreamId');

  const streamId = await new Promise<string>((resolve) => {
    // chrome.tabCapture.getMediaStreamId({ consumerTabId: tabId }, (streamId) => {
    chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, (streamId) => {
      resolve(streamId);
    });
  });
  console.error('BACKGROUND streamId', streamId);

  const micStreamId = await new Promise<string>((resolve) => {
    chrome.tabCapture.getMediaStreamId({ consumerTabId: tabId }, (streamId) => {
      resolve(streamId);
    });
  });
  console.error('BACKGROUND micStreamId', micStreamId);

  // Send the stream ID to the offscreen document to start recording.
  chrome.runtime.sendMessage({
    type: 'start-recording',
    target: 'offscreen',
    data: streamId,
    micStreamId,
  });

  chrome.action.setIcon({ path: '/icons/recording.png' });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    console.error('startRecording in background', JSON.stringify(message));
    startRecordingOffscreen(message.tabId);
    // startRecording(message.tabId, message.orgId);
    return true;
  } else if (message.action === 'stopRecording') {
    console.error('stopRecording in background');
    startRecordingOffscreen(message.tabId);
    return true;
  } else if (message.action === 'set-recording') {
    console.error('set-recording in background', message.recording);
    chrome.storage.session.set({ recording: message.recording });
  }
});
