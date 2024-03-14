import { genUUID } from '../utils/helpers';

class Analytics {
  // Отправляю событие 'route' с текущим путем URL в качестве данных
  async sendEventRoute() {
    try {
      await this.sendEvent({
        type: 'route',
        payload: {
          url: window.location.pathname
        },
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Ошибка при отправке события:', error);
    }
  }

  // Отправляю событие 'viewCard' или 'viewCardPromo' в зависимости от свойства `log` в `productProperties`
  async sendViewCard(productProperties: any, secretKey: string) {
    try {
      await this.sendEvent({
        type: productProperties.log ? 'viewCardPromo' : 'viewCard',
        payload: {
          ...productProperties,
          secretKey: secretKey
        },
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Ошибка при отправке события:', error);
    }
  }

  // Отправляю событие 'addToCard' с данными о продукте в качестве данных
  async sendAddToCard(productProperties: any) {
    try {
      await this.sendEvent({
        type: 'addToCard',
        payload: {
          ...productProperties
        },
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Ошибка при отправке события:', error);
    }
  }

  // Отправляю событие 'purchase' с ID заказа, общей стоимостью и ID продуктов из списка продуктов в качестве данных
  async sendPurchase(productsList: any) {
    try {
      const orderId = genUUID();
      const productsTotalPrice = productsList.reduce((acc: any, product: any) => (acc += product.salePriceU), 0);
      const productsId = productsList.map((product: any) => product.id);
      await this.sendEvent({
        type: 'purchase',
        payload: {
          orderId: orderId,
          totalPrice: productsTotalPrice,
          productIds: productsId
        },
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Ошибка при отправке события:', error);
    }
  }

  // Вспомогательный метод для проверки статуса ответа и возврата данных JSON или отклонения обещания
  private checkStatusRequest(res: any) {
    if (res.ok) return res.json();
    return Promise.reject(res.status);
  }

  // Приватный метод для отправки события на конечную точку API с использованием `fetch`
  private async sendEvent(payload: any) {
    try {
      const res = await fetch('/api/sendEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return this.checkStatusRequest(res);
    } catch (error) {
      console.error('Ошибка при отправке события:', error);
    }
  }
}

export const analyticService = new Analytics();

