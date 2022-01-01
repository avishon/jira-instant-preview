import { DataIssueService } from '../../src/services/data-issue.service';
import { IssueApiItemMock } from '../mocks/issue-api-item.mock';

describe('DataMetadataService', () => {
  const dataMetadataService = new DataIssueService();

  it('getIssueDatabaseItem method should return the correct value', () => {
    const databaseItem = dataMetadataService.getIssueDatabaseItem(
      IssueApiItemMock
    );
    expect(databaseItem).toEqual({
      issueId: 'key01',
      reporter: 'accountId01',
      assignee: 'accountId02',
      issueTypeId: 111,
      priorityId: 222,
      projectId: 333,
      statusId: 333,
      summary: 'summary001',
      bodyHtml: '',
      comments: [],
    });
  });
});
