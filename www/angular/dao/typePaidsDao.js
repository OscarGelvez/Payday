var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('TypePaidsDao', function ($q,localDatabase) {
    
    this.all = function(){
      
        var defered = $q.defer();
        var promise = defered.promise;
        
        var sql = 'SELECT * FROM type_paids';
        localDatabase.query(sql).then(function(result){
            if(result.rows.length > 0){
                var array = new Array();
                for(var i=0; i<result.rows.length; i++){
                    array.push(result.rows.item(i));
                }
                defered.resolve(array);
            }
            defered.resolve(null);
        }).catch(function(error){
            defered.reject(error);
        });
        
        return promise;
    };
    
    return this;
});