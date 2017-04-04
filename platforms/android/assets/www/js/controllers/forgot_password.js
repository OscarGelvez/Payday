angular.module('kubeApp')

  .controller('forgot_passwordController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'AuthService', '$ionicPlatform', function ($scope, $state, $ionicPopup, $http, APP, loadingService, AuthService, $ionicPlatform) {
 

  var deregisterFirst = $ionicPlatform.registerBackButtonAction(

      function() {
       
        $ionicPopup.confirm({
        title: 'Cerrar Food Trucks',
        template: '¿Está seguro de cerrar la aplicación?',
        cancelText: "Volver",
         okText:"Salir",
         okType:"button-assertive"
      }).then(function(res) {
        if (res) {

          ionic.Platform.exitApp();
        }
      })
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst); 





     $scope.formRestablecer          ={};
   
      $scope.enviar=function(formRestablecer){
        console.log(formRestablecer);
     
      if(formRestablecer.correo==undefined || formRestablecer.correo==""){

            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: '{{"SingUp.errorEmail" | translate}}'
             });
      }    
        $scope.recuperarClave(formRestablecer.correo);
                 
   }


     $scope.recuperarClave=function(datos){

      var mail={};
      mail.email_collector=datos;

        console.log(mail);
         AuthService.forgotPassword(mail)
              .success(function(response){
                loadingService.hide();
                     
                        var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"ResetPassword.Success" | translate}}'
                           });
                      $scope.formRestablecer ={};
                      $state.go('login')
                        
                       
                              
                  }).error(function(err){
                  loadingService.hide();
                  var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"ResetPassword.Error" | translate}}'
                           });
                    console.log(err);
                    
              });
         }



  }])
