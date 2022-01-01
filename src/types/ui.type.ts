import { IssueDatabaseItem } from './issue-database.type';
import { MetadataUi } from './metadata-database-item.type';

export interface UiData {
  issue: IssueDatabaseItem;
  metadata: MetadataUi;
}
