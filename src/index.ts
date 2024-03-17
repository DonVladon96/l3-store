import Router from "./router";
import { cartService } from "./services/cart.service";
import { userService } from "./services/user.service";

// Функция инициализации приложения
const initApp = async () => {
  await userService.init();
}

// Вызов функции инициализации приложения
initApp()
  .then(() => {
    // Создаею экземпляр роутера
    const route = new Router();
    route.route();

    // Инициализируею сервис корзины
    cartService.init();

setTimeout(() => {
  document.body.classList.add("is__ready");
}, 250);
  });

