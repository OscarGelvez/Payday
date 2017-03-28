
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('ZonesDao', function (localDatabase,$q) {
    
    this.all = function(){
        var defered = $q.defer();
        var promise = defered.promise;
        
        var sql = 'select * from zones';
        localDatabase.query(sql,[]).then(function(result){
            if(result.rows.length > 0){
                var array = new Array();
                for(var i=0; result.rows.length; i++){
                    var row = result.rows.item(i);
                    array.push(row);
                }
                defered.resolve(array);
            }
        }).catch(function(error){
            defered.reject(error);
        });
        
        return promise;
    };
    
    this.find = function(id){
        var defered = $q.defer();
        var promise = defered.promise;
        
        var sql = 'select * from zones where id = ?';
        localDatabase.query(sql,[id]).then(function(result){
            if(result.rows.length > 0){
                defered.resolve(result.rows.item(0));
            }
        }).catch(function(error){
            defered.reject(error);
        });
        
        return promise;
    };
    
    return this;
});