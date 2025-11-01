import { BBCodeElement, TagPattern } from '../types';

export class BBCodeParser {
  private static tagPatterns: TagPattern[] = [
    // Lists - handle both [list] and [list=1/a]
    { 
      regex: /\[list(?:=(\d+|a))?\](.*?)\[\/list\]/s, 
      type: 'list',
      multiLine: true 
    },
    // Basic formatting
    { regex: /\[b\](.*?)\[\/b\]/gs, type: 'bold' },
    { regex: /\[i\](.*?)\[\/i\]/gs, type: 'italic' },
    { regex: /\[u\](.*?)\[\/u\]/gs, type: 'underline' },
    { regex: /\[s\](.*?)\[\/s\]/gs, type: 'strikethrough' },
    // Links & Media
    { regex: /\[url=(.*?)\](.*?)\[\/url\]/gs, type: 'link' },
    { regex: /\[url\](.*?)\[\/url\]/gs, type: 'link' },
    { regex: /\[img\](.*?)\[\/img\]/gs, type: 'image' },
    { regex: /\[imgmw\](.*?)\[\/imgmw\]/gs, type: 'imgmw' },
    { regex: /\[streamable\](.*?)\[\/streamable\]/gs, type: 'streamable' },
    { regex: /\[youtube\](.*?)\[\/youtube\]/gs, type: 'youtube' },
    // Text styling
    { regex: /\[color=(.*?)\](.*?)\[\/color\]/gs, type: 'color' },
    { regex: /\[size=(\d+)\](.*?)\[\/size\]/gs, type: 'size' },
    { regex: /\[font=(.*?)\](.*?)\[\/font\]/gs, type: 'font' },
    { regex: /\[highlight=(.*?)\](.*?)\[\/highlight\]/gs, type: 'highlight' },
    { regex: /\[background=(.*?)\](.*?)\[\/background\]/gs, type: 'background' },
    { regex: /\[stroke=(\d+),(.*?)\](.*?)\[\/stroke\]/gs, type: 'stroke' },
    // Alignment & Positioning
    { regex: /\[center\](.*?)\[\/center\]/gs, type: 'center' },
    { regex: /\[right\](.*?)\[\/right\]/gs, type: 'right' },
    { regex: /\[left\](.*?)\[\/left\]/gs, type: 'left' },
    { regex: /\[float=(.*?)\](.*?)\[\/float\]/gs, type: 'float' },
    { regex: /\[indent\](.*?)\[\/indent\]/gs, type: 'indent' },
    { regex: /\[vspace=(\d+)\](.*?)\[\/vspace\]/gs, type: 'vspace' },
    { regex: /\[vstretch=([\d.]+)\](.*?)\[\/vstretch\]/gs, type: 'vstretch' },
    { regex: /\[width=([\d%]+),(.*?)\](.*?)\[\/width\]/gs, type: 'width' },
    // Blocks & Containers
    { regex: /\[quote\](.*?)\[\/quote\]/gs, type: 'quote' },
    { regex: /\[code\](.*?)\[\/code\]/gs, type: 'code' },
    { regex: /\[block=(.*?)\](.*?)\[\/block\]/gs, type: 'block' },
    { regex: /\[divbox=(.*?)\](.*?)\[\/divbox\]/gs, type: 'divbox' },
    { regex: /\[aligntable=(.*?)\](.*?)\[\/aligntable\]/gs, type: 'aligntable' },
    { regex: /\[altdiv=(.*?)\](.*?)\[\/altdiv\]/gs, type: 'altdiv' },
    { regex: /\[altspoiler="(.*?)"\](.*?)\[\/altspoiler\]/gs, type: 'altspoiler' },
    { regex: /\[spoiler\](.*?)\[\/spoiler\]/gs, type: 'spoiler' },
    { regex: /\[legend=(.*?)\](.*?)\[\/legend\]/gs, type: 'legend' },
    // Tables
    { regex: /\[table=(.*?)\](.*?)\[\/table\]/gs, type: 'table' },
    { regex: /\[alttable=(.*?)\](.*?)\[\/alttable\]/gs, type: 'alttable' },
    { regex: /\[custable=(.*?)\](.*?)\[\/custable\]/gs, type: 'custable' },
    { regex: /\[tr\](.*?)\[\/tr\]/gs, type: 'tr' },
    { regex: /\[td\](.*?)\[\/td\]/gs, type: 'td' },
    { regex: /\[td2=(.*?)\](.*?)\[\/td2\]/gs, type: 'td2' },
    { regex: /\[tdcs=(.*?)\](.*?)\[\/tdcs\]/gs, type: 'tdcs' },
    { regex: /\[tdrs=(.*?)\](.*?)\[\/tdrs\]/gs, type: 'tdrs' },
    { regex: /\[tdwidth=(.*?)\](.*?)\[\/tdwidth\]/gs, type: 'tdwidth' },
    { regex: /\[col=(\d+)\]/g, type: 'col' },
    { regex: /\[colgroup\](.*?)\[\/colgroup\]/gs, type: 'colgroup' },
    { regex: /\[custd=(.*?)\](.*?)\[\/custd\]/gs, type: 'custd' },
    // Special Elements
    { regex: /\[hr\]\[\/hr\]/g, type: 'hr' },
    { regex: /\[anchor\](.*?)\[\/anchor\]/gs, type: 'anchor' },
    { regex: /\[goto=(.*?)\](.*?)\[\/goto\]/gs, type: 'goto' },
    { regex: /\[cb\]\[\/cb\]/g, type: 'cb' },
    { regex: /\[cbc\]\[\/cbc\]/g, type: 'cbc' },
    { regex: /\[todo=(.*?)\](.*?)\[\/todo\]/gs, type: 'todo' },
    { regex: /\[todo_done=(.*?)\](.*?)\[\/todo_done\]/gs, type: 'todo_done' },
    { regex: /\[ooc\](.*?)\[\/ooc\]/gs, type: 'ooc' },
    { regex: /\[urln\](.*?)\[\/urln\]/gs, type: 'urln' },
    // Document Styles
    { regex: /\[bulletin=(.*?)\](.*?)\[\/bulletin\]/gs, type: 'bulletin' },
    { regex: /\[depcor=(.*?)\](.*?)\[\/depcor\]/gs, type: 'depcor' },
    { regex: /\[depmail=(.*?)\](.*?)\[\/depmail\]/gs, type: 'depmail' },
    { regex: /\[depmemo=(.*?)\](.*?)\[\/depmemo\]/gs, type: 'depmemo' },
    { regex: /\[letterhead\](.*?)\[\/letterhead\]/gs, type: 'letterhead' },
    { regex: /\[lssdheader\]/g, type: 'lssdheader' },
    { regex: /\[newsnet\]/g, type: 'newsnet' },
    { regex: /\[postas=(.*?)\]/g, type: 'postas' },
  ];

