export interface IssueDatabaseItem {
  issueId: string;
  reporter: string;
  assignee: string;
  issueTypeId: number;
  priorityId: number;
  projectId: number;
  statusId: number;
  summary: string;
  bodyHtml: string;
  comments: CommentsDatabase[];
}

export interface CommentsDatabase {
  authorId: string;
  updated: string;
  bodyHtml: string;
}
