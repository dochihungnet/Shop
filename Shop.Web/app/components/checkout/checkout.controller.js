(function (app){
    app.controller('checkOutController', checkOutController);

    checkOutController.$inject = ['$scope', 'apiService', '$q', '$timeout', 'cartService', 'authData', 'loginService', '$state', '$uibModal', 'locationData', 'notificationService', '$log', 'locationService', 'paymentService'];
    function checkOutController($scope, apiService, $q, $timeout, cartService, authData, loginService, $state, $uibModal, locationData, notificationService, $log, locationService, paymentService){
        
        $scope.loginStatus = false;
        $scope.userName = null;
        $scope.user = null;
        $scope.deliveryAddress = null;
        $scope.paymentOnline = false;
        
        // theo dõi xem đăng nhập và làm một số chức năng
        $scope.$watch(function () { return authData.authenticationData; }, function () {
            if(authData.authenticationData.IsAuthenticated === true){
                $scope.loginStatus = true;
                $scope.userName = authData.authenticationData.userName;
                cartService.getUserByUserName($scope.userName).then(result => {
                    $scope.user = result;

                    if(!$scope.user.DeliveryAddressDefault){
                        $scope.deliveryAddress = null;
                        handlerEventClickAddDeliveryAddress(null, "add", "static");
                    }
                    else {
                        locationData.GetDeliveryAddressById($scope.user.DeliveryAddressDefault)
                            .then(result => {
                                $scope.deliveryAddress = result;
                            });

                    }

                });

            }
            else {
                $scope.loginStatus = false;
                $scope.userName = null;
                $scope.user = null;
                $scope.deliveryAddress = "";
            }
        }, true);
        
        
        // SHIPPING METHOD =============================================
        $scope.shippingMethods = [
            {
                id: 1,
                text: "Bình thường",
                price: 30000,
                checked: true
            },
            {
                id: 2,
                text: "Chuyển phát nhanh",
                price: 100000,
                checked: false
            }
        ]
        
        $scope.handlerEventChangeInputShippingMethod = function (id){
            
            $scope.shippingMethods = $scope.shippingMethods.map(x => {
                if(x.id === id){
                    x.checked = true;
                    $scope.transportFee = x.price;
                }
                else {
                    x.checked = false;
                }
                return x;
            })
        }
        // END SHIPPING METHOD ===========================================

        // CHECK METHOD =================================================
        $scope.checkoutMethods = [
            {
                id: 1,
                text: "Thanh toán khi nhận hàng",
                checked: true
            },
            {
                id: 2,
                text: "Thanh toan bằng VnPay",
                checked: false
            }
        ]

        // theo dõi checkoutMethods
        $scope.$watch("checkoutMethods", function () {
            for (const item of $scope.checkoutMethods) {
                if(item.id === 1 && item.checked){
                    $scope.paymentOnline = false;
                    $scope.order.PaymentMethod = 0;
                    $scope.order.PaymentStatus = false;
                }
                else if(item.id === 2 && item.checked){
                    $scope.paymentOnline = true;
                    $scope.order.PaymentMethod = 1;
                    $scope.order.PaymentStatus = true;
                }
            }
        }, true);
        
        $scope.handlerEventChangeInputCheckoutMethod = function (id){

            $scope.checkoutMethods = $scope.checkoutMethods.map(x => {
                if(x.id === id){
                    x.checked = true;
                }
                else {
                    x.checked = false;
                }
                return x;
            })
        }
        // END CHECKOUT METHOD ==========================================
    
        
        // GET DATA CART ================================================
        $scope.carts = cartService.getAllProductShoppingCart();
        $scope.totalCart = cartService.getTotalShoppingCart();
        
        $scope.$watch(function () { return cartService.shoppingCart.carts; }, function () {
            $scope.carts = cartService.getAllProductShoppingCart();
            $scope.totalCart = cartService.getTotalShoppingCart();
        }, true);
        
        $scope.deleteProduct = function (productId) {
            cartService.deleteProductShoppingCart(productId);
        }

        $scope.updateProductShoppingCart = function (productId){
            let productShoppingCart =  $scope.carts.find(spc => spc.ProductId === productId);
            cartService.updateProductShoppingCart(productShoppingCart);
        }
        // END GET DATA CART ==========================================================
        
        
        // ORDER ===============================================================================
        $scope.transportFee = $scope.shippingMethods.find(x => x.checked).price || 0;
        $scope.vat = 20;
        $scope.order = {};
        $scope.Display = true;
        
        
        // xử lý khi người dùng nhấn đặt hàng
        $scope.OrderConfirmation = function (){
            
            if(!$scope.loginStatus){
                $scope.deliveryAddress = $scope.deliveryAddress_1;
            }
            
            // kiểm tra xem người dùng đã nhập địa chỉ hay chưa
            if(!$scope.deliveryAddress){
                notificationService.displayError("Địa chỉ không hợp lệ");
                
                // nếu người dùng đã đăng nhập
                if(authData.authenticationData.IsAuthenticated === true){
                    handlerEventClickAddDeliveryAddress(null, "add", "static");
                }
                
                return;
            }
            
            // kiểm tra xem giỏ hàng đã có sản phẩm hay chưa
            if($scope.carts.length === 0){
                notificationService.displayWarning("Mua hàng trước khi thanh toán");
                return;
            }
            
            orderData();
            
            // thêm giỏ hàng
            cartService.checkOut($scope.order).then(result => {
                if(!result){
                    notificationService.displayError("Đặt hàng thất bại");
                    return;
                }
                cartService.deleteShoppingCart();
                if($scope.paymentOnline){
                    // set orderId set local
                    localStorage.setItem('orderId', result.Id);
                    
                    let total =  ($scope.totalCart + $scope.totalCart * $scope.vat / 100) + $scope.transportFee;
                    let model = {
                        OrderType: "Tổng hợp",
                        Amount: total,
                        OrderDescription: "Tôi đồng ý",
                        Name : result.CustomerName
                    };
                    createPayment(model).then(result => {
                        if(result){
                            window.location.href = result;
                        }
                    })
                }
                else {
                    notificationService.displaySuccess("Đặt hàng thành công");
                    if(authData.authenticationData.IsAuthenticated === true){
                        $state.go("orders");
                    }
                    else {
                        $scope.Display = false;
                    }
                }
            });
        }
        function orderData(){
            $scope.order.CustomerDeliveryAddress = $scope.deliveryAddress.CustomerDeliveryAddress;
            // $scope.order.PaymentMethod = 0; // 0 thanh toán khi nhận hàng, 1 thanh toán qua payment
            $scope.order.CreatedDate = new Date(); // ngày tạo đơn hàng
            // $scope.order.PaymentStatus = false; // đã thanh toán, chưa thanh toán
            $scope.order.Status = true; // trạng thái
            $scope.order.OrderDetails = $scope.carts;
            $scope.order.TransportFee = $scope.transportFee;
            $scope.order.Vat = $scope.vat;
            $scope.order.OrderStatus = 1;

            // xử lý data theo người dùng đã đăng nhập hay chưa đăng nhập
            if (authData.authenticationData.IsAuthenticated === true) {
                $scope.order.CustomerName = $scope.deliveryAddress.CustomerName;
                $scope.order.CustomerEmail = $scope.user.Email;
                $scope.order.CustomerMobile = $scope.deliveryAddress.CustomerMobile;
                $scope.order.CreatedBy = $scope.user.FullName;
                $scope.order.CustomerId = $scope.user.Id;
            }
            else {
                $scope.order.CreatedBy = $scope.order.CustomerName;
                $scope.order.CustomerId = null;
            }
        }
        
        function createPayment(PaymentInformationModel){
            let deferred = $q.defer();
            apiService.post(
                'https://localhost:44353/api/payment/create',
                PaymentInformationModel,
                function (result){
                    deferred.resolve(result.data);
                },
                function (error){
                    deferred.reject("create payment failure");
                }
            );
            return deferred.promise;
        }
        
        // END ORDER ================================================================================
        
        
        // theo dõi location Data service để lấy $scope.deliveryAddress_1
        $scope.$watch(function () { return locationData.location  }, function (newVal, oldVal) {
            if(locationData.location.Province && locationData.location.District && locationData.location.Ward){
                $scope.deliveryAddress_1 = {
                    CustomerDeliveryAddress: (locationData.location.Ward?.ward_name || "") + ", "
                        + locationData.location.District.district_name + ", " + locationData.location.Province.province_name
                };
                
            }
        }, true);
        
        
        // xử lý sự kiện khi người dùng click thay đổi địa chỉ giao hàng
        $scope.handlerEventClickChangeDeliveryAddress = function (){
            if(authData.authenticationData.IsAuthenticated === true){
                cartService.getUserByUserName(authData.authenticationData.userName).then(result => {
                    if(!result.DeliveryAddressDefault){
                        handlerEventClickAddDeliveryAddress(null, "add", "static");
                    }
                    else {
                        handlerEventClickChangeDeliveryAddress();
                    }
                });

            }

        };
        function handlerEventClickChangeDeliveryAddress($event, backdrop) {
            if($event) $event.preventDefault();
            backdrop = backdrop || "static";
            
            let modalListDeliveryAddress = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                backdrop: backdrop,
                templateUrl: '/app/shared/views/modal_list_delivery_address.html',
                controller: 'ModalListDeliveryAddress',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    data: function () {
                        return  {
                            user : $scope.user,
                            handlerEventClickAddDeliveryAddress: handlerEventClickAddDeliveryAddress
                        };
                    }
                }
            });

            modalListDeliveryAddress.result.then(function () {
                // handler if close modal
                cartService.getUserByUserName($scope.userName).then(result => {
                    $scope.user = result;
                    if($scope.user.DeliveryAddressDefault){
                        locationData.GetDeliveryAddressById($scope.user.DeliveryAddressDefault)
                            .then(result => {
                                $scope.deliveryAddress = result;
                            });
                    }
                });
            });
        }
        
        // status: add or edit
        // backdrop: 'static' or true
        // Xử lý sự kiện khi người dùng click thêm địa chỉ giao hàng
        function handlerEventClickAddDeliveryAddress($event, status, backdrop, displayModalList, deliveryId) {
            if($event) $event.preventDefault();
            
            let modalAddDeliveryAddress = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                backdrop: backdrop,
                templateUrl: '/app/shared/views/modal_add_delivery_address.html',
                controller: 'ModalAddDeliveryAddress',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    // gui user xuong: muc dich: lay Customer Id??
                    data: function () {
                        return {
                            user : $scope.user,
                            status: status,
                            deliveryId: deliveryId
                        };
                    }
                }
            });
            modalAddDeliveryAddress.result.then(function () {
                // handler if close modal
                cartService.getUserByUserName($scope.userName).then(result => {
                    $scope.user = result;
                    if($scope.user.DeliveryAddressDefault){
                        locationData.GetDeliveryAddressById($scope.user.DeliveryAddressDefault)
                            .then(result => {
                                $scope.deliveryAddress = result;
                            });
                    }
                });
                if(displayModalList === true){
                    handlerEventClickChangeDeliveryAddress(null, null);
                }
            });
        }

        // Xử lý 3 ô input nhập địa chỉ ====================================================
        chooseProvince($scope, $q, $log, locationService, locationData);
        chooseDistrict($scope, $q, $log, locationService, locationData);
        chooseWard($scope, $q, $log, locationService, locationData);
        //==================================================================================
        
    }

    app.controller('ModalListDeliveryAddress', function ($uibModalInstance, data, locationService, $q, $log, $timeout, locationData, $scope, notificationService, authData) {
        
        $scope.user = data.user;
        $scope.handlerEventClickAddDeliveryAddress = data.handlerEventClickAddDeliveryAddress;
        
        $scope.listDeliveryAddress = [];

        $scope.handlerCheckedInputDeliveryAddressDefault = handlerCheckedInputDeliveryAddressDefault;
        
        getAllDeliveryAddressByUserId();
        
        $scope.add = function (){
            $uibModalInstance.close();
            $scope.handlerEventClickAddDeliveryAddress(null, null, "static", true);
        }        

        $scope.confirm__ = function (){
            let deliveryAddress = $scope.listDeliveryAddress.find(d => d.Checked === true);
            locationData.SetDeliveryAddressByUserId(deliveryAddress).then(result => {
                if(result){
                    $uibModalInstance.close();
                    notificationService.displaySuccess("Cập nhập địa chỉ thành công");
                }
            });
        }
        
        $scope.update = function (deliveryId){
            $uibModalInstance.close();
            $scope.handlerEventClickAddDeliveryAddress(null, "edit", "static", true, deliveryId);
        }
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        // FUNC
        function  getAllDeliveryAddressByUserId(){
            locationData.GetListDeliveryAddressByUserId($scope.user.Id)
                .then(result => {
                    $scope.listDeliveryAddress = result.map(a => {
                        if(a.Id === $scope.user.DeliveryAddressDefault){
                            a.Default = true;
                            a.Checked = true;
                        }
                        else {
                            a.Default = false;
                            a.Checked = false;
                        }
                        return a;
                    })
                })
        }

        function handlerCheckedInputDeliveryAddressDefault(id) {
  
            let input = $scope.listDeliveryAddress.find(x => x.Id == id);
            
            if (!input.Checked) {
                return;
            }

            $scope.listDeliveryAddress = $scope.listDeliveryAddress.map(function (a) {
                if (a.Id === id)
                {
                    return a;
                }
                else
                {
                    a.Checked = false;
                    return a;
                }
            });
        }

    });
    
    app.controller('ModalAddDeliveryAddress', function ($uibModalInstance, data, locationService, $q, $log, $timeout, locationData, $scope, notificationService, authData) {
        
        $scope.user = data.user;
        
        $scope.inputProvince_isDisabled = false;
        $scope.inputDistrict_isDisabled = true;
        $scope.inputWard_isDisabled = true;
        
        $scope.btnAdd_isDisabled = true;
        $scope.btnEdit_isDisabled = true;
        
        $scope.btnAddShow = false;
        $scope.btnEditShow = false;
        $scope.title = "";
        
        if(data.status === "add" || data.status === null || data.status === undefined){
            $scope.btnAddShow = true;
            $scope.btnEditShow = false;
            $scope.title = "Thêm địa chỉ giao hàng";
        }
        else if(data.status === "edit"){
            $scope.btnAddShow = false;
            $scope.btnEditShow = true;
            $scope.title = "Cập nhập địa chỉ giao hàng";
        }
        
        
        $scope.deliveryAddress = {
            CustomerId: $scope.user.Id,
            Status: true
        };
        
        
        if(data.deliveryId){
            locationData.GetDeliveryAddressById(data.deliveryId).then(result => {
               $scope.deliveryAddress = result;
            });
        }
        
        $scope.$watch(function () { return locationData.location  }, function (newVal, oldVal) {
            if(locationData.location.Province && locationData.location.District){
                $scope.btnAdd_isDisabled = false;
                $scope.btnEdit_isDisabled = false;
                $scope.inputDistrict_isDisabled = false;
                $scope.inputWard_isDisabled = false;
                
                $scope.deliveryAddress.CustomerDeliveryAddress = (locationData.location.Ward?.ward_name || "") + ", "
                    + locationData.location.District.district_name + ", " + locationData.location.Province.province_name;
                
            }
            else if(locationData.location.Province && locationData.location.District){
                $scope.btnAdd_isDisabled = true;
                $scope.btnEdit_isDisabled = true;
                
                $scope.inputWard_isDisabled = false;
                locationData.location.Ward = null;
            }
            else if(locationData.location.Province){
                $scope.btnAdd_isDisabled = true;
                $scope.btnEdit_isDisabled = true;
                
                $scope.inputDistrict_isDisabled = false;
            }
            else {
                $scope.btnAdd_isDisabled = true;
                $scope.btnEdit_isDisabled = true;
                
                $scope.inputDistrict_isDisabled = true;
                $scope.inputWard_isDisabled = true;
                locationData.location.District = null;
                locationData.location.Ward = null;
            }
        }, true);
        
        
        chooseProvince($scope, $q, $log, locationService, locationData);
        chooseDistrict($scope, $q, $log, locationService, locationData);
        chooseWard($scope, $q, $log, locationService, locationData);

        $scope.add = function (){
            locationData.AddDeliveryAddress($scope.deliveryAddress)
                .then(result => {
                    console.log(result);
                    if(result){
                        $uibModalInstance.close();
                        notificationService.displaySuccess('Add delivery success');
                    }
                    else {
                        $uibModalInstance.close();
                        notificationService.displayError('Add delivery failure');
                    }
                })
        }
        
        $scope.edit = function (){
            locationData.UpdateDeliveryAddress($scope.deliveryAddress)
                .then(result => {
                    if(result){
                        $uibModalInstance.close();
                        notificationService.displaySuccess('Update delivery success');
                    }
                    else {
                        notificationService.displayError('Delete delivery failure');
                    }
                })
        }
        
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
        
    });
    
})(angular.module('shop.checkout'))

