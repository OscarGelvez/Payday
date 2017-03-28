
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('LoansDao', function ($q,localDatabase,CalculatorDate) {
    
    /**
     * Función que permite registrar un nuevo credito en el sistema con la
     * información basica necesaria
     * @param {int} customer_id
     * @param {string} start_date fecha con formato de la base de datos
     * @param {int} pay_period frecuencía con la que se realizara cada cobro
     * @param {type} interest_rate
     * @param {type} value_loaned
     * @param {type} type_paid_id
     * @param {type} retention
     * @param {type} guarantor_id
     * @param {type} numbers_of_fee
     * @returns {defered.promise}
     */
    this.create = function(customer_id, start_date,end_date,
        pay_period, interest_rate, value_loaned, type_paid_id,
        retention, guarantor_id,numbers_of_fee){

        var created = CalculatorDate.curDateString('-','yyyy-mm-dd');
        

        var interest_produced = (type_paid_id == 1) ?
            (value_loaned * (interest_rate/100)) :
            (numbers_of_fee * (value_loaned * (interest_rate/100)));

        var balance = value_loaned + interest_produced;


        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'INSERT INTO loans ( customer_id, created, start_date, date_end, '+
                'pay_period,  balance,'+
                'interest_rate,interest_produced, value_loaned, type_paid_id,'+
                ' retention, '+((validateField(guarantor_id)) ? 'guarantor_id,' : '' )+' numbers_of_fee) VALUES('+
                '?,?,?,?,?,?,?,?,?,?,?,?'+(validateField(guarantor_id)? ',?':'')+' )';
        var arrayInfo = [
            customer_id, created, start_date, end_date,
            pay_period,  balance,
            interest_rate,interest_produced, value_loaned,
            type_paid_id, retention
        ];

        if(validateField(guarantor_id)){
            arrayInfo.push(guarantor_id);
        }
        arrayInfo.push(numbers_of_fee);
        localDatabase.query(sql,arrayInfo).then(function(result){

            defered.resolve(result);
        }).catch(function(error){
            console.error(error);
            defered.reject(error);
        });
        
        return promise;
    };

    this.delete = function(where){
        var defered =$q.defer();
        var promise = defered.promise;

        var sql = 'DELETE FROM loans WHERE '+where;

        localDatabase.query(sql).then(function(result){
            defered.resolve(result);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.update = function(fieldName,newValue,where,showSql){
        var defered = $q.defer();
        var promise = defered.promise;
        showSql = showSql || false;
        var sql = 'update loans set '
        var params = [];

        if(typeof fieldName === "object"){
            for(var i=0; i<fieldName.length; i++){
                sql += fieldName[i] +" = "+newValue[i];
                sql += (i == fieldName.length-1) ? '' : ',';
            }
            sql+= " where "+where;
        }else{
            console.log("deprecated");
        }

        if(showSql){
            console.log(sql);
        }

        localDatabase.query(sql,params).then(function(result){
            defered.resolve(result);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    }

    this.updateUnscaped = function(param, value,where,isArray){
        var defered = $q.defer();
        var promise = defered.promise;

        isArray = isArray || false;
        if(isArray){
            var sql = 'UPDATE loans set ';
            for(var i=0; i<param.length; i++) {
                sql += param[i] + " = " + value[i];
                sql += (i == param.length - 1) ? '' : ',';
            }
            sql+= ' where ' + where;
            console.log(sql);
            localDatabase.query(sql).then(function(result){
                defered.resolve(result);
            }).catch(function(error){
                defered.reject(error);
            })

        }else{
            var sql = "UPDATE loans set "+param +" ="+ value+" WHERE "+ where;
            //console.log(sql);
            localDatabase.query(sql).then(function(result){
                defered.resolve(result);
            }).catch(function(error){
                defered.reject(error);
            })
        }

        return promise;
    };

    this.detail =  function(id){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'select  (  select count(*) from fees where loan_id =l.id and state = 0  ) as "fees_paid",  (  select count(*) from fees where loan_id=l.id and state=2 ) as "fees_partial_paid",  l.balance as "balance",  l.numbers_of_fee as "number_fees",  l.date_end as "date_end",  l.created as "date_created",  l.start_date as "date_started",  l.interest_rate as "interest", ( select created from payments p where  p.fee_id in (select id from fees where loan_id = l.id and state <> 1) order by created desc limit 1 ) as "last_paid_date", ( select value from payments p where  p.fee_id in (select id from fees where loan_id = l.id and state <> 1) order by created desc limit 1 ) as "last_paid_value" from loans l  join fees f on(f.loan_id = l.id)  where l.id = ?';

        var params = [id];
       // console.log(sql.replace("?",params[0]));
        localDatabase.query(sql,params).then(function(result){
            var objResponse = {};
            console.log(result);
            if(result.rows.length>0){
                var r = result.rows.item(0);
                defered.resolve({
                    feesPaid : r.fees_paid,
                    feesPartialPaid : r.fees_partial_paid,
                    lastPaymentDate : r.last_paid_date,
                    lastPaymentValue : r.last_paid_value,
                    balance : r.balance,
                    numbersFee : r.number_fees,
                    dateEnd : r.date_end,
                    dateCreated : r.date_created,
                    dateStart : r.date_started,
                    interest : r.interest
                },result);
            }else{
                defered.resolve(null,result);
            }
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };


    this.getStateFees = function (id){

        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'select   f.id as "f_id",     f.value "f_value",  p.value as "p_value",   p.id as "p_id",  f.state from fees f left join payments p on(p.fee_id = f.id)where loan_id = ?';
        var params = [id];

        localDatabase.query(sql,params).then(function(result){
            console.log(result);
            if(result.rows.length  == 0){
                console.log("no se encontro nada");
                defered.resolve(null);
            }

            var arrayFees= new Array();

            var idFee = -1;
            for(var i = 0; i < result.rows.length; i++) {
                var r = result.rows.item(i);
                var currentFee;

                if(r.f_id != idFee){
                    idFee = r.f_id;
                    currentFee = createModelStateFee(r);
                    currentFee.balance =  currentFee.value;
                    arrayFees.push(currentFee);
                }else{
                    currentFee = lastElement(arrayFees);
                }

                if(typeof currentFee.payments == "undefined"){
                    currentFee.payments = new Array();
                }
                
                if(r.p_id !=  null){
                    var payment = createModelPaymentStateFee(r);
                    currentFee.balance -= payment.value;
                    currentFee.payments.push(payment);
                }

            };

            defered.resolve(arrayFees);

        }).catch(function(error){
            defered.resolve(error);
        })

        return promise;

    };

    var lastElement = function(array){
        return (array.length == 0) ? null : array[array.length-1];
    };
    
    var createModelPaymentStateFee = function(row){
        return createModel({
            id : "p_id",
            value : "p_value"
        },row);
    };

    var createModelStateFee = function(row){
        return createModel({
            id : "f_id",
            value : "f_value",
            state : "state"
        },row);
    };

    var createModel = function(attributes,row){
        var objModel = {};
        for(var key in attributes){
            objModel[key] = row[attributes[key]];
        }
        return objModel;
    };
    
    var validateField = function(field){
        return (typeof field !== "undefined" && field !== null || field != '');
    };
    
    return this;
});