(function (app) {
    app.controller('slideAddController', slideAddController);

    slideAddController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService'];

    function slideAddController($scope, apiService, $state, notificationService, commonService) {

        $scope.slide = {
            Status: true
        };
        $scope.slideGroups = [];

        $scope.AddSlide = AddSlide;
        $scope.ChooseImage = ChooseImage;

        function AddSlide() {
            apiService.post(
                'https://localhost:44353/api/slide/create',
                $scope.slide,
                function (result) {
                    notificationService.displaySuccess('Thêm slide thành công');
                    $state.go('slides');
                },
                function (error) {
                    notificationService.displayError('Thêm slide thất bại.');
                });
        }

        function ChooseImage() {
            var finder = new CKFinder();
            finder.selectActionFunction = function (fileUrl) {
                $scope.$apply(function () {
                    $scope.slide.Image = fileUrl;
                });
            }
            finder.popup();
        }

        function GetListSlideGroup() {
            apiService.get(
                'https://localhost:44353/api/slidegroup/getall',
                null,
                function (success) {
                    $scope.slideGroups = success.data;
                    console.log('Lấy danh sách slide group thành công.');
                },
                function (error) {
                    console.log('Lấy danh sách slide group thất bại.');

                }
            )
        }

        GetListSlideGroup();
    }


})(angular.module('shop.slides'));