// Register `phoneList` component, along with its associated controller and template

angular.
    module('shop.header', ['shop.common']).
    component('headerView', {  // This name is what AngularJS uses to match to the `<phone-list>` element.
        templateUrl: "/app/components/header/header.view.html",
        controller: ['apiService', function HeaderController(apiService) {
            var self = this;

            this.productCategories = [];



            function getListProductCategory() {

                apiService.get(
                    'https://localhost:44353/api/productcategory/getallparents',
                    null,
                    function (result) {
                        self.productCategories = result.data;
                        console.log(self.productCategories)
                    },
                    function (error) {
                        console.log('Lấy danh mục sản phẩm không thành công');
                    }
                );
            }

            getListProductCategory();


        }]
    });
