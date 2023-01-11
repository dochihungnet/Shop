(function (app) {
    'use strict'

    app.factory('paymentService', [
        function () {
            let Order = {};
            
            Order = {
                OrderId : ""
            };
                
            return {
                Order
            }


        }
    ])

})(angular.module('shop.common'));