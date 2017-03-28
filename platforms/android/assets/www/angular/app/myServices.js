var kubeApp = angular.module('kubeApp');

 kubeApp.service('loadingService', function($ionicLoading){
        this.show= function() {
                 $ionicLoading.show({
                     //templateUrl: '../templates/toast.html'
                     template: '<ion-spinner icon="bubbles" class="spinner"></ion-spinner>'
                }).then(function(){
                        //console.log("The loading indicator is now displayed");
                });
        }

        this.hide= function(){
                $ionicLoading.hide().then(function(){
                    console.log("The loading indicator is now hidden");
                });
        }

     })




//#######################################################################################################
//#######################################################################################################
// Servicios de movimientos de caja


// Servicio que se encarga de registrar un movimiento
    kubeApp.service('Box_Movement', function($http, APP, loadingService){
      this.doMovement = function (infoUser) {
            loadingService.show();
            return $http({
                method: 'POST',
                url: APP.BASE_URL + '',
                data: infoUser
            })
        };

  // Servicio que se encarga de cargar las categorias cargadas por los usuarios.
         this.loadCategories = function (id_collector) {
          console.log(id_collector);
            loadingService.show();
            return $http({
                method: 'GET',
                url: APP.BASE_URL + 'categories/' +id_collector
               
            })
        };



    })
//#######################################################################################################
//#######################################################################################################
// Servicios de configuraciones
     kubeApp.service('Admin_Rubro', function($http, APP, loadingService){
      this.saveRubro = function (info) {
            loadingService.show();
            return $http({
                method: 'POST',
                url: APP.BASE_URL + 'categories/add',
                data: info
            })
        };


        this.updateRubro = function (info) {
            loadingService.show();
            return $http({
                method: 'PUT',
                url: APP.BASE_URL + 'categories/update',
                data: info
            })
        };

        this.deleteRubro = function (id) {
            loadingService.show();
            return $http({
                method: 'DELETE',
                url: APP.BASE_URL + 'categories/' + id
            })
        };



    })



 


kubeApp.directive('dateFormat', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ngModelCtrl) {
      //Angular 1.3 insert a formater that force to set model to date object, otherwise throw exception.
      //Reset default angular formatters/parsers
      ngModelCtrl.$formatters.length = 0;
      ngModelCtrl.$parsers.length = 0;
    }
  };
});