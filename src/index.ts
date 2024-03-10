import "./icons";
import Router from "./router";
import { cartService } from "./services/cart.service";
import { userService } from "./services/user.service";
//Импорчу favoriteService
import { favoriteService } from "./services/favorite.service";

new Router();
cartService.init();
//вызываю имортированную функцию favoriteService.init();
favoriteService.init();
userService.init();

setTimeout(() => {
  document.body.classList.add("is__ready");
}, 250);
