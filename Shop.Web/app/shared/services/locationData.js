(function (app){
    'use strict'
    
    app.factory('locationData', ['apiService', '$q',
        
        function (apiService, $q){
            let location = {};
            location.Province = null;
            location.District = null;
            location.Ward = null;
            
            function AddDeliveryAddress(deliveryAddress){
                let deferred = $q.defer();
                
                apiService.post(
                    'https://localhost:44353/api/delivery-address/add-delivery-address',
                    deliveryAddress,
                    function (result){
                        deferred.resolve(result.data);
                    },
                    function (error){
                        deferred.reject('add delivery failure');
                    }
                );
                
                return deferred.promise;
            }
            
            function UpdateDeliveryAddress(deliveryAddress){
                let deferred = $q.defer();
                
                apiService.put(
                    'https://localhost:44353/api/delivery-address/update-delivery-address',
                    deliveryAddress,
                    function (result){
                        deferred.resolve(result.data);
                    },
                    function (error){
                        deferred.reject('update delivery failure');
                    }
                    
                )
                
                return deferred.promise;
            }
            
            
            function GetListDeliveryAddressByUserId(userId){
                let deferred = $q.defer();
                
                let config = {
                    params: {
                        userId: userId
                    }
                }
                
                apiService.get(
                    'https://localhost:44353/api/delivery-address/get-all-by-user-id',
                    config,
                    function (result){
                        deferred.resolve(result.data);
                    },
                    function (error){
                        deferred.reject('get delivery address default by user id');
                    }
                )
                return deferred.promise;
            }
            
            function GetDeliveryAddressById(id){
                let deferred = $q.defer();
                
                let config = {
                    params: {
                        id: id
                    }
                }
                
                apiService.get(
                    'https://localhost:44353/api/delivery-address/get-by-id',
                    config,
                    function (result){
                        deferred.resolve(result.data);
                    },
                    function (error){
                        deferred.reject('get delivery address default by user id');
                    }
                )
                return deferred.promise;
            }
            
            function SetDeliveryAddressByUserId(deliveryAddress){
                let deferred = $q.defer();
                
                apiService.put(
                    'https://localhost:44353/api/delivery-address/set-delivery-address-default',
                    deliveryAddress,
                    function (result){
                        deferred.resolve(result.data);
                    },
                    function (error){
                        deferred.reject('set delivery address default by user id failure');
                    }
                )
                return deferred.promise;
            }
            
            return {
                location,
                AddDeliveryAddress,
                UpdateDeliveryAddress,
                GetListDeliveryAddressByUserId,
                GetDeliveryAddressById,
                SetDeliveryAddressByUserId
            };
        }
    ])
})(angular.module('shop.common'));

