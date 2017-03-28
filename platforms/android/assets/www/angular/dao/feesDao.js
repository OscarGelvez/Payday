
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('FeesDao', function ($q,localDatabase,CalculatorDate) {

    this.saveAll= function (arrayObjects){
        var defered = $q.defer();
        var promise = defered.promise;

        var params = new Array();
        var sql = 'insert into fees(payment_date,state,value,interest_arrears,loan_id) values(?,?,?,?,?);';
        for(var i=0; i<arrayObjects.length; i++){


            var newParams = new Array();

            newParams.push(CalculatorDate.parseDateToString(arrayObjects[i].paymentDate,'yyyy-mm-dd','-'));
            newParams.push(arrayObjects[i].state);
            newParams.push(arrayObjects[i].value);
            newParams.push(arrayObjects[i].interestArrears);
            newParams.push(arrayObjects[i].loanId);
            params.push(newParams);
        }
        //console.log(sql);

        localDatabase.multipleQueries(sql,params).then(function(arrayResponse, arrayErrors){
            arrayResponse = arrayResponse || new Array();
            arrayErrors = arrayErrors || new Array();
            defered.resolve(arrayResponse,arrayErrors);
        }).catch(function(error){
            console.log(error);
        });

        return promise;
    };

    this.delete = function(where){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'DELETE FROM fees WHERE '+where;

        localDatabase.query(sql).then(function(result){
            defered.resolve(result);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    var  imprimirParametros = function(array){
        var r = '';

        for(var i =0 ; i<array.length; i++){
            r+= (i+1)+'-'+array[i]+"\n ";
        }

        return r;
    };

    this.dayListReceivable = function(date){
        var defered = $q.defer();
        var promise = defered.promise;
        date = date || CalculatorDate.curDateString('-','yyyy-mm-dd');////"2015-05-20";

        var sql = 'select c.route_position as "customer_route_position" ,' +
            ' c.address as "customer_address", c.name as "customer_name" , ' +
            ' f.id as "fee_id", l.id as "loan_id", ' +
            '(' +
                'select case when' +
                '(' +
                    '(' +
                        'select(case when (select sum(value) from payments where fee_id = f.id) = f.value then 1 else 0 end)' +
                    ')+(' +
                        'select count(*) ' +
                        'from payments ' +
                        'where fee_id in(' +
                            'select id ' +
                            'from fees ' +
                            'where loan_id = f2.loan_id' +
                        ') and created = f2.payment_date' +
                    ')' +
                ') > 0 ' +
                'then "true" ' +
                'else "false" ' +
                'end from fees f2 ' +
                'where f2.id = f.id'+
            ') as "has_payment"' +
            ' from fees f join loans l on( l.id = f.loan_id)' +
            ' join  customers c on(c.id = l.customer_id)' +
            ' where f.payment_date = date(?) and l.state <> 0 '+
            //' and date(l.created) <> date(?) '+
            ' order by c.route_position asc';

        var params  = [
            date
            //,CalculatorDate.curDateString('-','yyyy-mm-dd')
        ];
        //console.log(sql);
        localDatabase.query(sql,params).then(function(result){
            var arrayResponse = new Array();
            for(var i=0; i<result.rows.length; i++){
                var r = result.rows.item(i);
                arrayResponse.push({
                    route_position: r.customer_route_position,
                    address: r.customer_address,
                    name: r.customer_name,
                    feeId: r.fee_id,
                    loanId : r.loan_id,
                    hasPayment : r.has_payment
                });
            }
            defered.resolve(arrayResponse);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };


    this.get = function(id){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'select  f.id as "fee_id", f.value as "fee_value", l.type_paid_id, (  (  select sum(f2.value)  from fees f2  where f2.payment_date < f.payment_date AND  f2.loan_id = f.loan_id  ) -  IFNULl( (  select sum(p.value)  from payments p  where type_of_fee =1 and p.fee_id in (  select f3.id  from fees f3  where f3.loan_id = l.id  ) ),0 ) ) as "debt" , l.id as "loan_id" , l.value_loaned, l.interest_produced, l.balance, c.name, c.document, f.payment_date  from fees f  join loans l on(f.loan_id = l.id)  join customers c on(l.customer_id = c.id) where f.id = ?;';
        var sql = 'select   f.id as "fee_id",   f.value as "fee_value",     l.type_paid_id,     (       (           select sum(f2.value)            from fees f2            where f2.payment_date < f.payment_date              AND f2.loan_id = f.loan_id          ) - IFNULl(             (               select sum(p.value)                 from payments p                 where type_of_fee =1 and p.fee_id in (                  select f3.id                    from fees f3                    where f3.loan_id = l.id                     and (                       l.type_paid_id = 1  OR (                            l.type_paid_id = 2 AND f3.id not in (                               (                                   select id from                                      fees where loan_id = l.id and id <> f.id                                    order by payment_date desc limit 1                              )                           )                       )                   )               )           ),          0       )   ) as "debt" ,   l.id as "loan_id" ,     l.value_loaned,     l.interest_produced,    l.balance,  c.name,     c.document,     f.payment_date from fees f join loans l on(f.loan_id = l.id) join customers c on(l.customer_id = c.id)where f.id = ?;';
        var params = [id];
        localDatabase.query(sql,params).then(function(result){
            if(result.rows.length > 0){
                var r = result.rows.item(0);
                defered.resolve({
                    feeId : r.fee_id,
                    feeValue : r.fee_value,
                    typePaid : r.type_paid_id,
                    dbt : r.debt,
                    loanId : r.loan_id,
                    customerName : r.name,
                    customerDocument : r.document,
                    valueLoaned : r.value_loaned,
                    valueInterest : r.interest_produced,
                    balance : r.balance
                },result);
            }else{
                defered.resolve(null,result);
            }
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.listAllPending = function(loanId){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'select *, ( select sum(value) from payments where fee_id = f.id ) as "sumPayments" ' +
            'from fees f ' +
            'where (state = 1 or state =2) and loan_id = ?';
        var params = [loanId];
        localDatabase.query(sql,params).then(function(result){
            var r = result.rows;
            if(r.length> 0){
                var arrayResponse = new Array();

                for(var i=0; i<r.length; i++){
                    var row = r.item(i);

                    arrayResponse.push({
                        id : row.id,
                        loanId : row.loan_id,
                        paymentDate : row.payment_date,
                        state : row.state,
                        interest : row.interest_arrears,
                        valuePayments : row.sumPayments,
                        value: row.value
                    })
                }

                defered.resolve(arrayResponse,result);
            }else{
                defered.resolve(null,result);
            }

        }).catch(function(error){
            defered.reject(error)
        })

        return promise;
    };

    this.update = function(field,value,condition,showSql){
        var defered = $q.defer();
        var promise = defered.promise;
        showSql = showSql || false;

        condition = condition || '1'
        var sql= 'UPDATE FEES SET ';
        var params = [];

        if(typeof field === "object"){
            for(var i=0; i<field.length; i++){
                sql += field[i]+' = '+ value[i];
                sql += (i === field.length-1) ? '' : ', ';
            }
            sql+= ' WHERE '+condition;
        }else{
            sql+= field+' = ? WHERE '+condition;
            params.push(value);
        }

        if(showSql){
            console.log(sql);
        }

        localDatabase.query(sql,params).then(function(result){
            if(result.rows.length > 0 ){
                for(var i=0; i<result.rows.length; i++){
                    console.log(result.rows.item(i));
                }
            }else{
                console.log("filas actualizadas: "+result.rowsAffected);
                defered.resolve(result);
            }
        }).catch(function(error){
            defered.reject(error);
        });


        return promise;
    };



    return this;
});