(function (app) {
    app.factory('apiService', apiService);

    apiService.$inject = ['$http', 'authenticationService'];

    function apiService($http, authenticationService) {
        return {
            get, // read
            post, // Create
            put, // Update/Replace
            del // delete
        };

        function del(url, data, success, failure) {
            $http.delete(url, data).then(function (result) {
                success(result);
            }, function (error) {
                // lỗi 401: không có quyền authencation
                if (error.status == '401') {
                    notificationService.displayError('Authenticate is required.');
                }
                failure(error);
            })
        };

        function put(url, data, success, failure) {
            $http.put(url, data).then(function (result) {
                success(result);
            }, function (error) {
                // lỗi 401: không có quyền authencation
                if (error.status == '401') {
                     notificationService.displayError('Authenticate is required.');
                }
                failure(error);
            })
        };

        function post(url, data, success, failure) {
            $http.post(url, data).then(function (result) {
                success(result);
            }, function (error) {
                // lỗi 401: không có quyền authencation
                if (error.status == '401') {
                    notificationService.displayError('Authenticate is required.');
                }
                failure(error);
            })
        };

        function get(url, params, success, failure) {
            $http.get(url, params).then(function (result) {
                success(result);
            }, function (error) {
                failure(error);
            })
        };
    }
})(angular.module('shop.common'));