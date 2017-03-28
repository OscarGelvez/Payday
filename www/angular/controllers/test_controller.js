/**
 * @author Mario Nieto
 * @email marionieto@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');


kubeApp.controller('TestController',function($scope,$state,$compile,queries,localDatabase,
                                             APP,SynchronizerData,ClientsDao,LoansDao,FeesDao,
                                             PaymentsDao,NeighbourhoodsDao,ZonesDao,CalculatorDate,FacadeServer){
    $scope.db = null;
    $scope.testLoader = 'false';
    $scope.query = '';

    $scope.testUser = {};
    $scope.server = {};
    $scope.date={};

    $scope.alert = function( ){
        var i = $scope.date.start;
        alert(i);
    };

    $scope.loginCollector = function(){

        var obj ={
            cUsername : $scope.server.username,
            cPassword : $scope.server.password,
            cKey : $scope.server.keyCompany
        };
        console.log(obj);
        queries.executeRequest('post','/collector/login',obj).then(function(response) {
            console.log(response);
        }).catch(function(error){
            console.log(error);
        })

    };

    $scope.test= function(){
        SynchronizerData.outdatedMoves().then(function(objResponse){
            console.log(objResponse);
        }).catch(function(error){
            console.log(error);
        })
    };

    $scope.uploadData = function(){
        FacadeServer.pushData(1,1);
    };

    $scope.pull = function(){
        switch($scope.server.selectOption){
            case 'zones':{
                pullZones();
            }break;
            case 'neigh':{
                pullNeighbourhooods();
            }break;
            case 'customers':{
                pullCustomers();
            }break;
            case 'typePaids':{
                pullTypePaids();
            }break;
            case 'loans':{
                pullLoans();
            }break;
            case 'fees':{
                pullFees();
            }break;
            case 'payments' : {
                pullPayments();
            }break;
            case 'all':{
                FacadeServer.pullData(1);
            }

        }
    }



    var pullPayments = function(){
        var obj = {};
        obj.data = {};
        obj.data.collectorId =1;
        queries.executeRequest('post','/payments/list/service',obj).then(function(response) {
            console.log(response);
            if(response.status != 500 || !response.error) {
                SynchronizerData.pullPayments(response.payments).then(function(arrayResult,arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" pagos del servidor");
                    }

                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                    }
                }).catch(function(error){
                    console.log(error);
                })
            }
        }).catch(function(error){
            console.log(error);
        });

    };

    var pullFees = function(){
        var obj = {};
        obj.data = {};
        obj.data.collectorId = 1;

        queries.executeRequest('post','/fees/list/service',obj).then(function(response) {
            console.log(response);

            if(response.status != 500 || !response.error) {

                SynchronizerData.pullFees(response.fees).then(function(arrayResult, arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" cuotas del servidor");
                        alert("SE finalizo la carga");
                    }

                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                        localDatabase.dropTables();
                        messageError();
                    }
                }).catch(function(error){
                    console.log(error);
                    localDatabase.dropTables();
                    messageError();
                });

            }
        }).catch(function(error){
            console.log(error);
        });
    };

    var pullLoans = function(){
        var obj = {};
        obj.data = {};
        obj.data.collectorId = 1;

        queries.executeRequest('post','/loans/list/service',obj).then(function(response) {
            console.log(response);

            if(response.status != 500 || !response.error) {
                SynchronizerData.pullLoans(response.loans).then(function(arrayResult, arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" prestamos del servidor");
                    }

                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    var pullTypePaids = function(){
        queries.executeRequest('post','/typepaids/list/service').then(function(response) {
            console.log(response);
            alert(response.msg);

            if(response.status != 500 || !response.error) {
                SynchronizerData.pullTypePaids(response.typePaids).then(function(arrayResult, arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" tipos de abono del servidor");
                    }

                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }

        }).catch(function(error){
            console.log(error);
        });
    };

    var pullCustomers = function(){
        var obj = {};
        obj.data = {};
        obj.data.collectorId = 1;

        queries.executeRequest('post','/customers/list/service',obj).then(function(response){
            console.log(response);
            console.log(response.customers);
            alert(response.msg);

            if(response.status != 500 || !response.error) {
                SynchronizerData.pullCustomers(response.customers).then(function(arrayResult, arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" Clientes del servidor");
                    }

                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }

        }).catch(function(error){
            console.log(error);
        });
    };

    var pullNeighbourhooods = function() {
        var obj = {};
        obj.data = {};
        obj.data.collectorId = 1;
        console.log(obj);

        queries.executeRequest('post','/neighbourhoods/list/service',obj).then(function(response){
            alert(response.msg);

            if(response.status != 500 || !response.error) {
                SynchronizerData.pullNeighbourhoods(response.neighbourhoods).then(function(arrayResult,arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" Barrios del servidor");
                    }

                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }

        }).catch(function(error){
            console.log(error);
        });
    };


    var pullZones = function(){

        var obj = {};
        obj.data = {};
        obj.data.collectorId = 1;
        console.log(obj);
        queries.executeRequest('post','/zones/list/service',obj).then(function(response){
            alert(response.msg);

            if(response.status != 500 || !response.error) {
                SynchronizerData.pullZones(response.zones).then(function(arrayResult,arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" Zonas del servidor");
                    }
                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }
            console.log(response);
        }).catch(function(error){
            console.log(error);
        });
    };

    var init = function(){
        $('.datePicker').datepicker();
        $scope.testUser.response = '<h1>Hola Mundo</h1>';


        var state = $state.current.name;

        switch(state){
            case 'home.testServer':{

            }break;
        }
    };

    $scope.updateMoves = function(){
        SynchronizerData.outdatedMoves().then(function(objInfo){

            var obj = {};
            obj.data = objInfo;
            obj.data.collectorId = 1;
            console.log(obj);
            queries.executeRequest('put','/move/addChanges',obj).then(function(response){
                console.log(response);
                if(response.status == 500 || response.error) {
                    alert(response.msg);
                }else{
                    alert(response.msg);

                }
            }).catch(function(error){
                console.log(error);
            });
        }).catch(function(error){
            console.log(error);
        })
    }

    $scope.updateFeesLoan = function(){
        SynchronizerData.outdatedLoans().then(function(objInfo){
            console.log(objInfo);
            for(var i=0; i<objInfo.loans.length; i++){
                var obj = {};
                var currentLoan = objInfo.loans[i];
                obj.data = currentLoan;
                obj.data.collectorId = 1;
                queries.executeRequest('put','/loan/updateInfo',obj).then(function(response){
                    console.log(response);
                    if(response.status == 500 || response.error) {
                        alert(response.msg);
                    }else{
                        LoansDao.updateUnscaped('is_updated',1,' id ='+response.id).then(function(result){
                            var sqlUpdateFee = '(';
                            var sqlUpdatePayment = '(';

                            for(var i=0; i<response.fees.length; i++){
                                var infoFee = response.fees[i];
                                sqlUpdateFee += infoFee.id
                                sqlUpdateFee += (i == response.fees.length -1) ?
                                    ');' : ',';

                                for(var j=0; j<infoFee.payments.length; j++){
                                    var infoPayment = infoFee.payments[j];
                                    sqlUpdatePayment += infoPayment.idMobile;
                                    sqlUpdatePayment += (j == infoFee.payments.length-1 && i == response.fees.length-1) ?
                                        ');' : ',';
                                }
                            }

                            console.log(sqlUpdateFee);
                            console.log(sqlUpdatePayment);

                            FeesDao.update('is_updated',1,' id  in '+sqlUpdateFee).then(function(result){
                                alert("se actualizaron "+result.rowsAffected+" cuotas en el servidor");
                            });

                            PaymentsDao.updateUnescaped('is_updated',1,' id in'+sqlUpdatePayment).then(function(result){
                                alert("se actualizaron "+result.rowsAffected+" pagos en el servidor");
                            });

                            if(typeof response.moves !== "undefined" && response.moves.length >0){
                                alert("se actualizaron "+response.moves.length +" movimientos en el servidor")
                            }
                        });
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    $scope.updateLoansV2 = function(){
        SynchronizerData.getInfoNewLoans().then(function(objInfo){
            console.log(objInfo);
            for(var i=0; i<objInfo.loans.length; i++){
                var obj = {};
                var currentLoan = objInfo.loans[i];
                obj.data = currentLoan;
                obj.data.collectorId = 1;
                queries.executeRequest('put','loans/addChangeV2',obj).then(function(response){
                    if(response.status == 500 || response.error){
                        alert(response.msg);
                    }else {
                        var sqlUpdateFee = ' id in (';
                        for(var i=0; i<response.fees.length; i++){
                            sqlUpdateFee += response.fees[i].idMobile;
                            sqlUpdateFee += (i == response.fees.length-1) ? ');' : ',';
                        }
                        FeesDao.update(['is_new','is_updated'],[0,1],sqlUpdateFee).then(function(result){
                            alert("Se actualizaron "+result.rowsAffected+ "cuotas en el servidor");
                        })

                        LoansDao.update(['is_new','is_updated'],[0,1],response.idMobile).then(function(result){
                            if(result.rowsAffected > 0){
                                alert("Se actualizo 1 prestamo");
                            }
                        });
                    }
                }).catch(function(error){

                });
            }
        }).catch(function(error){

        });
    };


    $scope.updateCustomersV2 = function(){
        SynchronizerData.getInfoNewClients().then(function(objInfo){
            console.log(objInfo);
            for(var i=0; i<objInfo.customers.length; i++){
                var obj = {};
                var currentCustomer = objInfo.customers[i];
                currentCustomer.companyId = 1;
                currentCustomer.collectorId = 1;

                obj.data = currentCustomer;
                queries.executeRequest('put', 'customers/addChangesV2',obj).then(function(response){
                    if(response.status == 500 || response.error){
                        alert(response.msg);
                    }else{

                        ClientsDao.update(['is_new','is_updated'], [0,1], ' id = '+response.idMobile).then(function(result){


                            if(result.rowsAffected > 0){
                                var sqlUpdateLoans = '(';

                                for(var j= 0; typeof response.loans !=  "undefined" && response.loans.length > j; j++){
                                    var cLoan = response.loans[j];

                                    sqlUpdateLoans += cLoan.idMobile ;
                                    sqlUpdateLoans += (j == response.loans.length-1) ? ');' : ',';
                                    var sqlUpdateFees = '(';
                                    for(var k=0; typeof cLoan.fees != null && k < cLoan.fees.length; k++){
                                        var cFee = cLoan.fees[k];
                                        sqlUpdateFees += cFee.idMobile;
                                        sqlUpdateFees += (k == cLoan.fees.length-1) ? ');' : ',';
                                    }
                                    FeesDao.update(['is_new','is_updated'],[0,1],' id in'+sqlUpdateFees).then(function(result){
                                        alert("se actualizaron en el servidor "+result.rowsAffected +" cuotas en el servidor");
                                    });
                                }

                                if(sqlUpdateLoans != '(') {
                                    LoansDao.update(['is_new', 'is_updated'], [0, 1], 'id in ' + sqlUpdateLoans).then(function (result) {
                                        alert("se actualizaron en el servidor" + result.rowsAffected + " prestamos")
                                    });
                                }
                            }
                        });
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    $scope.updateCustomers = function(){
        var data = {};
        data.data = {};
        data.data.companyId = 1;
        var arrayInput = ["id","document","address","email","phone_numbers","name","neighbourhood_id","is_evil","route_position"];
        data.data.customers;

        SynchronizerData.getNews("customers"," is_updated = 0",arrayInput).then(function(arrayOutdated){
            if(arrayOutdated.length !== 0) {
                data.data.customers = arrayOutdated;
                queries.executeRequest('put', 'customers/addChanges', data).then(function (result) {
                    $scope.server.response = result.msg+" ";
                    var idUpdated = '(';

                    for(var i =0;
                        typeof result.registered != "undefined" &&
                        i < result.registered.length;
                        i++){

                        idUpdated += result.registered[i];
                        idUpdated += ( i == result.registered.length-1 ) ? ');' : ',';

                    }
                    console.log(result);
                    ClientsDao.update('is_updated',1,' id in '+idUpdated);
                }).catch(function (error) {
                    console.log(error);
                });
            }else{
                alert("todos los usuarios estan actualizados");
            }

        }).catch(function(error){

        });
    };

    $scope.updateLoans = function(){
        var data = {};
        data.data = {};
        data.data.collectorId = 1;
        var arrayInput = ["balance","created","customer_id","date_end","guarantor_id","id","interest_produced","interest_rate","numbers_of_fee","pay_period","retention","start_date","state","type_paid_id","value_loaned"];
        var arrayOuput = ['balance','created_at','customer_id','end_date','guarantor_id','id','interest_produced','interest_rate','numbers_of_fee','pay_period','retention','start_date','state','type_paid_id','value_loaned']

        SynchronizerData.getNews("loans","is_updated = 0",arrayInput,arrayOuput).then(function(arrayOutdated){

            if(arrayOutdated.length > 0){
                data.data.loans = arrayOutdated;
                queries.executeRequest('put', 'loans/addChanges', data).then(function (result) {
                    $scope.server.response = result.msg+" ";
                    var idUpdated = '(';

                    for(var i =0;
                        typeof result.registered != "undefined" &&
                        i < result.registered.length;
                        i++){

                        idUpdated += result.registered[i];
                        idUpdated += ( i == result.registered.length-1 ) ? ');' : ',';

                    }
                    console.log(result);
                    LoansDao.updateUnscaped('is_updated',1,' id in '+idUpdated);
                }).catch(function (error) {
                    console.log(error);
                });
            }else{
                alert("todos los prestamos estan actualizados");
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    $scope.updateFees =function(){
        var data = {};
        data.data = {};
        data.data.collectorId = 1;
        var arrayInput = ['id','interest_arrears','loan_id','payment_date','state','value'];


        SynchronizerData.getNews("fees","is_updated = 0",arrayInput).then(function(arrayOutdated){

            if(arrayOutdated.length > 0){
                data.data.fees = arrayOutdated;
                queries.executeRequest('put', 'fees/addChanges', data).then(function (result) {
                    $scope.server.response = result.msg+" ";
                    var idUpdated = '(';

                    for(var i =0;
                        typeof result.registered != "undefined" &&
                        i < result.registered.length;
                        i++){

                        idUpdated += result.registered[i];
                        idUpdated += ( i == result.registered.length-1 ) ? ');' : ',';

                    }
                    console.log(result);
                    FeesDao.update('is_updated',1,' id in '+idUpdated);
                }).catch(function (error) {
                    console.log(error);
                });
            }else{
                alert("todos los prestamos estan actualizados");
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    $scope.createDataBase = function(){
        $scope.db = localDatabase.createNew();
    };
    
    $scope.createTable = function(){
        $scope.testLoader = 'cargando...';
        localDatabase.createModels().then(function(arrayCreated,arrayError){
            $scope.testLoader ='finalizado';
            console.log(arrayCreated);
        }).catch(function(error){
            console.log(error);
        });
        
    };
    
    $scope.showSchema = function(){
        localDatabase.showSchema();
    };
    
    $scope.delete = function(){
        localDatabase.dropTables();
    };
    
    $scope.executeQuery = function(){

        localDatabase.query($scope.query).then(
            function(result){

                if(typeof result.rows.length !== 0){
                    for(var i =0; i<result.rows.length; i++){
                        console.log(result.rows.item(i));
                    }
                }else{
                    console.log(result);
                }
            }
        ).catch(function(error){
            console.log(error);
        });
    };
    
    $scope.listNeighbourhoods = function(){
        NeighbourhoodsDao.all().then(function(rows){
            for(var i=0; i<rows.length; i++){
                alert(rows[i].name+ ' id: '+rows[i].id);
            }
        }).catch(function(error){
            console.log(error);
        });
    };
    
    $scope.findZone = function(){
        ZonesDao.find($scope.query).then(function(row){
            console.log(row);
        }).catch(function(error){
            console.log(error);
        });
    };
    
    $scope.upDatabase = function(){
        $scope.testUser.response ='<h2>Se Inicio La Consulta</h2>';
        localDatabase.up().then(function(arrayResponse, arrayError){
            $scope.testUser.response = "<h2 style='color:#27ae60'>"+arrayResponse.length+" Registros Realizados</h2>";
            if(arrayError != null && typeof  arrayError != "undefined" &&arrayError.length > 0){
                $scope.testUser.response += "<h2 style='color:#c0392b'>"+arrayResponse.length+" Registros Erroneos</h2>";
            }
        }).catch(function(error){
            console.log(error);
            $scope.testUser.response ='<h2 style="color:#c0392b">SE PRESENTO UN ERROR</h2>';
        });
    };

    $scope.listDates = function(){

        var v = CalculatorDate.getDatesBetween(
            parseTextDate($scope.date.start,'/'),
            parseTextDate($scope.date.end,'/'),
            $scope.query
        );
        for(var i=0; i< v.length; i++){
            console.log(
                v[i].getFullYear()+'-'+
                v[i].getMonth()+'-'+
                v[i].getDate()+'   :'+
                v[i].toString()
            );
        }
    };

    var parseTextDate = function(stringDate, separator){
        var vectorInfo = stringDate.split(separator);

        return new Date(
            vectorInfo[2],
            vectorInfo[0]-1,
            vectorInfo[1],
            0,0,0,0
        );
    };

    $scope.listNews = function(){
        var option = parseInt($scope.testLoader);
        console.log(option);
        switch(option){
            case 1:{
                getNewCustomers();
            }break;
            case 2:{
                getNewLoans();
            }break;
            case 3:{
                getNewFees();
            }break;
            case 4:{
                getNewPayments();
            }break;
            case 5 : {
                getNewMoves();
            }break;
        }
    };

    var getNewMoves = function(){
        var arrayFields = [
            "id",
            "type",
            "created",
            "description",
            "value",
            "hour",
            "payment_id",
            "loan_id",
            "is_move_business"
        ];

        var arrayNameOutputs = [
            "id",
            "type",
            "created",
            "description",
            "value",
            "hour",
            "paymentId",
            "loanId",
            "isMoveBusiness"
        ];


        sincronizadorData.getNews("moves"," 1=1",arrayNameOutputs,arrayFields).then(function(arrayResponse){

            for(var i=0; i<arrayResponse.length; i++){
                console.log(arrayResponse[i]);
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    var getNewPayments = function(){

        var arrayFields = [
            "id",
            "value",
            "fee_id",
            "created",
            "description",
            "type_of_fee"
        ];

        var arrayNameOutputs = [
            "id",
            "value",
            "feeId",
            "created",
            "description",
            "typeOfFee"
        ];

        sincronizadorData.getNews("payments"," is_updated=0",arrayNameOutputs,arrayFields).then(function(arrayResponse){

            for(var i=0; i<arrayResponse.length; i++){
                console.log(arrayResponse[i]);
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    var getNewFees = function(){
        var arrayFields = [
            "id",
            "payment_date",
            "state",
            "value",
            "interest_arrears",
            "loan_id"
        ];

        var arrayNameOutputs = [
            "id",
            "paymentDate",
            "state",
            "value",
            "interestArrears",
            "loanId"
        ];

        sincronizadorData.getNews("fees"," is_updated=0",arrayNameOutputs,arrayFields).then(function(arrayResponse){

            for(var i=0; i<arrayResponse.length; i++){
                console.log(arrayResponse[i]);
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    var getNewLoans = function(){
        var arrayFields = [
            "id",
            "customer_id",
            "created",
            "start_date",
            "date_end",
            "interest_produced",
            "pay_period",
            "balance",
            "interest_rate",
            "value_loaned",
            "type_paid_id",
            "state",
            "retention",
            "guarantor_id",
            "numbers_of_fee"
        ];

        var arrayNameOutputs = [
            "id",
            "customerId",
            "created",
            "startDate",
            "dateEnd",
            "interestProduced",
            "payPeriod",
            "balance",
            "interestRate",
            "valueLoaned",
            "typePaidId",
            "state",
            "retention",
            "guarantorId",
            "numbersOfFee"
        ];

        sincronizadorData.getNews("loans"," is_updated=0",arrayNameOutputs,arrayFields).then(function(arrayResponse){

            for(var i=0; i<arrayResponse.length; i++){
                console.log(arrayResponse[i]);
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    var getNewCustomers = function(){
        var arrayFields = [
            "address",
            "document",
            "email",
            "id",
            "is_evil",
            "name",
            "neighbourhood_id",
            "phone_numbers",
            "route_position"
        ];

        var arrayNameOutputs = [
            "address",
            "document",
            "email",
            "id",
            "isEvil",
            "name",
            "neighbourhoodId",
            "phoneNumbers",
            "routePosition"
        ];

        sincronizadorData.getNews("customers"," is_updated=0",arrayNameOutputs,arrayFields).then(function(arrayResponse){

            for(var i=0; i<arrayResponse.length; i++){
                console.log(arrayResponse[i]);
            }
        }).catch(function(error){
            console.log(error);
        });
    };




    /**
     * funciones para las pruebas de la base de datos, por parte de un usuario
     *
     */

    $scope.showSchemaVisual = function(){
        $scope.testUser.response = '<h2>Se Inicio La Consulta</h2>';
        localDatabase.showSchema().then(function(arrayResponse){
            var response = '';
            var html = '<div class="col-xs-8" style="background-color: #16a085;color:#FFF;margin-top: 1rem;"><h4 style="max-width: 100%">?</h4></div>';
            for(var i=0; i<arrayResponse.length; i++){
                response+= html.replace('?',arrayResponse[i]);
            }

            $scope.testUser.response = response;
        }).catch(function(error){
            alert(error);
        });
    };


    $scope.createDBTables = function(){
        $scope.testUser.response = '<h2>Se Inicio La Consulta</h2>';
        localDatabase.createModels().then(function(arrayResponse){
            var response = '';

            for(var i=0; i<arrayResponse.length; i++){
                var html = '<div class="col-xs-8" style="background-color: #16a085;color:#FFF;margin-top: 1rem;"><h4 style="max-width: 100%"><i>#*  </i>  ?</h4></div>';

                var x =html.replace('?',arrayResponse[i]);
                response+= x.replace('*',(i+1));
            }

            $scope.testUser.response = response;
        }).catch(function(error){

        });
    };

    $scope.dropTablesTestUser = function(){
        var r = confirm("Si elimina la base de datos,\nse eliminaran todos los registros existentes");
        if(r) {
            $scope.testUser.response = '<h2>Se Inicio La Consulta</h2>';
            localDatabase.dropTables().then(function (arrayDroped) {
                var response = '';

                for (var i = 0; i < arrayDroped.length; i++) {
                    var html = '<div class="col-xs-8" style="background-color: #f39c12;color:#FFF;margin-top: 1rem;"><h4 style="max-width: 100%">?</h4></div>';
                    response += html.replace('?', arrayDroped[i] + " eliminada");
                }

                $scope.testUser.response = response;
            }).catch(function (error) {
                console.log(error);
            });
        }
    };

    $scope.cleanContent = function(){
        $scope.testUser.response = '';
        console.clear();
    };

    $scope.listItemsOfTable = function(){
        var table = $scope.testUser.selectTable;
        if(typeof table  != undefined){
            $scope.testUser.response = '';
            switch (table){
                case "zones":{
                    listZones();
                }break;
                case "neighbourhoods":{
                    listNeighbourhoods();
                }break;
                case "customers" : {
                    listCustomers();
                }break;
                case "type_paids" :{
                    listTypePaids();
                }break;
                case "moves":{
                    listMoves();
                }break;

            }


        }
    };



    $scope.searchFeesLoansId = function(evt){
        var vectorId = _id(evt.target).split('_')[0];

        var sql = 'select 	f.*,	p.id as "p_id",	p.value as "p_value",	p.created as "p_created",	p.description as "p_description"from fees f left join payments p on(p.fee_id = f.id) where f.loan_id = ?';
        var params = [vectorId];

        localDatabase.query(sql,params).then(function(result){
            __(result);
            var response = '';
            if(result.rows.length > 0){


                var r= result.rows;
                response = '<h1 style="color: #22A7F0">'+$scope.testUser.route +' / Prestamo '+ r.item(0).loan_id+'</h1>';
                var idFee = 0;
                var temporal = '';
                for(var i=0; i< r.length; i++){
                    var row = r.item(i);
                    if(parseInt(row.id) !== parseInt(idFee)){

                        temporal += (temporal.length > 0) ? '</div>' : '';
                        temporal += '<div style="font-size:18px;background-color: '+((row.state == 0) ? '#0eac51' :'#8c9aa9')+';color: #FFF; margin: 10px 5px; padding: 1rem 0.5rem" class="col-xs-5">';
                        temporal += '<span><b>Id Cuota: </b>'+row.id+'</span><br>';
                        temporal += '<span><b>Id Prestamo: </b>'+row.loan_id+'</span><br>';
                        temporal += '<span><b>Valor Cuota: </b>'+row.value+'</span><br>';
                        temporal += '<span><b>Estado Cuota: </b>'+stateFee(row.state)+'</span><br>';
                        temporal += '<span><b>Fecha Cobro: </b>'+row.payment_date+'</span><br>';
                        temporal += (row.p_created !== null) ? '<span>Pagos Asociados: </span><br>' : '';
                        idFee = row.id;
                    }

                    if(row.p_id != null) {
                        temporal += '<div class="col-xs-6" style="font-size: 12px; margin: 10px 0px">';
                        temporal += '<span><b>Realizado: </b>' + row.p_created + '</span><br>';
                        temporal += '<span><b>Id Pago: </b>' + row.p_id + '</span><br>';
                        temporal += '<span><b>Valor Pago: </b>' + row.p_value + '</span><br>';
                        temporal += '</div>';
                    }

                }

                response += temporal;

            }else{
                response = '<h2 style="color:#c0392b">NO se encontro ningúna cuota</h2>';
            }

            $scope.testUser.response = response;

        }).catch(function(error){
            __(error);
        })

    };

    $scope.searchLoansCustomerId = function(evt){
        var vectorId = _id(evt.target).split('_')[0];

        var sql = 'select l.*,c.name as "c_name",(IFNULL((select name from customers where id = l.guarantor_id),"SIN fiador")) as "g_name",t.name as "t_name" from loans l  join customers c on(l.customer_id = c.id)  join type_paids t on(l.type_paid_id = t.id) where l.customer_id = ?';
        var params = [parseInt(vectorId)];

        localDatabase.query(sql,params).then(function(result){
            var r = result.rows;
            var response = '';
            if(r.length > 0) {
                response = '<h1 style="color: #22A7F0;">Prestamos de '+ r.item(0).c_name+'</h1>';
                $scope.testUser.route = r.item(0).c_name;
                for (var i = 0; i < r.length; i++) {
                    var html = '<div ng-click="searchFeesLoansId($event)" id="?_fee_id" class="row" style="cursor:pointer;font-size: 18px ;padding: 1rem;width: 80%; background-color: #8E44AD;color: #FFF;display: inline-block;vertical-align: top; margin: 1rem 3% 0 0"><span> <b>Id Prestamo: </b>  ?2</span><br><span> <b>Id Cliente: </b>  ?3</span><br><span> <b>Nombre Cliente: </b>  ?4</span><br><span> <b>Creado: </b>  ?5<br> </span><span> <b>Fecha Inicio Cobro: </b>  ?6</span><br><span> <b>Fecha Fin Prestamo: </b>  ?7</span><br><span> <b>Interes Producido: </b>  ?8</span><br><span> <b>Frecuencía de pago: </b>  ?9</span><br><span> <b>Saldo: </b>  ?10</span><br><span> <b>Tasa de Interes: </b>  ?11</span><br><span> <b>Valor Prestado: </b>  ?12</span><br><span> <b>Tipo de Abono: </b>  ?13</span><br><span> <b>Estado: </b>  ?14</span><br><span> <b>Retención: </b>  ?15</span><br><span> <b>id Fiador: </b>  ?16</span><br><span> <b>Nombre Fiador: </b>  ?17</span><br><span> <b>Numero de cuotas: </b>  ?18</span><br><span style="color: #333;text-decoration: underline">Ver Cuotas</span></div>';

                    var row = r.item(i);
                    var params = [
                        row.id,
                        row.id,
                        row.customer_id,
                        row.c_name,
                        row.created,
                        row.start_date,
                        row.date_end,
                        row.interest_produced,
                        row.pay_period,
                        row.balance,
                        row.interest_rate,
                        row.value_loaned,
                        row.t_name,
                        row.state,
                        row.retention,
                        row.guarantor_id,
                        row.g_name,
                        row.numbers_of_fee,
                    ];

                    response += formatText(html, params);
                }
            }else{
                response = response = '<h2 style="color: #c0392b;">El Cliente no Tiene Prestamos Registrados</h2>';
            }

            var temp = $compile(response)($scope);
            angular.element(document.querySelector('#myContent')).html(temp);
        }).catch(function(error){
            console.log(error);
        })
    };


    var listZones = function (){

        var sql= 'select * from zones';
        localDatabase.query(sql).then(function(result){
            var response = '';
            if(result.rows.length > 0){
                var r = result.rows;
                var html = '<div style="cursor:pointer;padding: 1rem;width: 30%; background-color: #2c3e50;color: #FFF;display: inline-block;vertical-align: top; margin: 1rem 3% 0 0"><span style="font-size: 15px"><b>Id Zona:</b> ?</span><br><span style="font-size: 18px"><b>Nombre:</b> $</span></div>'
                for(var i=0; i< r.length; i++){
                    var row = r.item(i);
                    var copy = html.replace('?', row.id);
                    response+= copy.replace('$',row.name);

                }

            }else{
                response = '<h2 style="color: #c0392b;">No hay ningún registro en la tabla de zonas</h2>'
            }
            $scope.testUser.response = response;
        }).catch(function(error){
            console.log(error);
        });
    };

    var listNeighbourhoods = function(){
        var sql = 'select n.name as "name", n.id as "id" , z.name as "zone_name" from neighbourhoods n join zones z on (z.id= n.zone_id)';

        localDatabase.query(sql).then(function(result){
            var response = '';
            if(result.rows.length > 0 ){
                var r = result.rows;
                var html = '<div style="padding: 1rem;width: 45%; background-color: #F9BF3B;color: #FFF;display: inline-block;vertical-align: top; margin: 1rem 3% 0 0"><span style="font-size: 15px"><b>Id Barrio:</b> ?</span><br><span style="font-size: 18px"><b>Nombre:</b> ?2</span><br><span style="font-size: 18px"><b>Nombre Zona:</b> ?3</span></div>'
                for(var i=0; i< r.length; i++){
                    var row = r.item(i);
                    var x= html.replace('?',row.id);
                    x= x.replace('?2',row.name);
                    response+= x.replace('?3',row.zone_name);

                }
            }else {
                response += '<h2 style="color: #c0392b;">No hay ningún registro en la tabla de Barrios</h2>';
            }
            $scope.testUser.response = response;
        }).catch(function(error){
            console.log(error);
        });
    };

    var listCustomers = function(){
        var sql = 'select c.id,c.address,c.phone_numbers,c.name,c.neighbourhood_id,c.is_evil,c.route_position,c.email,c.document,c.my_client,n.name as "n_name" from customers c join neighbourhoods n on(c.neighbourhood_id =  n.id)';
        localDatabase.query(sql).then(function(result){
            var response = '';
            if(result.rows.length > 0 ){
                var r = result.rows;
                var html = '<div class="row itemCustomer" ng-click="searchLoansCustomerId($event)" id="?_client_id" style="cursor:pointer;padding: 1rem;width: 45%; background-color: #17bbb0;color: #FFF;display: inline-block;vertical-align: top; margin: 1rem 3% 0 0">    <span style="font-size:18px">   <b>Id Cliente: </b>?2    </span>    <br/>    <span style="font-size:18px">   <b>Dirección: </b>?3    </span>    <br/>    <span style="font-size:18px">   <b>Numeros De Telefonos: </b>?4    </span>    <br/>    <span style="font-size:18px">   <b>Nombre: </b>?5    </span>    <br/>    <span style="font-size:18px">   <b>Nombre Barrio: </b>?6    </span>    <br/>    <span style="font-size:18px">   <b>Esta en la lista negra: </b>?7    </span>    <br/>    <span style="font-size:18px">   <b>Posición en la ruta: </b>?8    </span>    <br/>    <span style="font-size:18px">   <b>Correo Electronico: </b>?9    </span>    <br/>    <span style="font-size:18px">   <b>Cedula: </b>?10    </span>    <br/>    <span style="font-size:18px">   <b>Tiene un prestamo actual: </b>?11</span><br/><br><span style="color:#333;text-decoration: underline">Ver Prestamos</span></div>';
                for(var i=0; i< r.length; i++){
                    var row = r.item(i);

                    var arrayParams = [
                        row.id,
                        row.id,
                        row.address,
                        (row.phone_numbers).replace(',',' , '),
                        row.name,
                        row.n_name,
                        (row.is_evil == 1)? "SI" :"NO",
                        row.route_position,
                        row.email,
                        row.document,
                        (row.my_client) ? "SI": "NO"
                    ];

                    response += formatText(html,arrayParams);
                }
            }else {
                response += '<h2 style="color: #c0392b;">No hay ningún registro en la tabla de zonas</h2>';
            }
            var temp = $compile(response)($scope);
            angular.element(document.querySelector('#myContent')).html(temp);
        }).catch(function(error){
            console.log(error);
        })
    };

    var listTypePaids = function(){
        var sql = 'select * from type_paids ';

        localDatabase.query(sql).then(function(result){
            var response = '';
            if(result.rows.length > 0 ){
                var r = result.rows;
                var html = '<div class="row" style="padding: 1rem;width: 40%; background-color: #ce9c7b;color: #FFF;display: inline-block;vertical-align: top; margin: 1rem 3% 0 0">    <span style="font-size:18px">   <b>Id Tipo Pago: </b>?    </span>    <br/>    <span style="font-size:18px">   <b>Nombre: </b>?2    </span>    <br/>    <span style="font-size:18px">   <b>Descripción: </b>?3    </span></div>';
                for(var i=0; i< r.length; i++){
                    var row = r.item(i);

                    var arrayParams = [
                        row.id,
                        row.name,
                        row.description
                    ];

                    response += formatText(html,arrayParams);
                }
            }else {
                response += '<h2 style="color: #c0392b;">No hay ningún registro en la tabla de Tipos de Pago</h2>';
            }
            $scope.testUser.response = response;
        }).catch(function(error){
            console.log(error);
        });
    };

    var listMoves = function(){
        var sql = 'select * from moves';
        localDatabase.query(sql).then(function(result){
            var r = result.rows;
            var response = ''

            if(r.length> 0){
                for(var i=0; i< r.length; i++){
                    var row= r.item(i);
                    response+= '<div class="col-xs-5" style="margin: 1rem;background-color: #7e4c2b; color: #FFF;padding: 1rem 0.5rem;font-size: 18px">';
                    response+= '<span><b>Id Movimiento: </b>'+row.id+'</span><br>';
                    response+= '<span><b>Fecha Creación: </b>'+row.created+'</span><br>';
                    response+= '<span><b>Hora Creación: </b>'+row.hour+'</span><br>';
                    response+= '<span><b>Es de la empresa: </b>'+(row.is_move_business == 1 ? "SI" : "NO")+'</span><br>';
                    if(row.loan_id != null){
                        response+= '<span><b>Asociado al prestamo: </b>'+row.loan_id+'</span><br>';
                    }
                    if(row.payment_id != null){
                        response+= '<span><b>Asociado al pago: </b>'+row.payment_id+'</span><br>';
                    }

                    response+= '<span><b>Tipo Movimiento: </b>'+(row.type == 1 ? "ENTRADA" :"SALIDA")+'</span><br>';
                    response+= '<span><b>Valor: </b>'+row.value+'</span><br>';
                    response+= '<span><b>Descripción: </b>'+row.description+'</span><br>';

                    response+='</div>'
                }
            }else{
                response += '<h2 style="color: #c0392b;">No hay ningún registro en la tabla de movimientos</h2>';
            }

            var temp = $compile(response)($scope);
            angular.element(document.querySelector('#myContent')).html(temp);

        }).catch(function(error){
            console.log(erro);
        })
    };

    var formatText = function(format,arrayValues){
        var copy= format;
        if(arrayValues.length > 0){
            copy = copy.replace('?',arrayValues[0]);
        }else{
            return format;
        }
        for(var i=1; i<arrayValues.length; i++){
            copy = copy.replace('?'+(i+1),arrayValues[i]);

        }

        return copy;
    };

    var _id = function(element){
        if(element.id.length > 0){
            return element.id;
        }
        return _id(element.parentNode);
    };

    var __ = function(text){
        console.log(text);
    };

    var stateFee = function(state){
        state = parseInt(state);

        switch (state){
            case 0:{
                return "PAGADA";
            }
            case 1:{
                return "PENDIENTE";
            }
            case 2:{
                return "PAGO PARCIAL";
            }
            default :{
                return "ESTADO SIN CONOCER"
            }
        }
    }



    init();
});

