angular.module('kubeApp')


  .controller('AdminCategoriesController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'Box_Movement', 'SaveData', function ($scope, $state, $ionicPopup, $http, APP, loadingService, Box_Movement, SaveData) {
 
  	     var folderConfig = SaveData.get("config");
		     var info = folderConfig.get("idCollector");
		    console.log(info);
		   

 	    $scope.load_categories=function(){
          Box_Movement.loadCategories(info)
              .success(function(response){
                      console.log(response);
                      loadingService.hide(); 
                      $scope.categories=response;                         
                  }).error(function(err){
                  loadingService.hide();                  
                    console.log(err);                    
              });
    }

     $scope.load_categories();
}])