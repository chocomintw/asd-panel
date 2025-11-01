export const EXAMPLE_JSON = `{
  "type": "bbcode_document",
  "content": [
    {
      "type": "bold",
      "content": "Welcome to our forum!"
    },
    {
      "type": "text",
      "content": "This is a sample post with various BBCode tags."
    },
    {
      "type": "italic",
      "content": "sample post"
    },
    {
      "type": "url",
      "url": "https://example.com",
      "content": "website"
    },
    {
      "type": "quote",
      "content": "This is a quoted message from another user"
    },
    {
      "type": "list",
      "listType": "bullet",
      "items": [
        {
          "type": "list_item",
          "content": "First item in the list"
        },
        {
          "type": "list_item",
          "content": "Second item in the list"
        },
        {
          "type": "list_item",
          "content": [
            {
              "type": "text",
              "content": "Third item with "
            },
            {
              "type": "bold",
              "content": "bold text"
            }
          ]
        }
      ]
    },
    {
      "type": "color",
      "color": "red",
      "content": "This text is red"
    },
    {
      "type": "size",
      "size": "18",
      "content": "this is large"
    },
    {
      "type": "spoiler",
      "content": "Hidden content"
    },
    {
      "type": "table",
      "font": "arial",
      "content": [
        {
          "type": "tr",
          "content": [
            {
              "type": "td",
              "content": "Cell 1"
            },
            {
              "type": "td", 
              "content": "Cell 2"
            }
          ]
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "youtube",
      "url": "https://youtube.com/watch?v=example"
    }
  ]
}`;

export const SUPPORTED_FORMATS = {
  formatting: ['bold', 'italic', 'underline', 'strikethrough'],
  styling: [
    'color',
    'size', 
    'font',
    'highlight',
    'background',
    'stroke'
  ],
  alignment: [
    'center',
    'right', 
    'left',
    'float',
    'indent',
    'vspace',
    'width'
  ],
  lists: ['list', 'list_item'],
  media: [
    'url', 
    'image',
    'youtube',
    'streamable',
    'imgmw'
  ],
  blocks: [
    'quote',
    'code',
    'block',
    'spoiler',
    'altspoiler',
    'divbox',
    'aligntable',
    'altdiv'
  ],
  tables: [
    'table',
    'alttable',
    'custable',
    'tr',
    'td',
    'td2',
    'tdcs',
    'tdrs',
    'col',
    'colgroup'
  ],
  special: [
    'hr',
    'cb',
    'cbc',
    'todo',
    'todo_done',
    'ooc',
    'anchor',
    'goto',
    'urln'
  ],
  documents: [
    'bulletin',
    'letterhead',
    'depcor',
    'depmail',
    'depmemo',
    'lssdheader',
    'newsnet',
    'postas'
  ]
};