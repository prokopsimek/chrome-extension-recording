// message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.error('message', JSON.stringify(message));
  if (message === 'startmicrec') {
    console.error('startmicrec');
    startRec(message.tabId);
  } else if (message === 'stopmicrec') {
    console.error('stopmicrec');
    startRec(message.tabId);
  }
});


const startRec = async (tabId: number) => {
  let recorder: MediaRecorder | undefined;
  let data: Blob[] = [];

  console.error('startRec');

  const media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  console.error('media is');

  // // Continue to play the captured audio to the user.
  // // const output = new AudioContext();
  // const output = new AudioContext();
  // const source = output.createMediaStreamSource(media);

  // const destination = output.createMediaStreamDestination();
  // // const micSource = output.createMediaStreamSource(micMedia);

  // source.connect(output.destination);
  // source.connect(destination);
  // // micSource.connect(destination);
  // console.error('REC MIC output', output);

  // Start recording.
  recorder = new MediaRecorder(media, { mimeType: 'video/webm' });
  recorder.ondataavailable = (event: any) => data.push(event.data);
  recorder.onstop = async () => {
    console.error('recorder.onstop');
    const blob = new Blob(data, { type: 'video/webm' });

    window.open(URL.createObjectURL(blob), '_blank');

    // Clear state ready for next recording
    recorder = undefined;
    data = [];
  };
  
  recorder.start();

  setTimeout(() => {
    recorder?.stop();
  }, 2000);
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
