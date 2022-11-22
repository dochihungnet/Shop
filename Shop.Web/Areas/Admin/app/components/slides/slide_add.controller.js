(function (app) {
    app.controller('slideAddController', slideAddController);

    slideAddController.$inject = ['$scope', 'apiService', '$state', 'notificationService', 'commonService'];

    function slideAddController($scope, apiService, $state, notificationService, commonService) {
        $scope.slide = {
            Status: true
        };

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

    }


})(angular.module('shop.slides'));