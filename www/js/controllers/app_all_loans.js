
/** ############################################
 * @author Oscar Gelvez                        #
 * @email oscargelvez23@gmail.com              #
 * @version 2.0 2017                           #                                          #
################################################ 
*/
angular.module('kubeApp')

  .controller('AllLoanController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'Admin_Rubro', '$ionicModal', '$translate', '$ionicPlatform', 'countriesFactory', 'clientsService', 'LoansService', '$filter', 'valorCaja', 'CalculatorDate', 'SimulateLoan', function ($scope, $state, $ionicPopup, $http, APP, loadingService, Admin_Rubro, $ionicModal, $translate, $ionicPlatform, countriesFactory, clientsService, LoansService, $filter, valorCaja, CalculatorDate, SimulateLoan) {
 
document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady()
    {
     screen.orientation.lock('landscape');
    }  





var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         $state.go("app.home");
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);



        var info = {};
        info.value = localStorage['kubesoft.kubeApp.user_id'];
       console.log(info);

$scope.load_all_loans=function(customFecha){

            var datosListos = {};
             datosListos.collector_id=info.value;
            

              LoansService.allInfoLoans(datosListos)
              .success(function(response){
                loadingService.hide();  
                    if(response.status){
                      console.log(response);                     

                     // 
                      $scope.listAllLoans=response.contenido;      
                    
                        loadingService.hide();    
                        $scope.infoLoans = $scope.listAllLoans.prestamos.data;
                      $scope.infoClients = $scope.listAllLoans.clientes;  
                                      
                      console.log($scope.infoClients);
                      console.log($scope.infoLoans);

                      
                    }else{
                          var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: 'Error no se pueden cargar la información de los prestamos'
                           });
                    }
                      

                  }).error(function(err){
                  loadingService.hide();                  
                    console.log(err);    
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: 'Error no se pueden cargar la información de lso prestamos'
                           });                
              });
}



$scope.load_all_loans();



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
   console.log(CalculatorDate);
   $scope.tablePaymentPlan= [];
   $scope.tablePaymentPlan2= [];
   $scope.auxLoan = {};

$scope.openHistorialCuotas=function(index){
 
  $scope.auxLoan = $scope.infoLoans[index];
  console.log($scope.auxLoan)
  $scope.auxFee = {}
  

  loadItemsHomeSimulate()

}

function loadItemsHomeSimulate(){


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

                          var textPendiente = $translate.instant('MakeCollections.TextPendient');
                           var textAtrasado = $translate.instant('MakeCollections.TextAtrasado');
                            var textOk = $translate.instant('MakeCollections.TextOk');
                             $scope.textAbono = $translate.instant('MakeCollections.TextAbono');  

                          for (var i = 1; i < $scope.tablePaymentPlan.length; i++) {
                            
                            $scope.tablePaymentPlan[i].estado = ""+textPendiente;
                                                
                          };
                           var dateHoy = new Date();
                           console.log(dateHoy);
                             for (var k = 1; k < $scope.tablePaymentPlan.length; k++) {

                              var auxA = $filter('date')(dateHoy, "yyyy-MM-dd");
                              var auxB = $filter('date')($scope.tablePaymentPlan[k].date, "yyyy-MM-dd");
                            
                            if(auxB<auxA){
                               $scope.tablePaymentPlan[k].estado = ""+textAtrasado;
                              // console.log("entro")
                              //  console.log(dateHoy);
                              //   console.log($scope.tablePaymentPlan[k].date);
                            }                         
                              };
                          var pagado = $scope.auxLoan.value_paid;
                        //  var pagado = 75200; 
                        $scope.auxFee.value = arrayTable[1].paid;
                          var valCuota = arrayTable[1].paid;
                          var cantCuotas;

                          $scope.abono = 0;
                           
                             for (var j = 1; j < $scope.tablePaymentPlan.length; j++) {                        
                                    pagado=pagado-valCuota;
                                      if(pagado>=valCuota || pagado>=0){
                                        console.log(pagado);
                                        $scope.tablePaymentPlan[j].estado = ""+textOk;
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


 }])