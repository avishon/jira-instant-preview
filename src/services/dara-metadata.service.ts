import { IssueApiItem, User } from '../types/issue-api.type';
import { IssueDatabaseItem } from '../types/issue-database.type';

import {
  MetadataDatabaseItem,
  MetadataDatabasePrefixes,
  MetadataUi,
} from '../types/metadata-database-item.type';

export class DataMetadataService {
  constructor() {}

  public getMetadataForUi(metadataItems: MetadataDatabaseItem[]) {
    const metadataUi: MetadataUi = {
      user: {},
      issueType: {},
      priority: {},
      ptoject: {},
      status: {},
    };
    metadataItems.forEach((item) => {
      metadataUi[item.dataType][item.id] = item;
    });
    return metadataUi;
  }

  public preperDatabaseQuery(issueDbItem: IssueDatabaseItem) {
    let indexKeys = [
      MetadataDatabasePrefixes.USER + issueDbItem.assignee,
      MetadataDatabasePrefixes.USER + issueDbItem.reporter,
      MetadataDatabasePrefixes.STATUS + issueDbItem.statusId,
      MetadataDatabasePrefixes.ISSUE_TYPE + issueDbItem.issueTypeId,
      MetadataDatabasePrefixes.PRIORITY + issueDbItem.priorityId,
      MetadataDatabasePrefixes.PROJECT + issueDbItem.projectId,
    ];
    issueDbItem.comments.forEach((comment) => {
      indexKeys.push(MetadataDatabasePrefixes.USER + comment.authorId);
    });
    indexKeys = [...new (Set as any)(indexKeys)];
    return indexKeys;
  }

  public getMetadataFromApi(apiResponse: IssueApiItem) {
    const fields = apiResponse.fields;
    const issueType = {
      indexkey: MetadataDatabasePrefixes.ISSUE_TYPE + fields.issuetype.id,
      id: fields.issuetype.id,
      dataType: 'issueType',
      name: fields.issuetype.name,
      imageUrl: fields.issuetype.iconUrl,
    } as MetadataDatabaseItem;

    const priority = {
      indexkey: MetadataDatabasePrefixes.PRIORITY + fields.priority.id,
      id: fields.priority.id,
      dataType: 'priority',
      name: fields.priority.name,
      imageUrl: fields.priority.iconUrl,
    } as MetadataDatabaseItem;

    const project = {
      indexkey: MetadataDatabasePrefixes.PROJECT + fields.project.id,
      id: fields.project.id,
      dataType: 'ptoject',
      name: fields.project.name,
      imageUrl: fields.project.avatarUrls['16x16'],
    } as MetadataDatabaseItem;

    const status = {
      indexkey: MetadataDatabasePrefixes.STATUS + fields.status.id,
      id: fields.status.id,
      dataType: 'status',
      name: fields.status.name,
    } as MetadataDatabaseItem;

    const users = this._getUsersFromApi(apiResponse);
    let dbData: MetadataDatabaseItem[] = users;
    dbData.push(issueType, priority, project, status);
    return dbData;
  }

  private _removeDuplicatesFromArray(array: any[], key: string) {
    const uniq: any = {};
    return array.filter((obj) => !uniq[obj[key]] && (uniq[obj[key]] = true));
  }

  private _getUsersFromApi(apiResponse: IssueApiItem) {
    const fields = apiResponse.fields;
    let apiUsers: User[] = [];
    const dbUsers: MetadataDatabaseItem[] = [];
    apiUsers.push(fields.assignee, fields.reporter);
    fields.comment.comments.forEach((comment) => {
      apiUsers.push(comment.author);
    });

    apiUsers = apiUsers.filter((user) => !!user);
    apiUsers = this._removeDuplicatesFromArray(apiUsers, 'accountId');
    apiUsers.forEach((user) => {
      dbUsers.push({
        indexkey: MetadataDatabasePrefixes.USER + user.accountId,
        accountId: user.accountId,
        id: user.accountId,
        dataType: 'user',
        name: user.displayName,
        imageUrl: user.avatarUrls['16x16'],
      });
    });
    return dbUsers;
  }
}
