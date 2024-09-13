import React, { useEffect, useState } from 'react';

export const RecordDialog: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMicRecording, setIsMicRecording] = useState(false);

  useEffect(() => {
    chrome.storage.session.get('recording', (result) => {
      setIsRecording(result.recording);
    });
  }, []);

  const handleRecordClick = () => {
    if (isRecording) {
      console.log('Attemping to stop recording');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab.id) {
          chrome.runtime.sendMessage({
            action: 'stopRecording',
            tabId: currentTab.id,
          });
          setIsRecording(false);
        }
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab.id) {
          chrome.runtime.sendMessage({
            action: 'startRecording',
            tabId: currentTab.id,
          });
          setIsRecording(true);
        }
      });
    }
  };

  let recorder: MediaRecorder | undefined;
  let data: Blob[] = [];

  const handleMicRecordClick = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      if (isMicRecording) {
        // recorder.stop();
        chrome.runtime.sendMessage({
          action: 'stopmicrec',
          tabId: currentTab.id,
        });
        setIsMicRecording(false);
      } else {
        // recorder.start();
        chrome.runtime.sendMessage({
          action: 'startmicrec',
          tabId: currentTab.id,
        });
        setIsMicRecording(true);
      }
    });
  };

  return (
    <div>
      <div>
        <button onClick={handleRecordClick}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <div>
        <button onClick={handleMicRecordClick}>
          {isMicRecording ? 'Stop Mic Recording' : 'Start Mic Recording'}
        </button>
      </div>
    </div>
  );
};

export default RecordDialog;
