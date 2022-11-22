(function (app) {
    app.filter('statusBrandFilter', function () {
        return function (input) {
            if (input) return "Hoạt động";
            else return "Ngừng hoạt động";
        }
    })
})(angular.module('shop.common'));