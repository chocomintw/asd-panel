import { BBCodeElement } from '../types';

export class JSONToBBCodeConverter {
  static convert(jsonInput: string): string {
    try {
      const parsed = JSON.parse(jsonInput);
      return this.convertElement(parsed);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  private static convertElement(element: BBCodeElement): string {
    if (!element || typeof element !== 'object') {
      return '';
    }

    const converters: { [key: string]: (elem: BBCodeElement) => string } = {
      // Basic formatting
      bold: (e) => `[b]${this.getContent(e)}[/b]`,
      italic: (e) => `[i]${this.getContent(e)}[/i]`,
      underline: (e) => `[u]${this.getContent(e)}[/u]`,
      strikethrough: (e) => `[s]${this.getContent(e)}[/s]`,
      
      // Text styling
      color: (e) => `[color=${e.color}]${this.getContent(e)}[/color]`,
      size: (e) => `[size=${e.size}]${this.getContent(e)}[/size]`,
      font: (e) => `[font=${e.font}]${this.getContent(e)}[/font]`,
      highlight: (e) => `[highlight=${e.color}]${this.getContent(e)}[/highlight]`,
      background: (e) => `[background=${e.color}]${this.getContent(e)}[/background]`,
      stroke: (e) => `[stroke=${e.width},${e.color}]${this.getContent(e)}[/stroke]`,
      
      // Alignment
      center: (e) => `[center]${this.getContent(e)}[/center]`,
      right: (e) => `[right]${this.getContent(e)}[/right]`,
      left: (e) => `[left]${this.getContent(e)}[/left]`,
      float: (e) => `[float=${e.alignment}]${this.getContent(e)}[/float]`,
      indent: (e) => `[indent]${this.getContent(e)}[/indent]`,
      vspace: (e) => `[vspace=${e.pixels}]${this.getContent(e)}[/vspace]`,
      vstretch: (e) => `[vstretch=${e.amount}]${this.getContent(e)}[/vstretch]`,
      width: (e) => `[width=${e.width},${e.alignment}]${this.getContent(e)}[/width]`,
      
      // Lists
      list: (e) => {
        const listTag = e.listType === 'ordered' ? '[list=1]' : 
                       e.listType === 'alpha' ? '[list=a]' : '[list]';
        const items = (e.items || []).map(item => `[*]${this.convertElement(item)}`).join('\n');
        return `${listTag}\n${items}\n[/list]`;
      },
      list_item: (e) => this.getContent(e),
      list_item_standalone: (e) => `[*]${this.getContent(e)}`,
      
      // Links & Media
      link: (e) => e.url === e.content ? `[url]${e.url}[/url]` : `[url=${e.url}]${e.content}[/url]`,
      image: (e) => `[img]${e.src}[/img]`,
      imgmw: (e) => `[imgmw]${e.src}[/imgmw]`,
      streamable: (e) => `[streamable]${e.url}[/streamable]`,
      youtube: (e) => `[youtube]${e.url}[/youtube]`,
      urln: (e) => `[urln]${this.getContent(e)}[/urln]`,
      
      // Blocks & Containers
      quote: (e) => `[quote]${this.getContent(e)}[/quote]`,
      code: (e) => `[code]${this.getContent(e)}[/code]`,
      block: (e) => `[block=${e.params}]${this.getContent(e)}[/block]`,
      divbox: (e) => `[divbox=${e.color}]${this.getContent(e)}[/divbox]`,
      aligntable: (e) => `[aligntable=${e.params}]${this.getContent(e)}[/aligntable]`,
      altdiv: (e) => `[altdiv=${e.params}]${this.getContent(e)}[/altdiv]`,
      altspoiler: (e) => `[altspoiler="${e.title}"]${this.getContent(e)}[/altspoiler]`,
      spoiler: (e) => `[spoiler]${this.getContent(e)}[/spoiler]`,
      legend: (e) => `[legend=${e.params}]${this.getContent(e)}[/legend]`,
      
      // Tables
      table: (e) => `[table=${e.font}]${this.getContent(e)}[/table]`,
      alttable: (e) => `[alttable=${e.params}]${this.getContent(e)}[/alttable]`,
      custable: (e) => `[custable=${e.params}]${this.getContent(e)}[/custable]`,
      tr: (e) => `[tr]${this.getContent(e)}[/tr]`,
      td: (e) => `[td]${this.getContent(e)}[/td]`,
      td2: (e) => `[td2=${e.params}]${this.getContent(e)}[/td2]`,
      tdcs: (e) => `[tdcs=${e.params}]${this.getContent(e)}[/tdcs]`,
      tdrs: (e) => `[tdrs=${e.params}]${this.getContent(e)}[/tdrs]`,
      tdwidth: (e) => `[tdwidth=${e.params}]${this.getContent(e)}[/tdwidth]`,
      col: (e) => `[col=${e.width}]`,
      colgroup: (e) => `[colgroup]${this.getContent(e)}[/colgroup]`,
      custd: (e) => `[custd=${e.params}]${this.getContent(e)}[/custd]`,
      
      // Special Elements
      hr: () => `[hr][/hr]`,
      anchor: (e) => `[anchor]${e.name}[/anchor]`,
      goto: (e) => `[goto=${e.anchor}]${e.content}[/goto]`,
      cb: () => `[cb][/cb]`,
      cbc: () => `[cbc][/cbc]`,
      todo: (e) => `[todo=${e.assigned}]${e.content}[/todo]`,
      todo_done: (e) => `[todo_done=${e.handled}]${e.content}[/todo_done]`,
      ooc: (e) => `[ooc]${this.getContent(e)}[/ooc]`,
      
      // Document Styles
      bulletin: (e) => `[bulletin=${e.params}]${this.getContent(e)}[/bulletin]`,
      depcor: (e) => `[depcor=${e.params}]${this.getContent(e)}[/depcor]`,
      depmail: (e) => `[depmail=${e.params}]${this.getContent(e)}[/depmail]`,
      depmemo: (e) => `[depmemo=${e.params}]${this.getContent(e)}[/depmemo]`,
      letterhead: (e) => `[letterhead]${this.getContent(e)}[/letterhead]`,
      lssdheader: () => `[lssdheader]`,
      newsnet: () => `[newsnet]`,
      postas: (e) => `[postas=${e.params}]`,
      
      // Newline handling
      newline: () => `\n`,
      
      // Default
      text: (e) => this.getContent(e),
      bbcode_document: (e) => this.convertContent(e.content)
    };

    const converter = converters[element.type] || converters.text;
    return converter(element);
  }

  private static getContent(element: BBCodeElement): string {
    if (Array.isArray(element.content)) {
      return this.convertContent(element.content);
    }
    return element.content?.toString() || '';
  }

  private static convertContent(content: string | BBCodeElement[] | undefined): string {
    if (!content) return '';
    
    if (Array.isArray(content)) {
      return content.map(item => this.convertElement(item)).join('');
    }
    
    return content.toString();
  }
}