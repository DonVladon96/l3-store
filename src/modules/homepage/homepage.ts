import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';
import { ProductList } from '../productList/productList';

class Homepage extends Component {
  popularProducts: ProductList;
  constructor(props: any) {
    super(props);

    // Создаю экземпляр класса ProductList для популярных продуктов
    this.popularProducts = new ProductList();

    // Присоединяю popularProducts к элементу this.view.popular
    this.popularProducts.attach(this.view.popular);
  }

  // Метод render, который отвечает за отображение главной страницы
  render() {
    // Отправляю запрос на получение популярных продуктов по API '/api/getPopularProducts'
    fetch('/api/getPopularProducts', {
      headers: {
        'x-userid': window.userId
      }
    })
      .then((res) => res.json())
      .then((products) => {
        // Обновляем список популярных продуктов в объекте this.popularProducts
        this.popularProducts.update(products);
      });

    // Проверяю, был ли успешно оформлен заказ
    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      // Создаю уведомление об успешном оформлении заказа
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
  }
}

export const homepageComp = new Homepage(html);
