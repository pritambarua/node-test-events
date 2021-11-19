// get the reference of EventEmitter class of events module
var events = require('events').EventEmitter;
const stockList = require('./stock-list.json'); 

//create an object of EventEmitter class by using above reference

class OrderProcessor extends events{
    placeOrder(orderData){
        this.emit('PROCESSING_STARTED', orderData.orderNumber);
        let hasLineItems = orderData.lineItems.length > 0;
        if(!hasLineItems){
            this.emit('PROCESSING_FAILED', {
                orderNumber: orderData.orderNumber,
                reason: 'LINEITEMS_EMPTY'
            });

            return;
        }

        orderData.lineItems.forEach(item => {
            let stock = stockList[item.id];
            if(stock < item.quantity){
                this.emit('PROCESSING_FAILED', {
                    orderNumber: orderData.orderNumber,
                    itemId: item.id,
                    reason: 'INSUFFICIENT_STOCK'
                });

                return;
            }
        });

        this.emit('PROCESSING_SUCCESS',orderData.orderNumber);
    }
};

module.exports = OrderProcessor;