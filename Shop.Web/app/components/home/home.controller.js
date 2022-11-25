(function (app) {
    app.controller('homeController', homeController);

	homeController.$inject = ['$scope', '$timeout', 'apiService', '$q']

    function homeController($scope, $timeout, apiService, $q) {

        const GroupSlide = "Group Slide";
        const GroupSlideBanner = "Group Slide Banner";
        const GroupBanner = "Group Banner";

        $scope.groupSlides = [];
        $scope.groupSlideBanners = [];
        $scope.groupBanners = [];
        $scope.rootProductCategories = [];
        $scope.brands = [];

        $q.all([getAllGroupSlide(GroupSlide), getAllGroupSlide(GroupSlideBanner), getAllGroupSlide(GroupBanner), getAllRootProductCategories(), getAllBrand()]).then(function (result) {
            $scope.groupSlides = result[0];
            $scope.groupSlideBanners = result[1];
            $scope.groupBanners = result[2];
            $scope.rootProductCategories = result[3];
            $scope.brands = result[4]
            $timeout(init, 0);

        });


        function getAllGroupSlide(groupName) {
            var deferred = $q.defer();
            var config = {
                params: {
                    groupName: groupName
                }
            }

            apiService.get(
                'https://localhost:44353/api/slide/getbygroupname',
                config,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy slide không thành công');
                }
            );

            return deferred.promise;
        }

        function getAllRootProductCategories() {
            var deferred = $q.defer();
            apiService.get(
                'https://localhost:44353/api/productcategory/getallroot',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy root product category không thành công');
                }

            );
            return deferred.promise;
        }

        function getAllBrand() {

            var deferred = $q.defer();

            apiService.get(
                'https://localhost:44353/api/brand/getall',
                null,
                function (result) {
                    deferred.resolve(result.data);
                },
                function (error) {
                    deferred.reject('Lấy thương hiệu không thành công');
                }
            );
        }

		// Thêm file js vào cuối body sau khi chạy hết logic angularjs + html/csss
        function init() {
            $('body').append('<script type="text/javascript" src="/assets/client/js/themejs/homepage.js"></script>');
        }
	}


})(angular.module('shop'));

