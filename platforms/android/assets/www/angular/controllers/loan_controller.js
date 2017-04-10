/**
/**
 * @author Mario Nieto
 * @email marionieto@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');


kubeApp.controller('LoanController', function ($scope,$filter ,$state,$stateParams, $q,CalculatorDate,SaveData, SimulateLoan,
                                               NeighbourhoodsDao, ClientsDao,TypePaidsDao,LoansDao,FeesDao,PaymentsDao,
                                               MovesDao,localDatabase, $ionicPlatform, $translate, $ionicPopup) {

    var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);





    $scope.calcDate = CalculatorDate;
    $scope.listAllCollectionDay = "false";

    $scope.notFind = false;
    $scope.notFindGuarantor = false;
    $scope.editableName = !$scope.notFind;
    $scope.optionsNeighbourhoods = new Array();
    $scope.optionsTimeUnities = new Array();
    $scope.new = {};
    $scope.views = {};

    $scope.days = CalculatorDate.daysWeek;
    $scope.tablePaymentPlan= [];
    $scope.tablePaymentesHistory = [];

    /**
     * Listados que se utilizaran en el sistema
     */
    $scope.lists = {};
    $scope.lists.clients = [];
    $scope.lists.chargesDay = [];

    $scope.stateFees = {}; 


    function init(){

        // try {
        //     $scope.$parent.init();
        // }catch(error){

        //     return ;
        // }

        // localDatabase.showSchema().then(function(arrayNames){
        //     if(arrayNames.length <= 2){
        //         $state.go("home");
        //         toastr.error("Debe abrir la caja antes de realizar cualquier actividad","ERROR");
        //         return;

        //     }
        // }).catch(function(error){
        //     toastr.error("No se pudo cargar la base de datos");
        // });

        // $scope.new = { showDetail : false, showDetailGuarantor: false,showDetailClassIcon: {
        //     false : 'fa fa-chevron-down',
        //     true : 'fa fa-chevron-up'
        // }};

        // $scope.new.showDetailCurrentClass = 'fa fa-chevron-down';
        var state = $state.current.name;
        switch(state){
            case 'home.newLoan':{
                $scope.views.new = { 
                    client:{ notFind : false,showDetail :false , showDetailCurrentClass : 'fa fa-chevron-down'}, 
                    guarantor:{}, 
                    loan:{}
                };
                $scope.lists.days =CalculatorDate.daysWeek;
                loadItemsHomeNewLoan();
            }break;
            case 'app.simulate':{
                $scope.views.new = {
                    loan:{} 
                };
                loadItemSimulateView();
            }break;
            case 'app.simulator':{
                $scope.views.new = {
                    loan:{} 
                };
                loadItemSimulateView();
            }break;
            case 'app.paymentPlan':{
                loadItemsHomeSimulate();
            }break;
            case 'home.asignRoutePosition':{
                $scope.views.asignRoutePosition = {};
                loadItemsHomeAsignRoute();
            }break;
            case 'home.collectionDay':{
                $scope.test = {};
                loadItemsHomeCollectionDay();
                $("#testDateInput").datepicker();
                $scope.test.dateCollectionDay = CalculatorDate.curDateString('/','mm/dd/yyyy');
            }break;
            case 'home.addPayment' : {

                $scope.views.new = { loan : { feePayment : {} } };
                loadItemsHomeAddPayment();
            }break;
            case 'home.listPaymentsLoan':{
                loadItemsHomeViewPaymentsLoan();
            }break;
            case 'home.detailLoan' : {
                loadItemsHomeViewDetailLoan();
            }break;
            case 'home.stateFeesLoan':{
                loadItemsHomeStateFees();
            }break;

        }

        $('#startDate').datepicker().on('changeDate',function(e){
            $('#startDate').datepicker('hide');
            $('#loan_duration').datepicker('setStartDate',$('#startDate').datepicker('getDate'));
        });

        $scope.updateSelectDate();
    };

    /**
     * función que permite encontrar a un cliente apartir de us docmento
     * para la creación de un nuevo y cargar sus datos en la vista
     * @returns {void}
     */
    $scope.findClient = function(indexScope){
        $scope.views.new.client.name = '';
        ClientsDao.findByDocument($scope.views.new[indexScope].document).then(function(client){
            if(client  !== null){
                $scope.views.new[indexScope] = client;
                $scope.views.new[indexScope].notFind = false;
                $scope.views.new[indexScope].showDetail = false;
                $scope.views.new[indexScope].showDetailCurrentClass = 'fa fa-chevron-down';
               
            }else{
                clearFields(indexScope);
                $scope.views.new[indexScope].notFind = true;
            }
        }).catch(function(error){
            console.log(error);
        });
    };
    

    /**
     * función que permite ocultar o mostrar los detalles de la información del cliente del prestamo
     */
    $scope.showDetail = function(indexScope){
        
        var flag = !$scope.views.new[indexScope].showDetail;
        $scope.views.new[indexScope].showDetail = flag;
        $scope.views.new[indexScope].showDetailCurrentClass = $scope.new.showDetailClassIcon[flag];

    }

    /**
     * función que permite ocultar o mostrar los detalles de la información del fiador del prestamo
     */
    $scope.showDetailGuarantor = function(){
        var flag = !$scope.new.showDetailGuarantor;
        $scope.new.showDetailGuarantor = flag;
        $scope.new.showDetailCurrentClass = $scope.new.showDetailClassIcon[flag];
    }

    /**
     * función que permite crear un prestamo
     */
