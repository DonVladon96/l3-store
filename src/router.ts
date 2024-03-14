import { catalogComp } from './modules/catalog/catalog';
import { notFoundComp } from './modules/notFound/notFound';
import { homepageComp } from './modules/homepage/homepage';
import { productDetailComp } from './modules/productDetail/productDetail';
import { checkoutComp } from './modules/checkout/checkout';
import { analyticService } from './services/analytics.service';

// Объект ROUTES определяет соответствие маршрутов и компонентов
const ROUTES = {
  '/': homepageComp,
  '/catalog': catalogComp,
  '/product': productDetailComp,
  '/checkout': checkoutComp
};

export default class Router {
  $appRoot: HTMLElement;

  constructor() {
    // @ts-ignore
    this.$appRoot = document.querySelector('.js__root');

    // Добавляем обработчики событий для загрузки страницы и изменения хэша
    window.addEventListener('load', this.route.bind(this));
    window.addEventListener('hashchange', this.route.bind(this));
  }

  // Метод route обрабатывает маршрутизацию и отображение соответствующего компонента
  route(e: any) {
    e.preventDefault();

    // Получаем компонент для текущего пути или используем notFoundComp
    // @ts-ignore
    const component = ROUTES[window.location.pathname] || notFoundComp;

    // Прикрепляем компонент к корневому элементу приложения и отображаем его
    component.attach(this.$appRoot);
    component.render();

    // Отправляем событие маршрута в аналитический сервис
    analyticService.sendEventRoute();
  }
}