  static parse(input: string): BBCodeElement {
    // Process the entire input while preserving newlines
    const result: BBCodeElement = {
      type: 'bbcode_document',
      content: this.parseContent(input)
    };

    return result;
  }

  private static parseContent(content: string): BBCodeElement[] {
    const elements: BBCodeElement[] = [];
    
    if (!content) return elements;

    // Split by lines but preserve newlines
    const lines = content.split(/(\r\n|\n|\r)/);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle newline characters
      if (line === '\r\n' || line === '\n' || line === '\r') {
        elements.push({ type: 'newline' });
        continue;
      }

      // Handle empty lines
      if (!line.trim()) {
        elements.push({ type: 'text', content: line });
        continue;
      }

      // Handle list items
      if (line.trim().startsWith('[*]')) {
        elements.push({
          type: 'list_item_standalone',
          content: line.replace(/\[\*\]/, '').trim()
        });
        continue;
      }

      // Parse BBCode tags in this line
      const parsedElements = this.parseLineWithTags(line);
      elements.push(...parsedElements);
    }

    return elements;
  }

  private static parseLineWithTags(line: string): BBCodeElement[] {
    const elements: BBCodeElement[] = [];
    let remaining = line;
    
    while (remaining.length > 0) {
      let foundTag = false;
      
      for (const pattern of this.tagPatterns) {
        if (pattern.multiLine) continue;
        
        const match = pattern.regex.exec(remaining);
        if (match && match.index === 0) {
          // Found a tag at the beginning
          const element = this.createElement(pattern.type, match);
          elements.push(element);
          remaining = remaining.slice(match[0].length);
          foundTag = true;
          pattern.regex.lastIndex = 0; // Reset regex
          break;
        }
        pattern.regex.lastIndex = 0; // Reset regex
      }
      
      if (!foundTag) {
        // No tag found, add as text
        const nextTagPos = this.findNextTagPosition(remaining);
        if (nextTagPos === -1) {
          elements.push({ type: 'text', content: remaining });
          break;
        } else {
          const textContent = remaining.slice(0, nextTagPos);
          if (textContent) {
            elements.push({ type: 'text', content: textContent });
          }
          remaining = remaining.slice(nextTagPos);
        }
      }
    }
    
    return elements;
  }

  private static findNextTagPosition(text: string): number {
    for (const pattern of this.tagPatterns) {
      if (pattern.multiLine) continue;
      
      const match = pattern.regex.exec(text);
      if (match) {
        pattern.regex.lastIndex = 0;
        return match.index;
      }
      pattern.regex.lastIndex = 0;
    }
    return -1;
  }

  private static createElement(type: string, match: RegExpMatchArray): BBCodeElement {
    const elementCreators: { [key: string]: (match: RegExpMatchArray) => BBCodeElement } = {
      // Basic formatting
      bold: (m) => ({ type: 'bold', content: m[1] }),
      italic: (m) => ({ type: 'italic', content: m[1] }),
      underline: (m) => ({ type: 'underline', content: m[1] }),
      strikethrough: (m) => ({ type: 'strikethrough', content: m[1] }),
      
      // Links & Media
      link: (m) => m[2] 
        ? { type: 'link', url: m[1], content: m[2] }
        : { type: 'link', url: m[1], content: m[1] },
      image: (m) => ({ type: 'image', src: m[1] }),
      imgmw: (m) => ({ type: 'imgmw', src: m[1] }),
      streamable: (m) => ({ type: 'streamable', url: m[1] }),
      youtube: (m) => ({ type: 'youtube', url: m[1] }),
      
      // Text Styling
      color: (m) => ({ type: 'color', color: m[1], content: m[2] }),
      size: (m) => ({ type: 'size', size: m[1], content: m[2] }),
      font: (m) => ({ type: 'font', font: m[1], content: m[2] }),
      highlight: (m) => ({ type: 'highlight', color: m[1], content: m[2] }),
      background: (m) => ({ type: 'background', color: m[1], content: m[2] }),
      stroke: (m) => ({ type: 'stroke', width: m[1], color: m[2], content: m[3] }),
      
      // Alignment & Positioning
      center: (m) => ({ type: 'center', content: m[1] }),
      right: (m) => ({ type: 'right', content: m[1] }),
      left: (m) => ({ type: 'left', content: m[1] }),
      float: (m) => ({ type: 'float', alignment: m[1], content: m[2] }),
      indent: (m) => ({ type: 'indent', content: m[1] }),
      vspace: (m) => ({ type: 'vspace', pixels: m[1], content: m[2] }),
      vstretch: (m) => ({ type: 'vstretch', amount: m[1], content: m[2] }),
      width: (m) => ({ type: 'width', width: m[1], alignment: m[2], content: m[3] }),
      
      // Blocks & Containers
      quote: (m) => ({ type: 'quote', content: m[1] }),
      code: (m) => ({ type: 'code', content: m[1] }),
      block: (m) => ({ type: 'block', params: m[1], content: m[2] }),
      divbox: (m) => ({ type: 'divbox', color: m[1], content: m[2] }),
      aligntable: (m) => ({ type: 'aligntable', params: m[1], content: m[2] }),
      altdiv: (m) => ({ type: 'altdiv', params: m[1], content: m[2] }),
      altspoiler: (m) => ({ type: 'altspoiler', title: m[1], content: m[2] }),
      spoiler: (m) => ({ type: 'spoiler', content: m[1] }),
      legend: (m) => ({ type: 'legend', params: m[1], content: m[2] }),
      
      // Tables
      table: (m) => ({ type: 'table', font: m[1], content: m[2] }),
      alttable: (m) => ({ type: 'alttable', params: m[1], content: m[2] }),
      custable: (m) => ({ type: 'custable', params: m[1], content: m[2] }),
      tr: (m) => ({ type: 'tr', content: m[1] }),
      td: (m) => ({ type: 'td', content: m[1] }),
      td2: (m) => ({ type: 'td2', params: m[1], content: m[2] }),
      tdcs: (m) => ({ type: 'tdcs', params: m[1], content: m[2] }),
      tdrs: (m) => ({ type: 'tdrs', params: m[1], content: m[2] }),
      tdwidth: (m) => ({ type: 'tdwidth', params: m[1], content: m[2] }),
      col: (m) => ({ type: 'col', width: m[1] }),
      colgroup: (m) => ({ type: 'colgroup', content: m[1] }),
      custd: (m) => ({ type: 'custd', params: m[1], content: m[2] }),
      
      // Special Elements
      hr: () => ({ type: 'hr' }),
      anchor: (m) => ({ type: 'anchor', name: m[1] }),
      goto: (m) => ({ type: 'goto', anchor: m[1], content: m[2] }),
      cb: () => ({ type: 'cb' }),
      cbc: () => ({ type: 'cbc' }),
      todo: (m) => ({ type: 'todo', assigned: m[1], content: m[2] }),
      todo_done: (m) => ({ type: 'todo_done', handled: m[1], content: m[2] }),
      ooc: (m) => ({ type: 'ooc', content: m[1] }),
      urln: (m) => ({ type: 'urln', content: m[1] }),
      
      // Document Styles
      bulletin: (m) => ({ type: 'bulletin', params: m[1], content: m[2] }),
      depcor: (m) => ({ type: 'depcor', params: m[1], content: m[2] }),
      depmail: (m) => ({ type: 'depmail', params: m[1], content: m[2] }),
      depmemo: (m) => ({ type: 'depmemo', params: m[1], content: m[2] }),
      letterhead: (m) => ({ type: 'letterhead', content: m[1] }),
      lssdheader: () => ({ type: 'lssdheader' }),
      newsnet: () => ({ type: 'newsnet' }),
      postas: (m) => ({ type: 'postas', params: m[1] }),

      // Lists (handled separately in parseContent)
      list: (m) => this.parseList(m),
    };

    return elementCreators[type]?.(match) || { type: 'text', content: match[0] };
  }

  private static parseList(listMatch: RegExpMatchArray): BBCodeElement {
    const listType = listMatch[1] || 'bullet';
    const listContent = listMatch[2];
    
    const list: BBCodeElement = {
      type: 'list',
      listType: this.getListType(listType),
      items: this.parseListItems(listContent)
    };

    return list;
  }

  private static getListType(type: string): string {
    const typeMap: { [key: string]: string } = {
      '1': 'ordered',
      'a': 'alpha',
      'bullet': 'bullet'
    };
    return typeMap[type] || 'bullet';
  }

  private static parseListItems(content: string): BBCodeElement[] {
    const items: BBCodeElement[] = [];

    if (content) {
      const itemRegex = /\[\*\](.*?)(?=\[\*\]|$)/gs;
      let match;
      
      while ((match = itemRegex.exec(content)) !== null) {
        const itemContent = match[1].trim();
        if (itemContent) {
          items.push({
            type: 'list_item',
            content: this.parseContent(itemContent)
          });
        }
      }
    }

    return items;
  }
}