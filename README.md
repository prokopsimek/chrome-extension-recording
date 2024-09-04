# Google Meet Recorder Browser Extension

## Description
This browser extension records meetings and then opens the recorded file in a new tab.

## Prerequisities

- Node v20
- yarn v1.x

## Run the project

1. Install dependencies and run the project
```
yarn install
yarn dev
```

2. load the extension in Chrome (chrome://extensions)
3. click on "Load unpacked"
4. select the `chrome-extension-recording` folder
5. open Youtube in a new tab
6. click on "Start Recording"
7. click on "Stop Recording"
8. a new tab with the recording is opened
9. you can save the recording locally

## Development

- `src/pages/offscreen/*` (React)
    - the main logic to record an audio from a given tab
- `src/pages/popup/*` (React)
    - opens a browser popup to get a select and show button "Start Recording" or "Stop Recording"
- `src/scripts/content-script.ts`
    - not currently used content script for business logic
- `src/background.ts`
    - background script for extension

## Acceptance Criteria

1. The Browser (Chrome) Extension is written in TypeScript and React
2. Uses the best practices according to Browser Extension (offscreen, storing blob with 1-x hours of recording, etc.)
3. When you click on "Start Recording" in a popup, the recording starts for Google Meet or any other tab such as Youtube (audio recording from Youtube video)
    - Records audio from a tab where the recording has been started
    - Record audio from the user (device), but only if has turned on microphone for Google Meet
4. When the tab is closed OR clicked on "Stop Recording", the recording is correctly finished
5. After the recording is stopped
    - A new tab with one audio file with combined tab recording and mic recording is opened to be able to save the file locally. **The file is exactly ONE and combines the audio from Google Meet and Mic recording too. IN JUST ONE FILE.**
    - All recoding of tabs and even mic are correctly stopped