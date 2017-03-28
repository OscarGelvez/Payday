angular.module('kubeApp')

  .controller('forgot_passwordController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'AuthService', function ($scope, $state, $ionicPopup, $http, APP, loadingService, AuthService) {
 

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
