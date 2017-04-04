angular.module('kubeApp')
  
   // Creacion de fabrica de Categorias o Rubros

    .factory('RubrosFactory', function(){
    return{
           datos:[] 
          };
        
      })


  .controller('AdminCategoriesController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'Admin_Rubro', 'SaveData', '$ionicModal', '$translate', 'Box_Movement', 'RubrosFactory', function ($scope, $state, $ionicPopup, $http, APP, loadingService, Admin_Rubro, SaveData, $ionicModal, $translate, Box_Movement, RubrosFactory) {
 
  	   //   var folderConfig = SaveData.get("config");
		    //  var info = folderConfig.get("idCollector");
		    // console.log(info);
		   var info = {};
        info.value = localStorage['kubesoft.kubeApp.user_id'];
       console.log(info);

      
 	    $scope.load_categories=function(){
          Box_Movement.loadCategories(info.value)
              .success(function(response){

                    if(response.status){
                      console.log(response);
                      RubrosFactory.datos=[];

                      loadingService.hide(); 
                      $scope.categories=response.data;  
                      RubrosFactory.datos=clone(response.data); 
                    }else{
                          var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorLoadRubros1" | translate}}'
                           });
                    }
                      

                  }).error(function(err){
                  loadingService.hide();                  
                    console.log(err);    
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorLoadRubros2" | translate}}'
                           });                
              });
    }

            //Funcion que clona el objeto 
        function clone( obj ) {
            if ( obj === null || typeof obj  !== 'object' ) {
                return obj;
            }
         
            var temp = obj.constructor();
            for ( var key in obj ) {
                temp[ key ] = clone( obj[ key ] );
            }
            
            return temp;
        }


$scope.load_categories();

// Codigo para apertura y manejo de datos del modal 


$scope.newCategory = {};
$scope.valToggle = $translate.instant('MoveBox.TypeMovementExpenses');


   $scope.$watch('newCategory.tipo', function(newname, oldname) {        
        console.log(newname);
      if (newname==undefined) {               
                    $scope.valToggle = $translate.instant('MoveBox.TypeMovementExpenses');                    
                    console.log('testToggle changed to ' + $scope.newCategory.tipo);                   
                }else{
                 
                   $scope.valToggle = $translate.instant('MoveBox.TypeMovementIncomes');       
                   console.log('testToggle changed to ' + $scope.newCategory.tipo);
            };
      });

     $ionicModal.fromTemplateUrl('templates/modals/add-category-rubro.html', {
        scope: $scope,
        animation: 'fade-in-scale'
      }).then(function(modal) {
        $scope.modaleditCategory = modal;
      });
      $scope.openModal = function() {
        $scope.modaleditCategory.show();

      };
      $scope.closeModal = function() {
        $scope.modaleditCategory.hide();
        $scope.newCategory = {};

      };
      
    


      $scope.addCategory=function(){
         $scope.openModal();
      }


      $scope.submitNewRubro=function(editCategory){
        console.log(editCategory);
        
          if(editCategory.name==undefined || editCategory.name==""){
               
                var error1 = $translate.instant('Settings.AdminRubros.ErrorName');
                toastr.error(error1, "ERROR");
               
               
          }
          
          //  else if(editCategory.descripcion==undefined || editCategory.descripcion==""){
          //        var error2 = $translate.instant('Settings.AdminRubros.ErrorDescripcion');
          //       toastr.error(error2, "ERROR");
               
          // }
           else{
            $scope.registrarNuevoRubro(editCategory);
          }

      }


       $scope.registrarNuevoRubro=function(datos){
          if(datos.tipo==undefined){
            datos.tipo=false;
          }

          if(datos.tipo){
            datos.tipo="Ingreso";
          }else{
            datos.tipo="Egreso";
          }
          datos.idCollector=info.value;

          var datosListos= {};
          datosListos.name=datos.name;
         // datosListos.type_movement=datos.tipo;
          datosListos.description=datos.descripcion;
          datosListos.collector_id=datos.idCollector;


          console.log(datosListos);
          $scope.modaleditCategory.hide();

        Admin_Rubro.saveRubro(datosListos)
              .success(function(response){
                      loadingService.hide();
                        if(response.status){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"Settings.AdminRubros.SuccessReg" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            
                         $scope.newCategory = {};
                         $scope.load_categories();

                           }); 
                        }else{
                             var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorReg1" | translate}}'
                           });
                        }
                                        
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorReg2" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
              });

    }
}])

