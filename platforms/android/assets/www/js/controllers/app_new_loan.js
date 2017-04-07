
angular.module('kubeApp')



  .controller('NewLoanController', ['$scope', '$state', '$ionicPopup', '$http', 'APP', 'loadingService', 'Admin_Rubro', 'SaveData', '$ionicModal', '$translate', 'Box_Movement', '$ionicPlatform', 'countriesFactory', 'clientsService', 'CalculatorDate', 'SimulateLoan', function ($scope, $state, $ionicPopup, $http, APP, loadingService, Admin_Rubro, SaveData, $ionicModal, $translate, Box_Movement, $ionicPlatform, countriesFactory, clientsService, CalculatorDate, SimulateLoan) {
 



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


 $scope.verificationNewLoan=function(newClient,  newInfoSimulator){

      //Si es true HAY Q CREAR UN NUEVO CLIENTE
          if($scope.hacerVisible){
                $scope.submitNewClient(newClient);
          }
          // De se false llamo solo a crear Loan
          else{

              if($scope.idClienteExistente!= "" || $scope.idClienteExistente!= undefined){
                 
               }else{
                alert("no ha elegido un cliente existente del select")
               }

             
          }


     }


$scope.SubmitNewLoan=function(){

    var prepareLoan = {};
    prepareLoan.client =  $scope.newClient;


}

//Verifica si el formulario de clientes esta completo y correcto
$scope.submitNewClient=function(newClient){
        console.log(newClient);

        
        if(newClient.document==undefined || newClient.document==""){
               
                var error1 = $translate.instant('Clients.ErrorFieldDocument');
                toastr.error(error1, "ERROR");            
               
          }

          else if(newClient.name==undefined || newClient.name==""){
               
                var error2 = $translate.instant('Clients.ErrorFieldName');
                toastr.error(error2, "ERROR");            
               
          }
       
           else{              
                if(newClient.email==undefined){
               newClient.email="";            
               
               }
                if(newClient.description==undefined){
               newClient.description="";           
               
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


            //$scope.registrarNuevoCliente(newClient);
            $scope.SubmitNewLoan(newClient);
          }

      }



$scope.registrarNuevoCliente=function(newClient){

        console.log(newClient);
          var datosListos= {};  
         
     
          datosListos.address=newClient.address;
          datosListos.name=newClient.name;
          datosListos.phone_numbers=newClient.phone_numbers;
          datosListos.email=newClient.email;

          datosListos.country=$scope.select.pais;
          datosListos.department=$scope.select.dpto;
          datosListos.city=$scope.select.ciudad;

          datosListos.observation=newClient.description;
          datosListos.document=newClient.document;
          datosListos.collector_id=info.value;


          console.log(datosListos);
        

        clientsService.saveClient(datosListos)
              .success(function(response){
                      loadingService.hide();
                        if(response.status==true){
                           var alertPopup = $ionicPopup.alert({
                             title: 'OK',
                             template: '{{"Clients.SuccessRegClient" | translate}}'
                           });
                          alertPopup.then(function(res) {
                            
                       $scope.newClient = {};
                     $scope.load_clients();


                           }); 
                        }else{
                            // en caso de que el documento ya exista para otro cliente
                            if(response.val==5){
                                 var alertPopup = $ionicPopup.alert({
                                       title: 'Error',
                                       template: '{{"Clients.ErrorReg3" | translate}}'
                                     });
                            }else{
                               var alertPopup = $ionicPopup.alert({
                                 title: 'Error',
                                 template: '{{"Clients.ErrorReg1" | translate}}'
                               });
                            }

                             $scope.select.pais=$scope.select.pais+"";
                             $scope.select.dpto=$scope.select.dpto+""; // => con el fin de que al abrir el modal para meter los datos los selects se llenen.
                              $scope.select.ciudad= $scope.select.ciudad+"";

                            
                        }
                                        
                  }).error(function(err){
                  loadingService.hide();
               
                      var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Clients.ErrorReg2" | translate}}'
                           });
                          alertPopup.then(function(res) {                            
                               console.log(err);
                           });
                  
                   
              });        
      }





  $scope.calcDate = CalculatorDate;
  $scope.tablePaymentPlan= [];
  $scope.tablePaymentesHistory = [];
  $scope.stateFees = {}; 


    $scope.newLoan = {} 
     $scope.newLoan.retention = 0;
                



var loadItemsHomeSimulate =  function(){

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

            console.log(loan)
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
            $scope.openSimulatorAux();
        
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





$scope.showPaymentPlan = function(){
      

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

            if( $scope.newLoan.selectPayPeriod == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorShowPlan" | translate}}'
                           });


            }else if( $scope.newLoan.value == 0 ||  $scope.newLoan.value==undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorValue" | translate}}'
                           });


            }else if(  $scope.newLoan.interest_rate == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorInterest" | translate}}'
                           });


            }else if( $scope.newLoan.start_date == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorStartDate" | translate}}'
                           });


            }else if( $scope.newLoan.date_end == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorEndDate" | translate}}'
                           });


            }else if(  $scope.newLoan.type_paid_id == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorPayPeriod" | translate}}'
                           });


            }else if( $scope.newLoan.retention == undefined ||  $scope.newLoan.retention == ""){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorRetention" | translate}}'
                           });


            }


            // alert("Debe ingresar el valor del prestamo\nIntereses\nFrecuencía Cobro\nFecha Inicio Cobros\nFecha Finalización Préstamo\nTipo Abono\nRetención")
            return;
        }

         $scope.newLoan.stringPeriodPaid = catchPeriodPay();
        // newFolder.addInfo("objView", $scope.views.new );

        // console.log( $scope.newLoan.stringPeriodPaid );
        
     
        loadItemsHomeSimulate();
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


