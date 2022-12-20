(function (app){
    app.controller('listOrderController', listOrderController);
    
    listOrderController.$inject = ['$scope', 'apiService', '$q', 'authData', 'loginService', '$state', 'notificationService', 'locationService'];
    
    function listOrderController($scope, apiService, $q, authData, loginService, $state, notificationService, locationService){
        
        $scope.loginStatus = false;
        $scope.user = null;

        
        $scope.$watch(function () { return authData.authenticationData; }, function () {
            if(authData.authenticationData.IsAuthenticated === true){
                $scope.loginStatus = true;
                getUserByUserName(authData.authenticationData.userName).then(result => {
                    if(result){
                        $scope.user = result;
                    }
                })
            }
            else {
                $scope.loginStatus = false;
            }
        }, true);
        
        function getAllOrderByUserId(userId){
            
        }

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
       
        
    }
    
})(angular.module('shop.orders'))