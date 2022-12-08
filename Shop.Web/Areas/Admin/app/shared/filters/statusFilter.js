(function (app) {
    app.filter('statusFilter', function () {
        return function (input) {
            if (input) return "Đang mở bán";
            else return "Chưa mở bán";
        }
    })
})(angular.module('shop.common'));