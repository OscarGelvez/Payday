
angular.module('kubeApp')



  .controller('NewLoanController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'Admin_Rubro', 'SaveData', '$ionicModal', '$translate', 'Box_Movement', '$ionicPlatform', 'countriesFactory', 'clientsService', 'CalculatorDate', 'SimulateLoan', 'LoansService', '$filter', 'valorCaja', function ($scope, $state, $ionicPopup, $http, APP, loadingService, Admin_Rubro, SaveData, $ionicModal, $translate, Box_Movement, $ionicPlatform, countriesFactory, clientsService, CalculatorDate, SimulateLoan, LoansService, $filter, valorCaja) {
 



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


// if(!valorCaja.estado){
  
// var title = $translate.instant('Alerts.TitleAlertBoxClosed');
//     var alertPopup = $ionicPopup.alert({
//                              title: ''+title,
//                              template: '{{"Alerts.AlertBoxClosed" | translate}}'
//                            });

//                            alertPopup.then(function(res) {
//                         $state.go('app.moves_box');
//                          }); 
// }


$scope.valToggle = $translate.instant('MakeLoan.OldClient');
$scope.hacerVisible = false;



  $scope.algo = 
    { text: "Wireless", checked: true };


     $scope.$watch('algo.checked', function(newname, oldname) {        
        console.log(newname);
      if (newname==false) {               
                    $scope.valToggle = $translate.instant('MakeLoan.OldClient'); 
                    $scope.hacerVisible = false;
   
                            
                   // console.log('testToggle changed to ' + $scope.toggle.tipoCliente);                   
                }else{
                 
                   $scope.valToggle = $translate.instant('MakeLoan.NewClient');   
                   $scope.hacerVisible = true;

          
                   //console.log('testToggle changed to ' + $scope.toggle.tipoCliente);
            };
      });






// ############################################CODIGO CREACION DE NUEVO CLIENTE ############################################

  $scope.newClient = {};
  $scope.newInfoSimulator = {};

    $scope.countries          = new Object();
    $scope.isColombia         =false;  
    $scope.isDepartmentDefined= false;
   

     // var folderConfig = SaveData.get("config");
     // var info = folderConfig.get("idCollector");

      var info = {};
        info.value = localStorage['kubesoft.kubeApp.user_id'];
       console.log(info);

$scope.load_clients=function(){
            var datosListos = {};
             datosListos.collector_id=info.value;
              clientsService.loadClients(datosListos)
              .success(function(response){

                    if(response.status){
                      console.log(response);                     

                     // 
                      $scope.listClients=response.data;  
                   
                        loadingService.hide(); 
                      
                      
                    }else{
                          var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorLoadClients1" | translate}}'
                           });
                    }
                      

                  }).error(function(err){
                  loadingService.hide();                  
                    console.log(err);    
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorLoadClients2" | translate}}'
                           });                
              });
}

