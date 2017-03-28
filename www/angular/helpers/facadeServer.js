/**
 * Created by laptop on 31/05/2015.
 */
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('FacadeServer', function($q,$state,SynchronizerData,queries,ClientsDao,localDatabase,FeesDao,
                                           LoansDao,PaymentsDao,MovesDao){

    var self = this;

    function mostrarPropiedades(objeto, nombreObjeto) {
        var resultado = "";
        for (var i in objeto) {
            if (objeto.hasOwnProperty(i)) {
                if(typeof objeto[i] == "object"){
                    resultado += nombreObjeto + "['" + i + "']' = "+mostrarPropiedades(objeto[i],i)+"\n";
                }else{
                    resultado += nombreObjeto + "['" + i + "'' = " + objeto[i] + "\n";                    
                }
            }
        }
        return resultado;
    }
    // #########Codigo mio para abrir caja #############


        this.openCash =function(collectorId, value){
        $params = {
            collector_id : collectorId,
            value : value
        }
        return queries.executeRequest('PUT','collector/opencash',$params);
    };














    // ################################################
    this.validateOpening =function(collectorId,companyId){
        $params = {
            collector_id : collectorId,
            company_id : companyId
        }
        return queries.executeRequest('GET','businesstransactions/validateassignmoney',null,$params);
    };


    this.pullData = function(collectorId,callback){

        localDatabase.validateDB(false).then(function(){

            callback();
            angular.element('#bannerLoading').css('display','block');
            pullZones(collectorId).then(function(){
                alert("Se finalizo la descarga de datos");
                angular.element('#bannerLoading').css('display','none');
            }).catch(function(error){
                printE(error);
                alert("se presento un problema al cargar los datos");
                angular.element('#bannerLoading').css('display','none');
            });
        }).catch(function(error){
            console.log("error no estan las tablas de la base de datos");
        });

    };

    this.pushData = function(collectorId,companyId){

        console.log("EL ID DE LA COMPAÑIA QUE LLEGO ES "+companyId);
        angular.element('#bannerLoading').css('display','block');

        var isAllUpdated = true;
        pushCustomers(collectorId,companyId).then(function(responseC){
            console.log("el response de los clientes fue: "+responseC);
            console.log("se subieron los clientes a los servidores");
            isAllUpdated &= responseC;

            pushLoans(collectorId).then(function(responseL){
                isAllUpdated &= responseL;
                console.log("el response de  los creditos fue: "+responseL);

                console.log("se subieron los prestamos al servidor");

                pushFeesLoan(collectorId).then(function(responseF){
                    console.log("le response de las cuotas fue: "+responseF);
                    isAllUpdated &= responseF;
                    console.log("se subieron las cuotas al servidor");

                    pushMoves(collectorId).then(function(responseM){
                        console.log("el response de los movimientos fue: "+responseM);
                        isAllUpdated &= responseM;
                        if(isAllUpdated){
                            alert("Se sincronizo todo se eliminara los registros acutalizados");
                            localDatabase.dropTables().then(function(result){
                                $state.go("login");
                            }).catch(function(error){
                                localDatabase.dropTables();
                            });
                        }

                        angular.element('#bannerLoading').css('display','none');
                    }).catch(function(error){
                        console.log("se presento problema con los movimientos");
                        showError(error);
                    });
                }).catch(function(error){
                    console.log("se presento problema con las cuotas");
                    showError(error);
                });
            }).catch(function(error){
                console.log("se presento problema con los prestamos");
                showError(error);
            });
        }).catch(function(error){
            console.log("se presento problema con los clientes");
            showError(error);
        });

        var showError = function(error){
            console.log(error);            
            alert("se presento un problema al guardar los datos en el servidor");
            angular.element('#bannerLoading').css('display','none');
        };
    };

    var pushMoves = function(collectorId){
        var defered = $q.defer();
        var promise = defered.promise;

        SynchronizerData.outdatedMoves().then(function(objInfo){

            if(objInfo ==  null){
                defered.resolve(true);
                return;
            }

            var obj = {};
            obj.data = objInfo;
            obj.data.collectorId = collectorId;
            console.log(obj);
            queries.executeRequest('put','/move/addChanges',obj).then(function(response){
                console.log(response);
                if(response.status == 500 || response.error) {
                    alert(response.msg);
                    defered.reject();
                }else{
                    var countMovesUpdated = 0;

                    for(var i=0; i<response.moves.length; i++) {
                        countMovesUpdated++;
                    }

                    var resultCount = countMovesPushed(objInfo.moves);
                    var responseCount = resultCount.moves == countMovesUpdated;
                    defered.resolve(responseCount);
                }
                
            }).catch(function(error){
                console.log(error);
                defered.reject(error);
            });
        }).catch(function(error){
            console.log(error)
            defered.reject(error);
        });

        return promise;
    };

    var pushFeesLoan = function(collectorId){
        var defered = $q.defer();
        var promise = defered.promise;
        SynchronizerData.outdatedLoans().then(function(objInfo){

            console.log(objInfo);
            
            if(objInfo ==  null){
                defered.resolve(true);
                return;
            }

            var obj = {};
            obj.data = objInfo;
            obj.data.collectorId = collectorId;
            queries.executeRequest('put','/loans/updateInfo',obj).then(function(response){
                console.log(response);
                if(response.status == 500 || response.error) {
                    alert(response.msg);
                }else{

                    var sqlUpdateLoans = '(';
                    var sqlUpdateFees = '(';
                    var sqlUpdatePayments = '(';

                    var countLoansUpdated = 0;
                    var countFeesUpdated = 0;
                    var countPaymentsUpdated = 0;
                    var countMovesUpdated = 0;

                    for(var i=0; i<response.loans.length; i++){
                        var l= response.loans[i];
                        console.log(l);
                        var isLastLoan = (i == response.loans.length -1);
                        sqlUpdateLoans += l.id;
                        sqlUpdateLoans += (isLastLoan) ? ');' :',';

                        countLoansUpdated++;

                        for(var j=0; j< l.fees.length; j++){

                            countFeesUpdated++;

                            var f = l.fees[j];
                            var isLastFee = (isLastLoan && j == l.fees.length -1);
                            sqlUpdateFees += f.id;
                            sqlUpdateFees += (isLastFee) ? ');' : ',';

                            for(var k=0; k< f.payments.length; k++){
                                countPaymentsUpdated++;
                                var isLastPayment = (isLastFee && k == f.payments.length-1);
                                var p = f.payments[k];

                                sqlUpdatePayments += p.idMobile;
                                sqlUpdatePayments += (isLastPayment) ? ');' : ',';
                            }
                        }

                        if(typeof l.moves != "undefined"){
                            countMovesUpdated++;
                        }
                    }


                    //console.log(sqlUpdateLoans);
                    //console.log(sqlUpdateFees);
                    //console.log(sqlUpdatePayments);

                    LoansDao.updateUnscaped(['is_new','is_updated'],[0,1],' id in '+sqlUpdateLoans,true).then(function(result){
                        console.log(result);
                        if(result.rowsAffected > 0){
                            FeesDao.update(['is_new','is_updated'],[0,1], ' id in '+sqlUpdateFees).then(function(result2){

                                if(result2.rowsAffected > 0){
                                    PaymentsDao.updateUnescaped("is_updated",1,' id in '+sqlUpdatePayments).then(function(result3){
                                        var resultCount = countFeesPushed(objInfo.loans);
                                        console.log(resultCount);
                                        var responseR = resultCount.loans == countLoansUpdated &&
                                            resultCount.fees == countFeesUpdated &&
                                            resultCount.payments == countPaymentsUpdated &&
                                            resultCount.moves == countMovesUpdated;

                                        defered.resolve(responseR);
                                    }).catch(function(error){
                                        defered.reject(error);
                                    });

                                }else{
                                    console.log("no se actualizo ninguna cuota");
                                }
                            }).catch(function(error){
                                defered.reject(error);
                            });
                        }else{
                            console.log("no se actualizo ningún prestamo");
                        }

                    }).catch(function(error){
                        defered.reject(error);
                    });
                }
            }).catch(function(error){
                console.log(error);
            });

        }).catch(function(error){
            console.log(error);
        });

        return promise;
    };


    var pushLoans = function(collectorId){
        console.log("entro a actualizar prestamos");
        var defered = $q.defer();
        var promise = defered.promise;

        SynchronizerData.getInfoNewLoans().then(function(objInfo){

            console.log(objInfo);

            if(objInfo == null){
                console.log("no hay prestamos nuevos de clientes viejos");
                defered.resolve(true);
                return;
            }

            var obj = {};
            obj.data = {};
            objInfo.collectorId = collectorId;
            obj.data = objInfo;

            console.log(obj);
            queries.executeRequest('put','loans/addChangeV2',obj).then(function(response){
                console.log(response);
                if(response.status == 500 || response.error){
                    alert(response.msg);
                }else {

                    var sqlUpdateLoans = '(';
                    var sqlUpdateFees = '(';

                    var isLastLoan;

                    var countLoansUpdated = 0;
                    var countFeesUpdated = 0;
                    var countMovesUpdated =0 ;

                    for (var j = 0; j < response.loans.length; j++) {

                        countLoansUpdated ++;

                        var l = response.loans[j];
                        isLastLoan = (j == response.loans.length - 1);

                        sqlUpdateLoans += l.idMobile;
                        sqlUpdateLoans += (isLastLoan) ? ');' : ',';


                        for (var i = 0; i < l.fees.length; i++) {
                            countFeesUpdated++;
                            sqlUpdateFees += l.fees[i].idMobile;
                            sqlUpdateFees += (isLastLoan && i == l.fees.length - 1) ? ');' : ',';
                        }

                        if(typeof l.move == "undefined"){
                            countMovesUpdated++;
                        }else{
                            countMovesUpdated++;
                        }

                    }

                    console.log(sqlUpdateLoans);
                    console.log(sqlUpdateFees);

                    LoansDao.updateUnscaped(['is_new', 'is_updated'], [0, 1], ' id = ' +l.idMobile, true).then(function (result) {
                        if (result.rowsAffected > 0) {
                            console.log("actualizo "+result.rowsAffected +" prestamos");
                            FeesDao.update(['is_new', 'is_updated'], [0, 1], " id in "+sqlUpdateFees).then(function (result2) {
                                if (result2.rowsAffected > 0) {
                                    console.log("actualizo "+result2.rowsAffected +" cuotas");
                                    var resultCount = countLoansPushed(objInfo.loans);
                                    
                                    console.log(resultCount);
                                    var responseR = (resultCount.loans == countLoansUpdated) &&
                                        (resultCount.fees ==  countFeesUpdated) &&
                                        (resultCount.moves == countMovesUpdated);

                                        
                                    defered.resolve(responseR);
                                }else{
                                    console.log("no actualizo ninguna cuota");
                                }
                            }).catch(function (error) {
                                defered.reject(error);
                            })
                        }else{
                            console.log("no actualizo ningún prestamo");
                        }
                    }).catch(function (error) {
                        defered.reject(error);
                    });
                }
            }).catch(function(error){
                defered.reject(error);
            });

        }).catch(function(error){
            console.log(error);
            defered.reject(error);
        });

        return promise;
    };

    /**
     *
     * @param collectorId
     * @param companyId
     * @returns {pushCustomers}
     */
    var pushCustomers = function(collectorId,companyId){
        var defered = $q.defer();
        var promise =  defered.promise;
        
        SynchronizerData.getInfoNewClients().then(function(objInfo){
            console.log(objInfo);
            //console.log(mostrarPropiedades(objInfo,"objInfoSyncronizer"));
            if(objInfo ==  null){
                defered.resolve(true);
                return;
            }

            objInfo.collectorId = collectorId;
            objInfo.companyId = companyId;
            var obj = {};
            obj.data = objInfo;
            //console.log(mostrarPropiedades(obj,"obInfo"));
            queries.executeRequest('put', 'customers/addChangesV2',obj).then(function(response){
                console.log(response);
                if(response.status == 500 || response.error){
                    alert(response.msg);
                    console.log(mostrarPropiedades(response,"response"));
                }else{

                    var sqlUpdateCustomers = '(';
                    var sqlUpdateLoans = '(';
                    var sqlUpdateFees = '(';

                    var isLastCustomer;

                    var countCustomersUpdated = 0;
                    var countLoansUpdated = 0;
                    var countFeesUpdated = 0;
                    var countMovesUpdated = 0;

                    for(var i =0; i<response.customers.length; i++) {

                        isLastCustomer = (i == (response.customers.length - 1));
                        var c = response.customers[i];
                        countCustomersUpdated++;
                        sqlUpdateCustomers += c.idMobile ;
                        sqlUpdateCustomers += (isLastCustomer) ? ');' : ',';


                        if (typeof c.loans !== "undefined") {
                            var isLastLoan;
                            for (var j = 0; j < c.loans.length; j++) {

                                countLoansUpdated++;
                                var isLastLoan = (isLastCustomer && j == c.loans.length - 1);
                                var separator = (isLastLoan) ? ');' : ',';
                                var l = c.loans[j];
                                sqlUpdateLoans += l.idMobile + separator;


                                for (var k = 0; k < l.fees.length; k++) {
                                    countFeesUpdated++;
                                    var f = l.fees[k];
                                    var separator2 = (isLastLoan && l.fees.length - 1 == k) ? ');' : ',';
                                    sqlUpdateFees += f.idMobile + separator2;
                                }

                                if(typeof l.move != "undefined"){
                                    countMovesUpdated++;
                                }
                            }
                        }
                    }//fin del for de clientes

                    
                    ClientsDao.update(['is_new','is_updated'], [0,1], ' id in '+sqlUpdateCustomers).then(function(result) {

                        if(result.rowsAffected >0){
                            console.log("actualizo "+result.rowsAffected +" clientes");
                            if(sqlUpdateLoans != '(') {
                                LoansDao.updateUnscaped(['is_new', 'is_updated'], [0, 1], 'id in ' + sqlUpdateLoans,true).then(function (result2) {
                                    console.log("actualizo "+result2.rowsAffected +" prestamos");
                                    if (result2.rowsAffected > 0) {

                                        FeesDao.update(['is_new', 'is_updated'], [0, 1], ' id in ' + sqlUpdateFees).then(function (result3) {
                                            console.log("actualizo "+result3.rowsAffected +" cuotas");
                                            if (result3.rowsAffected > 0) {
                                                
                                                var resultCount = countCustomersPushed(objInfo.customers);
                                                var response = resultCount.customers == countCustomersUpdated &&
                                                    resultCount.loans == countLoansUpdated &&
                                                    resultCount.fees == countFeesUpdated &&
                                                    resultCount.moves == countMovesUpdated;

                                                defered.resolve(response);
                                                
                                            } else {
                                                defered.reject("no actualizo ninguna cuota");
                                            }
                                        }).catch(function (error) {
                                            defered.reject(error);
                                        });
                                    } else {
                                        defered.reject("no actualizo ningún prestamo");
                                    }
                                }).catch(function (error) {
                                    defered.reject(error);
                                });
                            }else{
                                defered.resolve();
                            }
                        }else{
                            defered.reject("no actualizo ningún cliente");
                        }
                    }).catch(function(error){
                        defered.reject(error);
                    });
                }


            }).catch(function(error){
            console.log(error);
            defered.reject(error);
        });

        }).catch(function(error){
            console.log(error);
        });

        return promise;
    };


    var pullPayments = function(collectorId,defered){
        var obj = {};
        obj.data = {};
        obj.data.collectorId =collectorId;
        
        queries.executeRequest('post','/payments/list/service',obj).then(function(response) {
            console.log(response);
            if(response.status != 500 || !response.error) {
                if (response.payments.length > 0) {
                    SynchronizerData.pullPayments(response.payments).then(function (arrayResult, arrayError) {
                        if (typeof arrayResult != "undefined") {
                            alert("se registraron " + arrayResult.length + " pagos del servidor");
                            defered.resolve();
                        }

                        if (typeof arrayError != "undefined") {
                            alert("Se presentaron " + arrayError.length + " al realizar los registros");
                            localDatabase.dropTables();
                            messageError();
                        }
                    }).catch(function (error) {
                        console.log(error);
                        localDatabase.dropTables();
                        messageError();
                    })
                }else{
                    defered.resolve();
                }
            }
        }).catch(function(error){
            console.log(error);
        });

    };

    var pullFees = function(collectorId,defered){
        var obj = {};
        obj.data = {};
        obj.data.collectorId = collectorId;
        
        queries.executeRequest('post','/fees/list/service',obj,null,null,false).then(function(response) {
            console.log(response);

            if(response.status != 500 || !response.error) {
                if (response.fees.length > 0) {
                    SynchronizerData.pullFees(response.fees).then(function (arrayResult, arrayError) {
                        if (typeof arrayResult != "undefined") {
                            alert("se registraron " + arrayResult.length + " cuotas del servidor");
                            pullPayments(collectorId, defered);
                        }

                        if (typeof arrayError != "undefined") {
                            alert("Se presentaron " + arrayError.length + " al realizar los registros");
                            localDatabase.dropTables();
                            messageError();
                        }
                    }).catch(function (error) {
                        console.log(error);
                        localDatabase.dropTables();
                        messageError();
                    });

                }else{
                    localDatabase.dropTables();
                    messageError();
                    defered.resolve();
                }
            }
        }).catch(function(error){
            console.log(error);
        });
    };

    var pullLoans = function(collectorId,defered){
        var obj = {};
        obj.data = {};
        obj.data.collectorId = collectorId;
        
        queries.executeRequest('post','/loans/list/service',obj,null,null,false).then(function(response) {



            if(response.status != 500 || !response.error) {
                if (response.loans.length > 0) {
                    SynchronizerData.pullLoans(response.loans).then(function (arrayResult, arrayError) {
                        console.log(arrayResult);
                        if (typeof arrayResult != "undefined") {
                            alert("se registraron " + arrayResult.length + " prestamos del servidor");
                            pullFees(collectorId, defered);
                        }

                        if (typeof arrayError != "undefined") {
                            alert("Se presentaron " + arrayError.length + " al realizar los registros");
                            localDatabase.dropTables();
                            messageError();
                        }
                    }).catch(function (error) {
                        console.log(error);
                        localDatabase.dropTables();
                        messageError();
                    });
                }else{
                    defered.resolve();
                }
            }
        }).catch(function(error){
            console.log(error);
        });
    };


    var pullCustomers = function(collectorId,defered){
        var obj = {};
        obj.data = {};
        obj.data.collectorId = collectorId;
        
        queries.executeRequest('post','/customers/list/service',obj,null,null,false).then(function(response){
            console.log(response);
            console.log(response.customers);


            if(response.status != 500 || !response.error) {
                if (response.customers.length > 0) {
                    SynchronizerData.pullCustomers(response.customers).then(function (arrayResult, arrayError) {
                        console.log(arrayResult);
                        console.log(arrayError);

                        if (typeof arrayResult != "undefined") {
                            alert("se registraron " + arrayResult.length + " Clientes del servidor");
                            pullLoans(collectorId, defered);
                        }

                        if (typeof arrayError != "undefined") {
                            alert("Se presentaron " + arrayError.length + " al realizar los registros");
                            localDatabase.dropTables();
                            messageError();
                        }
                    }).catch(function (error) {
                        console.log(error);
                        localDatabase.dropTables();
                        messageError();
                    });
                }else{
                    defered.resolve();
                }
            }

        }).catch(function(error){
            console.log(error);
        });
    };

    var pullTypePaids = function(collectorId,defered){
        queries.executeRequest('post','/typepaids/list/service',null,null,null,false).then(function(response) {
            console.log(response);

            
            if(response.status != 500 || !response.error) {
                SynchronizerData.pullTypePaids(response.typePaids).then(function(arrayResult, arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" tipos de abono del servidor");
                        pullCustomers(collectorId,defered);
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

    var pullNeighbourhooods = function(collectorId,defered) {
        var obj = {};
        obj.data = {};
        obj.data.collectorId = collectorId;
        
        queries.executeRequest('post','/neighbourhoods/list/service',obj,null,null,false).then(function(response){
            if(response.status != 500 || !response.error) {
                SynchronizerData.pullNeighbourhoods(response.neighbourhoods).then(function(arrayResult,arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" Barrios del servidor");
                        pullTypePaids(collectorId,defered);
                    }

                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                        localDatabase.dropTables();
                        messageError();
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }

        }).catch(function(error){
            console.log(error);
            localDatabase.dropTables();
            messageError();
        });
    };

    var pullZones = function(collectorId){
        var obj = {};
        obj.data = {};
        obj.data.collectorId = collectorId;
        var defered = $q.defer();
        var promise = defered.promise;
        
        queries.executeRequest('post','/zones/list/service',obj,null,null,false).then(function(response){

            if(response.status != 500 || !response.error) {
                SynchronizerData.pullZones(response.zones).then(function(arrayResult,arrayError){
                    if(typeof arrayResult != "undefined"){
                        alert("se registraron "+arrayResult.length+" Zonas del servidor");
                        pullNeighbourhooods(collectorId,defered);
                    }
                    if(typeof arrayError != "undefined"){
                        alert("Se presentaron "+arrayError.length+" al realizar los registros");
                        localDatabase.dropTables();
                        messageError();
                    }
                }).catch(function(error){
                    console.log(error);
                });
            }
            console.log((response));
        }).catch(function(error){
            console.log("ESTE ES UN CONSOLE DE PRUEBA");
            console.log(mostrarPropiedades(error,"error"));
            localDatabase.dropTables();
            messageError();
        });

        return promise;
    };

    var messageError = function(){
        alert('Se presento un error al cargar los datos por favor vuelva  a intentarlo');
    };

    var countCustomersPushed =  function(arrayCustomers){
        var objResponse = {};

        var customers = 0;
        var loans = 0;
        var fees = 0;
        var moves = 0;

        for(var i=0; i<arrayCustomers.length; i++){
            customers++;
            if(typeof arrayCustomers[i].loans != "undefined"){

                var arrayLoans = arrayCustomers[i].loans;
                for(var j=0; j<arrayLoans.length; j++){
                    loans++;
                    var arrayFees = arrayLoans[j].fees;

                    for(var k = 0; k<arrayFees.length; k++){
                        fees++;
                    }

                    if(typeof arrayLoans[j].move != "undefined"){
                        moves++;
                    }
                }
            }            
        }

        objResponse.customers = customers;
        objResponse.loans = loans;
        objResponse.fees = fees;
        objResponse.moves = moves;

        return objResponse;

    };

    var countLoansPushed = function(arrayLoans){
        var objResponse = {};

        var loans = 0;
        var fees = 0;
        var moves = 0;


        for(var i=0; i<arrayLoans.length; i++){
            loans++;
            var l = arrayLoans[i];

            for(var j=0; j< l.fees.length; j++){
                fees++;
                var f = l.fees[j];
            }

            if(typeof l.move != "undefined"){
                moves++;
            }
        }

        objResponse.loans = loans;
        objResponse.fees =fees ;
        objResponse.moves = moves;

        return objResponse;
    };

    var countFeesPushed = function(arrayLoans){
        var objResponse = {};

        var loans = 0;
        var fees =0 ;
        var payments =0;
        var moves = 0;

        for(var i=0; i<arrayLoans.length; i++){
            loans++;
            var l= arrayLoans[i];

            for(var j=0; j< l.fees.length; j++){
                fees++;
                var f = l.fees[j];

                for(var k=0; k< f.payments.length; k++){
                    payments++;
                }
            }

            if(typeof l.moves != "undefined"){
                moves++;
            }
        }

        objResponse.loans = loans;
        objResponse.fees = fees;
        objResponse.payments = payments;
        objResponse.moves = moves;
        return objResponse;
    };

    var countMovesPushed = function(arrayMoves){
        var objResponse = {};

        var moves = 0;

        for(var i=0; i<arrayMoves.length; i++){
            moves++;
        }
        objResponse.moves = moves;
        return objResponse;
    };

    return this;
});