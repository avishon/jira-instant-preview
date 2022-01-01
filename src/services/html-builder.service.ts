import {
  Content,
  Paragraph,
  ParagraphText,
  ParagraphTextMarks,
  ParagraphStatus,
  ParagraphMention,
  ParagraphInlineCard,
  Blockquote,
  CodeBlock,
  List,
  Panel,
  Table,
} from '../types/issue-api.type';

export class HtmlBuilderService {
  constructor() {}

  public getHtmlDescription(description: Content) {
    if (!description) {
      return '';
    }
    let html = '';
    description.content.forEach((item) => {
      switch (item.type) {
        case 'paragraph':
          html += this._getHtmlParagraph(item);
          break;
        case 'blockquote':
          html += this._getHtmlBlockquote(item);
          break;
        case 'codeBlock':
          html += this._getHtmlCodeBlock(item);
          break;
        case 'bulletList':
        case 'orderedList':
          html += this._getHtmlList(item);
          break;
        case 'panel':
          html += this._getHtmlPanel(item);
          break;
        case 'table':
          html += this._getHtmlTable(item);
          break;
        case 'mediaSingle':
          html += this._getHtmlMediaSingle();
          break;
        case 'rule':
          html += this._getHtmlRule();
          break;
        default:
          break;
      }
    });
    return html;
  }

  private _getHtmlMediaSingle() {
    return '<div class="media-item"></div>';
  }

  private _getHtmlRule() {
    return '<hr/>';
  }

  private _getHtmlTable(table: Table) {
    let html = '<table>';
    table.content.forEach((row) => {
      html += '<tr>';
      row.content.forEach((cell) => {
        const tag = cell.type == 'tableHeader' ? 'th' : 'td';
        html += `<${tag}>`;
        cell.content.forEach((cellContent) => {
          html += this._getHtmlParagraph(cellContent);
        });
        html += `</${tag}>`;
      });
      html += '</tr>';
    });
    html += '</table>';
    return html;
  }

  private _getHtmlPanel(panel: Panel) {
    let html = `<span class="panel ${panel.attrs.panelType}">`;
    panel.content.forEach((item) => {
      html += this._getHtmlParagraph(item);
    });
    html += '</span>';
    return html;
  }

  private _getHtmlList(list: List) {
    let html = '';
    const tag = list.type == 'orderedList' ? 'ol' : 'ul';
    html += `<${tag}>`;
    list.content.forEach((listItem) => {
      html += '<li>';
      listItem.content.forEach((item) => {
        switch (item.type) {
          case 'paragraph':
            html += this._getHtmlParagraph(item);
            break;
          case 'bulletList':
          case 'orderedList':
            html += this._getHtmlList(item);
            break;
          default:
            break;
        }
      });
      html += '</li>';
    });
    html += `</${tag}>`;
    return html;
  }

  private _getHtmlCodeBlock(codeBlock: CodeBlock) {
    let html = '';
    codeBlock.content.forEach((item) => {
      html += `<code>${item.text.replaceAll('\n', '<br/>')}</code>`;
    });
    return html;
  }

  private _getHtmlMarks(text: string, marks: ParagraphTextMarks[]) {
    let finalHtml = '';
    let closeTagsHtml = '';
    marks.forEach((item) => {
      switch (item.type) {
        case 'code':
          finalHtml += '<code>';
          closeTagsHtml = `</code>${closeTagsHtml}`;
          break;
        case 'em':
          finalHtml += '<em>';
          closeTagsHtml = `</em>${closeTagsHtml}`;
          break;
        case 'link':
          finalHtml += `<a href="${item.attrs.href}">`;
          closeTagsHtml = `</a>${closeTagsHtml}`;
          break;
        case 'strike':
          finalHtml += '<s>';
          closeTagsHtml = `</s>${closeTagsHtml}`;
          break;
        case 'strong':
          finalHtml += '<strong>';
          closeTagsHtml = `</strong>${closeTagsHtml}`;
          break;
        case 'subsup':
          finalHtml += '<sub>';
          closeTagsHtml = `</sub>${closeTagsHtml}`;
          break;
        case 'textColor':
          finalHtml += `<span style="color:${item.attrs.color}">`;
          closeTagsHtml = `</span>${closeTagsHtml}`;
          break;
        case 'underline':
          finalHtml += '<u>';
          closeTagsHtml = `</u>${closeTagsHtml}`;
          break;
        default:
          break;
      }
    });
    finalHtml += text + closeTagsHtml;
    return finalHtml;
  }

  private _getHtmlParagraphText(paragraphText: ParagraphText) {
    if (paragraphText.marks) {
      return this._getHtmlMarks(paragraphText.text, paragraphText.marks);
    } else {
      return paragraphText.text;
    }
  }

  private _getHtmlDate(timestamp: number) {
    const date = new Date();
    date.setTime(timestamp);
    return `<div class="content-date">${date.toLocaleDateString()}</div>`;
  }

  private _getHtmlStatus(paragraphStatus: ParagraphStatus) {
    return `<span class="content-status ${paragraphStatus.attrs.color}">${paragraphStatus.attrs.text}</span>`;
  }

  private _getHtmlParagraph(paragraph: Paragraph) {
    let html = '<div class="paragraph">';
    paragraph.content.forEach((item) => {
      switch (item.type) {
        case 'text':
          html += this._getHtmlParagraphText(item);
          break;
        case 'hardBreak':
          html += '</br>';
          break;
        case 'date':
          html += this._getHtmlDate(item.attrs.timestamp);
          break;
        case 'emoji':
          html += item.attrs.text;
          break;
        case 'status':
          html += this._getHtmlStatus(item);
          break;
        case 'mention':
          html += this._getHtmlMention(item);
          break;
        case 'inlineCard':
          html += this._getHtmlInlineCard(item);
        default:
          break;
      }
    });
    html += '</div>';
    return html;
  }

  private _getHtmlInlineCard(paragraphInlineCard: ParagraphInlineCard) {
    return `<span class="inline-card">${paragraphInlineCard.attrs.url}</span>`;
  }

  private _getHtmlMention(paragraphMention: ParagraphMention) {
    return `<span class="mention">${paragraphMention.attrs.text}</span>`;
  }

  private _getHtmlBlockquote(blockquote: Blockquote) {
    let html = '<blockquote>';
    blockquote.content.forEach((item) => {
      html += this._getHtmlParagraph(item);
    });
    html += '</blockquote>';
    return html;
  }
}
