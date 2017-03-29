angular.module('kubeApp')

  .controller('ClientsController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', '$translate', '$filter', 'SaveData', function ($scope, $state, $ionicPopup, $http, APP, loadingService, $translate, $filter, SaveData) {
 


    $scope.CurrentDate = new Date();
    $scope.contentMove = {}; 
   

    //  var folderConfig = SaveData.get("config");
    //  var info = folderConfig.get("idCollector");
    // console.log(info);
   





  $scope.data = {
    showDelete: false
  };
  
  $scope.edit = function(item) {
    alert('Edit Item: ' + item.id);
  };
  $scope.share = function(item) {
    alert('Share Item: ' + item.id);
  };
  

  
  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
  };
  
  $scope.items = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },

  ];
  }])
