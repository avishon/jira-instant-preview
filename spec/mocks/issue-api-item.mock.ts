import { IssueApiItem } from '../../src/types/issue-api.type';

export const IssueApiItemMock: IssueApiItem = {
  key: 'key01',
  fields: {
    reporter: {
      accountId: 'accountId01',
      displayName: 'displayName01',
      avatarUrls: {
        '16x16': 'https://blabla.com/001.png',
      },
    },
    assignee: {
      accountId: 'accountId02',
      displayName: 'displayName02',
      avatarUrls: {
        '16x16': 'https://blabla.com/002.png',
      },
    },
    issuetype: {
      id: 111,
      name: 'issue type name',
      iconUrl: '',
    },
    priority: {
      id: 222,
      name: 'priority001',
      iconUrl: '',
    },
    project: {
      id: 333,
      name: 'project001',
      avatarUrls: {
        '16x16': '',
      },
    },
    status: {
      id: 333,
      name: 'status001',
    },
    summary: 'summary001',
    description: undefined,
    comment: {
      comments: [],
    },
  },
};
