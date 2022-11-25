(function (app) {
    app.controller('slideEditController', slideEditController);

    slideEditController.$inject = ['apiService', '$scope', 'notificationService', '$state', '$stateParams', 'commonService'];

    function slideEditController(apiService, $scope, notificationService, $state, $stateParams, commonService) {
        $scope.slide = {
            Status: true,
            HomeFlag: true
        }

        $scope.UpdateSlide = UpdateSlide;
        $scope.ChooseImage = ChooseImage;


        function loadSlideDetail() {
            apiService.get(
                'https://localhost:44353/api/slide/getbyid/' + $stateParams.id,
                null,
                function (result) {
                    $scope.slide = result.data;
                },
                function (error) {
                    notificationService.displayError(error.data);
                }
            );
        }

        function UpdateSlide() {
            apiService.put(
                'https://localhost:44353/api/slide/update',
                $scope.slide,
                function (result) {
                    notificationService.displaySuccess('Cập nhập thành công.');
                    $state.go('slides');
                },
                function (error) {
                    notificationService.displayError('Cập nhật không thành công.');
                }
            );
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

        loadSlideDetail();
        GetListSlideGroup();
    }

})(angular.module('shop.slides'));