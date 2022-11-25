(function (app) {
    app.controller('homeController', homeController);

	homeController.$inject = ['$scope', '$timeout', 'apiService', '$q']

    function homeController($scope, $timeout, apiService, $q) {

		$scope.slides = [];

		$scope.getAllSlide = getAllSlide;

        function getAllSlide() {
            apiService.get(
                'https://localhost:44353/api/slide/getall',
                null,
                function (result) {
                    $scope.slides = result.data;
                    console.log($scope.slides);
                    $timeout($scope.init, 3);
                },
                function (error) {
                    console.log('Lấy slide không thành công');
                }
            );
        }

        getAllSlide();



		// Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
		$scope.init = init;

        function init() {
            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/homepage.js"></script>');
            console.log("Đỗ Chí Hùng")
        }
	}


})(angular.module('shop'));

