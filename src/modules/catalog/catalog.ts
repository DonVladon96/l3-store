import { Component } from '../component';
import html from './catalog.tpl.html';
import { ProductList } from '../productList/productList';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    // Создаю экземпляр класса ProductList
    this.productList = new ProductList();

    // Присоединяю productList к элементу this.view.products
    this.productList.attach(this.view.products);
  }

  // Асинхронный метод render, который отвечает за отображение каталога
  async render() {
    // Отправляю запрос на получение продуктов по API '/api/getProducts'
    const productsResp = await fetch('/api/getProducts', {
      headers: {
        'x-userid': window.userId
      }
    });

    // Получаю данные о продуктах
    const products = await productsResp.json();

    // Обновляю список продуктов в объекте this.productList
    this.productList.update(products);
  }
}

export const catalogComp = new Catalog(html);
