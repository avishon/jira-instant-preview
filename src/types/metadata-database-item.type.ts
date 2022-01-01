export interface MetadataDatabaseItem {
  indexkey: string;
  dataType: metadataTypes;
  id?: string | number;
  accountId?: string;
  name?: string;
  imageUrl?: string;
}

export enum MetadataDatabasePrefixes {
  USER = 'user_',
  ISSUE_TYPE = 'issuetype_',
  PRIORITY = 'priority_',
  PROJECT = 'project_',
  STATUS = 'status_',
}

export type MetadataUi = {
  [prop in metadataTypes]: {
    [key: string]: MetadataDatabaseItem;
  };
};

type metadataTypes = 'user' | 'issueType' | 'priority' | 'ptoject' | 'status';
