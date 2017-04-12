angular.module('kubeApp')

  .controller('forgot_passwordController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'AuthService', '$ionicPlatform', function ($scope, $state, $ionicPopup, $http, APP, loadingService, AuthService, $ionicPlatform) {
 

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
