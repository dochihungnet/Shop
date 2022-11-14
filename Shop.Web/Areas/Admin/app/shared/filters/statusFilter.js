(function (app) {
    app.filter('statusFilter', function () {
        return function (input) {
            if (input) return "Hoạt động";
            else return "Khóa";
        }
    })
})(angular.module('shop.common'));