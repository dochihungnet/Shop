(function (app) {
    app.filter('statusDiscountFilter', function () {
        return function (input) {
            if (input) return "On";
            else return "Off";
        }
    })
})(angular.module('shop.common'));