.controller('DetailCategoryController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'Admin_Rubro', 'SaveData', '$ionicModal', '$translate', 'Box_Movement', 'RubrosFactory', '$stateParams', function ($scope, $state, $ionicPopup, $http, APP, loadingService, Admin_Rubro, SaveData, $ionicModal, $translate, Box_Movement, RubrosFactory, $stateParams) {

   $scope.datosParametros= $stateParams.category_id;
   console.log($scope.datosParametros);

   var contenido = $scope.datosParametros.split(':');
  
  $scope.nombreVista=contenido[1];
  $scope.tieneMovimientos=false;
// if(contenido[5]){
//  $scope.tieneMovimientos=true;
//
//}

 $scope.consultaMovimientosRubro=function(){
    var dataLista = {};
                dataLista.collector_id=contenido[4];
                dataLista.category_id=contenido[0];
               
                
          Admin_Rubro.movesByRubro(dataLista)
              .success(function(response){
                loadingService.hide();
                if(response.status){
                    console.log(response);
                    $scope.movesRubros=response.data;

                    console.log($scope.movesRubros);
                    console.log($scope.movesRubros.length);

                            if($scope.movesRubros!=undefined && $scope.movesRubros.length>0){
                              $scope.tieneMovimientos=true;
                              console.log("tiene movesRubros >0");
                            }


                    }
                          
                  }).error(function(err){
                    loadingService.hide();
                     var sta = $translate.instant('Settings.AdminRubros.ErrorLoadMovesRubro');
                     toastr.success("", sta);            
                    console.log(err); 
                      
                                         
              });
 }

      //Funcion que clona el objeto 
        function clone( obj ) {
            if ( obj === null || typeof obj  !== 'object' ) {
                return obj;
            }
         
            var temp = obj.constructor();
            for ( var key in obj ) {
                temp[ key ] = clone( obj[ key ] );
            }
            
            return temp;
        }
$scope.categoriesToMove=clone(RubrosFactory.datos);

 $scope.consultaMovimientosRubro();


// ##############FIN Consulta Tiene Movimientos ############################


    $scope.editCategory = {};
    $scope.auxEdit = {};

    function copiaOriginal(){
      $scope.auxEdit.nombre=contenido[1];
      $scope.auxEdit.tipo=contenido[2];
      $scope.auxEdit.descripcion=contenido[3];
    }
    copiaOriginal();

      $scope.editCategory.nombre=contenido[1];
      $scope.editCategory.tipo=contenido[2];
      $scope.editCategory.descripcion=contenido[3];



    
    $scope.valToggle = $translate.instant('MoveBox.TypeMovementExpenses');


   $scope.$watch('editCategory.tipo', function(newname, oldname) {        
        console.log(newname);
      if (newname=="Egreso" || newname== undefined) {               
                    $scope.valToggle = $translate.instant('MoveBox.TypeMovementExpenses');                    
                    console.log('testToggle changed to ' + $scope.editCategory.tipo);                   
                }else if(newname=="Ingreso" || newname==true ){
                  $scope.editCategory.tipo=true;
                   $scope.valToggle = $translate.instant('MoveBox.TypeMovementIncomes');       
                   console.log('testToggle changed to ' + $scope.editCategory.tipo);
            };
      });


   // ################ EDITAR RUBRO #######################
   // ####################### ####################### ####################### #######################

   $scope.textBtnEditar=$translate.instant('Settings.AdminRubros.btnEdit');

  $scope.boolEditar=false;

   $scope.hacerVisible=function(){     
     if($scope.boolEditar){
      $scope.boolEditar=false;
      $scope.textBtnEditar=$translate.instant('Settings.AdminRubros.btnEdit');
     
     }else{
      $scope.boolEditar=true;
       $scope.textBtnEditar=$translate.instant('Settings.AdminRubros.btnCancelEdit');
     }
   }

   $scope.submitEditRubro=function(editCategory){

    //###Compara si hubo cambios con los originales ###
    var huboCambios=false;
    if(editCategory.nombre != $scope.auxEdit.nombre){
      huboCambios=true;
    
    }if($scope.auxEdit.tipo=="Ingreso"){
      if(!editCategory.tipo){
         huboCambios=true;
      }
   }
   if($scope.auxEdit.tipo=="Egreso"){
      if(editCategory.tipo){
        huboCambios=true;
      }

   }

   if(editCategory.descripcion != $scope.auxEdit.descripcion){
      huboCambios=true;
  
   }
    $scope.updateRubro(editCategory, huboCambios);
   
}
$scope.updateRubro=function(editCategory, val){
  if(val){

          if(editCategory.tipo){
            editCategory.tipo="Ingreso";
          }else{
            editCategory.tipo="Egreso";
          }


          var datosListos= {};
          datosListos.id=contenido[0];
          datosListos.name=editCategory.nombre;
          //datosListos.type_movement=editCategory.tipo;
          datosListos.description=editCategory.descripcion;
          datosListos.collector_id=contenido[4];

          console.log(datosListos);
       
        Admin_Rubro.updateRubro(datosListos)
              .success(function(response){
                       console.log(response);
                        loadingService.hide();
                        if(response.status){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"Settings.AdminRubros.SuccessUpdate" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            $scope.hacerVisible();
                            $state.go('app.admin_categories');
                             }); 
                        }else{
                           var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorUpdateRubros1" | translate}}'
                           });
                       
                        }  
                                         
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorUpdateRubros2" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
              });
  }else{

    var alertPopup = $ionicPopup.alert({
             title: 'Error',
             template: '{{"Settings.AdminRubros.WarningNotChanges" | translate}}'
           });
    //aviso no hay cambios q guardar
  }
}

