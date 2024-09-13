/*
 * Sample code for offscreen document:
 *  https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.tabcapture-recorder
 */

import React, { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.target === 'offscreen') {
        switch (message.type) {
          case 'start-recording':
            console.error('OFFSCREEN start-recording');
            startRecording(message.data, message.tabId, message.micData, message.orgId, message.micStreamId);
            break;
          case 'stop-recording':
            console.error('OFFSCREEN stop-recording');
            stopRecording();
            break;
          default:
            throw new Error(`Unrecognized message: ${message.type}`);
        }
      }
    });
  }, []);

  let recorder: MediaRecorder | undefined;
  let data: Blob[] = [];

  async function startRecording(streamId: string, tabId: number, micData: Blob[], orgId: string, micStreamId: string) {
    if (recorder?.state === 'recording') {
      throw new Error('Called startRecording while recording is in progress.');
    }

    const media = await navigator.mediaDevices.getUserMedia({
      // audio: true,
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    } as any);
    console.error('OFFSCREEN media', media);

    // const videoMedia = await navigator.mediaDevices.getDisplayMedia({
    //   // audio: true,
    //   video: true,
    // });

    // FIXME: this causes error in recording, stops recording the offscreen
    // const micMedia = await navigator.mediaDevices.getUserMedia({
    //   audio: {
    //     mandatory: {
    //       chromeMediaSource: 'device',
    //       chromeMediaSourceId: micStreamId,
    //     },
    //   },
    //   video: false,
    // } as any);
    // const micMedia = await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: false,
    // });

    // Continue to play the captured audio to the user.
    const output = new AudioContext();
    const source = output.createMediaStreamSource(media);

    const destination = output.createMediaStreamDestination();
    // const micSource = output.createMediaStreamSource(micMedia);
    // const vidSource = output.createMediaStreamSource(videoMedia);

    source.connect(output.destination);
    source.connect(destination);
    // micSource.connect(destination);
    console.error('OFFSCREEN output', output);

    // Start recording.
    recorder = new MediaRecorder(destination.stream, { mimeType: 'video/webm' });
    recorder.ondataavailable = async (event: any) => { 
      data.push(event.data) 
      // await chrome.storage.local.set({ tabData: {data: data} })
      const bytes = await new Blob(data, { type: 'video/webm' }).arrayBuffer();
      await chrome.runtime.sendMessage({ action: 'set-data', name: 'tabData', data: Array.from(new Uint8Array(bytes)) })
    };
    recorder.onstop = async () => {
      // const micData = await chrome.runtime.sendMessage({ tabId, action: 'stopmicrec', target: 'content' });
      
      // const blob = new Blob(data, { type: 'video/webm' });
      
      // delete local state of recording
      chrome.runtime.sendMessage({
        action: 'set-recording',
        recording: false,
      });

      // window.open(URL.createObjectURL(blob), '_blank');

      // Clear state ready for next recording
      recorder = undefined;
      data = [];

      await chrome.runtime.sendMessage({
        action: 'stop-all-rec',
        tabId,
      });

    };

    
    recorder.start();
    
    chrome.runtime.sendMessage({tabId, action: 'startmicrec', target: 'content' });

    console.error('OFFSCREEN recorder started', recorder);

    chrome.runtime.sendMessage({
      action: 'set-recording',
      recording: true,
    });

    // Record the current state in the URL. This provides a very low-bandwidth
    // way of communicating with the service worker (the service worker can check
    // the URL of the document and see the current recording state). We can't
    // store that directly in the service worker as it may be terminated while
    // recording is in progress. We could write it to storage but that slightly
    // increases the risk of things getting out of sync.
    window.location.hash = 'recording';
  
    // stop recording after 5 seconds
    setTimeout(() => {
      recorder?.stop();
    }, 3000);  
  }

  async function stopRecording() {
    recorder?.stop();

    // Stopping the tracks makes sure the recording icon in the tab is removed.
    recorder?.stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());

    // Update current state in URL
    window.location.hash = '';

    // Note: In a real extension, you would want to write the recording to a more
    // permanent location (e.g IndexedDB) and then close the offscreen document,
    // to avoid keeping a document around unnecessarily. Here we avoid that to
    // make sure the browser keeps the Object URL we create (see above) and to
    // keep the sample fairly simple to follow.
  }

  return <div></div>;
};

export default App;