function chooseProvince($scope, $q, $log, locationService, locationData) {
    
   locationService.getAllProvinces().then(res => {
       $scope.repos =  res.results.map(function (repo) {
           repo.value = repo.province_name.toLowerCase();
           return repo;
       });
    }).catch();
    
    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;

   function querySearch(query) {
        let result = query ? $scope.repos.filter(createFilterFor(query)) : $scope.repos, deferred;
        return result;
   }
   
   function selectedItemChange(item) {
       locationData.location.Province = item;
   }
    function createFilterFor(query) {
        let lowercaseQuery = query.toLowerCase();

        return function filterFn(item) {
            return (item.value.includes(lowercaseQuery));
        };

    }
}

function chooseDistrict($scope, $q, $log, locationService, locationData) {

    $scope.$watch(function () { return locationData.location  }, function (newVal, oldVal) {
        if(locationData.location.Province){
            locationService.getAllDistrictsByProvince(locationData.location.Province.province_id).then(res => {
                $scope.district_repos =  res.results.map(function (repo) {
                    repo.value = repo.district_name.toLowerCase();
                    return repo;
                });
            }).catch();
        }else {
            $scope.searchTextDistrict = "";
        }
        
       
    }, true);
    

    $scope.querySearchDistrict = querySearchDistrict;
    $scope.selectedDistrictItemChange = selectedDistrictItemChange;

    function querySearchDistrict(query) {
        let result = query ? $scope.district_repos.filter(createFilterFor(query)) : $scope.district_repos, deferred;
        return result;
    }


    function selectedDistrictItemChange(item) {
        locationData.location.District = item;
    }
    
    function createFilterFor(query) {
        let lowercaseQuery = query.toLowerCase();

        return function filterFn(item) {
            return (item.value.includes(lowercaseQuery));
        };

    }
}

function chooseWard($scope, $q, $log, locationService, locationData) {
    
    $scope.$watch(function () { return locationData.location  }, function (newVal, oldVal) {
        if(locationData.location.Province && locationData.location.District){
            locationService.getAllWardByDistrict(locationData.location.District.district_id).then(res => {
                $scope.ward_repos =  res.results.map(function (repo) {
                    repo.value = repo.ward_name.toLowerCase();
                    return repo;
                });
            }).catch();
        }
        else {
            $scope.searchTextWard = "";
        }

    }, true);

    $scope.querySearchWard = querySearchWard;
    $scope.selectedWardItemChange = selectedWardItemChange;

    function querySearchWard(query) {
        let result = query ? $scope.ward_repos.filter(createFilterFor(query)) : $scope.ward_repos, deferred;
        return result;
    }


    function selectedWardItemChange(item) {
        locationData.location.Ward = item;
    }


    function createFilterFor(query) {
        let lowercaseQuery = query.toLowerCase();

        return function filterFn(item) {
            return (item.value.includes(lowercaseQuery));
        };

    }
}