$scope.load_clients();


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


   $scope.loadCountries=function(){
      loadingService.show();
      $http({
              method: 'GET',
              url: APP.BASE_URL + 'countries'
            }).then(function successCallback(response) {
                
                loadingService.hide();
                $scope.countries=response.data;
                countriesFactory.datos=clone(response.data);

                console.log(response);
                            
              }, function errorCallback(response) {
                loadingService.hide();
                console.log(response);
          });
   }
    
  $scope.loadDepartments=function(){
    loadingService.show();
      $http({
              method: 'GET',
              url: APP.BASE_URL + 'departments'
            }).then(function successCallback(response) {
                
                loadingService.hide();
                $scope.departments=response.data;
                console.log(response);
                            
              }, function errorCallback(response) {
                loadingService.hide();
                console.log(response);
          });
   } 
 
  
      $scope.loadCities=function(){
        loadingService.show();
          $http({
                  method: 'GET',
                  url: APP.BASE_URL + 'cities?department_id='+$scope.select.dpto
                }).then(function successCallback(response) {
                    
                    loadingService.hide();
                    $scope.cities=response.data;
                    console.log(response);
                                
                  }, function errorCallback(response) {
                    loadingService.hide();
                    console.log(response);
              });
       }   

      $scope.select= new Object();
        
        $scope.$watch('select.pais', function(newValue, oldValue) {
            
            console.log(newValue);
            if(newValue==45){
              $scope.loadDepartments();
              $scope.isColombia=true;  //Habilita Select de Departamentos
            }else{
              $scope.isColombia=false;
              $scope.isDepartmentDefined=false;
            }
          });


         $scope.$watch('select.dpto', function(newValue, oldValue) {
            
            console.log(newValue);
            if(newValue!=undefined){
              $scope.loadCities();
             $scope.isDepartmentDefined=true; //Habilita Select de Ciudad
            }
          });
 
      if(countriesFactory.datos.length == 0){
           $scope.loadCountries();
      }else{
          $scope.countries= clone(countriesFactory.datos);
      }



     // ########## submit del form de nuevos prestamos ###################


 $scope.verificationNewLoan=function(){
console.log("Llego")
      //Si es true HAY Q CREAR UN NUEVO CLIENTE
          if($scope.hacerVisible){
            console.log("Se fue por el If")
                $scope.submitNewClient();
          }
          // De se false llamo solo a crear Loan
          else{
            console.log("Se fue por el Else");
            console.log($scope.select.idClienteExistente);

              if($scope.select.idClienteExistente!= undefined){
                 $scope.showPaymentPlan(1); // Verifica si todo esta bien en el prestamo
                
               }else{
                alert("no ha elegido un cliente existente del select")
               }

             
          }


     }

 $scope.CurrentDate = new Date();
$scope.SubmitNewLoan=function(){

    var prepareLoan = {};
    prepareLoan.loan = {};
    prepareLoan.fees = {};

    if($scope.hacerVisible){

      $scope.newClient.country = $scope.select.pais;
      $scope.newClient.department = $scope.select.dpto;
      $scope.newClient.city = $scope.select.ciudad;

      prepareLoan.client = {};


      console.log($scope.newClient);

      prepareLoan.client =  clone($scope.newClient);
      prepareLoan.idClient = -1;
    }else{
      prepareLoan.idClient=$scope.select.idClienteExistente;
    }
    var start_date=$filter('date')($scope.newLoan.start_date, "yyyy-MM-dd");
    var end_date=$filter('date')($scope.newLoan.date_end, "yyyy-MM-dd");

 console.log($scope.newLoan.start_date);


    prepareLoan.loan.date=$filter('date')($scope.CurrentDate, "yyyy-MM-dd");
    prepareLoan.loan.start_date = start_date;
    prepareLoan.loan.end_date = end_date;
    prepareLoan.loan.interest_produced = $scope.newLoan.interest_produced;
    prepareLoan.loan.pay_period = $scope.newLoan.selectPayPeriod;
    prepareLoan.loan.balance = $scope.newLoan.value;
    prepareLoan.loan.interest_rate = $scope.newLoan.interest_rate;
    prepareLoan.loan.numbers_of_fee = $scope.newLoan.numbers_of_fee;
    prepareLoan.loan.value_paid = 0;
    prepareLoan.loan.type_paid_id= $scope.newLoan.type_paid_id;
    prepareLoan.loan.collector_creater_id = info.value;
    prepareLoan.loan.retention = $scope.newLoan.retention;

    $scope.tablePaymentPlanAux = clone($scope.tablePaymentPlan);
    for (var i = 0; i < $scope.tablePaymentPlan.length; i++) {
      

        $scope.tablePaymentPlanAux[i]["date"] = $filter('date')($scope.tablePaymentPlan[i]["date"], "yyyy-MM-dd");

        prepareLoan.fees[i] = $scope.tablePaymentPlanAux[i];
    };
    
    prepareLoan.collector_id=info.value;

    console.log(prepareLoan);
LoansService
      .doLoan(prepareLoan)
              .success(function(response){
                      loadingService.hide();
                      if(!response.error){
                         if(response.loans.movimiento.status && response.loans.prestamo.status){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"MakeLoan.SuccessRegLoan" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            
                       $scope.newClient = {};
                     $scope.load_clients();
                     prepareLoan={};
                    $scope.newLoan = {} 


                           }); 
                        }
                      }
                       else{
                            // en caso de que el documento ya exista para otro cliente
                            if(response.val==5){
                                 var alertPopup = $ionicPopup.alert({
                                       title: 'Error',
                                       template: '{{"Clients.ErrorReg3" | translate}}'
                                     });
                            }else{
                               var alertPopup = $ionicPopup.alert({
                                 title: 'Error',
                                 template: '{{"MakeLoan.ErrorRegLoan" | translate}}'
                               });
                            }

                             // $scope.select.pais=$scope.select.pais+"";
                             // $scope.select.dpto=$scope.select.dpto+""; // => con el fin de que al abrir el modal para meter los datos los selects se llenen.
                             //  $scope.select.ciudad= $scope.select.ciudad+"";

                            
                        }
                                        
                  }).error(function(err){
                  loadingService.hide();
               
                      var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"MakeLoan.ErrorRegLoan" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
                  
                   
              }); 
      

}

