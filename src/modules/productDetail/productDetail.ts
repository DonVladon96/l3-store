import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`, {
      headers: {
        'x-userid': window.userId
      }
    });
    this.product = await productResp.json();

    // Проверка наличия продукта
    if (!this.product) return;

    // Деструктуризация данных продукта
    const { id, src, name, description, salePriceU } = this.product;

    // Установка атрибута 'src' изображения продукта
    this.view.photo.setAttribute('src', src);

// Установка текста заголовка продукта
    this.view.title.innerText = name;

// Установка текста описания продукта
    this.view.description.innerText = description;

// Установка отформатированной цены продукта
    this.view.price.innerText = formatPrice(salePriceU);

    // Назначение обработчика события на кнопку "Купить"
    this.view.btnBuy.onclick = this._addToCart.bind(this);

    const isInCart = await cartService.isInCart(this.product);

    if (isInCart) this._setInCart();


    // Запрос секретного ключа продукта
    fetch(`/api/getProductSecretKey?id=${id}`, {
      headers: {
        'x-userid': window.userId
      }
    })
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    // Запрос популярных продуктов
    fetch('/api/getPopularProducts', {
      headers: {
        'x-userid': window.userId
      }
    })
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  // Приватный метод для добавления продукта в корзину
  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    this._setInCart();
  }

  // Приватный метод для установки статуса "В корзине" на кнопке
  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }
}

export const productDetailComp = new ProductDetail(html);
