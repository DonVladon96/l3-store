import localforage from 'localforage';
import { ProductData } from 'types';

const FV = '__wb-favorite';

class FavoriteService {
  // Инициализация сервиса избранных
  init() {
    this._updCounters();
  }

  // Добавление продукта в избранное
  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
  }

  // Удаление продукта из избранного
  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  // Получение списка продуктов из избранного
  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(FV)) || [];
  }

  // Установка списка продуктов в избранное
  async set(data: ProductData[]) {
    await localforage.setItem(FV, data);
    this._updCounters();
  }

  // Проверка наличия продукта в избранном
  async isInFavorite(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  // Обновление счетчиков избранных
  private async _updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;
    const button = document.querySelector('.favorite, .header__buttons') as HTMLElement | null;

    if (button) {
      button.style.display = count ? 'block' : 'none';
    }

    // @ts-ignore
    document.querySelectorAll('.js__favorite-counter').forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
  }
}

export const favoriteService = new FavoriteService();