//Verifica si el formulario de clientes esta completo y correcto
$scope.submitNewClient=function(){
     
        console.log("Llego submitNewClient")
         console.log($scope.newClient);
        
        if($scope.newClient.document==undefined || $scope.newClient.document==""){
               
                var error1 = $translate.instant('Clients.ErrorFieldDocument');
                toastr.error(error1, "ERROR");            
               
          }

          else if($scope.newClient.name==undefined || $scope.newClient.name==""){
               
                var error2 = $translate.instant('Clients.ErrorFieldName');
                toastr.error(error2, "ERROR");            
               
          }
       
           else{              
                if($scope.newClient.email==undefined){
               $scope.newClient.email="";            
               
               }
                if($scope.newClient.description==undefined){
               $scope.newClient.description="";           
               
               }
                if($scope.select.pais==undefined){
               $scope.select.pais=null;           
               
               }else{
                      $scope.select.pais=parseInt($scope.select.pais);

               } 

               if($scope.select.dpto==undefined){            
               $scope.select.dpto=null;  

               }else{
                     $scope.select.dpto=parseInt($scope.select.dpto);

               }

               if($scope.select.ciudad==undefined){
               $scope.select.ciudad=null;           
               
               }else{
                    $scope.select.ciudad=parseInt($scope.select.ciudad);

               }


            //$scope.registrarNuevoCliente($scope.newClient);
            

            $scope.showPaymentPlan(1); 
            
          }

      }



// $scope.registrarNuevoCliente=function(newClient){

//         console.log(newClient);
//           var datosListos= {};  
         
     
//           datosListos.address=newClient.address;
//           datosListos.name=newClient.name;
//           datosListos.phone_numbers=newClient.phone_numbers;
//           datosListos.email=newClient.email;

//           datosListos.country=$scope.select.pais;
//           datosListos.department=$scope.select.dpto;
//           datosListos.city=$scope.select.ciudad;

//           datosListos.observation=newClient.description;
//           datosListos.document=newClient.document;
//           datosListos.collector_id=info.value;


//           console.log(datosListos);
        

//         clientsService.saveClient(datosListos)
//               .success(function(response){
//                       loadingService.hide();
//                         if(response.status==true){
//                            var alertPopup = $ionicPopup.alert({
//                              title: 'OK',
//                              template: '{{"Clients.SuccessRegClient" | translate}}'
//                            });
//                           alertPopup.then(function(res) {
                            
//                        $scope.newClient = {};
//                      $scope.load_clients();


//                            }); 
//                         }else{
//                             // en caso de que el documento ya exista para otro cliente
//                             if(response.val==5){
//                                  var alertPopup = $ionicPopup.alert({
//                                        title: 'Error',
//                                        template: '{{"Clients.ErrorReg3" | translate}}'
//                                      });
//                             }else{
//                                var alertPopup = $ionicPopup.alert({
//                                  title: 'Error',
//                                  template: '{{"Clients.ErrorReg1" | translate}}'
//                                });
//                             }

