import { HtmlBuilderService } from './html-builder.service';
import { IssueApiItem, CommentItemRes } from '../types/issue-api.type';
import {
  IssueDatabaseItem,
  CommentsDatabase,
} from '../types/issue-database.type';

export class DataIssueService {
  private _htmlBuilderService: HtmlBuilderService;
  constructor() {
    this._htmlBuilderService = new HtmlBuilderService();
  }

  public getIssueDatabaseItem(apiResponse: IssueApiItem) {
    let dbData: IssueDatabaseItem = {
      issueId: apiResponse.key,
      reporter: apiResponse.fields.reporter?.accountId,
      assignee: apiResponse.fields.assignee?.accountId,
      issueTypeId: apiResponse.fields.issuetype.id,
      priorityId: apiResponse.fields.priority.id,
      projectId: apiResponse.fields.project.id,
      statusId: apiResponse.fields.status.id,
      summary: apiResponse.fields.summary,
      bodyHtml: this._htmlBuilderService.getHtmlDescription(
        apiResponse.fields.description
      ),
      comments: this._getComments(apiResponse.fields.comment.comments),
    };
    return dbData;
  }

  private _getComments(commentsApi: CommentItemRes[]) {
    const commentsDb: CommentsDatabase[] = [];
    commentsApi.forEach((comment) => {
      commentsDb.push({
        authorId: comment.author.accountId,
        updated: comment.updated,
        bodyHtml: this._htmlBuilderService.getHtmlDescription(comment.body),
      });
    });
    return commentsDb;
  }
}
