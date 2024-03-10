import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favoriteService } from '../../services/favorite.service';

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

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);

    // устанавливаю обработчик события клика на кнопку с классом "btnFav", который вызывает метод "_toggleToFavorite" объекта с контекстом
    this.view.btnFav.onclick = this._toggleToFavorite.bind(this);

    const isInCart = await cartService.isInCart(this.product);
    //тут создаю константу, в которой проверяю содержится ли текущий продукт в списке избранных.
    const isInFavorite = await favoriteService.isInFavorite(this.product);

    //а затем проверяю находится ли элемент в избранном и если да то вызываю метод setInFavorite
    if (isInFavorite) this._setInFavorite();

    if (isInCart) this._setInCart();


    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    this._setInCart();
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }


  // Метод _toggleToFavorite() переключает продукт в избранное.
  // Если продукт уже в избранном, то он удаляется, иначе добавляется.
  private async _toggleToFavorite() {
    if (!this.product) return; // Проверяем наличие продукта
    const isInFavorite = await favoriteService.isInFavorite(this.product); // Проверяем, есть ли продукт в избранном

    if (isInFavorite) {
      favoriteService.removeProduct(this.product); // Удаляем продукт из избранного
      this._removeInFavorite(); // Убираем стиль избранного
    } else {
      favoriteService.addProduct(this.product); // Добавляем продукт в избранное
      this._setInFavorite(); // Добавляем стиль избранного
    }
  }


   // Метод _setInFavorite() добавляет стиль 'btnFav__active' к кнопке избранного.
  private _setInFavorite() {
    this.view.btnFav.classList.add('btnFav__active');
  }


  // Метод _removeInFavorite() удаляет стиль 'btnFav__active' из кнопки избранного.
  private _removeInFavorite() {
    this.view.btnFav.classList.remove('btnFav__active');
  }

}

export const productDetailComp = new ProductDetail(html);
