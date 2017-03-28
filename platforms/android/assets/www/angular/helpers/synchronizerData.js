
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('SynchronizerData', function(localDatabase,$q){

    this.getNews = function(tableName,where,arrayIndexInput,arrayIndexOutput){
        arrayIndexOutput = arrayIndexOutput || arrayIndexInput;
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'select * from '+tableName+' where '+where;
        localDatabase.query(sql).then(function(result){
            var arraysObj = new Array();

            if(result.rows.length > 0){

                for(var i=0; i<result.rows.length; i++){
                    var r= result.rows.item(i);
                    var newObj = {};
                    for(var j=0; j<arrayIndexInput.length; j++){
                        newObj[arrayIndexOutput[j]] = r[arrayIndexInput[j]];
                    }
                    arraysObj.push(newObj);
                }
            }

            defered.resolve(arraysObj);

        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.pullPayments = function(arryaPayments){
        var defered = $q.defer();
        var promise = defered.promise;

        var arrayFields = [
            'id',
            'value',
            'fee_id',
            'created',
            'description',
            'type_of_fee',
            'is_updated',
            'move_id'
        ];

        var properties = [
            'id',
            'value',
            'fee_id',
            'created_at',
            'description',
            'type_of_fee',
            'is_updated',
            'move_id'
        ];

        pull(arrayFields, properties, 'payments', arryaPayments).then(function(arrayResult,arrayErrors){
            defered.resolve(arrayResult,arrayErrors);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.pullFees = function(arrayFees){
        var defered = $q.defer();
        var promise = defered.promise;

        var arrayFields = [
            'id',
            'interest_arrears',
            'loan_id',
            'payment_date',
            'state',
            'value',
            'is_updated',
            'is_new'
        ];

        var properties = arrayFields;

        pull(arrayFields, properties, 'fees', arrayFees).then(function(arrayResult,arrayErrors){
                    defered.resolve(arrayResult,arrayErrors);
        }).catch(function(error){
                    defered.reject(error);
        });

        return promise;
    };

    this.pullLoans = function(arrayLoans){
        var defered = $q.defer();
        var promise = defered.promise;

        var arrayFields = [
            'balance',
            'created',
            'customer_id',
            'date_end',
            'guarantor_id',
            'id',
            'interest_produced',
            'interest_rate',
            'numbers_of_fee',
            'pay_period',
            'retention',
            'start_date',
            'state',
            'type_paid_id',
            'value_loaned',
            'is_new',
            'is_updated'
        ];

        var properties = [
            'balance',
            'created_at',
            'customer_id',
            'end_date',
            'guarantor_id',
            'id',
            'interest_produced',
            'interest_rate',
            'numbers_of_fee',
            'pay_period',
            'retention',
            'start_date',
            'state',
            'type_paid_id',
            'value_loaned',
            'is_new',
            'is_updated'
        ];

        pull(arrayFields, properties, 'loans', arrayLoans).then(function(arrayResult,arrayErrors){
            defered.resolve(arrayResult,arrayErrors);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };


    this.pullTypePaids = function(arrayPaids){
        var defered = $q.defer();
        var promise = defered.promise;

        var arrayFields = [
            'id',
            'name',
            'description'
        ];

        var properties = arrayFields;
        pull(arrayFields, properties, 'type_paids', arrayPaids).then(function(arrayResult,arrayErrors){
            defered.resolve(arrayResult,arrayErrors);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.pullCustomers = function(arrayCustomers){
        var defered = $q.defer();
        var promise = defered.promise;

        var arrayFields = [
            'address',
            'document',
            'email',
            'id',
            'is_evil',
            'name',
            'neighbourhood_id',
            'phone_numbers',
            'route_position',
            'my_client',
            'is_updated',
            'is_new'
        ];

        var properties = arrayFields;

        pull(arrayFields, properties, 'customers', arrayCustomers).then(function(arrayResult,arrayErrors){

            defered.resolve(arrayResult,arrayErrors);
        }).catch(function(error){
            console.log(error);
            defered.reject(error);
        });

        return promise;
    };

    this.pullNeighbourhoods = function(arrayNeighbourhoods){
        var defered = $q.defer();
        var promise = defered.promise;

        var arrayFields= [
            'id',
            'name',
            'zone_id'
        ];
        var properties = arrayFields;

        pull(arrayFields, properties, 'neighbourhoods', arrayNeighbourhoods).then(function(arrayResult,arrayErrors){
            defered.resolve(arrayResult,arrayErrors);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.pullZones = function(arrayZones){

        var defered = $q.defer();
        var promise = defered.promise;

        var arrayFields = [
            'id',
            'name'
        ];

        var properties = [
            'id',
            'name'
        ];

        pull(arrayFields, properties, 'zones', arrayZones).then(function(arrayResult,arrayErrors){
            defered.resolve(arrayResult,arrayErrors);
        }).catch(function(error){
            defered.reject(error);

        });

        return promise;
    };


    var pull = function(arrayFields,properties,tableName,data,arrayConstant){
        var sql = concatSqlInsert(arrayFields,tableName);

        var params = new Array();

        for(var i=0; i<data.length; i++){
            var current = data[i];
            var currentArray = new Array();

            for(var j=0; j<properties.length; j++){
                currentArray.push(current[ properties[j] ]);
            }
            params.push(currentArray);
        }

        //console.log(params);
        var defered = $q.defer();
        var promise = defered.promise;


        localDatabase.multipleQueries(sql, params).then(function(arrayResult,arrayErrors){
            defered.resolve(arrayResult,arrayErrors);
        }).catch(function(error){
            defered.reject(error);
        });
        return promise;
    }

    var concatSqlInsert = function(fields,table){
        var sql = 'INSERT INTO '+table+' (';
        var values = '(';

        for(var i=0; i<fields.length; i++){

            var separator = (i == fields.length-1) ?  ')' : ',';
            sql+= fields[i]+separator;
            values+= '?'+separator;

        }
        //console.log(sql+' values '+values);
        return sql+' VALUES '+values;
    }

    /**
     * función en cargar de cargar todos los nuevos  usuarios del sistema
     * en caso que un nuevo usuario tenga un prestamo se traera toda la informació del prestamo así como también
     * toda la información de cada una de las cuotas que corresponden a un prestamo
     * @returns {promise} retorna un promesa que en caso de realizar la consulta efectivamente retornara un objeto json
     * con un todos los nuevos clientes en el
     */
    this.getInfoNewClients = function(){
        var sql = 'select   c.*,  l.balance as "l_balance",  l.created as "l_created",  l.date_end as "l_date_end",  l.guarantor_id as "l_guarantor_id",  l.id as "l_id",  l.customer_id as "l_customer_id",  l.interest_produced as "l_interest_produced",  l.interest_rate as "l_interest_rate",  l.is_new as "l_is_new",  l.is_updated as "l_is_updated",  l.numbers_of_fee as "l_numbers_of_fee",  l.pay_period as "l_pay_period",  l.retention as "l_retention",  l.start_date as "l_start_date",  l.state as "l_state",  l.type_paid_id as "l_type_paid_id",  l.value_loaned as "l_value_loaned",  f.id as "f_id",  f.interest_arrears as "f_interest_arrears",  f.is_new as "f_is_new",  f.is_updated as "f_is_updated",  f.payment_date as "f_payment_date",  f.state as "f_state",  f.loan_id  as "f_loan_id",  f.value as "f_value",  m.created as "m_created",  m.description as "m_description",  m.hour as "m_hour",  m.id as "m_id",  m.is_move_business as "m_is_move_business",  m.loan_id as "m_loan_id",  m.type as "m_type",  m.value as "m_value"  from customers c   left join loans l on( l.customer_id = c.id)  left join fees f on(  f.loan_id =  l.id) left join moves m on(m.loan_id =  l.id)  where c.is_new = 1 order by c.id desc';

        var defered = $q.defer();
        var promise = defered.promise;

        localDatabase.query(sql).then(function(result){
            var objJsonResponse = {};
            objJsonResponse.customers = new Array();

            console.log(result);

            if( result.rows.length > 0 ){

                var idCustomer = -1;
                var idLoan = -1;

                for(var i=0; i<result.rows.length; i++){
                    var r= result.rows.item(i);
                    var idNewCustomers = r.id;

                    var customer = null;
                    var loan = null;

                    if(idNewCustomers != idCustomer){

                        idCustomer = idNewCustomers;
                        var newCustomer = createModelCustomer(r);
                        objJsonResponse.customers.push(newCustomer);
                        customer = newCustomer;

                    }else{
                        customer = objJsonResponse.customers[objJsonResponse.customers.length-1];
                    }


                    if( typeof r.l_id !== "undefined" && r.l_id !== null){

                        if(typeof customer.loans == "undefined"){
                            customer.loans = new Array();
                        }

                        if(idLoan != r.l_id){
                            idLoan = r.l_id;
                            var newLoan = createModelLoan(r);
                            customer.loans.push(newLoan);
                            loan = newLoan;
                        }else{
                            loan =  customer.loans[customer.loans.length-1];
                        }
                    }

                    if(typeof r.f_id !== "undefined" && r.f_id !== null){
                        if(loan != null){

                            if(typeof loan.fees  == "undefined"){
                                loan.fees= new Array();
                            }

                            loan.fees.push(createModelFee(r));
                        }
                    }

                    if( typeof r.m_id !== "undefined" && r.m_id !== null){
                        loan.move = createModelMove(r);
                    }

                }

                defered.resolve(objJsonResponse);
                return;
            }
            defered.resolve(null);
        }).catch(function(error){
            console.log(error);
            defered.reject(error);
        });

        return promise;
    };

    this.getInfoNewLoans = function(){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'select l.balance as "l_balance", l.created as "l_created", l.date_end as "l_date_end", l.guarantor_id as "l_guarantor_id", l.id as "l_id", l.interest_produced as "l_interest_produced", l.interest_rate as "l_interest_rate", l.is_new as "l_is_new", l.is_updated as "l_is_updated", l.numbers_of_fee as "l_numbers_of_fee", l.pay_period as "l_pay_period", l.retention as "l_retention", l.start_date as "l_start_date", l.state as "l_state", l.type_paid_id as "l_type_paid_id", l.value_loaned as "l_value_loaned", l.customer_id as "l_customer_id", f.id as "f_id", f.interest_arrears as "f_interest_arrears", f.is_new as "f_is_new", f.is_updated as "f_is_updated", f.payment_date as "f_payment_date", f.state as "f_state", f.value as "f_value", f.loan_id as "f_loan_id" from loans l join fees f on (l.id = f.loan_id) where l.is_new = 1';

        localDatabase.query(sql).then(function(result){
            var idLoan = -1;
            var objResponse = {};
            console.log(result);
            if(result.rows.length > 0){
                objResponse.loans = new Array();
            }else{
                defered.resolve(null);
            }

            var sqlMoves = 'select  l.id as "l_id", m.created as "m_created",  m.description as "m_description",  m.hour as "m_hour",  m.id as "m_id",  m.is_move_business as "m_is_move_business",  m.loan_id as "m_loan_id",  m.type as "m_type",  m.value as "m_value"  from moves m  join loans l on(l.id = m.loan_id)  where l.id in(';
            for(var i=0; i<result.rows.length; i++){
                var loan;
                var r = result.rows.item(i);

                if(idLoan != r.l_id){
                    idLoan = r.l_id;
                    sqlMoves += idLoan +',' ;

                    var newLoan = createModelLoan(r);
                    objResponse.loans.push(newLoan);

                    loan = newLoan;
                }else{
                    loan = objResponse.loans[objResponse.loans.length-1];
                }

                if(loan != null && typeof loan.fees == "undefined"){
                    loan.fees = new Array();
                }
                var newFee = createModelFee(r);

                loan.fees.push(newFee);
            }
            
            sqlMoves = sqlMoves.substring(0,sqlMoves.length-1)+');';
            

            localDatabase.query(sqlMoves).then(function(result){
                
                for(var i=0; i<result.rows.length; i++){
                    var r= result.rows.item(i);
                    for(var j=0; j<objResponse.loans.length; j++){
                        var l = objResponse.loans[j];
                        if(l.id == r.l_id){
                            objResponse.loans[j].move = createModelMove(r);
                        }
                    }
                }

                defered.resolve(objResponse);
            }).catch(function(error){
                defered.reject(error);
            })
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.outdatedLoans = function(){
        var sql = 'select   l.balance as "l_balance",   l.created as "l_created",   l.date_end as "l_date_end",     l.guarantor_id as "l_guarantor_id",     l.id as "l_id",     l.customer_id as "l_customer_id",   l.interest_produced as "l_interest_produced",   l.interest_rate as "l_interest_rate",   l.is_new as "l_is_new",     l.is_updated as "l_is_updated",     l.numbers_of_fee as "l_numbers_of_fee",     l.pay_period as "l_pay_period",     l.retention as "l_retention",   l.start_date as "l_start_date",     l.state as "l_state",   l.type_paid_id as "l_type_paid_id",     l.value_loaned as "l_value_loaned",     f.id as "f_id",     f.interest_arrears as "f_interest_arrears",     f.is_new as "f_is_new",     f.is_updated as "f_is_updated",     f.payment_date as "f_payment_date",     f.state as "f_state",   f.loan_id  as "f_loan_id",      f.value as "f_value",   p.created as "p_created",   p.description as "p_description",   p.fee_id as "p_fee_id",     p.id as "p_id",     p.is_updated as "p_is_updated",     p.type_of_fee as "p_type_of_fee",   p.value as "p_value",   p.move_id as "p_move_id",   m.created as "m_created",   m.description as "m_description",   m.hour as "m_hour",     m.id as "m_id",     m.is_move_business as "m_is_move_business",     m.loan_id as "m_loan_id",   m.type as "m_type",     m.value as "m_value" from loans l left join fees f on( l.id = f.loan_id ) left join payments p on( p.fee_id = f.id ) left join moves m on ( m.id = p.move_id ) where    l.is_updated = 0 and    f.is_updated=0 and  p.is_updated=0;';

        var defered = $q.defer();
        var promise = defered.promise;

        localDatabase.query(sql).then(function(result){
            var objResponse = {};

            if(result.rows.length > 0){
                objResponse.loans = new Array();
            }else{
                defered.resolve(null);
                return;
            }

            
            var idLoan = -1;
            var idFee = -1;

            for(var i=0; i<result.rows.length; i++){
                var r = result.rows.item(i);
                var loan = null;
                var fee = null;

                if(r.l_id  != idLoan){
                    idLoan = r.l_id;
                    var newLoan = createModelLoan(r);

                    objResponse.loans.push(newLoan);
                    loan = newLoan;
                }else{
                    loan = objResponse.loans[objResponse.loans.length-1];
                }


                if( r.f_id != null && loan != null){

                    if( typeof loan.fees == "undefined" ){
                        loan.fees = new Array();
                    }



                    if(idFee != r.f_id ){
                        idFee = r.f_id;
                        var newFee =  createModelFee(r);
                        fee = newFee;
                        loan.fees.push(newFee);
                    }else{
                        fee = loan.fees[loan.fees.length-1]
                    }


                }

                if(r.p_id != null && fee != null ){
                    if(typeof fee.payments == "undefined"){
                        fee.payments = new Array();
                    }
                    fee.payments.push(createModelPayment(r));
                    //sqlMoves+= r.p_id + (i == result.rows.length -1) ? ');' : ',';
                }


                if( r.m_id != null && loan != null ){

                    if(typeof loan.moves == "undefined"){
                        loan.moves = new Array();
                    }

                    if(!validateNotHasMove(loan.moves,r.m_id)){
                        loan.moves.push(createModelMove(r));
                    }

                }


            }//fin del for de loans

            /*
            localDatabase.query(sqlMoves).then(function(result){
                for(var i=0; i<result.rows.length; i++){
                    var r = result.rows.item(i);

                    for(var j=0; j<obj.loans.length; j++){
                        var l = obj.loans[j];
                    }

                }
            }).catch(function(error){

            });
            */

            defered.resolve(objResponse);

        }).catch(function(error){
            console.log(error);
        });

        return promise;
    };

    var validateNotHasMove = function(arrayMoves,id){
        for (var i = 0; i < arrayMoves.length; i++) {
            if(arrayMoves[i].id == id){
                return true;
            }
        }
        return false;
    };

    this.outdatedMoves = function(){
        var sql = 'select m.created as "m_created",m.description as "m_description",m.hour as "m_hour",m.id as "m_id",m.is_move_business as "m_is_move_business",m.loan_id as "m_loan_id",m.type as "m_type",m.value as "m_value" from moves m where m.loan_id is null and m.is_move_payment = 0';

        var defered = $q.defer();
        var promise = defered.promise;

        localDatabase.query(sql).then(function(result){
            var objResponse = {};
            objResponse.moves = new Array();

            if(result.rows.length <= 0){
                defered.resolve(null);
                return;
            }

            for(var i=0; i<result.rows.length; i++){
                var r= result.rows.item(i);

                var newMove =  createModelMove(r);
                objResponse.moves.push(newMove);
            }
            console.log(objResponse);
            defered.resolve(objResponse);
        }).catch(function(error){
            console.log(error);
            defered.reject(error);
        });

        return promise;
    };


    var createModelPayment = function(row){
        var arrayFields = ['p_created','p_description','p_move_id','p_fee_id','p_id','p_is_updated','p_type_of_fee','p_value'];

        var arrayAttribs = ['created','description','move_id','fee_id','id','is_updated','type_of_fee','value'];

        return createModel(row,arrayFields,arrayAttribs);
    };

    var createModelMove = function(row){
        var arrayFields = ['m_created','m_description','m_hour','m_id','m_is_move_business',
            'm_loan_id','m_type','m_value'];

        var arrayAttribs = ['created','description','hour','id','is_move_business',
            'loan_id','type','value'];

        return createModel(row,arrayFields,arrayAttribs);
    }

    var createModelCustomer = function(row){
        var arrayFields = ['address','document','email','id','is_evil','my_client','name','neighbourhood_id',
            'phone_numbers','route_position'
        ];
        return createModel(row,arrayFields);
    };

    var createModelLoan = function(row){

        var arrayFields = ["l_balance","l_created","l_date_end","l_guarantor_id","l_id","l_interest_produced",
            "l_interest_rate","l_numbers_of_fee","l_pay_period","l_retention",
            "l_start_date","l_state","l_type_paid_id","l_value_loaned","l_customer_id"
        ];

        var arrayAttribs = ["balance","created","date_end","guarantor_id","id","interest_produced",
            "interest_rate","numbers_of_fee","pay_period","retention","start_date","state",
            "type_paid_id","value_loaned","customer_id"
        ];

        return createModel(row, arrayFields,arrayAttribs);
    };

    var createModelFee = function(row){
        var arrayFields = ["f_id","f_interest_arrears","f_payment_date","f_state","f_value","f_loan_id"];
        var arrayAttribs = ["id","interest_arrears","payment_date","state","value","loan_id"];

        return createModel(row,arrayFields,arrayAttribs);
    }



    var createModel  = function(row, arrayFields, arrayAttribs){
        arrayAttribs = arrayAttribs || arrayFields;
        var obj = {};
        for(var i=0 ; i < arrayFields.length; i++){
            obj[arrayAttribs[i]] = row[arrayFields[i]];
        }
        return obj;
    };


    return this;

});