//создам новый компоннет favorite.ts
import { Component } from '../component';
import html from './favorite.tpl.html';

class Favotite extends Component {

  async render() {

  }
}

export const favoriteComp = new Favotite(html);
