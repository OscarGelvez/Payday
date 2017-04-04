angular.module('kubeApp')

  .controller('ClientsController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', '$translate', '$filter', 'SaveData', '$ionicModal', 'clientsService', '$ionicPlatform', function ($scope, $state, $ionicPopup, $http, APP, loadingService, $translate, $filter, SaveData, $ionicModal, clientsService, $ionicPlatform) {
 

var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         $state.go("app.home");
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);






    $scope.CurrentDate = new Date();
    $scope.newClient = {};

    $scope.countries          = new Object();
    $scope.isColombia         =false;  
    $scope.isDepartmentDefined= false;
   

     // var folderConfig = SaveData.get("config");
     // var info = folderConfig.get("idCollector");

      var info = {};
        info.value = localStorage['kubesoft.kubeApp.user_id'];
       console.log(info);




          $scope.load_clients=function(){
            var datosListos = {};
            datosListos.collector_id=info.value;
          clientsService.loadClients(datosListos)
              .success(function(response){

                    if(response.status){
                      console.log(response);                     

                      loadingService.hide(); 
                      $scope.listClients=response.data;  
                    }else{
                          var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorLoadClients1" | translate}}'
                           });
                    }
                      

                  }).error(function(err){
                  loadingService.hide();                  
                    console.log(err);    
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorLoadClients2" | translate}}'
                           });                
              });
    }
