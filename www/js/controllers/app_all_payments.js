angular.module('kubeApp')

 .factory('recaudoSeleccionado', function(){
    return{
           datos:[] 
          };
        
      })

 .controller('paymentsDayController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', '$ionicModal', '$translate', 'Box_Movement', '$ionicPlatform', '$filter', 'valorCaja', 'PaymentsService', 'recaudoSeleccionado', function ($scope, $state, $ionicPopup, $http, APP, loadingService, $ionicModal, $translate, Box_Movement, $ionicPlatform, $filter, valorCaja, PaymentsService, recaudoSeleccionado) {
 


var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         $state.go("app.home");
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);

 document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady()
    {
     screen.orientation.unlock();
    }  



var info = {};
info.value = localStorage['kubesoft.kubeApp.user_id'];
console.log(info);


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


  $scope.algo = 
    { text: "Wireless", checked: true };


     $scope.$watch('algo.checked', function(newname, oldname) {        
        console.log(newname);
      if (newname==false) {               
                    $scope.valToggle = $translate.instant('MakeCollections.SeeAll'); 
                    $scope.hacerVisible = false;
   
                            
                   // console.log('testToggle changed to ' + $scope.toggle.tipoCliente);                   
                }else{
                 
                   $scope.valToggle = $translate.instant('MakeCollections.SeeUnpaid');   
                   $scope.hacerVisible = true;

          
                   //console.log('testToggle changed to ' + $scope.toggle.tipoCliente);
            };
      });

$scope.paymentsTodayModel = {};     

$scope.CurrentDate = new Date();
$scope.fechaHoy=$filter('date')($scope.CurrentDate, "yyyy-MM-dd");


$scope.load_payments_today=function(customFecha){

            var datosListos = {};
             datosListos.collector_id=info.value;
             datosListos.date=customFecha;

    			PaymentsService.paymentsToday(datosListos)
              .success(function(response){
              	loadingService.hide();  
                    if(response.status){
                      console.log(response);                     

                     // 
                      $scope.listPaymentsToday=response.contenido;      
                      console.log($scope.listPaymentsToday);                 
                        loadingService.hide();      
                        $scope.verificarLista();                 
                      
                    }else{
                          var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: 'Error no se pueden cargar los pagos de hoy'
                           });
                    }
                      

                  }).error(function(err){
                  loadingService.hide();                  
                    console.log(err);    
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: 'Error no se pueden cargar los pagos de hoy'
                           });                
              });
}

// funcion que valida los clientes (cuyos prestamos) se muestran en la lista
// con el fin de no mostrar cuotas para pagar en caso de q el cliente de un momento a otro pague todo
//y las cuotas queden por planificacion en el sistema
$scope.verificarLista=function(){
  for (var i = 0; i < $scope.listPaymentsToday.cliente.length; i++) {

        $scope.listPaymentsToday.cliente[i].stateLoan = 1; // Indica que el prestamo esta vigente

        if($scope.listPaymentsToday.prestamo[i].state == 0){
          $scope.listPaymentsToday.cliente[i].stateLoan = 0;
        }

  };
  
}


$scope.paymentsTodayModel.fecha=$scope.fechaHoy;
$scope.load_payments_today($scope.fechaHoy);


$scope.buscarPagosPorFecha=function(){
	$scope.paymentsTodayModel.fecha;
	console.log($scope.paymentsTodayModel.fecha)
	$scope.load_payments_today($scope.paymentsTodayModel.fecha);
}

