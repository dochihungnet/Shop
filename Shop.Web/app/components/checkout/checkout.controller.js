(function (app){
    app.controller('checkOutController', checkOutController);

    checkOutController.$inject = ['$scope', 'apiService', '$q', '$timeout', 'cartService', 'authData', 'loginService', '$state', '$uibModal', 'locationData', 'notificationService', '$log', 'locationService'];
    function checkOutController($scope, apiService, $q, $timeout, cartService, authData, loginService, $state, $uibModal, locationData, notificationService, $log, locationService){
        /*
        * user chua dang nhap => phai dien CustomerName, ........
        * 
        */
        
        /*
        * user da dang nhap: get DeliveryAddressDefault(dia chi nhan hang mac dinh theo index)
        * - neu chua co dia chi nhan hang nao => yeu cau khach hang create
        * - neu co dia chi nhan hang roi: co the cho khach hang tao them, update dia chi nhan hang, set dia chi nhan hang
        * mac dinh moi
        * 
        */
        
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////// declare variable (khai báo biến)
        ////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.loginStatus = false;
        $scope.userName = null;
        $scope.user = null;
        
        $scope.deliveryAddress = null;
        
        
        
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
                text: "Chuyển khoản",
                checked: false
            }
        ]

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
        // END CHECKOUT METHOD =====================================
    
        
        // GET DATA CART ================================================
        $scope.carts = cartService.getAllProductShoppingCart();
        $scope.totalCart = cartService.getTotalShoppingCart();
        
        $scope.$watch(function () { return cartService.shoppingCart.carts; }, function (newVal, oldVal) {
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
        
        

        // DATA ORDER ====================================================================
        $scope.transportFee = $scope.shippingMethods.find(x => x.checked).price || 0;
        $scope.vat = 20;
        $scope.order = {};
        $scope.Display = true;
        
        
        
        $scope.OrderConfirmation = function (){
            
            // người dùng phải nhập địa chỉ nhá
            if(!$scope.deliveryAddress){
                notificationService.displayError("Địa chỉ không hợp lệ");
                
                // nếu người dùng đã đăng nhập
                if(authData.authenticationData.IsAuthenticated === true){
                    handlerEventClickAddDeliveryAddress(null, "add", "static");
                }
                
                return;
            }
            
            // check xem giỏ hàng có gì hay không
            if($scope.carts.length === 0){
                notificationService.displayWarning("Giỏ hãng rỗng");
                notificationService.displayWarning("Mua hàng trước khi thanh toán");
                return;
            }
            
            $scope.order.CustomerDeliveryAddress = $scope.deliveryAddress.CustomerDeliveryAddress;
            $scope.order.PaymentMethod = "Thanh toán khi nhận hàng";
            $scope.order.CreatedDate = new Date();
            $scope.order.PaymentStatus = false; // đã thanh toán // chưa thanh toán
            $scope.order.Status = true; // trạng thái
            $scope.order.OrderDetails = $scope.carts;
            $scope.order.TransportFee = $scope.transportFee;
            $scope.order.Vat = $scope.vat;
            $scope.order.OrderStatus = 1;
            // 1: Chưa duyệt
            // 2: Đã duyệt
            // 3: Đang gói hàng
            // 4: Đang vận chuyển
            // 5: Đã giao hàng
            
            // handler if user login
            if (authData.authenticationData.IsAuthenticated === true) {
                $scope.order.CustomerName = $scope.user.FullName;
                $scope.order.CustomerEmail = $scope.user.Email;
                $scope.order.CustomerMobile = $scope.user.PhoneNumber;
                $scope.order.CreatedBy = $scope.user.FullName;
                $scope.order.CustomerId = $scope.user.Id;
            }
            else {
                $scope.order.CreatedBy = $scope.order.CustomerName;
                $scope.order.CustomerId = null;
            }
            cartService.checkOut($scope.order).then(result => {
                if(result){
                    cartService.deleteShoppingCart();
                    notificationService.displaySuccess("Đặt hàng thành công");
                    if(authData.authenticationData.IsAuthenticated === true){
                        $state.go("");
                    }
                    else {
                        $scope.Display = false;
                    }
                }
                else {
                    notificationService.displayError("Đặt hàng thất bại");
                }
            });
        }
        ///////////////////////////////////////////////////////////////////////////////////
        chooseProvince($scope, $q, $log, locationService, locationData);
        chooseDistrict($scope, $q, $log, locationService, locationData);
        chooseWard($scope, $q, $log, locationService, locationData);
        /////////////////////////////////////////////////////////////////////////////////////
        
        // theo dõi location Data service để lấy $scope.deliveryAddress.CustomerDeliveryAddress
        $scope.$watch(function () { return locationData.location  }, function (newVal, oldVal) {
            if(locationData.location.Province && locationData.location.District && locationData.location.Ward){
                $scope.deliveryAddress = {
                    CustomerDeliveryAddress: (locationData.location.Ward?.ward_name || "") + ", "
                        + locationData.location.District.district_name + ", " + locationData.location.Province.province_name
                };
                
            }
        }, true);
        
        // handler event click
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
        
        // theo doi xem user co dang nhap hay khong
        $scope.$watch(function () { return authData.authenticationData; }, function (newVal, oldVal) {
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