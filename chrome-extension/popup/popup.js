document.addEventListener('DOMContentLoaded', function () {
  const querySelector = (selector) => document.querySelector(selector);
  const body = document.body;
  const optionsForm = querySelector('.options-form');
  const clearCacheButton = querySelector('.clear-cache');
  const fieldset = querySelector('fieldset');

  const inputsAll = [
    {
      name: 'hideDialogOnPageContentLoaded',
      type: 'checkbox',
    },
    {
      name: 'hideDialogOnMouseMove',
      type: 'checkbox',
    },
    {
      name: 'showDialogForCacheOnly',
      type: 'radio',
    },
    {
      name: 'showCommentsAtTop',
      type: 'radio',
    },
    {
      name: 'commentOrderNewFirst',
      type: 'radio',
    },
    {
      name: 'themeColor',
      type: 'radio',
    },
    {
      name: 'cacheMaxKb',
      type: 'number',
    },
  ];

  const populateFormValus = (newValues) => {
    inputsAll.forEach((item) => {
      let el = querySelector(`[name="${item.name}"]`);
      if (!el) {
        return;
      }
      switch (item.type) {
        case 'radio':
          querySelector(
            `[name="${item.name}"][value="${newValues[item.name]}"]`
          ).checked = true;
          break;
        case 'checkbox':
          el.checked = newValues[item.name];
          break;
        default:
          el.value = newValues[item.name];
          break;
      }
    });
  };

  const isJiraPage = (url) => {
    return /^https:\/\/(.*)\.atlassian\.net(.*)/.test(url);
  };
  const showDone = () => {
    const doneEl = body.classList.add('show-done');
    setTimeout(() => {
      body.classList.remove('show-done');
    }, 750);
  };
  const showHidePage = (show) => {
    const classes = body.classList;
    if (show) {
      classes.remove('not-jira-site');
    } else {
      classes.add('not-jira-site');
      classes.remove('loading');
    }
  };

  const getFormValus = () => {
    const formValue = {};
    inputsAll.forEach((item) => {
      let el;
      switch (item.type) {
        case 'radio':
          el = querySelector(`[name="${item.name}"]:checked`);
          if (el) {
            let value = el.value;
            switch (el.value) {
              case 'true':
                value = true;
                break;
              case 'false':
                value = false;
                break;
            }
            formValue[item.name] = value;
          }
          break;
        case 'checkbox':
          el = querySelector(`[name="${item.name}"]`);
          if (el) {
            formValue[item.name] = el.checked;
          }
          break;
        default:
          el = querySelector(`[name="${item.name}"]`);
          formValue[item.name] = el.value;
          break;
      }
    });
    return formValue;
  };

  optionsForm.addEventListener('submit', (e) => {
    const newOptions = getFormValus();
    sendOptionsFromPopupToPage(newOptions);
    showDone();
    e.preventDefault();
  });

  clearCacheButton.addEventListener('click', (e) => {
    clearCache();
    showDone();
  });

  chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.name === 'newConfigData') {
      populateFormValus(msg.data);
      fieldset.removeAttribute('disabled');
      body.classList.remove('loading');
    }
  });

  const waitForTab = async () => {
    let tab = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab;
  };

  const executeScript = (tabId, fn) => {
    chrome.scripting.executeScript({
      target: {
        tabId: tabId,
      },
      function: fn,
    });
  };

  const onPopupOpen = async () => {
    const [tab] = await waitForTab();
    const isValidPage = isJiraPage(tab.url);
    showHidePage(isValidPage);
    if (!isValidPage) {
      return Promise.resolve();
    }
    executeScript(tab.id, getDataFromPageToPopup);
  };

  const clearCache = async () => {
    const [tab] = await waitForTab();
    executeScript(tab.id, sendClearCacheRequest);
  };

  const sendOptionsFromPopupToPage = async (newOptions) => {
    const [tab] = await waitForTab();
    chrome.storage.sync.set({
      popupFormValue: newOptions,
    });
    executeScript(tab.id, sendDataToPage);
  };
  onPopupOpen();
});

const sendClearCacheRequest = () => {
  var evt = new CustomEvent('jiraExtenstionClearCacheRequest');
  window.dispatchEvent(evt);
};

const sendDataToPage = () => {
  chrome.storage.sync.get('popupFormValue', ({ popupFormValue }) => {
    var evt = new CustomEvent('jiraExtenstionNewConfigFromPopup', {
      detail: popupFormValue,
    });
    window.dispatchEvent(evt);
  });
};

const getDataFromPageToPopup = () => {
  window.addEventListener(
    'jiraExtenstionConfigFromPage',
    (evt) => {
      chrome.runtime.sendMessage({
        name: 'newConfigData',
        data: evt.detail,
      });
    },
    { once: true }
  );
  const evt = new CustomEvent('jiraExtenstionPopupDataRequest');
  window.dispatchEvent(evt);
};
