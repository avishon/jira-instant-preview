import { Content } from '../../src/types/issue-api.type';

export const ContentParagraphStatusMock: Content = {
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'status',
          attrs: {
            color: 'yellow',
            text: 'This is a status with a yellow color',
          },
        },
      ],
    },
  ],
};

export const ContentParagraphDateMock: Content = {
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'date',
          attrs: {
            timestamp: 1641003081977,
          },
        },
      ],
    },
  ],
};

export const ContentParagraphTextMock: Content = {
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'simple text paragraph',
        },
        {
          type: 'text',
          text: 'code inside paragraph',
          marks: [
            {
              type: 'code',
            },
          ],
        },
        {
          type: 'text',
          text: 'em inside paragraph',
          marks: [
            {
              type: 'em',
            },
          ],
        },
        {
          type: 'text',
          text: 'subsup inside paragraph',
          marks: [
            {
              type: 'subsup',
            },
          ],
        },
        {
          type: 'text',
          text: 'strike inside paragraph',
          marks: [
            {
              type: 'strike',
            },
          ],
        },
        {
          type: 'text',
          text: 'click here',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://link.com',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'strong and underline with style',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'underline',
            },
            {
              type: 'textColor',
              attrs: {
                color: '#3c3c3c',
              },
            },
          ],
        },
      ],
    },
  ],
};
