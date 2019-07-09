import ClipboardJS from 'clipboard';

/* eslint-disable no-unused-vars */
const copyElements = document.querySelectorAll('.--copy');
const _ = new ClipboardJS(copyElements);
/* eslint-enable no-unused-vars */

const esfpsContainerElement = document.getElementById('esfps');

const SCRIPT_URL = 'https://raw.githubusercontent.com/5x/easy-steam-free-packages/gh-pages/easysfp.js';
fetch(SCRIPT_URL, {
  headers: {
    'Content-Type': 'text/plain',
  },
}).then(response => response.text())
  .then((text) => {
    esfpsContainerElement.value = text;
  });
