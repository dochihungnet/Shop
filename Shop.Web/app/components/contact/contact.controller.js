
(function (app) {
    app.controller('contactController', contactController);

    contactController.$inject = ['apiService', '$scope', '$state', 'notificationService', '$stateParams', '$timeout', '$q'];

    function contactController(apiService, $scope, $state, notificationService, $stateParams, $timeout, $q) {

        $scope.contact;

        getContact().then(result => {
            $scope.contact = result;
        })

        function getContact() {
            var deferred = $q.defer();

            apiService.get(
                'https://localhost:44353/api/contact/getcontactdefault',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function () {
                    deferred.reject('lấy sản phẩm thất bại.')
                }
            );

            return deferred.promise;
        }

           
        // Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
        function init() {
            $("script[src='/assets/client/js/themejs/homepage.js']").remove();
            $("script[src='/assets/client/js/themejs/so_megamenu.js']").remove();
            $("script[src='/assets/client/js/themejs/application.js']").remove();

            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/homepage.js"></script>');
            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/so_megamenu.js"></script>');
            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/application.js"></script>');
        }

    }


})(angular.module('shop.contact'));


