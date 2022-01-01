import { HtmlBuilderService } from '../../src/services/html-builder.service';
import {
  ContentParagraphTextMock,
  ContentParagraphDateMock,
  ContentParagraphStatusMock,
} from '../mocks/html-content.mock';

describe('DataMetadataService', () => {
  const htmlBuilderService = new HtmlBuilderService();

  it('getHtmlDescription method should return the correct HTML for ParagraphStatus', () => {
    const html = htmlBuilderService.getHtmlDescription(
      ContentParagraphStatusMock
    );
    expect(html).toBe(
      '<div class="paragraph"><span class="content-status yellow">This is a status with a yellow color</span></div>'
    );
  });

  it('getHtmlDescription method should return the correct HTML for ParagraphDate', () => {
    const html = htmlBuilderService.getHtmlDescription(
      ContentParagraphDateMock
    );
    expect(html).toBe(
      '<div class="paragraph"><div class="content-date">1/1/2022</div></div>'
    );
  });

  it('getHtmlDescription method should return the correct HTML for ParagraphText', () => {
    const html = htmlBuilderService.getHtmlDescription(
      ContentParagraphTextMock
    );
    expect(html).toBe(
      '<div class="paragraph">simple text paragraph<code>code inside paragraph</code><em>em inside paragraph</em><sub>subsup inside paragraph</sub><s>strike inside paragraph</s><a href="https://link.com">click here</a><strong><u><span style="color:#3c3c3c">strong and underline with style</span></u></strong></div>'
    );
  });
});