$scope.guardarFabrica=function(index){
	

	recaudoSeleccionado.datos["prestamo"] = clone($scope.listPaymentsToday.prestamo[index]);
	recaudoSeleccionado.datos['cliente'] = clone($scope.listPaymentsToday.cliente[index])
	recaudoSeleccionado.datos['cuota'] = clone($scope.listPaymentsToday.cuotas[index])

	console.log(recaudoSeleccionado.datos);

	$state.go('app.addPayment');

}


 }])


 .controller('addPaymentController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', '$ionicModal', '$translate', 'Box_Movement', '$ionicPlatform', '$filter', 'valorCaja', 'PaymentsService', 'recaudoSeleccionado', 'CalculatorDate', 'SimulateLoan', function ($scope, $state, $ionicPopup, $http, APP, loadingService, $ionicModal, $translate, Box_Movement, $ionicPlatform, $filter, valorCaja, PaymentsService, recaudoSeleccionado, CalculatorDate, SimulateLoan) {


var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         $state.go("app.paymentsDay");
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);


    var deregister = $ionicPlatform.registerBackButtonAction(
                function () {
                    console.log("I did something")
                     $scope.closeHistoryFees();
                      $scope.closeHistoryPay();
                }, 201
        );
        //Then when this scope is destroyed, remove the function
        $scope.$on('$destroy', deregister)


var info = {};
info.value = localStorage['kubesoft.kubeApp.user_id'];
console.log(info);
//Asigno datos de fabrica a variables locales

$scope.auxLoan = recaudoSeleccionado.datos.prestamo;
$scope.auxClient = recaudoSeleccionado.datos.cliente;
$scope.auxFee = recaudoSeleccionado.datos.cuota;

if($scope.auxLoan.state == 0){
  $scope.buttonSendPay = true;
}else{
  $scope.buttonSendPay = false;
}

//Saldo calculado
$scope.saldo = ($scope.auxLoan.balance - $scope.auxLoan.value_paid);

$scope.payment = {};



 	
// apertura de modal de Historial de Pagos
    $ionicModal.fromTemplateUrl('templates/modals/payments_history.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false
      }).then(function(modal) {
        $scope.modalHistoryPayments = modal;
      });
      
      $scope.openHistoryPay = function() {
        function onDeviceReady()
                  {
                   screen.orientation.lock('landscape');
                  }  
        $scope.modalHistoryPayments.show();

      };
      $scope.closeHistoryPay = function() {
        document.addEventListener("deviceready", onDeviceReady, false);
                  function onDeviceReady()
                  {
                   screen.orientation.unlock();
                  }  
        $scope.modalHistoryPayments.hide();
        
      };


      // apertura de modal de Historial de Cuotas
    $ionicModal.fromTemplateUrl('templates/modals/fees_history.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false
        // hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.modalHistoryFees = modal;
      });
      
      $scope.openHistoryFees = function() {
        document.addEventListener("deviceready", onDeviceReady, false);
                  function onDeviceReady()
                  {
                   screen.orientation.lock('landscape');
                  }  
        $scope.modalHistoryFees.show();

      };
      $scope.closeHistoryFees = function() {
        document.addEventListener("deviceready", onDeviceReady, false);
                  function onDeviceReady()
                  {
                   screen.orientation.unlock();
                  }  
        $scope.modalHistoryFees.hide();
        
      };






  $scope.calcDate = CalculatorDate;
  $scope.tablePaymentPlan= [];
   $scope.tablePaymentPlan2= [];

$scope.openHistorialCuotas=function(){
 
	loadItemsHomeSimulate()

}

function loadItemsHomeSimulate(){

            var loan =  $scope.newLoan;
            var value = $scope.auxLoan.balance
            var interest = $scope.auxLoan.interest_rate;
            var payPeriod = $scope.auxLoan.pay_period;
            // var startD = CalculatorDate.parseStringToDate(loan.start_date,'/','mm/dd/yyyy');
            // var endD = CalculatorDate.parseStringToDate(loan.date_end,'/','mm/dd/yyyy');

                  //no hubo necesidad de parsear
      				// var b = new Date(Date.UTC(2005, 8, 12))
      					var c = Date.parse($scope.auxLoan.start_date)
      					var d = Date.parse($scope.auxLoan.end_date)                   

                  var startD = c;
                  var endD = d;
                  var typePaid = $scope.auxLoan.type_paid_id;               
                  console.log(value)
                  console.log(interest)
                  console.log(payPeriod)
                  console.log(startD)
                  console.log(endD)
                  console.log(typePaid)
          
                  var arrayDates = [];

                  arrayDates = CalculatorDate.getDatesBetween(
                              startD,endD,
                              payPeriod
                  );
                 // console.log(arrayDates);
                  $scope.tablePaymentPlan = [];
                  var x = SimulateLoan.on(value,interest , arrayDates, typePaid).then(
                      function(arrayTable){
                          $scope.tablePaymentPlan = arrayTable;
                          console.log(arrayTable);   

                          for (var i = 1; i < $scope.tablePaymentPlan.length; i++) {
                          	
                          	$scope.tablePaymentPlan[i].estado = "P";
                                               	
                          };
                           var dateHoy = new Date();
                           console.log(dateHoy);
                             for (var k = 1; k < $scope.tablePaymentPlan.length; k++) {

                              var auxA = $filter('date')(dateHoy, "yyyy-MM-dd");
                              var auxB = $filter('date')($scope.tablePaymentPlan[k].date, "yyyy-MM-dd");
                            
                            if(auxB<auxA){
                               $scope.tablePaymentPlan[k].estado = "Atrasó";
                              // console.log("entro")
                              //  console.log(dateHoy);
                              //   console.log($scope.tablePaymentPlan[k].date);
                            }                         
                              };
                          var pagado = $scope.auxLoan.value_paid;
                        //  var pagado = 75200; 
                          var valCuota = $scope.auxFee.value;
                          var cantCuotas;

                          $scope.abono = 0;
                           
                             for (var j = 1; j < $scope.tablePaymentPlan.length; j++) {                        
                                    pagado=pagado-valCuota;
                                      if(pagado>=valCuota || pagado>=0){
                                        console.log(pagado);
                                        $scope.tablePaymentPlan[j].estado = "OK";
                                      }
                                      else{                            
                                      var a = pagado+valCuota;
                                            if(a>0){
                                               $scope.tablePaymentPlan[j].estado = -1;
                                                 $scope.abono = pagado+valCuota;
                                              
                                                 $scope.abono = $filter('currency')($scope.abono, '$', 0)
                                                  console.log($scope.abono);
                                            }                            
                                        break;
                                      }           
                            }; 
                      $scope.openHistoryFees();                        
                }).catch(
                function(error){
                       var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorShowPlan" | translate}}'
                           });
                    // alert("Error al Mostrar el plan de pago");
                    console.log(error);
                }
            );
                console.log(x);
            //$scope.tablePaymentPlan = x;   
    };   


