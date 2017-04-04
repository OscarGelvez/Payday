/**
 * Controlador padre de todos los estados de la consola de administracion
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 2.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller("HomeController", function($scope,$state, ngTableParams, queries, $modal, APP, localDatabase, FacadeServer, SaveData, MovesDao, $ionicSlideBoxDelegate, $translate, isOpenBox, $ionicPopup, valorCaja, $filter, loadingService, Box_Movement, isVerificatedAccount) {

    console.log("llego aHome");



    $scope.home = {};

//##############################INICIO PARTE MIA ######################
        var info = {};
        info.value = localStorage['kubesoft.kubeApp.user_id'];
       console.log(info);

     // var folderConfig = SaveData.get("config");
     //  var info = folderConfig.get("idCollector");
   
     //var info=60;
     $scope.CurrentDate = new Date();
     $scope.dateToday=$filter('date')($scope.CurrentDate, "yyyy-MM-dd");
  


       $scope.checkBox=function(){

           var dataLista = {};
                dataLista.date=$scope.dateToday;
                dataLista.collector_id=info.value;
                
          isOpenBox.isOpen(dataLista)
              .success(function(response){
                loadingService.hide();
                if(response.status){
                    console.log(response);
                     valorCaja.estado=true;
                      $scope.reloadCountMoves();
                    }else{
                       valorCaja.estado=false;
                       
                    }
                    $scope.isOpen =response.status;               
                  }).error(function(err){
                    loadingService.hide();
                     var sta = $translate.instant('Home.WarningStatusBox');
                     toastr.success("", sta);            
                    console.log(err); 
                      
                                         
              });
    }
  
  $scope.isOpen = valorCaja.estado;
$scope.checkBox(); 

    //################ Permite actualizar la vista con el conteo de los movimientos ###################
$scope.incomes=0;
$scope.expenses=0;
$scope.total=0;
        $scope.reloadCountMoves=function(){

               var dataLista = {};
                        dataLista.date=$scope.dateToday;
                        dataLista.collector_id=info.value;


            Box_Movement.reloadMovesView(dataLista)
              .success(function(response){
                loadingService.hide();
                if(response.status){
                    console.log(response);
                     
                      var currentMoves=response.data;
                      $scope.calculate(currentMoves);
                    }else{
                       
                       
                    }
                    $scope.isOpen =response.status;               
                  }).error(function(err){
                    loadingService.hide();
                     var sta = $translate.instant('Home.WarningStatusBox');
                     toastr.success("", sta);            
                    console.log(err); 
                      
                                         
              });
        }


        $scope.calculate=function(moves_array){

            for (var i = 0; i < moves_array.length; i++) {

                if( moves_array[i].type==1){

                    $scope.incomes+=moves_array[i].value;


                 }else if(moves_array[i].type==0){

                        $scope.expenses+=moves_array[i].value;

                         }
               
            };

            $scope.total=($scope.incomes-$scope.expenses);
            console.log($scope.incomes);
             console.log($scope.expenses);
              console.log($scope.total);

        }




$scope.windowsVerificationAccount=function(){

            var a = localStorage.getItem("kubesoft.kubeApp.authenticated");
           var codeUser = localStorage.getItem("kubesoft.kubeApp.code");

           

var title =  $translate.instant('Alerts.VerificationCodeTitle');
var msg = $translate.instant('Alerts.VerificationCodeMsg');
var yes = $translate.instant('Alerts.VerificationCodeYes');
var no = $translate.instant('Alerts.VerificationCodeNo');
            if(a==0){
                $ionicPopup.prompt({
                       title: ''+title,
                       template: ''+msg,
                    
                      
                       cancelText: ''+no,
                       okText: ''+yes
                 }).then(function(res) {
                    console.log(res);
                                               
                         $scope.activarUser(res);

                            
                     }); 
                }

                
}

    $scope.windowsVerificationAccount();

$scope.activarUser=function(res){
          var valor = {};
        valor.code=res;
        valor.collector_id=info.value;
       
         isVerificatedAccount.check(valor)
                      .success(function(response){
                         
                              loadingService.hide();
                                if(response.status){
                                   var alertPopup = $ionicPopup.alert({
                                     title: 'OK',
                                     template: '{{"Alerts.AlertVerificationSuccess" | translate}}'
                                   });
                                 
                                }else{
                                     var alertPopup = $ionicPopup.alert({
                                     title: 'Error',
                                     template: '{{"Alerts.AlertVerificationError1" | translate}}'
                                   });
                                }
                                                
                          }).error(function(err){
                          loadingService.hide();
                           var alertPopup = $ionicPopup.alert({
                                     title: 'Error',
                                     template: '{{"Alerts.AlertVerificationError1" | translate}}'
                                   });
                                  alertPopup.then(function(res) {                            
                                       console.log(err);
                                   });
                         });

}










    ///////#######################FIN PARTE MIA ##################################



 $scope.showInfoDevice = function(model,platform,uuid,version){
        alert("modelo: "+model+"\nPlataforma: "+platform+"\nUUID: "+uuid+"\nVersión: "+version);
    };

    $scope.init = function (){
        init();


        //Variables del paginador
        /*
        $scope.filtroTexto = "";
        $scope.nuevaConsulta = false;
        $scope.fechaInicio = "";
        $scope.fechaFin = "";
        $scope.type="";
        $scope.zone="";
        */

    }


       $scope.sincronize = function(){
        var select = confirm("Requiere conexión a internet para hacer esta operación," +
        "\nesta operación puede tomar algunos minutos desea continuar");

        var folderConfig = SaveData.get("config");
        if(folderConfig ==  null){
            $state.go('login');
            return;
        }
        var info = folderConfig.get("idCollector");
        console.log(info);
        var infoCompany = folderConfig.get("idCompany");
        console.log("id company "+infoCompany);
        if(info == null){
            $state.go('login');
            return;
        }

        var idCollector = info.value
       // console.log(infoCompany.value);
        if(select){
            if($scope.home.action == "push"){
               // console.log(infoCompany);
               // FacadeServer.pushData(idCollector,infoCompany.value,function(){
                FacadeServer.pushData(idCollector,function(){
                    $state.go('login');
                    SaveData.removeFolder("config");
                });
            }else if($scope.home.action == "pull"){
                //validateOpening(idCollector,infoCompany.value,function(callback){
                    validateOpening(idCollector,function(callback){
                    FacadeServer.pullData(idCollector,callback);
                });
            }
        }

    }

    /**
     * Function for datepicker operation
     *
     * @param {Event} $event : propagated event
     * @returns {void}
     */
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
        $scope.opened2 = false;
    };

    $scope.open2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened2 = true;
        $scope.opened = false;

    };

    /**
     *  Obtiene el tipo de error presente en el campo de un formulario
     *
     * @param source: El campo a evaluar
     *
     * @return String: Una cadena que contiene el mensaje de error
     */
    $scope.getError = function (form, field) {

        error = form[field].$error;
        var message = "";

        if (angular.isDefined(error)) {
            if (error.required) {
                message = "Este campo es requerido";
            } else if (error.email) {
                message = "Por favor ingrese un email válido";
            } else if (error.maxlength) {
                maxlength = angular.element("input[name='" + form[field].$name + "']").attr('ng-maxlength');
                message = "La longitud no puede ser mayor de " + maxlength;
            } else if (error.minlength) {
                minlength = angular.element("input[name='" + form[field].$name + "']").attr('ng-minlength');
                message = "La longitud no puede ser menor de " + minlength;
            } else if (error.number) {
                message = "Por favor ingrese un numero válido";
            } else if (error.passwordMatcher) {
                message = "Las contraseñas no coinciden";
            } else if (error.min || error.max) {
                min = angular.element("input[name='" + form[field].$name + "']").attr('min');
                max = angular.element("input[name='" + form[field].$name + "']").attr('max');
                message = "El número debe estar entre " + min + " y " + max;
            }

            return message;
        }
    };

    /**
     *
     * @param {form} form :El formulario que contiene el campo a evaluar
     * @param {input} field :El campo a evaluar
     * @param {String} success :El nombre de la clase CSS que se aplicará si el campo es válido
     * @param {String} error :El nombre de la clase CSS que se aplicarà si el campo es inválido
     * @returns {String} :Una cadena que contiene el nombre de la clase CSS
     */
    $scope.validate = function (form, field, success, error) {

        if (form[field].$dirty) {
            return (form[field].$invalid) ? error : success;
        } else {
            return (form[field].$invalid && form.$submitted) ? error : null;
        }
    };

    /**
     *
     *
     * @returns {String} CSS class to apply
     */
    $scope.showIcon = function (form, field) {
        return (form[field].$dirty || form.$submitted);
    };

    $scope.showError = function (form, field) {
        return ((form[field].$invalid && form[field].$dirty) || (form[field].$invalid && form[field].$pristine && form.$submitted));
    };

    /**
     * Función utilizada para crear una tabla con paginación mediante AJAX.
     * Esta función hace uso de la librerìa ng-table para su funcionamiento.
     *
     * @param url: la url de la cual se van a obtener los datos
     */
    $scope.cargarListaAjax = function (url, $data) {

        $scope.lista = new ngTableParams({
            page: 1, // show first page
            count: 10 // count per page
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {

                var $columna, $orden;
                for (key in params.sorting()) {
                    $columna = key;
                    $orden = params.sorting()[key];
                }

                $params = {
                    pagina: params.page(),
                    itemsPorPagina: params.count(),
                    columna: $columna,
                    orden: $orden,
                    filtro: $scope.filtroTexto,
                    nueva: $scope.nuevaConsulta,
                    fechaInicio: $scope.fechaInicio,
                    fechaFin: $scope.fechaFin,
                    id: $data
                };
                queries.executeRequest('GET', url, null, $params)
                        .then(function (result) {
                            params.total(result.data.count);
                            $defer.resolve(result.data.data);
                            if ($scope.nuevaConsulta) {
                                $scope.lista.page(1);
                                $scope.nuevaConsulta = false;
                            }
                        });
            }
        });
    };

    $scope.cargarListaAjaxx = function (url, $data, parametros) {

        $scope.lista = new ngTableParams({
            page: 1, // show first page
            count: 10 // count per page
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {

                var $columna, $orden;
                for (key in params.sorting()) {
                    $columna = key;
                    $orden = params.sorting()[key];
                }

                $params = {
                    pagina: params.page(),
                    itemsPorPagina: params.count(),
                    columna: $columna,
                    orden: $orden,
                    filtro: $scope.filtroTexto,
                    nueva: $scope.nuevaConsulta,
                    fechaInicio: $scope.fechaInicio,
                    fechaFin: $scope.fechaFin,
                    id: $data,
                    type: $scope.type,
                    zone: $scope.zone
                };

                angular.forEach(parametros, function (value, key) {
                    $params[key] = value;
                });

                queries.executeRequest('GET', url, null, $params)
                        .then(function (result) {
                            params.total(result.data.count);
                            $defer.resolve(result.data.data);
                            if ($scope.nuevaConsulta) {
                                $scope.lista.page(1);
                                $scope.nuevaConsulta = false;
                            }
                        });
            }
        });
    };

    /**
     * Recarga los valores de la ng-table
     */
    $scope.reloadTable = function () {
        $scope.lista.reload();
    };

    /**
     * Revisa si se han modificado los filtros de fecha o de texto para realizar una nueva consulta cuando se vayan a-
     * obtener nuevamente los datos en el servidor para el paginado
     */
    $scope.$watchCollection('[filtroTexto, fechaInicio, fechaFin]', function (newValue, oldValue) {
        $scope.nuevaConsulta = true;
    });


    /**
     * Muestra un modal en pantalla
     * Esta funciòn hace uso del modal de bootstra-ui
     *
     * @param $template: La url de la plantilla que se va a cargar en el modal
     * @param $size: El tamaño del modal (Correspondiente a los tamaños del modal de bootstrap), puede ser "lg" (grande), "sm" (pequeño) o null (mediano)
     * @param $data: Los datos que se van a mostrar en el modal (opcional)
     *
     * @return modalInstance: La instancia del modal
     */
    $scope.showModal = function ($template, $size, $data) {

        var modalInstance = $modal.open({
            templateUrl: $template,
            controller: 'ModalInstanceCtrl',
            size: $size,
            resolve: {
                item: function () {
                    return $data;
                }
            }
        });

        return modalInstance;
    };

    $scope.logoutHome = function(){
        console.log(SaveData.removeFolder("config",true));
        $state.go("login");
    };


    function init(){

        var folderConfig = SaveData.get("config",true);


        if(folderConfig == null) {
            $state.go('login');
            throw("configuración no encontrada");
            return;
        }
        localDatabase.showSchema(false).then(function(arrayTables){
            if(arrayTables.length<= 2){
                $scope.home.textButton = 'Abrir Caja';
                $scope.home.action = "pull";
            }else{
                $scope.home.textButton = 'Cerrar Caja';
                $scope.home.action = "push";
            }
        }).catch(function(error){

        });


    }

    var validateOpening = function(collectorId,companyId,callback){
        FacadeServer.validateOpening(collectorId,companyId).then(function(result){
            console.log(result);
            if(result.error){
                toastr.error(result.msg,'ERROR');
            }else{

                if(callback != null){
                    callback(function(){
                        console.log('llego al callback: '+result.transaction.total_value);
                        createMoveOpening(result.transaction.total_value);                        
                    });
                }
                
                
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    var createMoveOpening = function(value){
        console.log("llego el valor"+value);
        MovesDao.create(1,value,"Apertura de caja",null,1,1).then(function(result){
            console.log(result);
                    
        }).catch(function(error){
            console.log(error);
            $state.go('login');
        }); 
    };

    init();
});

kubeApp.filter("showCollectionDay",function(){
    return function(input,filter){
        var out = new Array();
        for(var i=0; i<input.length; i++){
            if(filter == "any"){
                out.push(input[i]);
            }else if(input[i].hasPayment == filter){
                out.push(input[i]);
            }
        }

        return out;
    };
});

kubeApp.filter("stateFee",function(){
    return function(input){
        
        switch(input){
            case 0:{
                return 'C';
            }break;
            case 1:{
                return 'P';
            }break;
            case 2:{
                return 'A';
            }
        }

    };
});

kubeApp.filter("classStateFee",function(){
    return function(input){
        
        switch(input){
            case 0:{
                return 'bg-greensea';
            }break;
            case 1:{
                return 'bg-danger';
            }break;
            case 2:{
                return 'bg-blue';
            }
        }

    };




});