$scope.createLoan =  function(){
        if($scope.views.new.loan.start_date == $scope.views.new.loan.date_end){
            alert("No se puede definir el rango de fechas para el prestamo");
            return;
        }

        var formatPeriodPay = catchPeriodPay();
        $scope.views.new.loan.pay_period_text = formatPeriodPay;
        var arrayDates;

        try{
            arrayDates = CalculatorDate.getDatesBetween(
                CalculatorDate.parseStringToDate($scope.views.new.loan.start_date,'/','mm/dd/yyyy'),
                CalculatorDate.parseStringToDate($scope.views.new.loan.date_end,'/','mm/dd/yyyy'),
                formatPeriodPay
            );
        }catch(e){
            alert("No se puede definir el rango de fechas para el prestamo");
            return;
        }

        if(arrayDates.length == 0){
            alert("No se puede definir el rango de fechas para el prestamo");
            return;
        }

        
        if(typeof $scope.views.new.client.id == "undefined" || $scope.views.new.client.id === "" || $scope.views.new.client.id === "error"){
            saveClientNew().then(function(id, result){
                $scope.views.new.client.id = id;
                var idNewClient = $scope.views.new.client.id;


                saveLoan(arrayDates).then(function(result){

                    var idLoanNew = result.insertId;
                    if(result.insertId > 0){
                        alert("se ha creado el prestamo correctamente");
                        var arrayFees = createFees(
                            $scope.views.new.loan.type_paid_id,
                            $scope.views.new.loan.value,
                            $scope.views.new.loan.interest_rate,
                            result.insertId,
                            arrayDates
                        );

                        console.log("EL NÚMERO DE CUOTAS CREADAS FUE: "+arrayFees.length);
                        FeesDao.saveAll(arrayFees).then(function(arrayResponse, arrayError){
                            arrayResponse = arrayResponse || new Array();
                            arrayError = arrayError || new Array();
                            alert("se crearon "+arrayResponse.length+" cuotas");
                            if(arrayError.length > 0){
                                alert("se presentaron "+arrayError.length+" errores ");
                            }
                            storeGuarantor(idLoanNew,id);

                            $state.go("home.asignRoutePosition");
                            var folder = SaveData.getOrCreate("client.id.new");
                            folder.addInfoOrUpdate("id",idNewClient);



                        }).catch(function(error){
                            alert("NO se pudo realizar el registro de las cuotas");
                        });



                    }else{
                        alert("Error al registrar el prestamo")
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }).catch(function(error){
                console.log(error);
            });
        }else{            
            saveLoan(arrayDates).then(function(result){
                var idLoanNew = result.insertId;
                var arrayFees = createFees(
                    $scope.views.new.loan.type_paid_id,
                    $scope.views.new.loan.value,
                    $scope.views.new.loan.interest_rate,
                    result.insertId,
                    arrayDates
                );

                $state.go("home.asignRoutePosition");
                var folder = SaveData.getOrCreate("client.id.new");
                folder.addInfoOrUpdate("id",$scope.views.new.client.id);
                alert("se ha creado el prestamo correctamente");

                FeesDao.saveAll(arrayFees).then(function(arrayResponse, arrayError){
                    arrayResponse = arrayResponse || new Array();
                    arrayError = arrayError || new Array();

                    alert("se crearon "+arrayResponse.length+" cuotas");
                    if(arrayError.length > 0){
                        alert("se presentaron "+arrayError.length+" errores ");
                    }
                    storeGuarantor(idLoanNew,$scope.views.new.client.id);
                }).catch(function(error){
                    alert("NO se pudo realizar el registro de las cuotas");
                    console.log(error.message);
                });
            }).catch(function(error){
                console.log(error);
            });
        }

    };

    /**
     * función que se encarga de capturar los datos para mostrar el plan de pago
     * crear el plan de pago de y hacer la navegación  a la vista indicada
     */
    $scope.showPaymentPlan = function(){
        var newFolder;
        if(SaveData.get("loan.new") != null){
            newFolder = SaveData.get("loan.new");
            newFolder.deleteContent();
        }else{
            newFolder = SaveData.addFolder("loan.new");
        }

        var navigationFolder = SaveData.getOrCreate("navigation");
        navigationFolder.addInfoOrUpdate("back",$state.current.name);

        console.log($scope.views.new.loan.selectPayPeriod)
        console.log($scope.views.new.loan.value)
        console.log($scope.views.new.loan.interest_rate)
        console.log($scope.views.new.loan.start_date)
        console.log($scope.views.new.loan.date_end)
        console.log($scope.views.new.loan.type_paid_id)
        console.log($scope.views.new.loan.retention)
       

        if(typeof $scope.views.new.loan.selectPayPeriod != "undefined" && $scope.views.new.loan.value > 0 &&
            $scope.views.new.loan.interest_rate > 0 && $scope.views.new.loan.start_date && $scope.views.new.loan.date_end &&
            $scope.views.new.loan.type_paid_id && $scope.views.new.loan.retention >= 0){

            var accept = true;

            switch($scope.views.new.loan.selectPayPeriod){
                case ',*,*,*':{
                    console.log("semana");

                    accept &= typeof $scope.views.new.loan.weeklyPayment != "undefined";

                }break;
                case ',+,*':{
                    console.log("Mes");
                    accept &= typeof $scope.views.new.loan.monthlyPayment != "undefined";
                }break;
                case 'c*,*,*':{
                    console.log("Dia Personalizado");
                    accept &= $scope.views.new.loan.dailyPayment;
                }break;
                case '*,c*,*':{

                    console.log("mes Personalizado");
                    accept &= typeof $scope.views.new.loan.monthlyPayment != "undefined";
                    accept &= typeof $scope.views.new.loan.customMonthlyPayment != "undefined";
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

            if($scope.views.new.loan.selectPayPeriod == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorShowPlan" | translate}}'
                           });


            }else if($scope.views.new.loan.value == 0 || $scope.views.new.loan.value==undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorValue" | translate}}'
                           });


            }else if( $scope.views.new.loan.interest_rate == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorInterest" | translate}}'
                           });


            }else if($scope.views.new.loan.start_date == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorStartDate" | translate}}'
                           });


            }else if($scope.views.new.loan.date_end == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorEndDate" | translate}}'
                           });


            }else if( $scope.views.new.loan.type_paid_id == undefined){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorPayPeriod" | translate}}'
                           });


            }else if($scope.views.new.loan.retention == undefined || $scope.views.new.loan.retention == ""){

                    var alertPopup = $ionicPopup.alert({
                             title: 'Error',
                             template: '{{"Simulator.ErrorRetention" | translate}}'
                           });


            }


            // alert("Debe ingresar el valor del prestamo\nIntereses\nFrecuencía Cobro\nFecha Inicio Cobros\nFecha Finalización Préstamo\nTipo Abono\nRetención")
            return;
        }

        $scope.views.new.loan.stringPeriodPaid = catchPeriodPay();
        newFolder.addInfo("objView", $scope.views.new );

        console.log($scope.views.new.loan.stringPeriodPaid );
        /*
        if(typeof $scope.views.new.client != "undefined"){
            newFolder.addInfo("objClient",$scope.views.new.client);
            
        }

        if(typeof $scope.views.new.guarantor != "undefined"){
            newFolder.addInfo("objGuarantor",$scope.views.new.guarantor);
            
        }

        newFolder.addInfo("objLoan",$scope.views.new.loan);
        */
        $state.go("app.paymentPlan");
    };

    /**
     * función que permite regresar a la vista desde la cual se llego a la vista de mostrar plan de pago
     */
    $scope.goBackSimulate = function(){

        var url = "";
        var folder = SaveData.get("navigation");
        if(folder === null){
            url = "home.newLoan";
        }else{
            var data = folder.get("back");
            if(data === null){
                url ="home.newLoan"
            }else{
                url = data.value;
            }
        }
        $state.go(url);
    };

    $scope.catchPositionRoute = function(evt){
        var stringId = evt.target.id;
        var vectorId = stringId.split('_');
        var pos = vectorId[0];

        var folder = SaveData.get("client.id.new");
        var idNewClient = folder.get("id").value;
        //console.log([pos,idNewClient]);
        catchPositionRoute(pos, idNewClient);
    };

    $scope.navigateAddPayment = function(evt){
        var id = (evt.target.id).split('_')[0];
        FeesDao.get(id).then(function(obj,result){
            console.log(result);
            if(obj !== null) {
                var folder = SaveData.getOrCreate("objects");

                obj.dateTest = CalculatorDate.reorganizeStringDate(
                    $scope.test.dateCollectionDay,
                    'mm/dd/yyyy',
                    'yyyy-mm-dd',
                    '/',
                    '-'
                );

                console.log(obj);
                folder.addInfoOrUpdate("objFeeAddPayment",obj);
                $state.go("home.addPayment");
            }else{
                console.log(result);
                alert("No se pudo cargar el info de la cuota");
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    $scope.copyValuePayment = function(){
        if(typeof $scope.views.collectionDay.infoLoan !== "undefined"){
            if(typeof $scope.views.collectionDay.infoLoan.value !== "undefined"){
                if(String($scope.views.collectionDay.infoLoan.value).search(/\+/) != -1){
                    var values = $scope.views.collectionDay.infoLoan.value.split("+");
                    var result = parseInt(values[0])+parseInt(values[1]);
                    $scope.views.collectionDay.infoLoan.payment = result;
                }else{
                    $scope.views.collectionDay.infoLoan.payment = $scope.views.collectionDay.infoLoan.value;
                }
            }
        }
    };

    $scope.createPayment = function(){
        savePayment();
    };

    var loadItemsHomeStateFees = function(){
        
        LoansDao.getStateFees($stateParams.loan_id).then(function(arrayFees){
            $scope.lists.fees = arrayFees;
            //console.log($scope.lists.fees);
        }).catch(function(error){
            $state.go("home");
            console.log(error);
        });
    };

    var loadItemsHomeNewLoan = function(){
        NeighbourhoodsDao.all().then(function(rows){

            $scope.optionsNeighbourhoods = rows;
            $scope.views.new.client.neighbourhood_id = {selected : '0'};
            $scope.views.new.loan.retention = 0;
            TypePaidsDao.all().then(function(rows){
                if(rows !== null){
                    $scope.typesPaid = rows;
                    $scope.views.new.loan.type_paid_id = {selected : '0'};
                    loadPreviousDataSimulate();
                }else{

                }
            }).catch(function(error){
                console.log(error);
            });
        }).catch(function(error){
            console.log(error);
        });
    };

    $scope.updateSelectDate = function(){
        
        /*
        var date = CalculatorDate.curDate();
        var stringIncrement = catchPeriodPay();
        
        if(stringIncrement == null){
            stringIncrement = '+,*,*';
        }
        
        date = CalculatorDate.nextDate(date,stringIncrement);
        if(stringIncrement.split(",").length == 4){
        //    date = CalculatorDate.yesterday(date);
        }
        */

        $('#startDate').datepicker(
        //    'setStartDate',
        //    date            
        );

        $('#startDate').datepicker('update','');

        $('#loan_duration').datepicker().on('changeDate',function(e){
            $('#loan_duration').datepicker('hide');
        });
    };

    var loadItemsHomeSimulate =  function(){

        var data = SaveData.get("loan.new")
        console.log(data);
        if(data == null){
            $state.go('home.newLoan');
            return;
        }

        if(data.find("objView")){

            var view = data.get("objView").value;
            console.log(view);
            var loan = view.loan;
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

            console.log(view)
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
        }
    };

    var loadItemSimulateView= function(){
        $scope.views.new.loan.retention = 0;
        TypePaidsDao.all().then(function(rows){
            if(rows !== null){
                $scope.typesPaid = rows;
                $scope.views.new.loan.type_paid_id = {selected : '0'};
                loadPreviousDataSimulate();
            }else{

                   } 
                    

            
        }).catch(function(error){
            var name1 = $translate.instant('Simulator.OptionTypePayment.PaymentA');
            var description1 = $translate.instant('Simulator.OptionTypePayment.DescriptionA');

            var name2 = $translate.instant('Simulator.OptionTypePayment.PaymentB');
            var description2 = $translate.instant('Simulator.OptionTypePayment.DescriptionB');


            console.log("entro"+name1)
        var rows= [

                           {
                            "id" : "1",
                            "name":""+name1,
                            "description":""+description1
                            },
                            
                        
                         {
                          "id": "2",
                            "name":""+name2,
                            "description":""+description2  
                         }

                    ]
                     
                        
                    
                    $scope.typesPaid = rows
                    console.log($scope.typesPaid); 
            console.log(error);
        });

    };

    var loadItemsHomeAsignRoute = function(){
        var folderIdClient = SaveData.get("client.id.new");
        if(folderIdClient == null){
            $state.go("home");
            return;
        }

        var id = folderIdClient.get("id");
        if(id == null){
            $state.go("home");
            return;
        }


        listClientsPosition([id.value]);
    };

    var loadItemsHomeCollectionDay = function(){

        FeesDao.dayListReceivable().then(function(arrayResponse){
            $scope.lists.chargesDay = arrayResponse;
        }).catch(function(error){
            console.log(error)
        });
    };

    var loadItemsHomeAddPayment = function(){
        $scope.views.collectionDay = { infoLoan: { loan : {} } }
        
        var folder = SaveData.get("objects");
        if(false){
            $state.go("home");
        }else{
            var obj = folder.get("objFeeAddPayment").value;
            $scope.views.collectionDay.infoLoan.value = obj.feeValue;
            if(obj.dbt > 0){
                $scope.views.collectionDay.infoLoan.value += ' + '+obj.dbt;
            }else{
                $scope.views.collectionDay.infoLoan.value = (obj.feeValue + obj.dbt)>0 ? obj.feeValue + obj.dbt : '';
            }
            $scope.views.collectionDay.infoLoan.id = obj.feeId;
            $scope.views.collectionDay.infoLoan.loan.id = obj.loanId;
            $scope.views.collectionDay.infoLoan.typePaid2 = obj.typePaid;
            $scope.views.collectionDay.infoLoan.name = obj.customerName;
            $scope.views.collectionDay.infoLoan.document = obj.customerDocument;
            $scope.views.collectionDay.infoLoan.valueLoaned = obj.valueLoaned;
            $scope.views.collectionDay.infoLoan.valueInterest = obj.valueInterest;
            $scope.views.collectionDay.infoLoan.totalValue = parseInt(obj.valueLoaned)+parseInt(obj.valueInterest);
            $scope.views.collectionDay.infoLoan.balance = obj.balance;


            //SaveData.removeFolder("objects");
        }
    };

    var loadItemsHomeViewPaymentsLoan = function(){
        var folder = SaveData.get("objects");
        if(folder == null){

            $state.go("home");
        }else{

            var obj = folder.get("objFeeAddPayment").value;
                PaymentsDao.allByLoanId(obj.loanId).then(function(arrayResponse,result){
                $scope.lists.payments = arrayResponse;
                console.log($scope.lists.payments);

            }).catch(function(errro){
                console.log(error);
            });
        }
    };

    var loadItemsHomeViewDetailLoan = function(){

        var folder = SaveData.get("objects");
        if(folder == null){
            $state.go("home");
        }else{

            var obj = folder.get("objFeeAddPayment").value;



            LoansDao.detail(obj.loanId).then(function(obj,result){
                console.log(obj);
                if(obj == null){
                    $state.go("home")
                }else{
                    $scope.views.detail ={ loan : {} };
                    $scope.views.detail.loan.lastPaidValue = obj.lastPaymentValue;
                    $scope.views.detail.loan.lastPaidDate = (obj.lastPaymentDate == null) ? '' :(obj.lastPaymentDate).substring(0,10);
                    $scope.views.detail.loan.balance = obj.balance;
                    $scope.views.detail.loan.numberFeesPaid = obj.feesPaid;
                    $scope.views.detail.loan.numberFees = obj.numbersFee;
                    $scope.views.detail.loan.dateEnd = (obj.dateEnd == null) ? '' :  (obj.dateEnd).substring(0,10);
                    $scope.views.detail.loan.dateCreated = (obj.dateCreated == null) ? '' :  (obj.dateCreated).substring(0,10);
                    $scope.views.detail.loan.dateStarted = (obj.dateStart == null) ? '' :  (obj.dateStart).substring(0,10);
                    $scope.views.detail.loan.interest = obj.interest+"%";
                }
            }).catch(function(error){
                console.log(error);
            });

        }
    };

    var loadPreviousDataSimulate = function(){

        var folder = SaveData.get("loan.new");
        if(folder !== null) {

            /*

            var infoClient = folder.get("objClient");
            $scope.views.new.client = (infoClient != null) ? infoClient.value : {};
          
            var infoGuarantor = folder.get("objGuarantor");
            $scope.views.new.guarantor = (infoGuarantor != null) ? infoGuarantor.value : {};


            var infoLoan = folder.get("objLoan");
            $scope.views.new.loan = (infoLoan != null )? infoLoan.value : {};
            */
            var view = folder.get("objView");
            $scope.views.new = (view !=  null) ? view.value : 
                { client:{  notFind : false,
                            showDetail :false, 
                            showDetailCurrentClass : 'fa fa-chevron-down'
                    }, 
                    guarantor:{}, 
                    loan:{} 
                };


            SaveData.removeFolder("loan.new");
        }
    };

    var saveLoan = function(arrayDates){
        var defered = $q.defer();
        var promise = defered.promise;

        LoansDao.create(
            $scope.views.new.client.id,
            CalculatorDate.reorganizeStringDate($scope.views.new.loan.start_date,'mm/dd/yyyy','yyyy-mm-dd','/','-'),
            CalculatorDate.reorganizeStringDate($scope.views.new.loan.date_end,'mm/dd/yyyy','yyyy-mm-dd','/','-'),
            $scope.views.new.loan.pay_period_text,
            $scope.views.new.loan.interest_rate,
            $scope.views.new.loan.value,
            $scope.views.new.loan.type_paid_id,
            $scope.views.new.loan.retention,
            0,
            arrayDates.length
        ).then(function(result){
                MovesDao.create(2,
                    parseInt($scope.views.new.loan.value) - parseInt((typeof $scope.views.new.loan.retention == "undefined" ? 0 : $scope.views.new.loan.retention)),
                    "PRESTAMO REALIZADO",result.insertId,1
                ).then(function(result){
                        console.log(result);
                    }).catch(function(error){
                        console.log(error);
                    });
                defered.resolve(result);
            }).catch(function(error){
                defered.reject(error);
            });
        return promise;
    };

    var saveClientNew = function(){
        var defered = $q.defer();
        var promise = defered.promise;
        //document, name, address, phone_numbers, email, neighbourhood_id
        var barrio_id = $scope.views.new.client.neighbourhood_id;

        if($scope.views.new.client.neighbourhood_id !== '-1'){
            ClientsDao.create($scope.views.new.client.document,
                $scope.views.new.client.name,
                $scope.views.new.client.address,
                $scope.views.new.client.phone_numbers,
                $scope.views.new.client.email,
                barrio_id
            ).then(function(result){
                if(typeof result.insertId !== "undefined" && result.insertId > 0){
                    $scope.views.new.client.id = result.insertId;
                    console.log($scope.views.new.client.id);
                    defered.resolve( result.insertId , result );
                }
                defered.resolve( null , result);
            }).catch(function(error){
                $scope.views.new.client.id = 'error';
                defered.reject(error);
            });
        }
        return promise;
    };

    var saveNewGuarantor = function(){
        var defered = $q.defer();
        var promise = defered.promise;
        //document, name, address, phone_numbers, email, neighbourhood_id
        var barrio_id = $scope.views.new.guarantor.neighbourhood_id;

        if($scope.views.new.guarantor.neighbourhood_id !== '-1'){
            ClientsDao.create($scope.views.new.guarantor.document,
                $scope.views.new.guarantor.name,
                $scope.views.new.guarantor.address,
                $scope.views.new.guarantor.phone_numbers,
                $scope.views.new.guarantor.email,
                barrio_id
            ).then(function(result){
                    if(typeof result.insertId !== "undefined" && result.insertId > 0){
                        $scope.views.new.client.id = result.insertId;
                        console.log($scope.views.new.client.id);
                        defered.resolve( result.insertId , result );
                    }
                    defered.resolve( null , result);
                }).catch(function(error){
                    $scope.views.new.client.id = 'error';
                    defered.reject(error);
                });
        }
        return promise;
    };

    var storeGuarantor = function(loanId,clientId){
        if($scope.views.new.loan.guarantorCheck){
            if(typeof $scope.views.new.guarantor.id == "undefined" || 
                $scope.views.new.guarantor.id === "" || 
                $scope.views.new.guarantor.id === "error"){

                saveNewGuarantor().then(function(id, result){
                    LoansDao.update(["guarantor_id"],[id],"id = "+loanId).then(function(result){
                        console.log(result);
                    }).catch(function(error){
                        console.log(error)
                    });
                }).catch(function(error){
                    console.log(error);
                });

            }else{
                if(clientId !== $scope.views.new.guarantor.id){
                    LoansDao.update(["guarantor_id"],[$scope.views.new.guarantor.id],'id = '+loanId).then(function(result){
                        console.log(result);
                    }).catch(function(error){
                        console.log(error);
                    });
                }else{
                    alert("NO se asigno el fiador, un cliente no puede ser su mismo fiador")
                }
            }
        }
    };

    $scope.testList = function(){
        console.log($scope.lists.clients);
        var date = CalculatorDate.reorganizeStringDate($scope.test.dateCollectionDay,'mm/dd/yyyy','yyyy-mm-dd','/','-')
        FeesDao.dayListReceivable(date).then(function(arrayResponse){
            $scope.lists.chargesDay = arrayResponse;
        }).catch(function(error){
            console.log(error)
        });
    };

    var listClientsPosition =function(idClientNew){
        ClientsDao.listAllExcept(idClientNew,"my_client = 1 ORDER BY route_position ASC").then(function(arrayClients,result){
            
            $scope.lists.clients = arrayClients;

        }).catch(function(error){
            alert("se presento un problema al cargar los clientes");
        });

    };

    var catchPeriodPay = function(){
        switch ($scope.views.new.loan.selectPayPeriod){
            case '+,*,*':{
                return $scope.views.new.loan.selectPayPeriod;
            }
            case ',*,*,*' :{
                return $scope.views.new.loan.weeklyPayment + $scope.views.new.loan.selectPayPeriod;
            }
            case ',+,*' :{
                return $scope.views.new.loan.monthlyPayment + $scope.views.new.loan.selectPayPeriod;
            }
            case 'c*,*,*':{
                return $scope.views.new.loan.dailyPayment+($scope.views.new.loan.selectPayPeriod.replace('c*',''));
            }
            case '*,c*,*':{
                return $scope.views.new.loan.monthlyPayment+','+$scope.views.new.loan.customMonthlyPayment+',*';
            }
            default:{
                return null;
            }
        }
    };

    var catchPositionRoute = function(id,idNewClient){
        var position = parseInt(id);
        var copy = $scope.lists.clients;

        if(copy == null || copy.length == 0){
            ClientsDao.updatePositionBatch([
                {
                    id : idNewClient,
                    routePosition : 0
                }
            ]).then(function(rowsAffected){
                if(rowsAffected > 0){
                    alert("Se asigno la posición "+position+" en la ruta número: ");
                    $state.go("home");
                }else{
                    alert("No se logro asignar la posición en la ruta");
                }
            }).catch(function(error){
                console.log(error);
            })
        }else{
            var arrayObjects = new Array();
            var findElement = false;

            for(var i = 0; i < copy.length; i++) {
                var current = copy[i];

                //console.log('id('+id+') == i('+i+') : '+(id==i));
                
                if(id == i){
                    //console.log("encontro el id: "+i);
                    findElement = true;

                    arrayObjects.push({
                        id : idNewClient,
                        routePosition : parseInt(id)
                    });
                }
                //console.log(findElement);
                
                if(findElement == true){
                    arrayObjects.push({
                        id : current.id,
                        routePosition : i+1
                    });
                }else{
                    arrayObjects.push({
                        id : current.id,
                        routePosition : i
                    });
                }                
            };

            if(!findElement){
                arrayObjects.push({
                    id : idNewClient,
                    routePosition : copy.length
                });
            }

            ClientsDao.updatePositionBatch(arrayObjects).then(function(rowsAffected){
                if(rowsAffected > 0){
                    alert("Se asigno la posición en la ruta: "+id);
                    $state.go("home");
                }else{
                    alert("NO se pudo asignar la posición en la ruta");
                }

            }).catch(function(error){
                console.log(error);
                alert("NO se pudo asignar la posición en la ruta");
            });
            
        }
        
    };

    var clearFields = function(indexScope){
        var c_document = $scope.views.new[indexScope].document;
        $scope.views.new[indexScope] = {};
        $scope.views.new[indexScope].document = c_document;
        $scope.views.new[indexScope] = { 
            notFind : false,
            showDetail :false , 
            showDetailCurrentClass : 'fa fa-chevron-down',
            document:c_document
        };
    };

    var createFees = function(typepaid,value,interest,loanId,arrayDates){
        var arrayResponse  = new Array();
        
        if(typepaid == 1){
            var totalInterest = value * (interest /100);
            var total = value+ totalInterest;
            var cashed = 0;

            var valueFee = total / arrayDates.length;
            valueFee = Math.ceil(valueFee);
            valueFee = parseInt(valueFee/100)*100;

            var i=0;
            for(; i<arrayDates.length-1; i++){
                cashed += valueFee;
                arrayResponse.push({
                    paymentDate : arrayDates[i],
                    state : 1,
                    value : valueFee,
                    interestArrears : 0,
                    loanId : loanId
                });
            }

            arrayResponse.push({
                paymentDate : arrayDates[i],
                state : 1,
                value : total-cashed,
                interestArrears : 0,
                loanId : loanId
            });

        }else if(typepaid == 2){
            var valueFee = value * (interest/100);
            var i=0;
            for(; i<arrayDates.length-1; i++){
                arrayResponse.push({
                    paymentDate : arrayDates[i],
                    state : 1,
                    value : valueFee,
                    interestArrears : 0,
                    loanId : loanId
                });
            }
            arrayResponse.push({
                paymentDate : arrayDates[i],
                state : 1,
                value : valueFee+value,
                interestArrears : 0,
                loanId : loanId
            });
        }

        return arrayResponse;
    };

    var savePayment = function(){
        var typePaid = null;
        var testDate = null;
        var folder = SaveData.get("objects");

        if(folder == null){
            $state.go("home");
        }else {
            var obj = folder.get("objFeeAddPayment").value;
            typePaid = obj.typePaid;
            testDate = obj.dateTest;
        }

        var valuePaid = $scope.views.collectionDay.infoLoan.payment;
        var feeId = $scope.views.collectionDay.infoLoan.id;
        var loanId = $scope.views.collectionDay.infoLoan.loan.id;
        var paidBalance = $scope.views.collectionDay.infoLoan.addPaidBalance;


        console.log($scope.views.new.loan.feePayment.id);        
        var description = '';

        var objPayment = {
            value : valuePaid,
            //feeId : feeId,
            loanId : loanId,
            //feeValue : minValue,
            //totalValue : total,
            paidBalance :paidBalance,
            typePaid :  typePaid,
        //    testDate : testDate
        };
        valuePaid = parseInt(valuePaid);
        valuePaid += (paidBalance == null ||
            typeof paidBalance == "undefined" ||
            paidBalance.length == 0
        ) ? 0 : parseInt(paidBalance);



        MovesDao.create(1,valuePaid,"COBRO PRESTAMO",null,1,1).then(function(result){
            console.log(result);
            objPayment.moveId = result.insertId;

            PaymentsDao.create(objPayment).then(function(result,resultUpdateFees){
            if(result > 0) {
                LoansDao.updateUnscaped("balance","(balance-"+valuePaid+")","id="+loanId,false);
                LoansDao.updateUnscaped("state",0,"(select count(*) from fees where loan_id ="+loanId+" and (state =1 or state =2 )) = 0 and id = "+loanId,false);
                LoansDao.updateUnscaped("is_updated",0," id = "+loanId,false);
                alert("se registro correctamente el pago");

                $state.go("home.collectionDay");
            }else{
                console.log(resultUpdateFees);
                console.log(result);
            }
        }).catch(function(error){
            console.log(error);
        });
        }).catch(function(error){
            console.log(error);
            alert("se produjo un error al crear el movimiento");
        })
        
    };

    $scope.findClientPositionRoute = function(){
        var folderIdClient = SaveData.get("client.id.new");
        if(folderIdClient == null){
            $state.go("home");
            return;
        }

        var id = folderIdClient.get("id");
        if(id == null){
            $state.go("home");
            return;
        }

        var name = $scope.views.asignRoutePosition.name;
        var copy = $scope.lists.clients;

        var countVisible = 0;
        for (var i = 0; i < copy.length; i++) {
            if(name == '' || name.length == 0){
                angular.element(document.getElementById(i+'_trButton')).css('display','');
                angular.element(document.getElementById(i+'_trInfo')).css('display','');
                countVisible++; //validar la cantidad de
            }else{
                if(copy[i].name.toLowerCase().search(name.toLowerCase()) != -1){
                    angular.element(document.getElementById(i+'_trButton')).css('display','');
                    angular.element(document.getElementById(i+'_trInfo')).css('display','');
                    countVisible++;
                    var next = i+1;
                    document.querySelector('.lastOption').id = next+'_positionRoute';
                }else{
                    angular.element(document.getElementById(i+'_trButton')).css('display','none');
                    angular.element(document.getElementById(i+'_trInfo')).css('display','none');
                }
            }

            if(i == copy.length-1){
                if(countVisible != 0){
                    angular.element(document.querySelector('.lastOption')).css('display','');
                }else{
                    angular.element(document.querySelector('.lastOption')).css('display','none');
                }
            }
        }
        

        return;
        ClientsDao.listAllExcept(id,"my_client = 1 and name like '%"+name+"%' and id != "+id.value+" ORDER BY route_position ASC").then(function(arrayClients,result){
            console.log(arrayClients);
            $scope.lists.clients = arrayClients;
        }).catch(function(error){
            alert("se presento un problema al cargar los clientes");
        });

    };

    $scope.getLastPosition = function(){
        return (
                typeof $scope.lists == "undefined" || $scope.lists == null || 
                !$scope.lists || typeof $scope.lists.clients == "undefined" || 
                $scope.lists.clients.length == 0
                ) ? 
                0 :
                $scope.lists.clients[$scope.lists.clients.length-1].routePosition+1 
            
    };

    $scope.showStateFee = function($event){
        var node = angular.element($event.target);

        var state = node.data('state');
        var message='';
        switch(state){
            case 0:{
                message = 'Cuota Cancelada';
            }break;
            case 1:{
                message = 'Cuota Pendiente Por Pagar';
            }break;
            case 2:{
                message = 'Cuota con Abono';                
            }break;
            default:{
                message =  'No se encontro el estado de la cuota';
            }
        }

        alert(message);
    };

    $scope.showValuePay = function($event){
        var node = angular.element($event.target);
        
        var message = 'Valor Pagado: ' + $filter('currency')(node.data('paymentvalue'),'$',0);
        
        alert(message);
    };

    $scope.valuePaid = function(arrayPayments){
        var total = 0;
        if(typeof arrayPayments == "undefined"){
            return 0;
        }

        for (var i = 0; i < arrayPayments.length; i++) {
            total+= arrayPayments[i].value;
        };

        return total;
    };
    
    init();

});