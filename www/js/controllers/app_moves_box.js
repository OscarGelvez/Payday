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
          $scope.contentMove.categoria=1; // indica Categoria Base del dia
          $scope.contentMove.tipo=true;
   
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
          Box_Movement.loadCategories(info.value)
              .success(function(response){
                if(response.status){
                    console.log(response);
                      loadingService.hide(); 
                      $scope.categories=response.data;  
                    }else{
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorLoadCategory1" | translate}}'
                           });
                    }
                                           
                  }).error(function(err){
                  loadingService.hide();                  
                    console.log(err); 
                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorLoadCategory2" | translate}}'
                           });                      
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
                console.log("if 1")
          }
           else if(contentMove.fecha==undefined || contentMove.fecha==""){
                var alertPopup = $ionicPopup.alert({
                   title: 'Error',
                   template: '{{"MoveBox.ErrorDate" | translate}}'
                 });
                 console.log("if 2")
          }
           else if(contentMove.categoria==undefined || contentMove.categoria==""){
                var alertPopup = $ionicPopup.alert({
                   title: 'Error',
                   template: '{{"MoveBox.ErrorCategory" | translate}}'
                 });
                 console.log("if 3")
          } else{
            $scope.registrarMovimiento(contentMove);
             console.log("else ")
          }       
    }


    $scope.registrarMovimiento=function(datos){

     
          var dataLista = {};
          if(datos.observaciones==undefined){
            datos.observaciones="";
          }
          if(datos.tipo==undefined){
            datos.tipo=false; // o falso
            dataLista.type=0;
          }else{
            dataLista.type=1
          }

          
          dataLista.description=datos.observaciones;
          dataLista.value=datos.value;
          dataLista.date=datos.fecha;
          dataLista.category=parseInt(datos.categoria);
          dataLista.collector_id=info.value;
          dataLista.base_box=datos.baseCaja;
          console.log(dataLista);
               

        Box_Movement.doMovement(dataLista)
              .success(function(response){
                       loadingService.hide();
                          var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"MoveBox.SuccessReg" | translate}}'
                           });

                           alertPopup.then(function(res) {
                          $scope.contentMove = {};
                         });               
                        
                               
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
