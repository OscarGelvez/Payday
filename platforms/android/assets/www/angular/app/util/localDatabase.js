var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('localDatabase', function(APP,$q){
    var kubedatabase = {};
    kubedatabase.db = null;
    kubedatabase.ts = null;
    var self = this;
    
    var arrayTablesCreated = new Array();
    var arrayTablesErrorCreated = new Array();


    /**
     * Función que permite crear una nueva base de datos en el navegaor
     * @param {string} shortName
     * @param {string} displayName
     * @param {int} maxSize
     * @returns {null | Object Database en caso de crearlar correctamente}
     */
    kubedatabase.createNew = function(shortName, displayName, maxSize){
        try{
            shortName = shortName || 'mydatabase';
            displayName = displayName || 'one important database';
            maxSize = maxSize || 10240;

            if(!window.openDatabase){
                alert('Base de datos no Soportada');
            }else{
                kubedatabase.db = openDatabase(shortName,'1.0',displayName,maxSize);

                return kubedatabase.db;
            }
        }catch(e){
            if(e === 2){
                alert('Número de Versión invalido');
            }else{
                alert('error desconocido: '+e+'.');
            }            
            return null;
        }
    };

    /**
     * función que se encarga de leer las tablas del archivo global y crear las tablas alli mencioadas
     * @returns {promise} retorna un promesa en caso de realizar todas las consultas sql sin presentarse ningún error
     * retornara un callback con un array con el nombre de las tablas creadas
     */
    kubedatabase.createModels = function(){
        var defered = $q.defer();
        var promise = defered.promise;
        loadDatabase();
        try {
            var jsTables = APP.TABLES;
            for (var i = 0; i < jsTables.names.length; i++) {
                var index = jsTables.names[i];
                createTable(index,jsTables.fields[index],function(result,name){

                    arrayTablesCreated.push(name);

                    if(arrayTablesCreated.length === APP.TABLES.names.length){
                        defered.resolve(arrayTablesCreated,arrayTablesErrorCreated);
                        arrayTablesCreated = new Array();
                        arrayTablesErrorCreated = new Array();                        
                    }
                    
                });
            }
        } catch (error) {
            defered.reject(error);
        }
        return promise;
    };

    /**
     * función que permite eliminar todas las tablas existentes en la base de datos
     * @returns {undefined}
     */
    kubedatabase.dropTables = function(){
        var defered = $q.defer();
        var promise = defered.promise;

        var sql = 'SELECT * FROM sqlite_master ';
        this.query(sql,null,false).then(function(result){
            var  arrayTablesDroped = new Array();
            var  arrayErrors = new Array();

            for(var i=0; i<result.rows.length; i++){
                var table = result.rows.item(i)['name'];

                if(table != '__WebKitDatabaseInfoTable__' &&
                    table != 'sqlite_autoindex___WebKitDatabaseInfoTable___1' &&
                    table != 'sqlite_sequence'){

                    dropTable(result.rows.item(i)['name']).then(function(nameTable){
                        console.log("table "+nameTable+" deleted");
                        arrayTablesDroped.push(nameTable);

                        if((arrayTablesDroped.length + arrayErrors.length) == result.rows.length-3){
                            defered.resolve(arrayTablesDroped,arrayErrors);
                            return;
                        }
                    }).catch(function(error){
                        defered.reject(error);
                    });

                }

            }

        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    /**
     * función que permite ejecutar una sentencía sqlite en la base de datos
     * @param {string} query consulta que se pretende ejecutar
     * @param {array:string} parametros que seran incluidos en la consulta
     * @returns {defered.promise} en caso efectivo retornara el resultado de la ejecución del sql,
     * en caso de error retornara el error generado por la base de datos
     */
    kubedatabase.query = function(query,params,showResultConsole){
        var defered = $q.defer();
        var promise = defered.promise;
        loadDatabase();
        params = params || [];
        showResultConsole || true;
        //console.log(query);
        kubedatabase.db.transaction(function(tx){
            tx.executeSql(query,params,function(tx,result){
                    defered.resolve(result);
                    if(showResultConsole){
                        console.log(result);
                    }
                },
                function(tx,error){
                    defered.reject(error);
                    console.log(error.message);
                }
            );
        });
        return promise;    
    };

    kubedatabase.updateBach = function(sql,params){
        var defered = $q.defer();
        var promise = defered.promise;

        kubedatabase.db.transaction(function(tx){
            var fieldsModified = 0;
            var countExecuted = 0;
            for (var i = 0; i < params.length; i++) {
                
                console.log(sql);
                console.log(params[i]);

                tx.executeSql(sql,params[i],function(tx,result){
                    console.log(result);
                    countExecuted++;
                    if(result.rowsAffected > 0){
                        fieldsModified++;
                    }

                    if(params.length == countExecuted){
                        defered.resolve(fieldsModified);
                    }
                },
                function(error){
                    console.log(error);
                    countExecuted++;
                    if(params.length == countExecuted){
                        defered(fieldsModified);
                    }
                });
            };
        });

        return promise;
    };

    /**
     * función que permite realizar multiples registros en la misma transacción
     * @param query consulta que se quiere ejecutar la consulta se envía como si se fuese a insertar un solo reigstro
     * @param matrixParams arreglo de arreglo de parametros que se deben ingresar en cada inserción
     * @returns {promise} retorna una promesa que puede ya sea retornar un array de registros realizados y un array de errores
     * en cualquiera de los dos casos es posible que lleguen como null en el caso que no lleve ningún registro
     */
    kubedatabase.multipleQueries = function(query,matrixParams){
        var defered = $q.defer();
        var promise = defered.promise;
        loadDatabase();

        matrixParams = matrixParams || new Array(new Array());


        kubedatabase.db.transaction(function(tx){
            var arrayResult = new Array();
            var arrayErrors = new Array();

            for(var i=0; i<matrixParams.length; i++){
                tx.executeSql(query,matrixParams[i],function(tx, result){

                        arrayResult.push(result);
                        if( (arrayResult.length + arrayErrors.length) == matrixParams.length){
                            defered.resolve(arrayResult,arrayErrors);

                        }

                    },
                    function(error){

                        arrayErrors.push(error);
                        if( (arrayResult.length + arrayErrors.length) == matrixParams.length){
                            defered.resolve(arrayResult,arrayErrors);
                            console.log(arrayErrors);
                        }
                    }
                );
            }
        });

        return promise;
    };

    kubedatabase.validateDB = function(up){
        var defered = $q.defer();
        var promise = defered.promise;

        loadDatabase();
        var sql = 'SELECT * FROM sqlite_master';
        var self = this;
        this.query(sql).then(function(result){
            if(result.rows.length <= 2){
                self.createModels().then(function(arrayNames,arrayErrors){
                    if(arrayNames != null && arrayNames.length > 0){
                        if(up) {
                            self.up().then(function (arrayResponse, arrayError) {
                                if (arrayResponse != null && arrayResponse.length > 0) {
                                    defered.resolve(true, arrayResponse.length);
                                }
                            }).catch(function (error) {
                                defered.reject(error);
                            });
                        }else{
                            defered.resolve(true, arrayNames.length);
                        }
                    }else{
                        defered.resolve(false);
                    }
                }).catch(function(error){
                    defered.reject(error);
                })
            }
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };


    /**
     * función que permite ejecutar un conjunto de sentencías para realizar inserciones a  la base de datos
     * se utiliza  para crear los registros estaticos que estaran en la base de datos
     */
    kubedatabase.up = function(){
        var defered= $q.defer();
        var promise = defered.promise;

        var cmds = APP.UP_DATABASE;
        for(var i=0; i<cmds.length; i++){
            var arrayResponse = new Array();
            var arrayError = new Array();
            kubedatabase.query(cmds[i]).then(function(result){
                if(result.rowsAffected > 0){
                    arrayResponse.push(result);
                }else{
                    arrayError.push(result);
                }
                if(arrayError.length + arrayResponse.length == cmds.length){
                    defered.resolve(arrayResponse,arrayError);
                }
            }).catch(function(error){
               console.error(error);
                defered.reject(error);
            });
        }

        return promise;
    };




    /**
     * función que permite listar todas las tablas existentes en la base de datos, la base de datos debe estar
     * creada anteriormente y debe estar la conexión establecida
     */
    kubedatabase.showSchema = function(showConsole){
        var defered = $q.defer();
        var promise = defered.promise;

        if(typeof showConsole == "undefined" || showConsole == null){
            showConsole = false;
        }


        this.query('SELECT * FROM sqlite_master').then(function(result){
            var arrayResponse = new Array();
            for(var i =0 ;i <result.rows.length;i++){
                if(showConsole == true){

                    console.log("table: "+result.rows.item(i)['name']);

                }
                arrayResponse.push(result.rows.item(i)['name']);
            }
            defered.resolve(arrayResponse);
        }).catch(function(error){
            defered.reject(error);
        });

        return promise;

    };


    /**
     * función privada que permite inicializar la base de datos de forma sencilla
     * @returns {kubedatabase.db} en caso de no existir la base de datos la crea o si no la retornara
     */
    var loadDatabase = function(){
        return (kubedatabase.db !== null)? kubedatabase.db : kubedatabase.createNew();
    };

    /**
     * función que permite crear una tabla en la base de datos actual
     * @param {String} name nombre que se le asignara  a la base de datos
     * @param {Array:String} fields listado de propiedades que contendrá la tabla
     * @param callback función que se ejecutara una vez se realice la ejeuccuón del sql
     */
    var createTable = function(name,fields,callback){
        var sqlCreate = 'CREATE TABLE IF NOT EXISTS '+name +' (';
        if(fields.length > 0){
            for(var i=0; i<fields.length; i++){
                sqlCreate+= fields[i]+',';
            }
            sqlCreate =  sqlCreate.substring(0,sqlCreate.length-1);
        }
        sqlCreate+=');';

        kubedatabase.db.transaction(function(tx2){
            tx2.executeSql(sqlCreate,[],function(tx,result){
                    console.log('table '+name+' created');
                    if(typeof callback === "function"){
                        callback(result,name);
                    }
                },
                function(tx,error){
                    console.log("ERROR: the table "+name+" not can be created");
                    if(typeof callback === "function"){
                        callback(error,name);
                    }
                }
            );
        });
    };

    /**
     * función que permite eliminar una tabla de la base de datos a partir de su nombre
     * @param {string} name nombre de la tabla a  eliminar
     * @returns {Boolean} true en el caso que la eliminación sea correcta, false en caso
     * de presentarse cualquier tipo de error
     */
    var dropTable = function(name){
        var defered = $q.defer();
        var promise = defered.promise;

        var sqlDrop = 'DROP TABLE IF EXISTS '+name;

        kubedatabase.query(sqlDrop).then(function(result){

            defered.resolve(name);

        }).catch(function(error){
            defered.reject(error);
        });

        return promise;
    };

    /**
     * función privada para la función multipleQueries que se encarga de validar si ya es momento de entregar la respuesta
     * @param defered
     * @param arrayResult array de tablas registradas
     * @param arrayErrors array de errores presentados
     * @param arrayValues array de registros totales
     */
    var validateQuantity = function(defered,arrayResult, arrayErrors,arrayValues){

        if(arrayResult.length + arrayErrors.length == arrayValues.length){
            defered.resolve(arrayResult,arrayErrors);
            console.log(arrayErrors);
        }

    };

    return kubedatabase;
    
});