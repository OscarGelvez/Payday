var kubeApp = angular.module('kubeApp');

kubeApp.factory('AuthService', function ($http, SessionService, APP, loadingService) {
    var authService = {};

    authService.login = function (credentials) {
    
        loadingService.show();
        return $http({
            method: 'POST',
            url: APP.BASE_URL + 'collector/login',
            data: credentials
        }).success(function(response){
         
          console.log(response)
                   loadingService.hide();
                      
          }).error(function(err){
          loadingService.hide();
         
            console.log(err);
            // An alert dialog
                    
           /*var alertPopup = $ionicPopup.alert({
             title: 'Aviso',
             template: 'No se encontraron establecimientos',
             okText: 'Entendido',
             okType: 'button-stable'
           });*/

      })
    };

      authService.singup = function (infoUser) {
        loadingService.show();
        return $http({
            method: 'POST',
            url: APP.BASE_URL + 'collector/add',
            data: infoUser
        })
    };


     authService.forgotPassword = function (infoUser) {
        
        loadingService.show();
        return $http({
            method: 'POST',
            url: APP.BASE_URL + 'collector/resetpassword',
            data: infoUser
        })
    };

    authService.logout = function () {
        return $http({
            method: 'POST',
            url: APP.BASE_URL + 'collector/logout'
        }).success(function(response){
                   loadingService.hide();
                      
          }).error(function(err){
          loadingService.hide();
            console.log(err);
            

      })
    };
    
    authService.isAuthenticated = function(){
        return !!SessionService.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {

        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(SessionService.userRole) !== -1);
    };

    return authService;
});
