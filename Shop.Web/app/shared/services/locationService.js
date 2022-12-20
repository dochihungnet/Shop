(function (app) {
    app.factory('locationService', locationService);

    locationService.$inject = ['apiService', '$q'];

    function locationService(apiService, $q) {
        return {
            getAllProvinces,
            getAllDistrictsByProvince,
            getAllWardByDistrict
        };

        function getAllProvinces(){
            let deferred = $q.defer();

            apiService.get(
                'https://vapi.vnappmob.com/api/province',
                null,
                function (result){
                    deferred.resolve(result.data);
                },
                function (error){
                    deferred.reject('get all provinces failure.');
                }
            )

            return deferred.promise;
        }
        
        function  getAllDistrictsByProvince(province_id){
            let deferred = $q.defer();
            apiService.get(
                'https://vapi.vnappmob.com/api/province/district/' + province_id,
                null,
                function (result){
                    deferred.resolve(result.data);    
                },
                function (error){
                    deferred.reject('get all districts by province failure');
                }
            )
            return deferred.promise;
        }
        
        function getAllWardByDistrict(district_id){
            let deferred = $q.defer();
            
            apiService.get(
                'https://vapi.vnappmob.com/api/province/ward/'+ district_id,
                null,
                function (result){
                    deferred.resolve(result.data);
                },
                function (error){
                    deferred.resolve('get all ward by district failure');
                }
            )
            
            return deferred.promise;
        }

    }
})(angular.module('shop.common'));