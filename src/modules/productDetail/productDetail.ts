import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { analyticService } from '../../services/analytics.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    // Инициализация компонента ProductDetail
    this.more = new ProductList();
    this.more.attach(this.view.more); // Прикрепление ProductList к текущему компоненту
  }

  async render() {
    // Получение параметров из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    // Запрос данных о продукте по ID
    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    // Если продукт не найден, завершаем выполнение
    if (!this.product) return;

    // Обновление представления с данными о продукте
    const { id, src, name, description, salePriceU } = this.product;
    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);

    // Проверка, добавлен ли продукт в корзину
    const isInCart = await cartService.isInCart(this.product);

    // Если продукт уже в корзине, обновляем представление
    if (isInCart) this._setInCart();

    // Получение секретного ключа продукта и отправка события просмотра в аналитический сервис
    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
        //исользую ранее написанный метод analyticService.sendViewCard
        analyticService.sendViewCard(this.product, secretKey);
      });

    // Получение популярных продуктов и обновление списка продуктов
    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  // Метод для добавления продукта в корзину
  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    this._setInCart();

    // Отправка события добавления продукта в корзину в аналитический сервис
    analyticService.sendAddToCard(this.product);
  }

  // Метод для обновления представления, указывающего, что продукт уже в корзине
  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }
}

// Экспорт экземпляра ProductDetail в качестве productDetailComp
export const productDetailComp = new ProductDetail(html);
