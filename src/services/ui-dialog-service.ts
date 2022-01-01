import style from '../style/style.css';
import { AppConfig } from '../config/app.config';
import { UiData } from '../types/ui.type';
import { ExtensionConfig } from '../types/config-extension.type';

const selectors = {
  wrapper: 'wrapper',
  mainContainer: `container`,
  overlay: `overlay`,
  dialog: `dialog`,
  closeButton: 'close',
};

export class UiDialogService {
  private _wrapperElement: HTMLElement;
  private _isFullPageLoaded = false;
  private _currentIssueId: string;
  private _shadowRoot: ShadowRoot;
  private _extensionConfig: ExtensionConfig;
  private _isDataFromCache: boolean;
  constructor(newExtensionConfig: ExtensionConfig) {
    this._extensionConfig = newExtensionConfig;
  }

  public async waitUntilBodyExists() {
    return this._waitUntilElementExists();
  }

  public destroyDialog() {
    if (this._shadowRoot) {
      this._wrapperElement.innerHTML = '';
    }
  }

  public updateConfig(newConfig: ExtensionConfig) {
    this._extensionConfig = newConfig;
  }

  public openDialog(uiData: UiData, isDataFromCache: boolean) {
    if (this._isIssuePageAlreadyLoad(uiData.issue.summary)) {
      return;
    }
    this._currentIssueId = uiData.issue.issueId;
    this._isDataFromCache = isDataFromCache;
    const html = this._getHtml(uiData);
    this._injectHtmlToPage(html);
  }

  private _isIssuePageAlreadyLoad(issueTitle: string) {
    const el = document.querySelector(AppConfig.JIRA_ISSUE_TITLE_SELECTOR);
    return !!el && el.innerHTML.includes(issueTitle);
  }

  private _getHtmlComments(uiData: UiData) {
    let html = '';
    const comments = uiData.issue.comments;
    if (comments.length) {
      html += '<div class="comments">';
      comments.forEach((comment) => {
        const user = uiData.metadata.user[comment.authorId];
        if (!user) {
          return;
        }
        html += `
                <div class="item">
                    <img class="avatar" src="${user.imageUrl}" />
                    <div class="main">
                        <div class="info">
                            <div class="author">${user.name}</div>
                            <div class="date">${new Date(
                              comment.updated
                            ).toLocaleString()}</div>
                        </div>
                        <div class="body">
                            ${comment.bodyHtml}
                        </div>
                    </div>
                </div>
            `;
      });
      html += '</div>';
    }
    return html;
  }

  private _getUserBox(userId: string, title: string, uiData: UiData) {
    const user = uiData.metadata.user[userId];
    if (!user) {
      return '';
    }
    return `
        <div class="item userbox">
            <div class="desc">${title}</div>
            <div class="info">
                <img class="avatar" src="${user.imageUrl}" />
                <div class="name">${user.name}</div>
            </div>
        </div>
    `;
  }

  private _getHtmlMetadata(uiData: UiData) {
    const indicatorText = this._isDataFromCache ? 'From Cache' : 'Live data';
    const indicatorClass = this._isDataFromCache ? 'from-cache' : 'live';
    return ` <div class="status status-${uiData.issue.statusId % 5}">
            ${uiData.metadata.status[uiData.issue.statusId].name}
     </div>
    ${this._getUserBox(uiData.issue.reporter, 'Reporter', uiData)}
    ${this._getUserBox(uiData.issue.assignee, 'Assignee', uiData)}
    <div class="item issuetype">
        <div class="desc">Issue</div>
        <div class="info">
            <img class="icon" src="${
              uiData.metadata.issueType[uiData.issue.issueTypeId]?.imageUrl
            }" />
            <span class="name">${uiData.issue.issueId}</span>
        </div>
    </div>
    <div class="item priority">
        <div class="desc">Priority</div>
        <div class="info">
            <img class="icon" src="${
              uiData.metadata.priority[uiData.issue.priorityId]?.imageUrl
            }" />
            <span class="name">${
              uiData.metadata.priority[uiData.issue.priorityId].name
            }</span>
        </div>
    </div>
    <div class="item project">
        <div class="desc">Project</div>
        <div class="info">
            <img class="icon" src="${
              uiData.metadata.ptoject[uiData.issue.projectId]?.imageUrl
            }" />
            <span class="name">${
              uiData.metadata.ptoject[uiData.issue.projectId].name
            }</span>
        </div>
    </div>
    <div class="control">
        <div class="cache-indicator ${indicatorClass}">${indicatorText}</div>
        <button class="close">Close</button>
    </div>
   
    `;
  }

