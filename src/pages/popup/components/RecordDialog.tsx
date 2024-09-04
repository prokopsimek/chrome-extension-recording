import React, { useEffect, useState } from 'react';

export const RecordDialog: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);

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

  return (
    <div>
      <div>
        <button onClick={handleRecordClick}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
};

export default RecordDialog;
