/**
 * Controlador interface del servicio de Sesión "SessionService"
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('SesionController', function($scope, AuthService, SessionService, SaveData, $state, RatesHelper, $translate, $ionicPopup, $ionicPlatform) {
console.log("llego aqui a SesionController")


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



if(localStorage['kubesoft.kubeApp.user_id']){
    $state.go('app.home');
}
    $scope.credentials = {};
  
   /* function init(){
        if(!window.isLoadAngular) {
            var event = window.angularEvent;
            window.dispatchEvent(event);
        }else{
            var folderCordova = SaveData.get("cordova");
            $scope.credentials.uuid = folderCordova.get("uuid").value;
        }

        // solo para las pruebas importante eliminar esto
        //$scope.credentials.uuid = "celularnokia";
    }*/

    $scope.sesion = SessionService;

    $scope.showInfoDevice = function(model,platform,uuid,version){
        var folderCordova = SaveData.getOrCreate("cordova");
        folderCordova.addInfoOrUpdate("model",model);
        folderCordova.addInfoOrUpdate("platform",platform);
        folderCordova.addInfoOrUpdate("uuid",uuid);
        folderCordova.addInfoOrUpdate("version",version);

        $scope.credentials = {};
        $scope.credentials.uuid = uuid;
    };



    $scope.refreshRates = function () {

        if ($scope.sesion.isLoged()) {
            RatesHelper.refresh().then(function (info) {
                $scope.tpcb = (info.tpc['Bolívares'] === undefined) ? 0 : info.tpc['Bolívares'].tpc;
                $scope.tpcd = (info.tpc['Dólares'] === undefined) ? 0 : info.tpc['Dólares'].tpc;
                $scope.tpvb = (info.tpv['Bolívares'] === undefined) ? 0 : info.tpv['Bolívares'].tpv;
                $scope.tpvd = (info.tpv['Dólares'] === undefined) ? 0 : info.tpv['Dólares'].tpv;
            });
        }
    };

    $scope.isAdmin = function () {
        var isAdmin = false;
        angular.forEach($scope.sesion.roles, function (value) {
            if (value.name === "Administrador") {
                isAdmin = true;
            }
        });
        return isAdmin;
    };

    $scope.refreshRates();

    $scope.$on('newOperation', function () {
        $scope.refreshRates();
    });

    $scope.login = function () {

         if($scope.credentials.email==undefined || $scope.credentials.email==""){
            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: "{{'Login.errorEmail' | translate}}"
             });
         }
        else if($scope.credentials.password==undefined || $scope.credentials.password==""){
                    var alertPopup2 = $ionicPopup.alert({
                       title: 'Error',
                       template: '{{"Login.errorPassword" | translate}}'
                     });
              }
        else {
            $scope.credentials.password = $("#password").val();
             AuthService.login($scope.credentials)
                .success(function (data) {
                    console.log(data);
                    if(data.status==0){
                        
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',

                             template: '{{"Login.MsgErrorLoginBadPass" | translate}}'
                           });
                      
                    }else if(data.status==1){
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Login.MsgErrorLoginDisabled" | translate}}'
                           });
                       
               
                    }else if(data.status==3){
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Login.MsgErrorLoginBadPass" | translate}}'
                           });
                        
                    }else{ 
                        SessionService.create(data);
                    if(data.error != true){
                        var hello = $translate.instant('Login.LoginSuccess');
                        toastr.success(data.name, hello);
                        var configFolder = SaveData.getOrCreate("config");

                        configFolder.addInfoOrUpdate("idCollector",data.id);
                        //configFolder.addInfoOrUpdate("idCompany",data.company_id);

                        configFolder.store();
                        

                        $state.go('app.home');

                        } 
                    }
                 
                })
                .error(function (data) {
                    toastr.error(data.msg, "ERROR");
                })
                .then(function (data) {
                    //despues de la peticion haga:
                });
        }
    
    };

    $scope.logout = function () {
        AuthService.logout().
                success(function (data) {
                    SessionService.destroy();
                    $state.go('login');
                }).
                error(function () {

                });
    };

   //init();



    });
