import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './searchHelp.tpl.html';
import { ProductData } from 'types';

export class searchHelp {
  view: View;
  products: ProductData[];

  constructor(html: any) {
    this.products = [];
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
    this.init();
  }

  async init() {
    this.view.example.innerHTML = `например,&nbsp;`;
    this.view.firstHint.textContent = 'чехол iphone 13 pro';
    this.view.secondHint.textContent = 'коляски agex';
    this.view.thirdHint.textContent = 'яндекс станция 2';
  }

  render(products?: ProductData[]) {
    if (products) {
      this.view.example.textContent = '';
      this.view.firstHint.textContent = products[0];
      this.view.secondHint.textContent = products[1];
      this.view.thirdHint.textContent = products[2];
    }
  }
}

export const searchHelpComp = new searchHelp(html);
