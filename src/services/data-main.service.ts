import { AppConfig } from '../config/app.config';
import { IndexedDbService } from './indexed-db.service';
import { DataIssueService } from './data-issue.service';
import { DataMetadataService } from './dara-metadata.service';
import { IssueApiItem } from '../types/issue-api.type';
import { IssueDatabaseItem } from '../types/issue-database.type';
import { UiData } from '../types/ui.type';
import { MetadataDatabaseItem } from '../types/metadata-database-item.type';
import { ExtensionConfig } from '../types/config-extension.type';

type IssueId = string;
export class DataMainService {
  private _dataIssueService: DataIssueService;
  private _dataMetadataService: DataMetadataService;
  private _issuesDb: IndexedDbService;
  private _metadataDb: IndexedDbService;
  private _isDataFromCache: boolean;
  private _extensionConfig: ExtensionConfig;
  constructor(newExtensionConfig: ExtensionConfig) {
    this._extensionConfig = newExtensionConfig;
    this._initDb();
  }

  public get isDataFromCache() {
    return this._isDataFromCache;
  }

  public async getIssueById(issueId: IssueId) {
    const issueFromCache = await this._getIssueFromCache(issueId);
    if (issueFromCache) {
      const metadataFromCache = await this._getMetadataFromCache(
        issueFromCache
      );
      setTimeout(async () => {
        const data = await this._getDataFromApi(issueId);
        this._putDataInCacheWithDelay(data.issue, data.metadata, 0);
      }, 1000);
      this._isDataFromCache = true;
      return this._getUiData(issueFromCache, metadataFromCache);
    } else {
      const data = await this._getDataFromApi(issueId);
      this._putDataInCacheWithDelay(data.issue, data.metadata);
      this._isDataFromCache = false;
      return this._getUiData(data.issue, data.metadata);
    }
  }

  private _getUiData(
    issue: IssueDatabaseItem,
    metadata: MetadataDatabaseItem[]
  ): UiData {
    return {
      issue: issue,
      metadata: this._dataMetadataService.getMetadataForUi(metadata),
    };
  }

  public clearCache() {
    this._issuesDb.deleteDatabase();
  }

  private async _putDataInCacheWithDelay(
    issue: IssueDatabaseItem,
    metadata: MetadataDatabaseItem[],
    delay = 1000
  ) {
    setTimeout(async () => {
      await this._dbPutIssues(issue);
      await this._dbPutMetadata(metadata);
      this._deleteOldRecords();
    }, delay);
  }

  private async _getMetadataFromCache(issueFromCache: IssueDatabaseItem) {
    const metadataQueryKeys = this._dataMetadataService.preperDatabaseQuery(
      issueFromCache
    );
    const metadataFromCache = await this._metadataDb.read<MetadataDatabaseItem>(
      metadataQueryKeys
    );
    return metadataFromCache;
  }

  private async _getIssueFromCache(issueId: IssueId) {
    const dbCacheIssue = await this._issuesDb.read<IssueDatabaseItem>([
      issueId,
    ]);
    const issueFromCache = dbCacheIssue[0];
    return issueFromCache;
  }

  private async _getDataFromApi(issueId: IssueId) {
    const apiData = await this._getApiData(issueId);
    const dbDataIssue = this._dataIssueService.getIssueDatabaseItem(apiData);
    const dbDataMetadata = this._dataMetadataService.getMetadataFromApi(
      apiData
    );
    return {
      issue: dbDataIssue,
      metadata: dbDataMetadata,
    };
  }

  private _deleteOldRecords() {
    navigator.storage.estimate().then(({ usage, quota }) => {
      const usageKb = usage / 1000;
      const quotaKb = quota / 1000;
      if (
        quotaKb - usageKb < 10000 ||
        usageKb >= this._extensionConfig.cacheMaxKb
      ) {
        this._issuesDb.deleteOldItems(10);
        this._metadataDb.deleteOldItems(10);
      }
    });
  }

  private async _dbPutIssues(data: IssueDatabaseItem) {
    await this._issuesDb.write([data]);
  }

  private async _dbPutMetadata(data: MetadataDatabaseItem[]) {
    await this._metadataDb.write(data);
  }

  private async _getApiData(issueId: IssueId) {
    const response = await fetch(
      `${
        AppConfig.API_ISSUE_URL + issueId
      }?fields=summary,description,assignee,reporter,issuetype,project,comment,priority,status`
    );
    const apiData = (await response.json()) as IssueApiItem;
    return apiData;
  }

  private _initDb() {
    this._dataIssueService = new DataIssueService();
    this._dataMetadataService = new DataMetadataService();
    this._issuesDb = new IndexedDbService(
      AppConfig.DB_NAME,
      AppConfig.DB_VERSION,
      AppConfig.DB_STORES.ISSUES.NAME,
      AppConfig.DB_STORES.ISSUES.KEY,
      [
        {
          storeName: AppConfig.DB_STORES.ISSUES.NAME,
          keyPath: AppConfig.DB_STORES.ISSUES.KEY,
        },
        {
          storeName: AppConfig.DB_STORES.METADATA.NAME,
          keyPath: AppConfig.DB_STORES.METADATA.KEY,
        },
      ]
    );
    this._metadataDb = new IndexedDbService(
      AppConfig.DB_NAME,
      AppConfig.DB_VERSION,
      AppConfig.DB_STORES.METADATA.NAME,
      AppConfig.DB_STORES.METADATA.KEY
    );
  }
}

const observer = new MutationObserver((mutations, obs) => {
  const hello = document.body;
  if (hello) {
    obs.disconnect();
    return;
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});
