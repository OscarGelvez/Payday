
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('NeighbourhoodsDao', function (localDatabase,$q) {
    
    this.all = function(){
        var defered = $q.defer();
        var promise = defered.promise;
        
        var sql = 'SELECT * FROM neighbourhoods';
        localDatabase.query(sql,[]).then(function(result){
                if(result.rows.length > 0){
                    
                    var array = new Array();
                    for(var i=0; i<result.rows.length;  i++){
                        var row = result.rows.item(i);
                        array.push(row);
                    }                    
                    defered.resolve(array);
                }
            },function(error){
                defered.reject(error);
            }
        );

        return promise;
    };
    
    return this;
});