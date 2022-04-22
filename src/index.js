/**
 * This is the React entry point. It needs to be at src/index.js because the
 * default webpack config for React expects this.
 *
 * https://stackoverflow.com/questions/68530058/can-i-move-index-js-in-create-react-app-to-an-nested-folder
 *
 * The rest of the React frontend code is found in a subdirectory.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './frontend/App';

const body = document.querySelector('body');

const app = document.createElement('div');

app.id = 'root';

// Make sure the element that you want to mount the app to has loaded. You can
// also use `append` or insert the app using another method:
// https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
//
// Also control when the content script is injected from the manifest.json:
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time
if (body) {
  body.prepend(app);
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