  private _getHtml(uiData: UiData) {
    let containerClasses = this._extensionConfig.showCommentsAtTop
      ? ' comments-at-top '
      : '';
    containerClasses += this._extensionConfig.commentOrderNewFirst
      ? ' comments-new-first '
      : '';

    return `
    <div class="${selectors.mainContainer} ${containerClasses}" theme-color="${
      this._extensionConfig.themeColor
    }">
        <div class="${selectors.overlay}"></div>
        <div class="${selectors.dialog}">
            <div class="box">
                <div class="maindata">
                    <div class="issue">
                        <span class="title">${uiData.issue.summary}</span>
                        <div class="desc">${uiData.issue.bodyHtml}</div>
                    </div>
                    ${this._getHtmlComments(uiData)}
                </div>
                <div class="metadata">${this._getHtmlMetadata(uiData)}</div>
            </div>
        </div>
    </div>
`;
  }

  private _injectHtmlToPage(html: string) {
    if (!this._shadowRoot) {
      const shadowHostEl = document.createElement('div') as HTMLElement;
      shadowHostEl.id = 'ex-shadow-host';
      document.body.appendChild(shadowHostEl);
      shadowHostEl.attachShadow({ mode: 'open' });
      this._shadowRoot = shadowHostEl.shadowRoot;
      this._wrapperElement = document.createElement('div');
      this._wrapperElement.className = selectors.wrapper;
      this._shadowRoot.appendChild(this._wrapperElement);
      style.use({ target: this._shadowRoot });
    }
    this._wrapperElement.innerHTML = html;
    this._jiraPageListener();
    setTimeout(() => this._initDestroyListeners(), 100);
  }

  private _jiraPageListener() {
    this._isFullPageLoaded = false;
    this._waitUntilElementExists(AppConfig.JIRA_ISSUE_TITLE_SELECTOR).then(
      () => {
        this._isFullPageLoaded = true;
        if (this._extensionConfig.hideDialogOnPageContentLoaded) {
          this.destroyDialog();
        }
      }
    );
  }

  private _waitUntilElementExists(selector?: string) {
    return new Promise<void>(async (resolve, reject) => {
      const observer = new MutationObserver((mutations, obs) => {
        const el = selector ? document.querySelector(selector) : document.body;
        if (el) {
          resolve();
          obs.disconnect();
          return;
        }
      });

      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    });
  }

  private _initDestroyListeners() {
    const elements = [`.${selectors.overlay}`, `.${selectors.closeButton}`];
    elements.forEach((elSelector) => {
      const el = this._shadowRoot.querySelector(elSelector);
      if (el) {
        el.addEventListener('click', (e) => this.destroyDialog());
      }
    });

    const onKeyboardPressHandler = (e: KeyboardEvent) => {
      if (e.keyCode == 27) {
        this.destroyDialog();
      }
      window.removeEventListener('keyup', onKeyboardPressHandler);
    };
    window.addEventListener('keyup', onKeyboardPressHandler);
    if (this._extensionConfig.hideDialogOnMouseMove) {
      const mousemoveHandler = () => {
        this.destroyDialog();
        this._shadowRoot.removeEventListener('mousemove', mousemoveHandler);
      };
      this._shadowRoot.addEventListener('mousemove', mousemoveHandler);
    }
  }
}
