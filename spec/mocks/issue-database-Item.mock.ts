import { IssueDatabaseItem } from '../../src/types/issue-database.type';

export const IssueDatabaseItemMock: IssueDatabaseItem = {
  issueId: 'issueid1',
  reporter: 'reporter1',
  assignee: 'assignee1',
  issueTypeId: 10,
  priorityId: 20,
  projectId: 30,
  statusId: 40,
  summary: '',
  bodyHtml: '',
  comments: [
    {
      authorId: 'avi001',
      bodyHtml: '',
      updated: '',
    },
    {
      authorId: 'yossi002',
      bodyHtml: '',
      updated: '',
    },
    {
      authorId: 'dan003',
      bodyHtml: '',
      updated: '',
    },
  ],
};