$scope.load_clients();











   
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

    $scope.loadCountries();
    


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

        
        if(newClient.document==undefined || newClient.document==""){
               
                var error1 = $translate.instant('Clients.ErrorFieldDocument');
                toastr.error(error1, "ERROR");            
               
          }

          else if(newClient.name==undefined || newClient.name==""){
               
                var error2 = $translate.instant('Clients.ErrorFieldName');
                toastr.error(error2, "ERROR");            
               
          }
          // else if(newClient.address==undefined || newClient.address==""){
               
          //       var error2 = $translate.instant('Clients.ErrorFieldAddress');
          //       toastr.error(error2, "ERROR");            
               
          // }
          // else if(newClient.phone==undefined || newClient.phone==""){
               
          //       var error2 = $translate.instant('Clients.ErrorFieldPhone');
          //       toastr.error(error2, "ERROR");            
               
          // }
         
           else{

              
                if(newClient.email==undefined){
               newClient.email="";            
               
               }
                if(newClient.description==undefined){
               newClient.description="";           
               
               }
                if($scope.select.pais==undefined){
               $scope.select.pais=null;           
               
               }else{
                      $scope.select.pais=parseInt($scope.select.pais);

               } 

               if($scope.select.dpto==undefined){            
               $scope.select.dpto=null;  

               }else{
                     $scope.select.dpto=parseInt($scope.select.dpto);

               }

               if($scope.select.ciudad==undefined){
               $scope.select.ciudad=null;           
               
               }else{
                    $scope.select.ciudad=parseInt($scope.select.ciudad);

               }


            $scope.registrarNuevoCliente(newClient);
          }

      }

      $scope.registrarNuevoCliente=function(newClient){

        console.log(newClient);
  

          var datosListos= {};
      
         
     
          datosListos.address=newClient.address;
          datosListos.name=newClient.name;
          datosListos.phone_numbers=newClient.phone;
          datosListos.email=newClient.email;

          datosListos.country=$scope.select.pais;
          datosListos.department=$scope.select.dpto;
          datosListos.city=$scope.select.ciudad;

          datosListos.observation=newClient.description;
          datosListos.document=newClient.document;
          datosListos.collector_id=info.value;


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
                            
                       $scope.newClient = {};
                     $scope.load_clients();


                           }); 
                        }else{
                             $scope.select.pais=$scope.select.pais+"";
                             $scope.select.dpto=$scope.select.dpto+""; // => con el fin de que al abrir el modal para meter los datos los selects se llenen.
                              $scope.select.ciudad= $scope.select.ciudad+"";

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


// ########################################## MODIFICAR CLIENTES   ########################################################


$scope.textBtnEditar=$translate.instant('Clients.ModalEdit');
 $scope.boolEditar=false;

   $scope.hacerVisible=function(){     
     if($scope.boolEditar){
      $scope.boolEditar=false;
      $scope.textBtnEditar=$translate.instant('Clients.ModalEdit');
     
     }else{
      $scope.boolEditar=true;
       $scope.textBtnEditar=$translate.instant('Clients.ModalBack');
     }
   }
// apertura de modal
    $ionicModal.fromTemplateUrl('templates/modals/detail-client.html', {
        scope: $scope,
        animation: 'fade-in-scale',
         backdropClickToClose: false,
          hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.modalDetailClient = modal;
      });
      
      $scope.openDetailClient = function() {
        $scope.modalDetailClient.show();


      };
      $scope.closeDetailClient = function() {
        $scope.modalDetailClient.hide();
         $scope.datosOriginal = {};
      };




$scope.openModalDetail=function(id_client){

      $scope.datosOriginal = {};
      $scope.datosEditados = {};
     

      $scope.isColombiaM         =false;  
     $scope.isDepartmentDefinedM= false;


      console.log($scope.listClients);

      for (var i = 0; i < $scope.listClients.length; i++) {

        if($scope.listClients[i].id == id_client){
            $scope.datosOriginal=clone($scope.listClients[i]);
            $scope.datosOriginal.phone_numbers=parseInt($scope.datosOriginal.phone_numbers);
            $scope.datosOriginal.document=parseInt($scope.datosOriginal.document);
            console.log($scope.datosOriginal);
        }
         
      } 

          if($scope.datosOriginal.country==45){         
                $scope.isColombiaM=true;  //Habilita Select de Departamentos
              }
          if($scope.datosOriginal.department!=undefined){          
               $scope.isDepartmentDefinedM=true; //Habilita Select de Ciudad
              }    



            $scope.datosEditados =clone($scope.datosOriginal);
            console.log($scope.datosOriginal);
             console.log($scope.datosEditados);

            $scope.openDetailClient();
            //Establece valores del select
             document.getElementById('selectCountry').value=$scope.datosEditados.country;
             document.getElementById('selectDepartment').value=$scope.datosEditados.department;
             document.getElementById('selectCity').value=$scope.datosEditados.city;

console.log($scope.datosOriginal.department);
             if(($scope.datosOriginal.city==0 || $scope.datosOriginal.city==null) && ($scope.datosOriginal.department != 0 || $scope.datosOriginal.department!=null)){
              $scope.auxCity = '?department_id='+$scope.datosOriginal.department;
              $scope.loadCities2();
              console.log("entro");
             }else{
              $scope.auxCity = "";
              $scope.loadCities2()
              
                
             
             }
             
}



$scope.submitEditClient=function(datosEditados){
// Comparaciones con los datos originales.
  var editoAlgo = false;
   var a=document.getElementById('selectCountry').value 
   var b=document.getElementById('selectDepartment').value
   var c=document.getElementById('selectCity').value



  if(datosEditados.document != $scope.datosOriginal.document){
    editoAlgo = true;
  }
  else if(datosEditados.name != $scope.datosOriginal.name){
    editoAlgo = true;
  
  }
   else if(datosEditados.address != $scope.datosOriginal.address){
    editoAlgo = true;
  
  }
   else if(datosEditados.phone_numbers != $scope.datosOriginal.phone_numbers){
    editoAlgo = true;
  
  }
   else if(datosEditados.email != $scope.datosOriginal.email){
    editoAlgo = true;
  
  }
  else if(datosEditados.observation != $scope.datosOriginal.observation){
    editoAlgo = true;
  
  }
    // Selects de Pais, Departamento y Ciudad
   
    else if(a != $scope.datosOriginal.country){
    editoAlgo = true;
  
  }
    else if(b != $scope.datosOriginal.department){

    editoAlgo = true;
  
  }
    else if(c != $scope.datosOriginal.city){
    editoAlgo = true;
  
  }

   if(editoAlgo){
    $scope.actualizarUsuario(datosEditados);
  }  
}


$scope.actualizarUsuario=function(datos){

     var datosListos ={};
     datosListos.country= document.getElementById('selectCountry').value;

     
     datosListos.department= document.getElementById('selectDepartment').value;
     datosListos.city= document.getElementById('selectCity').value;

     datosListos.name = datos.name;
     datosListos.address = datos.address;
     datosListos.phone_numbers = datos.phone_numbers;
     datosListos.email = datos.email;
     datosListos.observation = datos.observation;
     datosListos.document = datos.document;
    
     datosListos.collector_id=info.value;
     datosListos.id = datos.id;
      console.log(datosListos);

           $scope.modalDetailClient.hide();

        clientsService.updateClients(datosListos)
              .success(function(response){
                      loadingService.hide();
                        if(response.status){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"Clients.SuccessUpdateClient" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            
                        $scope.datosEditadosSelect= {};
                          $scope.load_clients();
                        $scope.auxCity=""
                        



                           }); 
                        }else{
                            
                             var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorUpdate1" | translate}}'
                           });
                        }
                                   
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorUpdate2" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
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



