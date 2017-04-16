/** ############################################
 * @author Oscar Gelvez                        #
 * @email oscargelvez23@gmail.com              #
 * @version 2.0 2017                           #                                          #
################################################ 
*/
angular.module('kubeApp')

  .controller('SingupController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'AuthService', '$ionicPlatform', function ($scope, $state, $ionicPopup, $http, APP, loadingService, AuthService, $ionicPlatform) {
 

 var deregisterFirst = $ionicPlatform.registerBackButtonAction(

      function() {
       var title = $translate.instant('Alerts.CloseAppTitle');
       var msg = $translate.instant('Alerts.CloseAppMsg');
       var yes = $translate.instant('Alerts.CloseAppYes');
       var no = $translate.instant('Alerts.CloseAppNo');
        $ionicPopup.confirm({
        title: ''+title,
        template: ''+msg,
        cancelText: ""+no,
         okText:""+yes,
         okType:"button-positive"
      }).then(function(res) {
        if (res) {

          ionic.Platform.exitApp();
        }
      })
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst); 



 document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady()
    {
     screen.orientation.unlock();
    }  



    
    $scope.formData           ={};
    $scope.countries          = new Object();
    $scope.isColombia         =false;  
    $scope.isDepartmentDefined= false;


    $scope.aux= new Date();
    $scope.CurrentDate = new Date(new Date().setYear($scope.aux.getFullYear()-18));


 
    $scope.submitForm=function(formData){
        console.log(formData);
      //validarClave.validar(formData.clave)
      if(formData.nombre==undefined){
            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: "{{'SingUp.errorUsername' | translate}}"
             });
      }

       else if(formData.f_nacimiento==undefined){
            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: '{{"SingUp.errorBirthday" | translate}}'
             });
      }
      else if(formData.correo==undefined){
            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: '{{"SingUp.errorEmail" | translate}}'
             });
      }
      else if(formData.clave==undefined){
            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: '{{"SingUp.errorPassword" | translate}}'
             });
      }
      else if($scope.select.pais==undefined){
            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: '{{"SingUp.errorCountry" | translate}}'
             });
      }      

      else if($scope.isColombia){
                if($scope.select.dpto==undefined){
              var alertPopup = $ionicPopup.alert({
                 title: 'Error',
                 template: '{{"SingUp.errorDepartment" | translate}}'
               });
             }   
            

             else if($scope.select.ciudad==undefined){
              var alertPopup = $ionicPopup.alert({
                 title: 'Error',
                 template: '{{"SingUp.errorCity" | translate}}'
               });
             }else{
               $scope.registrarCobrador(formData, 1); // Indica que es colombia y debe ir dpto y ciudad
             } 
                     
      }else{
        $scope.registrarCobrador(formData, 0);
      }    
             
   }


 
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
 

    $scope.registrarCobrador=function(formData, num){      
      var datosRegistro = new Object();
      if(num=1){
           datosRegistro.department=$scope.select.dpto;       
           datosRegistro.city=$scope.select.ciudad;
           
      }

              datosRegistro.username=formData.nombre;
              datosRegistro.birthday=formData.f_nacimiento;
              datosRegistro.email=formData.correo;
              datosRegistro.password=formData.clave;
              datosRegistro.country=$scope.select.pais;
              
      AuthService.singup(datosRegistro)
              .success(function(response){
                        alert("registro bien")
                          var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"SingUp.SuccessReg" | translate}}'
                           });

                        $scope.formData ={};
                          $scope.select ={};
                        loadingService.hide();
                        $state.go('login');
                              
                  }).error(function(err){
                  loadingService.hide();
                   var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"SingUp.ErrorReg" | translate}}'
                           });
                    console.log(err);
                    
              });
                
    }





$scope.iniciar= function() {

  console.log($scope.email);

    

    
  };

  }])
