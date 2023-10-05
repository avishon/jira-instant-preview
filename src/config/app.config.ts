import { ExtensionConfig } from '../types/config-extension.type';

export const AppConfig = {
  DB_NAME: 'jiraCacheDb',
  DB_VERSION: 1,
  DB_STORES: {
    ISSUES: {
      NAME: 'issues',
      KEY: 'issueId',
    },
    METADATA: {
      NAME: 'metadata',
      KEY: 'indexkey',
    },
  },
  API_ISSUE_URL: '/rest/api/3/issue/',
  CHROME_EXTENSION: <ExtensionConfig>{
    cacheMaxKb: 600000,
    hideDialogOnPageContentLoaded: true,
    hideDialogOnMouseMove: false,
    showDialogForCacheOnly: false,
    showCommentsAtTop: false,
    commentOrderNewFirst: false,
    themeColor: 'default',
  },
  USER_CONFOG_LOCAL_STORAGE_KEY: 'jiraChromeExtensionUserConfig',
  JIRA_ISSUE_TITLE_SELECTOR:
    '[data-test-id="issue.views.issue-base.foundation.summary.heading"],[data-testid="issue.views.issue-base.foundation.summary.heading"]',
};
