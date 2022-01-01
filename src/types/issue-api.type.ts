export interface IssueApiItem {
  key: string;
  fields: {
    reporter: User | undefined;
    assignee: User | undefined;
    issuetype: {
      id: number;
      name: string;
      iconUrl: string;
    };
    priority: {
      id: number;
      name: string;
      iconUrl: string;
    };
    project: {
      id: number;
      name: string;
      avatarUrls: {
        '16x16': string;
      };
    };
    status: {
      id: number;
      name: string;
    };
    summary: string;
    description: Content | undefined;
    comment: {
      comments: CommentItemRes[];
    };
  };
}

export interface Content {
  content:
    | Paragraph[]
    | CodeBlock[]
    | Panel[]
    | Blockquote[]
    | Rule[]
    | List[]
    | Table[]
    | MediaSingle[];
}

export interface User {
  accountId: string;
  displayName: string;
  avatarUrls: {
    '16x16': string;
  };
}

export interface CommentItemRes {
  author: User;
  updated: string;
  body: Content;
}

interface MediaSingle {
  type: 'mediaSingle';
}

export interface Table {
  type: 'table';
  content: TableRow[];
}

interface TableRow {
  type: 'tableRow';
  content: TableCell[];
}

interface TableCell {
  type: 'tableHeader' | 'tableCell';
  content: Paragraph[];
}

export interface List {
  type: 'bulletList' | 'orderedList';
  content: {
    type: 'listItem';
    content: Paragraph[] | List[];
  }[];
}

export interface Blockquote {
  type: 'blockquote';
  content: Paragraph[];
}
export interface Rule {
  type: 'rule';
}

export interface Panel {
  type: 'panel';
  attrs: {
    panelType: 'info' | 'note' | 'success' | 'warning' | 'error';
  };
  content: Paragraph[];
}

export interface CodeBlock {
  type: 'codeBlock';
  content: {
    type: 'text';
    text: string;
  }[];
}

export interface Paragraph {
  type: 'paragraph';
  content:
    | ParagraphText[]
    | ParagraphEmoji[]
    | ParagraphDate[]
    | ParagraphStatus[]
    | ParagraphMention[]
    | ParagraphInlineCard[]
    | ParagraphHardBreak[];
}

export interface ParagraphHardBreak {
  type: 'hardBreak';
}

export interface ParagraphInlineCard {
  type: 'inlineCard';
  attrs: {
    url: string;
  };
}

export interface ParagraphMention {
  type: 'mention';
  attrs: {
    text: string;
  };
}

export interface ParagraphStatus {
  type: 'status';
  attrs: {
    color: 'neutral' | 'yellow' | 'purple' | 'blue' | 'red' | 'green';
    text: string;
  };
}

export interface ParagraphDate {
  type: 'date';
  attrs: {
    timestamp: number;
  };
}

export interface ParagraphEmoji {
  type: 'emoji';
  attrs: {
    text: string;
  };
}

export interface ParagraphText {
  type: 'text';
  text: string;
  marks?: ParagraphTextMarks[];
}

export interface ParagraphTextMarks {
  type:
    | 'strong'
    | 'em'
    | 'strike'
    | 'underline'
    | 'link'
    | 'textColor'
    | 'code'
    | 'subsup';
  attrs?: {
    href?: string;
    color?: string;
  };
}
