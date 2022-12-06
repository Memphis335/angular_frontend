import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseHtml'
})
export class ParseHtmlPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): String {
    const domParser = new DOMParser();
    const html = domParser.parseFromString(value, 'text/html');
    const parsedString = html.getElementsByTagName(`body`);
    return parsedString[0].innerHTML;
  }

}
