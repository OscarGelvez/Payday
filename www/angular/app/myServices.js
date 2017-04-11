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
// Servicio que verifica si ya verifico la cuenta

   kubeApp.service('isVerificatedAccount', function($http, APP, loadingService){

      this.check = function (data) {
         loadingService.show();
            return $http({
                method: 'POST',
                url: APP.BASE_URL + 'collector/verify',
                data: data
            })
        };

   })


//#######################################################################################################
//#######################################################################################################
// Servicio que verifica si abrio caja para el dia actual

   kubeApp.service('isOpenBox', function($http, APP, loadingService){
      this.isOpen = function (data) {
         loadingService.show();
            return $http({
                method: 'POST',
                url: APP.BASE_URL + 'isOpenBox',
                data: data
            })
        };

   })




//#######################################################################################################
//#######################################################################################################
// Servicios de movimientos de caja


// Servicio que se encarga de registrar un movimiento
    kubeApp.service('Box_Movement', function($http, APP, loadingService){
      this.doMovement = function (data) {
            loadingService.show();
            return $http({
                method: 'POST',
                url: APP.BASE_URL + 'move',
                data: data
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


        // Servicio que se encarga de cargar las categorias cargadas por los usuarios.
         this.reloadMovesView = function (data) {
       
            loadingService.show();
            return $http({
                method: 'GET',
                url: APP.BASE_URL + 'moves',
                params: data
               
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


         this.movesByRubro = function (info) {
            loadingService.show();
            return $http({
                method: 'GET',
                url: APP.BASE_URL + 'moves',
                params: info
            })
        };

        this.doTransmitMove = function (info) {
            loadingService.show();
            return $http({
                method: 'PUT',
                url: APP.BASE_URL + 'moves/update',
                params: info
            })
        };



    })



//#######################################################################################################
//#######################################################################################################
// Servicios de CRUD de CLIENTES 


// Servicio que se encarga de registrar un cliente
    kubeApp.service('clientsService', function($http, APP, loadingService){
      this.saveClient = function (data) {
            loadingService.show();
            return $http({
                method: 'POST',
                url: APP.BASE_URL + 'customers',
                params: data
            })
        };

  // Servicio que se encarga de cargar los clientes.
         this.loadClients = function (id_collector) {
          console.log(id_collector);
            loadingService.show();
            return $http({
                method: 'GET',
                url: APP.BASE_URL + 'customers',
                params: id_collector
               
            })
        };


        // Servicio que se encarga de actualizar los clientes.
         this.updateClients = function (data) {
          console.log(data);
            loadingService.show();
            return $http({
                method: 'PUT',
                url: APP.BASE_URL + 'customers',
                params: data
               
            })
        };


        // Servicio que se encarga de eliminar los clientes.
         this.deleteClients = function (data) {
          console.log(data);
            loadingService.show();
            return $http({
                method: 'DELETE',
                url: APP.BASE_URL + 'customers',
                params: data
               
            })
        };



    })

//#######################################################################################################
//#######################################################################################################
// Servicio que permite registrar prestamos

   kubeApp.service('LoansService', function($http, APP, loadingService){
      this.doLoan = function (data) {
         loadingService.show();
            return $http({
                method: 'POST',
                url: APP.BASE_URL + 'loans',
                data: data
            })
        };

   })
   //#######################################################################################################
// Servicio que permite registrar recaudos

   kubeApp.service('PaymentsService', function($http, APP, loadingService){
      this.paymentsToday = function (data) {
         loadingService.show();
            return $http({
                method: 'GET',
                url: APP.BASE_URL + 'fees_date',
                params: data
            })
        };

          this.doPayment = function (data) {
         loadingService.show();
            return $http({
                method: 'POST',
                url: APP.BASE_URL + 'payments',
                data: data
            })
        };

   })


 //######################################################################################################
//#######################################################################################################


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