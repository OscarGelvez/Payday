angular.module('kubeApp')

  .controller('ClientsController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', '$translate', '$filter', 'SaveData', '$ionicModal', 'clientsService', function ($scope, $state, $ionicPopup, $http, APP, loadingService, $translate, $filter, SaveData, $ionicModal, clientsService) {
 


    $scope.CurrentDate = new Date();
    $scope.newClient = {};

    $scope.countries          = new Object();
    $scope.isColombia         =false;  
    $scope.isDepartmentDefined= false;
   

    //  var folderConfig = SaveData.get("config");
    //  var info = folderConfig.get("idCollector");
    // console.log(info);
   
   // ############## Codigo para agregar un nuevo cliente ###########################################


// apertura de modal
    $ionicModal.fromTemplateUrl('templates/modals/add-new-client.html', {
        scope: $scope,
        animation: 'fade-in-scale'
      }).then(function(modal) {
        $scope.modalNewClient = modal;
      });
      
      $scope.openFormNewClient = function() {
        $scope.modalNewClient.show();

      };
      $scope.closeModalNewClient = function() {
        $scope.modalNewClient.hide();
        $scope.newClient = {};
      };




       $scope.loadCountries=function(){
      loadingService.show();
      $http({
              method: 'GET',
              url: APP.BASE_URL + 'countries'
            }).then(function successCallback(response) {
                
                loadingService.hide();
                $scope.countries=response.data;
                console.log(response);
                            
              }, function errorCallback(response) {
                loadingService.hide();
                console.log(response);
          });
   }
    
   $scope.loadDepartments=function(){
    loadingService.show();
      $http({
              method: 'GET',
              url: APP.BASE_URL + 'departments'
            }).then(function successCallback(response) {
                
                loadingService.hide();
                $scope.departments=response.data;
                console.log(response);
                            
              }, function errorCallback(response) {
                loadingService.hide();
                console.log(response);
          });
   } 
    $scope.loadCountries();
  
  $scope.loadCities=function(){
    loadingService.show();
      $http({
              method: 'GET',
              url: APP.BASE_URL + 'cities?department_id='+$scope.select.dpto
            }).then(function successCallback(response) {
                
                loadingService.hide();
                $scope.cities=response.data;
                console.log(response);
                            
              }, function errorCallback(response) {
                loadingService.hide();
                console.log(response);
          });
   } 


     $scope.select= new Object();
    
    $scope.$watch('select.pais', function(newValue, oldValue) {
        
        console.log(newValue);
        if(newValue==45){
          $scope.loadDepartments();
          $scope.isColombia=true;  //Habilita Select de Departamentos
        }else{
          $scope.isColombia=false;
          $scope.isDepartmentDefined=false;
        }
      });


     $scope.$watch('select.dpto', function(newValue, oldValue) {
        
        console.log(newValue);
        if(newValue!=undefined){
          $scope.loadCities();
         $scope.isDepartmentDefined=true; //Habilita Select de Ciudad
        }
      });




     // ########## submit del form ###################

          $scope.submitNewClient=function(newClient){
        console.log(newClient);
        
          if(newClient.name==undefined || newClient.name==""){
               
                var error1 = $translate.instant('Clients.ErrorFieldName');
                toastr.error("ERROR", error1);            
               
          }
         
           else{
            $scope.registrarNuevoCliente(newClient);
          }

      }

      $scope.registrarNuevoCliente=function(){


    

          var datosListos= {};
          datosListos.name=datos.name;
     
          datosListos.description=datos.descripcion;
          datosListos.collector_id=datos.idCollector;


          console.log(datosListos);
          $scope.modalNewClient.hide();

        clientsService.saveClient(datosListos)
              .success(function(response){
                      loadingService.hide();
                        if(response.status){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"Clients.SuccessRegClient" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            
                         $scope.newCategory = {};
                         $scope.load_categories();

                           }); 
                        }else{
                             var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorReg1" | translate}}'
                           });
                        }
                                        
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorReg2" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
              });        
      }




   // ########################################################################################################





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
    { id: 0,
    img: "" },
    { id: 0,
    img: "2" },
    { id: 0,
    img: "3" },
    { id: 0,
    img: "" },
    { id: 0,
    img: "2" },
    { id: 0,
    img: "3" }


  ];
  }])