$scope.submitPayment=function(){

    if($scope.payment.valuePay == undefined || $scope.payment.valuePay == ""){
       var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"MakeCollections.ErrorFieldValuePay" | translate}}'
                           });
     }else{
         $scope.savePayment();
     }

}

 $scope.CurrentDate = new Date();
$scope.savePayment=function(){
        var datosListos= {};
      
          datosListos.collector_id = info.value;
          datosListos.loan_id = $scope.auxLoan.id;
          datosListos.value = $scope.payment.valuePay;
          datosListos.date = $filter('date')($scope.CurrentDate, "yyyy-MM-dd");

          console.log(datosListos);
      
          loadingService.show();
        PaymentsService.doPayment(datosListos)
              .success(function(response){
                      loadingService.hide();
                        console.log(response);
                        if(response.error==false){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"MakeCollections.SuccessRegPayment" | translate}}'
                           });
                          alertPopup.then(function(res) {
                                $scope.afterPayment(response.payment);
                                $scope.payment = {}

                           }); 
                        }else{
                               var alertPopup = $ionicPopup.alert({
                                 title: 'Error',
                                 template: '{{"MakeCollections.ErrorRegRecaudo" | translate}}'
                               });
                        }
                                        
                  }).error(function(err){
                  loadingService.hide();               
                      var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"MakeCollections.ErrorRegRecaudo" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
                  
                   
              }); 
      }


      $scope.afterPayment=function(response){

          var tempValuePaid = response.loanUpdate.data.data.value_paid;
          console.log(tempValuePaid);
          $scope.auxLoan.value_paid = tempValuePaid;

          if(response.checkPayComplet.data.state ==0){
                var alertPopup = $ionicPopup.alert({
                                 title: 'OK',
                                 template: '{{"MakeCollections.ErrorRegRecaudo" | translate}}'
                               });
                $scope.buttonSendPay = true;
          }
          

        
    
           $scope.saldo = ($scope.auxLoan.balance - tempValuePaid);
           $scope.loadHistoryPayments();

       }

$scope.openHistoryAux=function(){

     $scope.openHistoryPay();

}

$scope.loadHistoryPayments = function(){
    var datosListos= {};
      
     datosListos.loan_id = $scope.auxLoan.id;          

          console.log(datosListos);      
          loadingService.show();
        PaymentsService.checkHistoryPayment(datosListos)
              .success(function(response){
                      loadingService.hide();
                        console.log(response);
                        if(response.error==false){
                  
                          $scope.listHistoryPayments = response.History;
                          console.log($scope.listHistoryPayments);
                          $scope.totalValueHistory = 0;
                          for (var i = 0; i < $scope.listHistoryPayments.length; i++) {
                            $scope.totalValueHistory+=$scope.listHistoryPayments[i].value;
                          };
                          

                        }else{
                               var alertPopup = $ionicPopup.alert({
                                 title: 'Error',
                                 template: '{{"MakeCollections.ErrorRegRecaudo" | translate}}'
                               });
                        }
                                        
                  }).error(function(err){
                  loadingService.hide();               
                      var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"MakeCollections.ErrorRegRecaudo" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
                  
                   
              }); 
}

$scope.loadHistoryPayments();


			
 }])

