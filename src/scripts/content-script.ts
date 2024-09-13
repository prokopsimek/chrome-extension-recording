// message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.error('message', JSON.stringify(message));
  if (message.target === 'content') {
    if (message.action === 'startmicrec') {
      console.error('startmicrec');
      startRec(message.tabId, message.micStreamId);
      return true;
    } else if (message.action === 'stopmicrec') {
      console.error('stopmicrec');
      return startRec(message.tabId, message.micStreamId);
    } else if (message.action === 'open-new-tab') {
      window.open(URL.createObjectURL(new Blob([new Uint8Array(message.data)], { type: 'video/webm' })), '_blank');
    }
  }
});

export const startRec = async (tabId: number, micStreamId: string) => {
  let recorder: MediaRecorder | undefined;
  let data: Blob[] = [];
  
  // console.error('recorder?.state', recorder?.state);
  // if (recorder?.state === 'recording') {
  //   console.error("sending data", data)
  //   recorder.stop();
  //   return data;
  // }

  console.error('startRec');

  const media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  } as any);

  // navigator.mediaDevices
  //   .enumerateDevices()
  //   .then((devices) => {
  //     devices.forEach((device) => {
  //       console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
  //     });
  //   })
  //   .catch((err) => {
  //     console.error(`${err.name}: ${err.message}`);
  //   });

  console.error('media is');
  
  // Start recording.
  recorder = new MediaRecorder(media, { mimeType: 'video/webm' });
  recorder.ondataavailable = async (event: any) => { 
    data.push(event.data) 
    const bytes = await new Blob(data, { type: 'video/webm' }).arrayBuffer();
    await chrome.runtime.sendMessage({ action: 'set-data', name: 'micData', data: Array.from(new Uint8Array(bytes)) })
  };
  recorder.onstop = async () => {
    console.error('recorder.onstop');
    const blob = new Blob(data, { type: 'video/webm' });

    window.open(URL.createObjectURL(blob), '_blank');

    // Clear state ready for next recording
    recorder = undefined;
    data = [];

    // return blob;
  };

  recorder.start();

  setTimeout(() => {
    recorder?.stop();
  }, 4000);
};

/*

NOT USED FOR NOW

*/

// let recorder: AudioRecorder | null = null;

// async function startRecording(streamId: string, orgId: string) {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: false,
//       audio: {
//         mandatory: {
//           // echoCancellation: false,
//           // noiseSuppression: false,
//           chromeMediaSource: 'tab',
//           chromeMediaSourceId: streamId,
//         },
//       },
//     } as any);

//     if (!stream) {
//       throw new Error('Failed to capture tab audio');
//     }

//     const audioContext = new AudioContext();
//     const source = audioContext.createMediaStreamSource(stream);
//     const destination = audioContext.createMediaStreamDestination();

//     source.connect(audioContext.destination); // Playing audio to user
//     source.connect(destination); // Copy of audio for recording

//     // ...
//   } catch (error) {
//     console.error('Error starting recording:', error);
//     throw error;
//   }
// }

// async function stopRecording() {
//   if (recorder) {
//     await recorder.stopRecording();
//   }
// }