$scope.submitDeleteRubro=function(){
             var ok=$translate.instant('Settings.AdminRubros.DeleteSi');
             var no=$translate.instant('Settings.AdminRubros.DeleteNo');
             var title=$translate.instant('Settings.AdminRubros.DeleteTitle');
  if ($scope.tieneMovimientos) {           

             var confirmPopup = $ionicPopup.confirm({
                 title: ''+title,
                 template: '{{"Settings.AdminRubros.DeleteMsg" | translate}}',
                 okText: ''+ok,
                 cancelText: ''+no
             });

             confirmPopup.then(function(res) {
                   if(res) {
                     $scope.deleteRubro(0); 
                   } else {
                     
                   }
             });
  }else{

      var confirmPopup = $ionicPopup.confirm({
                 title: ''+title,
                 template: '{{"Settings.AdminRubros.DeleteMsg2" | translate}}',
                 okText: ''+ok,
                 cancelText: ''+no
             });

             confirmPopup.then(function(res) {
                   if(res) {
                     $scope.deleteRubro(1);
                   } else {
                     
                   }
             });
     
  }
}

    $scope.deleteRubro = function(val){

        Admin_Rubro.deleteRubro(parseInt(contenido[0]))
              .success(function(response){                       
                        loadingService.hide();
                        if(response.status){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"Settings.AdminRubros.SuccessDelete" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            
                         $scope.editCategory = {};
                          $state.go('app.admin_categories');

                           }); 
                        }else{
                              var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorDelete1" | translate}}'
                           });
                        }                                        
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorDelete2" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
              });
    }




   // ################ MOVER  RUBRO #######################
   // ####################### ####################### ####################### #######################

   

      $ionicModal.fromTemplateUrl('templates/modals/move-category-rubro.html', {
        scope: $scope,
        animation: 'fade-in-scale'
      }).then(function(modal) {
        $scope.modalMoveCategory = modal;
      });
      $scope.openModal = function() {
        $scope.modalMoveCategory.show();

      };
      $scope.closeModalMoves = function() {
        $scope.modalMoveCategory.hide();       

      };

      $scope.moveMoves = {};

      $scope.openModalMove=function(){
         $scope.openModal();
         console.log(RubrosFactory.datos);
         $scope.categoriesToMove=RubrosFactory.datos;
         $scope.loadInfoModal();
      }

      $scope.loadInfoModal=function(){
        $scope.cantMoves=0;
        $scope.totalMoveIncomes=0;
        $scope.totalMoveExpenses=0;

        if($scope.movesRubros!= undefined || $scope.movesRubros.length>0){

        for (var i = 0; i < $scope.movesRubros.length; i++) {
         
          if($scope.movesRubros[i].type==1){
              $scope.totalMoveIncomes+=$scope.movesRubros[i].value;
          }else if($scope.movesRubros[i].type==0){ //Pregunto asi, ps epronto mas adelante hay otros tipos
              $scope.totalMoveExpenses+=$scope.movesRubros[i].value
          }

           $scope.cantMoves++;

        };
        }
       
      }

      $scope.submitMoveRubro=function(moveMoves){

        if(moveMoves.categoria==undefined || moveMoves.categoria==""){
               
                var error1 = $translate.instant('Settings.AdminRubros.ErrorCategoryDestinity');
                toastr.error(error1, "ERROR");      
               
          }else{
            $scope.registrarTranspasoRubro(moveMoves);
          }
      }

      $scope.registrarTranspasoRubro=function(moveMoves){

        var dataLista = {};

        dataLista.id_category_current=contenido[0]
        dataLista.id_category_new=parseInt(moveMoves.categoria);
        dataLista.id_collector=contenido[4]
        $scope.closeModalMoves();

        Admin_Rubro.doTransmitMove(dataLista)
              .success(function(response){                       
                        loadingService.hide();
                        if(response.status){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"Settings.AdminRubros.SuccessRegTrasmit" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            
                         $scope.moveMoves = {};
                       }); 
                        }else{
                              var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorTransmit1" | translate}}'
                           });
                        }                                        
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Settings.AdminRubros.ErrorTransmit2" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
              });
      }
     
}])