﻿(function (app) {
    app.factory('apiService', apiService);

    apiService.$inject = ['$http', 'authenticationService', 'notificationService'];

    function apiService($http, authenticationService, notificationService) {
        return {
            get, // read
            post, // Create
            put, // Update/Replace
            del // delete
        };

        function del(url, data, success, failure) {
            authenticationService.setHeader();

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
            authenticationService.setHeader();
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
            authenticationService.setHeader();
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
            authenticationService.setHeader();
            $http.get(url, params).then(function (result) {
                success(result);
            }, function (error) {
                if (error.status == '401') {
                    notificationService.displayError('Authenticate is required.');
                }
                failure(error);
            })
        };
    }
})(angular.module('shop.common'));