//                              $scope.select.pais=$scope.select.pais+"";
//                              $scope.select.dpto=$scope.select.dpto+""; // => con el fin de que al abrir el modal para meter los datos los selects se llenen.
//                               $scope.select.ciudad= $scope.select.ciudad+"";

                            
//                         }
                                        
//                   }).error(function(err){
//                   loadingService.hide();
               
//                       var alertPopup = $ionicPopup.alert({
//                              title: 'Error',
//                              template: '{{"Clients.ErrorReg2" | translate}}'
//                            });
//                           alertPopup.then(function(res) {                            
//                                console.log(err);
//                            });
                  
                   
//               });        
//       }





  $scope.calcDate = CalculatorDate;
  $scope.tablePaymentPlan= [];
  $scope.tablePaymentesHistory = [];
  $scope.stateFees = {}; 


    $scope.newLoan = {} 
     $scope.newLoan.retention = 0;
                



function loadItemsHomeSimulate(val){

            var loan =  $scope.newLoan;
            var value = loan.value;
            var interest = loan.interest_rate;
            var payPeriod = loan.selectPayPeriod;
            // var startD = CalculatorDate.parseStringToDate(loan.start_date,'/','mm/dd/yyyy');
            // var endD = CalculatorDate.parseStringToDate(loan.date_end,'/','mm/dd/yyyy');

            //no hubo necesidad de parsear
            var startD = loan.start_date;
            var endD = loan.date_end;
            var typePaid = loan.type_paid_id;

            console.log(value)
            console.log(interest)
            console.log(payPeriod)
            console.log(startD)
            console.log(endD)
            console.log(typePaid)
      
            console.log(loan.stringPeriodPaid);
            var arrayDates = [];

            arrayDates = CalculatorDate.getDatesBetween(
                        startD,endD,
                        loan.stringPeriodPaid
            );
           console.log(arrayDates);
            $scope.tablePaymentPlan = [];
            var x = SimulateLoan.on(value,interest , arrayDates, typePaid).then(
                function(arrayTable){
                    $scope.tablePaymentPlan = arrayTable;
                    console.log(arrayTable);
                    $scope.newLoan.numbers_of_fee=arrayTable.length-1;

                    $scope.newLoan.interest_produced= arrayTable[0].interest;
                    console.log($scope.newLoan.numbers_of_fee);
                     console.log( $scope.newLoan.interest_produced);

                       if(val == 2){
                        $scope.openSimulatorAux();
                          }else{
                            $scope.SubmitNewLoan();
                          }
                }

            ).catch(
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
            $scope.tablePaymentPlan = x;

          
           
        
    };   

// apertura de modal de simulador de pagos
    $ionicModal.fromTemplateUrl('templates/modals/modal-show-payment-plan.html', {
        scope: $scope,
        animation: 'fade-in-scale'
      }).then(function(modal) {
        $scope.modalSimulatorPayment = modal;
      });
      
      $scope.openSimulatorAux = function() {
        $scope.modalSimulatorPayment.show();

      };
      $scope.closeSimulatorAux = function() {
        $scope.modalSimulatorPayment.hide();
        
      };





$scope.showPaymentPlan = function(val){
      
console.log("llego a showPaymentPlan")
        console.log( $scope.newLoan.selectPayPeriod)
        console.log( $scope.newLoan.value)
        console.log( $scope.newLoan.interest_rate)
        console.log( $scope.newLoan.start_date)
        console.log( $scope.newLoan.date_end)
        console.log( $scope.newLoan.type_paid_id)
        console.log( $scope.newLoan.retention)
       

        if(typeof  $scope.newLoan.selectPayPeriod != "undefined" &&  $scope.newLoan.value > 0 &&
             $scope.newLoan.interest_rate > 0 &&  $scope.newLoan.start_date &&  $scope.newLoan.date_end &&
             $scope.newLoan.type_paid_id &&  $scope.newLoan.retention >= 0){

            var accept = true;

            switch( $scope.newLoan.selectPayPeriod){
                case ',*,*,*':{
                    console.log("semana");

                    accept &= typeof  $scope.newLoan.weeklyPayment != "undefined";

                }break;
                case ',+,*':{
                    console.log("Mes");
                    accept &= typeof  $scope.newLoan.monthlyPayment != "undefined";
                }break;
                case 'c*,*,*':{
                    console.log("Dia Personalizado");
                    accept &=  $scope.newLoan.dailyPayment;
                }break;
                case '*,c*,*':{

                    console.log("mes Personalizado");
                    accept &= typeof  $scope.newLoan.monthlyPayment != "undefined";
                    accept &= typeof  $scope.newLoan.customMonthlyPayment != "undefined";
                }break;
            }

            if(!accept){
                var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorSelectPayPeriod" | translate}}'
                           });
                // alert("debe incluir la seleccion del periodo de pago");
                return;
            }
           }else{

            if( $scope.newLoan.value == 0 ||  $scope.newLoan.value==undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorValue" | translate}}'
                           });


            }else if( $scope.newLoan.retention >= $scope.newLoan.value){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorRetention2" | translate}}'
                           });


            }else if(  $scope.newLoan.interest_rate == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorInterest" | translate}}'
                           });


            }else if( $scope.newLoan.selectPayPeriod == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorShowPlan" | translate}}'
                           });


            }

            else if( $scope.newLoan.start_date == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorStartDate" | translate}}'
                           });


            }else if( $scope.newLoan.date_end == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorEndDate" | translate}}'
                           });


            }else if(  $scope.newLoan.type_paid_id == undefined || $scope.newLoan.type_paid_id == ""){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorTypeAbono" | translate}}'
                           });


            }else if( $scope.newLoan.retention == undefined ||  $scope.newLoan.retention == null){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorRetention" | translate}}'
                           });


            }
            


            // alert("Debe ingresar el valor del prestamo\nIntereses\nFrecuencía Cobro\nFecha Inicio Cobros\nFecha Finalización Préstamo\nTipo Abono\nRetención")
            return;
        }

         $scope.newLoan.stringPeriodPaid = catchPeriodPay();
         if(val == 1){
          console.log("se fue a loadItemsHomeSimulate y alla si abro SubmitNewLoan")
          loadItemsHomeSimulate(1);
          
         }else{
          console.log("se fue a mostrar el modal")
          loadItemsHomeSimulate(2);
         }
          
    };






  var catchPeriodPay = function(){
        switch ($scope.newLoan.selectPayPeriod){
            case '+,*,*':{
                return $scope.newLoan.selectPayPeriod;
            }
            case ',*,*,*' :{
                return $scope.newLoan.weeklyPayment + $scope.newLoan.selectPayPeriod;
            }
            case ',+,*' :{
                return $scope.newLoan.monthlyPayment + $scope.newLoan.selectPayPeriod;
            }
            case 'c*,*,*':{
                return $scope.newLoan.dailyPayment+($scope.newLoan.selectPayPeriod.replace('c*',''));
            }
            case '*,c*,*':{
                return $scope.newLoan.monthlyPayment+','+$scope.newLoan.customMonthlyPayment+',*';
            }
            default:{
                return null;
            }
        }
    };



           

 }])


  .controller('AllLoanController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'Admin_Rubro', '$ionicModal', '$translate', '$ionicPlatform', 'countriesFactory', 'clientsService', 'LoansService', '$filter', 'valorCaja',  function ($scope, $state, $ionicPopup, $http, APP, loadingService, Admin_Rubro, $ionicModal, $translate, $ionicPlatform, countriesFactory, clientsService, LoansService, $filter, valorCaja, unlockScreen) {
 
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
                             template: 'Error no se pueden cargar la información de lso prestamos'
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

 }])
