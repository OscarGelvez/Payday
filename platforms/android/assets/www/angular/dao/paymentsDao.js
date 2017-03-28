
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('PaymentsDao', function ($q,localDatabase,CalculatorDate,FeesDao) {

    var self = this;
    /**
     * función que permite agregar un nuevo pago a una cuota determinada
     * @param objPayment objeto con la información del pago
     * @param state entero que determina la acción a tratar con las cuotas, valores 1 cuando se vaya a  pagar el valor de la deuda acutal
     * 2 para el caso donde se vaya  a pagar un valor menor al valor de la cuota.
     * 3 para el caso donde se vaya a pagar un valor mayor al valor de la cuota
     *
     */
    this.create = function(objPayment){
        var defered = $q.defer();
        var promise = defered.promise;

        createdState1(objPayment,defered);

        return promise;
    };

    this.allByLoanId = function(loanId){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = "select * from payments where fee_id in(select id from fees where loan_id = ?)";
        var params = [loanId];

        localDatabase.query(sql,params).then(function(result){

            var arrayResponse = new Array();
            var rows = result.rows;

            var payment = {};
            for(var i= 0; i<rows.length; i++){
                var r= rows.item(i);

                if(payment.move_id != r.move_id){
                    payment = {
                        id : r.id,
                        value : r.value,
                        feeId : r.fee_id,
                        created : r.created,
                        move_id : r.move_id
                    };
                    arrayResponse.push(payment);
                }else{
                    payment.value += r.value;
                }
            }
            
            defered.resolve(arrayResponse,result);
        }).catch(function(error){
            defered.reject(error);
        });
        return promise;
    };


    var compareDates = function(stringDate,stringDate2){
        var d1,d2;
        if(stringDate.length > 10){
            d1 = stringDate.split(" ")[0];
        }else{
            d1 = stringDate;
        }

        if(stringDate2.length > 10){
            d2 = stringDate2.split(" ")[0];
        }else{
            d2 = stringDate2;
        }

        return d1 == d2;
    };

    var createdState1 = function(objPayment,defered){
        var value = objPayment.value;
        
        FeesDao.listAllPending(objPayment.loanId).then(function(arrayResponse, result){
            if(arrayResponse !== null){
                var sqlInsertPayment = 'INSERT INTO PAYMENTS (value,fee_id,created,description,move_id) VALUES (?,?,?,?,?);';
                var paramsInsertPayments = new Array();

                var sqlUpdateFee = 'UPDATE fees SET state=0 , is_updated = 0 where id in (';
                var sqlPartialPayment = '';
                for(var i=0; i<arrayResponse.length && value>0; i++){

                    var currentFee = arrayResponse[i];
                    var valuePayment = (currentFee.valuePayments == null) ? 0 : currentFee.valuePayments ;

                    if(value >= (currentFee.value-_int(valuePayment)) ){

                        value -= (currentFee.value-_int(valuePayment));
                        var stringDate = (typeof  objPayment.testDate == "undefined") ?
                            CalculatorDate.curDateString('-','yyyy-mm-dd') :
                            objPayment.testDate;

                        paramsInsertPayments.push([
                            currentFee.value - valuePayment,
                            currentFee.id,
                            stringDate,
                            '',
                            objPayment.moveId
                            ]
                        );

                        sqlUpdateFee+= currentFee.id+',';
                    }else{
                        
                        if(paramsInsertPayments.length === 0){
                            /**
                             * en el caso que no se haya registrado ningún parametro para la inserción significa que
                             * tampoco se debe actualizar ninguna cuota por lo que se remplaza el sql de actualización
                             * por cualquier consulta sql que permita mantener la estructura la de consulta final de la
                             * linea 93
                             */
                            sqlUpdateFee = 'select date("now")';

                        }

                        var stringDate = (typeof  objPayment.testDate == "undefined") ?
                            CalculatorDate.curDateString('-','yyyy-mm-dd') :
                            objPayment.testDate;

                        sqlPartialPayment = 'UPDATE fees SET state=2,is_updated=0 where id = '+currentFee.id;
                        paramsInsertPayments.push([
                            value,
                            currentFee.id,
                            stringDate,
                            '',
                            objPayment.moveId
                            ]
                        );
                        value = 0;
                    }
                }

                sqlUpdateFee = sqlUpdateFee.substring(0, sqlUpdateFee.length-1);
                sqlUpdateFee += ');'
                
                /*
                console.log(sqlInsertPayment);
                console.log(paramsInsertPayments);
                console.log(sqlUpdateFee);
                console.log(sqlPartialPayment);
                */

                localDatabase.multipleQueries(sqlInsertPayment,paramsInsertPayments).then(function(arrayResult, arrayError){


                    arrayResult = arrayResult || new Array();
                    arrayError =  arrayError || new Array();
                    localDatabase.query(sqlUpdateFee).then(function(result){
                        if(sqlPartialPayment !== '' ){
                            localDatabase.query(sqlPartialPayment).then(function(result){

                                defered.resolve(arrayResult[arrayResult.length-1].insertId,result);
                            }).catch(function(error){
                                defered.reject(error);
                            })
                        }else{
                            defered.resolve(arrayResult[arrayResult.length-1].insertId,result);
                        }
                        
                        createPaidLastFee(objPayment);

                    }).catch(function(error){
                        defered.reject(error);
                    });

                });
            }
        }).catch(function(error){

        });
    };

    var _int = function(value){
        return parseInt(value);
    }

    var createPaidLastFee = function(obj){
        var defered = $q.defer();
        var promise = defered.promise;

        var typePaid = obj.typePaid;
        
        if(typePaid == 2 && obj.paidBalance != null &&  typeof obj.paidBalance != "undefined" && obj.paidBalance.length>0){
            var sql = "";
            var params = [];

            sql = "INSERT INTO PAYMENTS (value,fee_id,created,description,type_of_fee,move_id,is_updated) VALUES " +
            "(?,(select id from fees where loan_id = ? order by payment_date desc limit 1),?,?,2,?,0)";

            params.push(obj.paidBalance);
            params.push(obj.loanId);
            var stringDate = (typeof  obj.testDate == "undefined") ?
                CalculatorDate.curDateString('-','yyyy-mm-dd') :
                obj.testDate;
            params.push(stringDate);
            params.push('');
            params.push(obj.moveId);


            //console.log(sql,params);
            localDatabase.query(sql,params).then(function(result){
                console.log(result);
                localDatabase.query('update fees set state=2 , is_updated = 0 where id in (select id from fees where loan_id = ? order by payment_date desc limit 1)',[obj.loanId]);
                defered.resolve(result);
            }).catch(function(error){
                defered.reject(error);
            });
        }else{
            return;
        }

        return promise;
    };

    this.updateUnescaped = function(param,value,where, isArray){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = "";
        isArray = isArray || false;
        if(isArray){

        }else{
            sql = "UPDATE payments SET "+param+"="+value+" WHERE "+where;
        }

        localDatabase.query(sql).then(function(result){
            defered.resolve(result);
            console.log(result);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    /*
    this.getValuePayment = function(loanId){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'SELECT SUM(value) as "paymentValue" FROM payments WHERE fee_id in (select id from fees where loan_id = ?)';
        var params = [loanId] ;

        localDatabase.query(sql,params).then(function(result){
            if(result.rows.length > 0){

                defered.resolve(result.rows.item(0).paymentValue,result);
            }else{
                defered.resolve(null,result);
            }
        }).catch(function(error){
            defered.reject(error);
        });


        return promise;
    }

    */

    return this;
});