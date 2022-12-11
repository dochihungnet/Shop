(function (app) {
    'use strict'

    app.factory('cartService', ['$window', 'authData', 'apiService', 'notificationService', '$q',
        function ($window, authData, apiService, notificationService, $q) {
            let self = this;
            let shoppingCart = {};
            this.loginStatus = false;
            this.userName = null;
            this.userId = null;
            

            init();
            
            return {
                shoppingCart,
                init, // func lay gia tri carts
                getAllProductShoppingCart, // func get all product shopping cart
                getTotalShoppingCart, // func get total money shopping cart
                getCountProductShoppingCart, // func get count product shopping cart
                addProductShoppingCart, // func add product shopping cart
                deleteProductShoppingCart, // func delete product shopping cart
                deleteShoppingCart, // func delete shopping cart
                updateProductShoppingCart,  // func update product shopping cart
                updateShoppingCart, // func update shopping cart
                getUserByUserName,
                deleteShoppingCartLocalStorage
            }
            
            // get all shopping cart
            function getAllProductShoppingCart(){
                return shoppingCart.carts;
            }
            // get total shopping cart
            function getTotalShoppingCart(){
                return shoppingCart.totalMoney;
            }
            
            // get count shopping cart
            function getCountProductShoppingCart(){
                return shoppingCart.carts.length;
            }
            // add product shopping cart
            function addProductShoppingCart(product, quantity){
                
                quantity = quantity || 1;
                
                let productNew = {
                    CustomerId : null,
                    ProductId: product.Id,
                    Name: product.Name,
                    Image: product.Image,
                    Quantity: quantity,
                    Price: (product.PriceAfterDiscount === null
                        || product.PriceAfterDiscount === 0) ? product.Price : product.PriceAfterDiscount
                }
                
                if(self.loginStatus){
                    productNew.CustomerId = self.userId;
                    addProductShoppingCartServer(productNew).then(result => {
                        if(result){
                            let product = shoppingCart.carts.some(spc => spc.ProductId === productNew.ProductId);
                            if(product){
                                shoppingCart.carts = shoppingCart.carts.map(spc => {
                                    if(spc.ProductId === productNew.ProductId){
                                        spc.Quantity += productNew.Quantity;
                                    }
                                    return spc;
                                })
                            }
                            else {
                                shoppingCart.carts.push(productNew);
                            }
                            
                            syncCarts();
                            calculateTotalMoneyShoppingCart();
                            notificationService.displaySuccess("Add product shopping cart success.");
                        }
                        else {
                            notificationService.displayError("Add product shopping cart failure.");
                        }
                    })
                }else {
                    let product = shoppingCart.carts.some(spc => spc.ProductId === productNew.ProductId);
                    if(product){
                        shoppingCart.carts = shoppingCart.carts.map(spc => {
                            if(spc.ProductId === productNew.ProductId){
                                spc.Quantity += productNew.Quantity;
                            }
                            return spc;
                        })
                    }
                    else {
                        shoppingCart.carts.push(productNew);
                    }
                    
                    syncCarts();
                    calculateTotalMoneyShoppingCart();
                    notificationService.displaySuccess("Add product shopping cart success.");
                }
            }
            
            // delete product shopping cart
            function deleteProductShoppingCart(productId){
                if(self.loginStatus){
                    deleteProductShoppingCartServer(self.userId, productId).then(result => {
                        if(result){
                            let index = shoppingCart.carts.findIndex(el => el.ProductId === productId);
                            shoppingCart.carts.splice(index, 1);
                            syncCarts();
                            calculateTotalMoneyShoppingCart();
                            notificationService.displaySuccess("Delete product shopping cart success.");
                        }
                        else {
                            notificationService.displayError("Delete product shopping cart failure.");
                        }
                    })
                }
                else {
                    let index = shoppingCart.carts.findIndex(el => el.ProductId === productId);
                    shoppingCart.carts.splice(index, 1);
                    syncCarts();
                    calculateTotalMoneyShoppingCart();
                    notificationService.displaySuccess("Delete product shopping cart success.");
                }
                
            }
            
            // delete shopping cart
            function deleteShoppingCart(){
                if(self.loginStatus){
                    deleteShoppingCartServer(self.userId).then(result => {
                        if(result){
                            if(result){
                                shoppingCart.carts = [];
                                syncCarts();
                                calculateTotalMoneyShoppingCart();
                                notificationService.displaySuccess("Delete shopping cart success.");
                            }
                            else {
                                notificationService.displayError("Delete shopping cart failure.");
                            }
                        }
                    })
                }
                else {
                    shoppingCart.carts = [];
                    syncCarts();
                    calculateTotalMoneyShoppingCart();
                    notificationService.displaySuccess("Delete shopping cart success.");
                }
            }
            
            // update product shopping cart / update quantity
            function updateProductShoppingCart(_shoppingCart) {
                if(self.loginStatus){
                    updateProductShoppingCartSever(_shoppingCart).then(result => {
                        if(result){
                            shoppingCart.carts = shoppingCart.carts.map(el => {
                                if(el.ProductId === _shoppingCart.ProductId){
                                    el.Quantity = _shoppingCart.Quantity;
                                }
                                return el;
                            })
                            syncCarts();
                            calculateTotalMoneyShoppingCart();
                            notificationService.displaySuccess("Update product shopping cart success.");
                        }else {
                            notificationService.displaySuccess("Update product shopping cart failure.");
                        }
                    })
                }else {
                    shoppingCart.carts = shoppingCart.carts.map(el => {
                        if(el.ProductId === _shoppingCart.ProductId){
                            el.Quantity = _shoppingCart.Quantity;
                        }
                        return el;
                    })
                    syncCarts();
                    calculateTotalMoneyShoppingCart();
                    notificationService.displaySuccess("Update product shopping cart success.");
                }
            }
            
            // update shopping cart
            function updateShoppingCart(carts){
                if(self.loginStatus){
                    updateShoppingCartServer(self.userId, carts).then(result => {
                        if(result){
                            shoppingCart.carts = carts;
                            syncCarts();
                            calculateTotalMoneyShoppingCart();
                            notificationService.displaySuccess("Update shopping cart success.");
                        }else {
                            notificationService.displayError("Update shopping cart failure.");
                        }
                    })
                }else {
                    shoppingCart.carts = carts;
                    syncCarts();
                    calculateTotalMoneyShoppingCart();
                    notificationService.displaySuccess("Update product shopping cart success.");
                }
            }
            
            // set cart
            function init(){
                let deferred = $q.defer();
                self.loginStatus = authData.authenticationData.IsAuthenticated;
                if(self.loginStatus){
                    self.userName = authData.authenticationData.userName;
                    getUserByUserName(self.userName).then((result) => {
                        if(result){
                            self.userId = result.Id;
                            getAllProductShoppingCartByCustomerIdServer(self.userId).then((result) => {
                                shoppingCart.carts = result;
                                syncCarts();
                                calculateTotalMoneyShoppingCart();
                                deferred.resolve(self.carts);
                            })
                        }else {
                            shoppingCart.carts = [];
                            syncCarts();
                            calculateTotalMoneyShoppingCart();
                            deferred.resolve(self.carts);
                        }
                    })
                }
                else {
                    getShoppingCartLocalStorage();
                    calculateTotalMoneyShoppingCart();
                    deferred.resolve(self.carts);
                }
                return deferred.promise;
            }
            
            // func calculate total money all product shopping cart
            function calculateTotalMoneyShoppingCart(){
                shoppingCart.totalMoney = 0;
                shoppingCart.carts.map(spc => {
                    shoppingCart.totalMoney += spc.Price * spc.Quantity;
                })
            }
            
            
            /////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////  HANDLER SERVER IF USER LOGIN
            /////////////////////////////////////////////////////////////////////////////////////////////////
            
            // get user by user name
            function getUserByUserName(userName){
                let deferred = $q.defer();
                let config = {
                    params: {
                        userName: userName
                    }
                }
                apiService.get(
                    'https://localhost:44353/api/user/get-user-by-user-name',
                    config,
                    function (response){
                        deferred.resolve(response.data);
                    },
                    function (error){
                        deferred.reject(error);
                    }
                )

                return deferred.promise;
                
            }
            
            // get all product shopping cart by customer id
            function  getAllProductShoppingCartByCustomerIdServer(customerId){
                let deferred = $q.defer();
                let config = {
                    params: {
                        customerId: customerId
                    }
                }
                apiService.get(
                    'https://localhost:44353/api/shopping-cart/get-all-product-by-customer-id',
                    config,
                    function (response){
                        deferred.resolve(response.data);
                    },
                    function (error){
                        deferred.reject(error);
                    }
                )
                
                return deferred.promise;
                
            }
            
            // add product shopping cart sever
            function addProductShoppingCartServer(shoppingCart){
                let deferred = $q.defer();

                apiService.post(
                    'https://localhost:44353/api/shopping-cart/add-product-shopping-cart',
                    shoppingCart,
                    function (response){
                        deferred.resolve(response.data);
                    },
                    function (error){
                        deferred.reject(error);
                    }
                )
                return deferred.promise;
            }
            
            // delete product shopping cart sever
            function deleteProductShoppingCartServer(customerId, productId){
                let deferred = $q.defer();
                let config = {
                    params: {
                        customerId: customerId,
                        productId: productId
                    }
                }
                apiService.del(
                    'https://localhost:44353/api/shopping-cart/delete-product-shopping-cart',
                    config,
                    function (response){
                        deferred.resolve(response.data);
                    },
                    function (error){
                        deferred.reject(error);
                    }
                )
                return deferred.promise;
            }
            
            // delete shopping cart
            function deleteShoppingCartServer(customerId){
                let deferred = $q.defer();
                let config = {
                    params: {
                        customerId: customerId
                    }
                }
                apiService.del(
                    'https://localhost:44353/api/shopping-cart/delete-shopping-cart',
                    config,
                    function (response){
                        deferred.resolve(response.data);
                    },
                    function (error){
                        deferred.reject(error);
                    }
                )
                return deferred.promise;
            }
            
            // update shopping cart
            function updateShoppingCartServer(customerId, carts){
                let deferred = $q.defer();
                
                apiService.put(
                    'https://localhost:44353/api/shopping-cart/update-shopping-cart',
                    carts,
                    function (response){
                        deferred.resolve(response.data);
                    },
                    function (error){
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
                
            }
            
            // update product shopping cart - update quantity
            function updateProductShoppingCartSever(shoppingCart){
                let deferred = $q.defer();

                apiService.put(
                    'https://localhost:44353/api/shopping-cart/update-quantity',
                    shoppingCart,
                    function (response){
                        deferred.resolve(response.data);
                    },
                    function (error){
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
                
                
            }

            function deleteShoppingCartLocalStorage(){
                shoppingCart.carts = [];
                syncCarts();
            }
            function syncCarts(){
                $window.localStorage.setItem('carts',JSON.stringify(shoppingCart.carts)); // sync the datalocalStorage.setItem('carts',JSON.stringify(self.carts)); // sync the data
            }
            
            function getShoppingCartLocalStorage(){
                shoppingCart.carts = JSON.parse($window.localStorage.getItem('carts') || '[]'); // get the data at 
            }

        }
    ])

})(angular.module('shop.common'));