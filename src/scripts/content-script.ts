// message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.error('message', JSON.stringify(message));
  // if (message.action === 'startRecording') {
  //   startRecording(message.streamId, message.orgId);
  // } else if (message.action === 'stopRecording') {
  //   stopRecording();
  // }
});

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
