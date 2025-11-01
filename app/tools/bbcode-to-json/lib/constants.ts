export const EXAMPLE_BBCODE = `[b]Welcome to our forum![/b]

This is a [i]sample post[/i] with various BBCode tags.

Check out our [url=https://example.com]website[/url] for more info.

[quote]This is a quoted message from another user[/quote]

[list]
[*]First item in the list
[*]Second item in the list
[*]Third item with [b]bold text[/b]
[/list]

[color=red]This text is red[/color] and [size=18]this is large[/size].

[spoiler]Hidden content[/spoiler]

[table=arial]|[td]Cell 1[/td]|[td]Cell 2[/td]|[/table]

[hr][/hr]

[youtube]https://youtube.com/watch?v=example[/youtube]`;

export const SUPPORTED_TAGS = {
  formatting: ['[b]bold[/b]', '[i]italic[/i]', '[u]underline[/u]', '[s]strikethrough[/s]'],
  styling: [
    '[color=red]text[/color]',
    '[size=18]text[/size]', 
    '[font=arial]text[/font]',
    '[highlight=yellow]text[/highlight]',
    '[background=blue]text[/background]',
    '[stroke=2,red]text[/stroke]'
  ],
  alignment: [
    '[center]text[/center]',
    '[right]text[/right]', 
    '[left]text[/left]',
    '[float=left]text[/float]',
    '[indent]text[/indent]',
    '[vspace=10]text[/vspace]',
    '[width=50%,center]text[/width]'
  ],
  lists: ['[list]...[/list]', '[list=1]...[/list]', '[list=a]...[/list]', '[*] list item'],
  media: [
    '[url]link[/url]', 
    '[url=...]text[/url]', 
    '[img]image[/img]',
    '[youtube]link[/youtube]',
    '[streamable]link[/streamable]'
  ],
  blocks: [
    '[quote]text[/quote]',
    '[code]text[/code]',
    '[block=1,2,red,blue]text[/block]',
    '[spoiler]text[/spoiler]',
    '[altspoiler="Title"]text[/altspoiler]'
  ],
  tables: [
    '[table=font]text[/table]',
    '[tr]row[/tr]',
    '[td]cell[/td]',
    '[td2=1,top]cell[/td2]'
  ],
  special: [
    '[hr][/hr]',
    '[cb][/cb]',
    '[cbc][/cbc]',
    '[todo]text[/todo]',
    '[ooc]text[/ooc]'
  ],
  documents: [
    '[bulletin=...]text[/bulletin]',
    '[letterhead]text[/letterhead]',
    '[depcor=...]text[/depcor]'
  ]
};