(function (app) {
    'use strict'

    app.factory('authData', [
        function () {
            let authDataFactory = {};

            let authentication = {
                IsAuthenticated: false,
                userName: ""
            };

            authDataFactory.authenticationData = authentication;

            return authDataFactory;
        }
    ])

})(angular.module('shop.common'));