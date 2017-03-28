angular.module('kubeApp')

  .controller('MovesBoxController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', '$translate', 'Box_Movement', 'valorCaja', '$filter', 'SaveData', function ($scope, $state, $ionicPopup, $http, APP, loadingService, $translate, Box_Movement, valorCaja, $filter, SaveData) {
 


    $scope.CurrentDate = new Date();
    $scope.contentMove = {}; 
    
    console.log(valorCaja.estado);

     var folderConfig = SaveData.get("config");
     var info = folderConfig.get("idCollector");
    console.log(info);
   

      if(!valorCaja.estado){
          //Establezco variables para abrir caja

          $scope.contentMove.baseCaja= 1; // 1 para abrir caja (True)
   
          $scope.valToggle = $translate.instant('MoveBox.TypeMovementIncomes');
          $scope.desabilitarCampos=true;
           $scope.contentMove.fecha=$filter('date')($scope.CurrentDate, "yyyy-MM-dd");
          console.log($scope.contentMove.fecha);
         
      }else{
          
          $scope.contentMove.baseCaja = 0; // Por defecto cero (Falso)
         
          $scope.desabilitarCampos=false;
         
      }

//Funcion que carga las categorias para los movimientos en el sistema
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

     $scope.$watch('contentMove.tipo', function(newValue, oldValue) {        
        console.log(newValue);
      if (newValue==undefined) {               
                    $scope.valToggle = $translate.instant('MoveBox.TypeMovementExpenses');                    
                    console.log('testToggle changed to ' + $scope.contentMove.tipo);                   
                }else{
                 
                   $scope.valToggle = $translate.instant('MoveBox.TypeMovementIncomes');       
                   console.log('testToggle changed to ' + $scope.contentMove.tipo);
            };
      });




    $scope.submitForm=function(contentMove){
        console.log(contentMove);

          if(contentMove.value==undefined || contentMove.value==""){
                var alertPopup = $ionicPopup.alert({
                   title: 'Error',
                   template: "{{'MoveBox.ErrorValue' | translate}}"
                 });
          }
           else if(contentMove.fecha==undefined || contentMove.fecha==""){
                var alertPopup = $ionicPopup.alert({
                   title: 'Error',
                   template: '{{"MoveBox.ErrorDate" | translate}}'
                 });
          }
           else if(contentMove.categoria==undefined || contentMove.categoria==""){
                var alertPopup = $ionicPopup.alert({
                   title: 'Error',
                   template: '{{"MoveBox.ErrorCategory" | translate}}'
                 });
          } else{
            $scope.registrarMovimiento(contentMove);
          }       
    }


    $scope.registrarMovimiento=function(datos){
          if(datos.tipo==undefined){
            datos.tipo=false;
          }
        Box_Movement.doMovement(datos)
              .success(function(response){
                       
                          var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"MoveBox.SuccessReg" | translate}}'
                           });

                        $scope.contentMove = {};
                        $state.go('app.home');
                        loadingService.hide();
                               
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"MoveBox.ErrorReg" | translate}}'
                           });
                    console.log(err);
                    
              });

    }

    $scope.cancelForm=function(){
     
     var ok=$translate.instant('MoveBox.CancelFormOk');
     var no=$translate.instant('MoveBox.CancelFormNot');
     var title=$translate.instant('MoveBox.CancelFormTitle');
    console.log($scope.ok)

     var confirmPopup = $ionicPopup.confirm({
         title: ''+title,
         template: '{{"MoveBox.CancelFormText" | translate}}',
         okText: ''+ok,
         cancelText: ''+no
     });

     confirmPopup.then(function(res) {
           if(res) {
              $scope.contentMove = {};
              $state.go('app.home');
           } else {
             
           }
     });
 
    }
  }])
