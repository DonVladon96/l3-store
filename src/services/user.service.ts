// Импорт библиотеки localforage для работы с локальным хранилищем
import localforage from 'localforage';
import { genUUID } from '../utils/helpers';

const ID_DB = '__wb-userId';

// Расширение интерфейса Window для добавления свойства userId типа string
declare global {
  interface Window {
    userId: string;
  }
}

// Определение класса UserService
class UserService {
  // Метод инициализации
  async init() {
    // Получение идентификатора и установка его в глобальное свойство userId окна
    const id = await this.getId();
    window.userId = id;
    console.warn('UserID: ', id);
  }

  // Метод для получения идентификатора
  async getId(): Promise<string> {
    let id = await localforage.getItem(ID_DB) as string;
    // Если идентификатор отсутствует, установить новый
    if (!id) id = await this._setId();
    return id;
  }

  // Приватный метод для установки нового идентификатора
  private async _setId(): Promise<string> {
    const id = genUUID();
    await localforage.setItem(ID_DB, id);
    return id;
  }
}

export const userService = new UserService();
