import { DataMetadataService } from '../../src/services/dara-metadata.service';
import { MetadataDatabaseItemsMock } from '../mocks/metadata-database-Item.mock';
import { IssueDatabaseItemMock } from '../mocks/issue-database-Item.mock';
import { IssueApiItemMock } from '../mocks/issue-api-item.mock';

describe('DataMetadataService', () => {
  const dataMetadataService = new DataMetadataService();

  it('preperDatabaseQuery method should return the correct value', () => {
    const indexKeys = dataMetadataService.preperDatabaseQuery(
      IssueDatabaseItemMock
    );

    expect(indexKeys).toEqual([
      'user_assignee1',
      'user_reporter1',
      'status_40',
      'issuetype_10',
      'priority_20',
      'project_30',
      'user_avi001',
      'user_yossi002',
      'user_dan003',
    ]);
  });

  it('getMetadataFromApi method should return the correct value', () => {
    const metadata = dataMetadataService.getMetadataFromApi(IssueApiItemMock);

    expect(metadata).toEqual([
      {
        indexkey: 'user_accountId02',
        accountId: 'accountId02',
        id: 'accountId02',
        dataType: 'user',
        name: 'displayName02',
        imageUrl: 'https://blabla.com/002.png',
      },
      {
        indexkey: 'user_accountId01',
        accountId: 'accountId01',
        id: 'accountId01',
        dataType: 'user',
        name: 'displayName01',
        imageUrl: 'https://blabla.com/001.png',
      },
      {
        indexkey: 'issuetype_111',
        id: 111,
        dataType: 'issueType',
        name: 'issue type name',
        imageUrl: '',
      },
      {
        indexkey: 'priority_222',
        id: 222,
        dataType: 'priority',
        name: 'priority001',
        imageUrl: '',
      },
      {
        indexkey: 'project_333',
        id: 333,
        dataType: 'ptoject',
        name: 'project001',
        imageUrl: '',
      },
      {
        indexkey: 'status_333',
        id: 333,
        dataType: 'status',
        name: 'status001',
      },
    ]);
  });

  it('getMetadataForUi method should return the correct value', () => {
    const metadataUi = dataMetadataService.getMetadataForUi(
      MetadataDatabaseItemsMock
    );

    expect(metadataUi).toEqual({
      user: {},
      issueType: {
        123: MetadataDatabaseItemsMock[0],
      },
      priority: {
        456: MetadataDatabaseItemsMock[1],
      },
      ptoject: {
        789: MetadataDatabaseItemsMock[2],
      },
      status: {
        111: MetadataDatabaseItemsMock[3],
      },
    });
  });
});
