//создам новый компоннет favorite.ts
import { Component } from '../component';
import html from './favorite.tpl.html';
import { ProductList } from '../productList/productList';
import { favoriteService } from '../../services/favorite.service';

class Favorite extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {
    const products = await favoriteService.get();

    this.productList.update(products);
  }
}

export const favoriteComp = new Favorite(html);
