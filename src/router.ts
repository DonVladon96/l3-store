import { catalogComp } from './modules/catalog/catalog';
import { notFoundComp } from './modules/notFound/notFound';
import { homepageComp } from './modules/homepage/homepage';
import { productDetailComp } from './modules/productDetail/productDetail';
import { checkoutComp } from './modules/checkout/checkout';

// Определение маршрутов и соответствующих им компонентов
const ROUTES = {
  '/': homepageComp,
  '/catalog': catalogComp,
  '/product': productDetailComp,
  '/checkout': checkoutComp
};

// Экспорт класса Router
export default class Router {
  $appRoot: HTMLElement;

  constructor() {
    // @ts-ignore
    this.$appRoot = document.querySelector('.js__root');
    window.addEventListener('load', this.route.bind(this));
    window.addEventListener('hashchange', this.route.bind(this));
  }

  // Метод для обработки маршрутов
  route(e?: any) {
    if (e) e.preventDefault();
    // @ts-ignore
    const component = ROUTES[window.location.pathname] || notFoundComp;
    component.attach(this.$appRoot);
    component.render();
  }
}