//CARGA LOS PAISES, DEPARTAMENTOS Y CIUDADES PARA USARLOS EN  MODIFICAR CLIENTES
$scope.loadCountries2=function(){
      loadingService.show();
      $http({
              method: 'GET',
              url: APP.BASE_URL + 'countries'
            }).then(function successCallback(response) {
                
                loadingService.hide();
                $scope.countries2=response.data;
                console.log(response);
                            
              }, function errorCallback(response) {
                loadingService.hide();
                console.log(response);
          });
   }
    
$scope.loadDepartments2=function(){
    loadingService.show();
      $http({
              method: 'GET',
              url: APP.BASE_URL + 'departments'
            }).then(function successCallback(response) {
                
                loadingService.hide();
                $scope.departments2=response.data;
                console.log(response);
                            
              }, function errorCallback(response) {
                loadingService.hide();
                console.log(response);
          });
   } 

   $scope.auxCity=""
$scope.loadCities2=function(){
    loadingService.show();
      $http({
              method: 'GET',
              url: APP.BASE_URL + 'cities'+$scope.auxCity
            }).then(function successCallback(response) {
                
                loadingService.hide();
                $scope.cities2=response.data;
                if($scope.datosOriginal!= undefined){

                         if($scope.datosOriginal.city!=0 || $scope.datosOriginal.city!=null){
                              console.log("restauro val");

                              // console.log($scope.datosOriginal.city);
                               document.getElementById('selectCity').value=$scope.datosOriginal.city;

                            }
                }
             
                console.log(response);
                            
              }, function errorCallback(response) {
                loadingService.hide();
                console.log(response);
          });
   }

   
  $scope.loadCountries2();
  $scope.loadDepartments2();
  $scope.loadCities2();
  $scope.datosEditadosSelect= {};
  


       
      $scope.$watch('datosEditadosSelect.country', function(newValue, oldValue) {
        
        console.log(newValue);
        if(newValue==45){
         
          $scope.isColombiaM=true;  //Habilita Select de Departamentos
        }else{

          if(document.getElementById('selectDepartment').value !=null){
              document.getElementById('selectDepartment').value= 0;
          } 
          if(document.getElementById('selectCity').value !=null){
            document.getElementById('selectCity').value = 0;
          }
          
          $scope.isColombiaM=false;
          $scope.isDepartmentDefinedM=false;
        }
      });

  

     $scope.$watch('datosEditadosSelect.department', function(newValue, oldValue) {
        
        console.log(newValue);
        if(newValue!=undefined){
          
         $scope.isDepartmentDefinedM=true; //Habilita Select de Ciudad
         $scope.auxCity = '?department_id='+newValue;
         $scope.loadCities2();

        }
      });
   // ##################################################ELIMINAR CLIENTES##############################################################



      $scope.submitDeleteRubro=function(){

            $scope.modalDetailClient.hide();
             var ok=$translate.instant('Clients.DeleteYes');
             var no=$translate.instant('Clients.DeleteNo');
             var title=$translate.instant('Clients.DeleteTitle');


            var confirmPopup = $ionicPopup.confirm({
                       title: ''+title,
                       template: '{{"Clients.DeleteMsg" | translate}}',
                       okText: ''+ok,
                       cancelText: ''+no
                   });

                   confirmPopup.then(function(res) {
                         if(res) {
                           $scope.deleteClient();
                         } else {
                           
                         }
                   });
           
        
      }


    $scope.deleteClient = function(){
      var datosListos = {}
      datosListos.id = $scope.datosOriginal.id;

        clientsService.deleteClients(datosListos)
              .success(function(response){                       
                        loadingService.hide();
                        if(response.status){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"Clients.SuccessDeleteClient" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            
                         $scope.editCategory = {};
                          $state.go('app.admin_categories');

                           }); 
                        }else{
                              var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorDelete1" | translate}}'
                           });
                        }                                        
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorDelete2" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
              });
    }

      





    // ################################################################################################################





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
