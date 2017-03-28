
var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('ClientsDao', function ($q,localDatabase) {
    
    /**
     * Función que permite registrar un nuevo cliente en el sistema con los 
     * sdatos basicos
     * @param {string} document
     * @param {string} name
     * @param {string} address
     * @param {string} phone_numbers numeros de telefonos que pueden estar 
     * separados por una coma
     * @param {string} email
     * @param {int} neighbourhood_id identificador del barrio en la base de datos
     * @returns {defered.promise} en caso de poder ejecutar el sql retornara un 
     * resultado de la base de datos, en caso contrario retornara el error
     */
    this.create = function(document, name, address, phone_numbers, email, neighbourhood_id){
        
        var defered = $q.defer();
        var promise = defered.promise;
        
        var sql = 'INSERT INTO customers (document, name, address,'+
                ' phone_numbers, email, neighbourhood_id,is_evil,route_position,my_client) values '+
                '( ? , ? , ? , ? , ? , ? ,0,-1,1)';
        
        localDatabase.query(sql,[document, name, address, phone_numbers,
            email, neighbourhood_id]).then(function(result){
            
            defered.resolve(result);
            
        }).catch(function(error){
            
            defered.reject(error);
            
        });
        
        return promise;
    };
    
    /**
     * Función que permite obtener toda la información de un cliente registrado
     *  anteriormente apartir de su numero de cedula
     * @param {string} document
     * @returns {defered.promise} en caso de realizar la consulta efectivamente 
     * retornara ya sea la información del cliente o nulo en caso que no se 
     * encuentre ningún cliente con esa cedula, en caso de producirse un error
     *  lo retornara
     */
    this.findByDocument = function(document){
        var defered = $q.defer();
        var promise = defered.promise;
        
        var sql = 'SELECT * FROM customers WHERE document=?';
        localDatabase.query(sql,[document]).then(function(result){
            if(result.rows.length > 0){
                defered.resolve(result.rows.item(0));
            }
            defered.resolve(null);
        }).catch(function(error){
            console.log(error);
            defered.reject(error);
        });
        return promise;
    };

    this.findByName = function(name){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'SELECT * FROM customers where name like "%?%" ORDER BY route_position ASC';
        var params = [name];

        localDatabase.query(sql,params).then(function(result){
            if(result.rows.length > 0){
                defered.resolve(result);
            }else{
                defered.resolve(new Array());
            }
        }).catch(function(error){
            console.log("error en la consulta");
            defered.reject(error);
        })

        return promise;
    }

    this.list = function(constraint){
        var defered = $q.defer();
        var promise = defered.promise;

        var where = constraint || '';

        var sql = 'SELECT * FROM customers '+ (where != '') ? ' where ' + constraint : ';' ;
        localDatabase.query(sql).then(function(result){

            var arrayResponse =  new Array();
            for(var i=0; i<result.rows.length; i++){
                arrayResponse.push(
                    getObject(result.rows.item(i))
                );
            }

            defered.resolve(arrayResponse,result);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    this.listAllExcept = function(arrayIds,constraint){
        var defered = $q.defer();
        var promise = defered.promise;

        var where = constraint || '';
        var sql = 'SELECT * FROM customers';
        sql += ( ( where != '') ? ' where '+constraint : ';');
        
        localDatabase.query(sql).then(function(result){

            var arrayResponse =  new Array();
            for(var i=0; i<result.rows.length; i++){
                var obj = getObject(result.rows.item(i));
                var finded = false;
                for(var j=0; j<arrayIds.length; j++){
                    if(obj.id == arrayIds[j]){
                        finded = true;
                    }
                }
                if(!finded){
                    arrayResponse.push(obj);
                }
            }

            defered.resolve(arrayResponse,result);
        }).catch(function(error){
            console.log(error);
            defered.reject(error);
        });

        return promise;
    };

    this.updatePositionBatch = function(objects){
        var sql = 'update customers set route_position = ?, my_client=1 where id = ?';
        var arrayParams = new Array();
        for(var i = 0; i < objects.length; i++) {
            var c =  objects[i];

            var array= new Array();
            array.push(c.routePosition);
            array.push(c.id);

            arrayParams.push(array);
        }

        return localDatabase.updateBach(sql,arrayParams);
    }

    this.update = function(field,value,constraint,showSql){
        var defered = $q.defer();
        var promise = defered.promise;
        constraint = constraint || 1;
        showSql = showSql || false;

        var sql = 'update customers set ';

        if(typeof field == "object"){

            for(var i = 0; i<field.length; i++){
                sql += field[i]+ " = "+value[i];
                sql += (i == field.length -1) ? '' : ',';
            }
            sql+= ' where '+ constraint;
        }else{
            sql+= field + ' = '+value+' where '+constraint;

        }

        if(showSql){
            console.log(sql);
        }

        localDatabase.query(sql).then(function(result){
            defered.resolve(result);
        }).catch(function(error){
            defered.resolve(error);
        });

        return promise;
    };

    this.delete = function(where){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'DELETE FROM customers WHERE '+where;
        

        if(typeof id == "object"){

            localDatabase.query(sql).then(function(result){
                defered.resolve(result);
            }).catch(function(error){
                defered.reject(error);
            });

        }else{
            
            localDatabase.query(sql).then(function(result){
                console.log(result.rowsAffected);
                defered.resolve(result);
            }).catch(function(error){
                defered.reject(error);
            });
            
        }

        return promise;
    };

    var getObject = function(row){
        return {
            id : row.id,
            address : row.address,
            document : row.document,
            email: row.email,
            isEvil : row.is_evil,
            name : row.name,
            neighbourhoodId : row.neighbourhood_id,
            routePosition : row.route_position
        };
    };
    
    return this;
});


