
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('MovesDao', function ($q,localDatabase,CalculatorDate) {

    this.create = function(type,value,description,loanId,isMovedBusiness,isMovePayment){

        isMovePayment = ( isMovePayment == null || typeof isMovePayment == "undefined" || isMovePayment == 0)  ? 0 : 1;
        var defered = $q.defer();
        var promise = defered.promise;

        loanId = loanId || null;

        var sql = 'INSERT INTO moves (type,created,value, description,hour,loan_id,is_move_business,is_move_payment)' +
            ' VALUES(?,?,?,?,?,?,?,?)';
        var params = [
            type,
            CalculatorDate.curDateString('-','yyyy-mm-dd'),
            value,
            description,
            CalculatorDate.curHour(),
            loanId,
            isMovedBusiness,
            isMovePayment
        ];
        //console.log(params);
        localDatabase.query(sql,params).then(function(result){
            defered.resolve(result);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.delete = function(where){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'DELETE FROM moves WHERE '+where;

        localDatabase.query(sql).then(function(result){
            defered.resolve(result);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.all = function(stringDate){
        var defered = $q.defer();
        var promise = defered.promise;

        stringDate = stringDate || CalculatorDate.curDateString('-','yyyy-mm-dd');
        var sql = 'select * from moves where created = date(?)';
        var params = [stringDate];

        localDatabase.query(sql,params).then(function(result){
            var arrayResponse = new Array();

            for(var i=0;  i<result.rows.length; i++){
                var row = result.rows.item(i);

                arrayResponse.push({
                    value : row.value,
                    description : row.description,
                    created : row.created,
                    type : row.type,
                    id : row.id,
                    hour : row.hour,
                    subType : row.is_move_business
                });
                defered.resolve(arrayResponse,result);
            }
        }).catch(function(error){
            defered.reject(error);
        });
        return promise;
    }

    return this;
});