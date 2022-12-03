(function (app) {
    app.factory('notificationService', notificationService);

    function notificationService() {
        toastr.options = {
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "fadeIn": 300, // hiện lên trong vòng 300ms
            "fadeOut": 1000, // tắt trong vòng 1000ms
            "timeOut": 3000, // hiện, sau 3000ms tắt
            "extendedTimeOut": 1000
        };
        return {
            displaySuccess,
            displayError,
            displayWarning,
            displayInfo
        };

        function displaySuccess(message) {
            toastr.success(message);
        };

        function displayError(error) {
            if (Array.isArray(error)) {
                error.each(function (err) {
                    toastr.error(err)
                })
            } else toastr.error(error);
        };

        function displayWarning(message) {
            toastr.warning(message)
        };

        function displayInfo(message) {
            toastr.info(message)
        };
    }
})(angular.module('shop.common'));