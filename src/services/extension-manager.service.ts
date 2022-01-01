import { DataMainService } from './data-main.service';
import { UiDialogService } from './ui-dialog-service';
import { AppConfig } from '../config/app.config';
import { ExtensionConfig } from '../types/config-extension.type';

export class ExtensionManagerService {
  private _currentPresentedIssueId: string;
  private _extensionConfig = AppConfig.CHROME_EXTENSION;
  private _uiDialogService: UiDialogService;
  constructor() {
    this._extensionConfig = this._getExtensionConfigFromLocalStorage();
    this._uiDialogService = new UiDialogService(this._extensionConfig);
    this._initPopupListeners();
  }

  private _initPopupListeners() {
    const listener = window.addEventListener;
    listener('jiraExtenstionPopupDataRequest', () => {
      this._sendConfigDataFromPageToPopup();
    });

    listener('jiraExtenstionNewConfigFromPopup', (evt: CustomEvent) => {
      this._saveExtensionConfigOnLocalStorage(evt.detail as ExtensionConfig);
    });

    listener('jiraExtenstionClearCacheRequest', () => {
      this._clearDatabaseCache();
    });
  }

  private _clearDatabaseCache() {
    const dataService = new DataMainService(this._extensionConfig);
    dataService.clearCache();
  }

  private _sendConfigDataFromPageToPopup() {
    const extensionConfig = this._extensionConfig;
    const evt = new CustomEvent('jiraExtenstionConfigFromPage', {
      detail: extensionConfig,
    });
    window.dispatchEvent(evt);
  }

  private _isValidIssueId(issueId: string) {
    return /^([A-Z\d]+-[0-9]+)$/.test(issueId);
  }

  private _getIssueIdFromUrl(): string | null {
    const url = new URL(location.href);
    const issueByPath = url.pathname.split('/browse/')[1];
    const issueBySearchParams = url.searchParams.get('selectedIssue');
    if (issueByPath && this._isValidIssueId(issueByPath)) {
      return issueByPath;
    }
    if (issueBySearchParams && this._isValidIssueId(issueBySearchParams)) {
      return issueBySearchParams;
    }
    return null;
  }

  private _saveExtensionConfigOnLocalStorage(
    newExtensionConfig: ExtensionConfig
  ) {
    this._extensionConfig = {
      ...this._extensionConfig,
      ...newExtensionConfig,
    };
    this._uiDialogService.updateConfig(this._extensionConfig);
    localStorage.setItem(
      AppConfig.USER_CONFOG_LOCAL_STORAGE_KEY,
      JSON.stringify(this._extensionConfig)
    );
  }

  private _getExtensionConfigFromLocalStorage() {
    try {
      const localStorageData = localStorage.getItem(
        AppConfig.USER_CONFOG_LOCAL_STORAGE_KEY
      );
      const configJson = JSON.parse(localStorageData) as ExtensionConfig;
      if (Object(configJson) !== configJson) {
        throw new Error();
      }
      return configJson;
    } catch (e) {
      return AppConfig.CHROME_EXTENSION;
    }
  }

  public init() {
    this._pageLoadHandler();
    this._urlChangeListener();
  }

  private _urlChangeListener() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this._pageLoadHandler(false);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  private async _pageLoadHandler(isPageLoad = true) {
    const issueID = this._getIssueIdFromUrl();
    if (issueID) {
      if (issueID === this._currentPresentedIssueId) {
        return Promise.resolve();
      }

      this._currentPresentedIssueId = issueID;
      const dataService = new DataMainService(this._extensionConfig);

      const bodyExists = isPageLoad
        ? await this._uiDialogService.waitUntilBodyExists()
        : await Promise.resolve();
      const uiData = await dataService.getIssueById(issueID);
      Promise.all([bodyExists, uiData]).then(() => {
        if (
          !dataService.isDataFromCache &&
          this._extensionConfig.showDialogForCacheOnly
        ) {
          // live data - don't show the dialog
          return;
        }
        this._uiDialogService.openDialog(uiData, dataService.isDataFromCache);
      });
    } else {
      this._uiDialogService.destroyDialog();
    }
  }
}
