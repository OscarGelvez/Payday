/**
 * @author Mario Nieto
 * @email marionieto@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');


kubeApp.controller('MoveController',function($scope,$state ,$filter,MovesDao,localDatabase){

    $scope.new = {};
    $scope.list = {};

    $scope.lists = {};

    $scope.addMove = function(){
        var type = $scope.new.type.id;

        var value = $scope.new.value;
        var description = $scope.new.description;
        var subType =$scope.new.subTypeMove;

        MovesDao.create(type,value,description,null,subType).then(function(result){
            if(typeof result.insertId === "undefined"){
                alert("no se pudo registrar el movimiento");
            }else{
                alert("Se ha registrado un nuevo movimiento\nTipo: "+$scope.new.type.name+"\nValor: "+value);
                cleanInputsAdd();
            }
        }).catch(function(error){
            console.log(error);
        });

    };

    $scope.balance = function(listado,filter){
        var input = 0;
        var output = 0;


        for(var i=0; i<listado.length; i++){
            var m = listado[i];
            switch(m.type){
                case 1:{
                    if(typeof filter == "undefined" || filter == null){
                        input += m.value;
                    }else if(m.subType == filter){
                        input += m.value;
                    }
                }break;
                case 2:{
                    if(typeof filter == "undefined"|| filter == null){
                        output += m.value;
                    }else if(m.subType == filter){
                        output += m.value;
                    }

                }
            }
        }


        return input-output;
    };

    $scope.getStringType = function(type){
        return (type === 1) ? "Entrada" : "Salida";
    };

    $scope.showDetailsMove = function(evt){
        
        var vectorId = evt.target.id.split("_");
        var id = vectorId[0];

        var list = $scope.lists.moves;
        for(var i=0; i<list.length; i++){
            if(list[i].id == id){
                alert("Hora: "+ $filter("showHour")(list[i].hour)+"\nTipo: "+$scope.getStringType(list[i].type)+
                    "\nSubTipo: "+getStringSubtype(list[i].subType)+
                    "\nValor: "+list[i].value+"\nDescripción: "+list[i].description+
                    "\nFecha: "+list[i].created
                );
            }
        }

    };

    var init = function(){

        localDatabase.showSchema().then(function(arrayNames){
            if(arrayNames.length <= 2){
                $state.go("home");
                toastr.error("Debe abrir la caja antes de realizar cualquier actividad","ERROR");
            }
        }).catch(function(error){
            toastr.error("No se pudo cargar la base de datos");
        });

        var state = $state.current.name;

        $scope.lists.subTypeMove = new Array();
        $scope.lists.subTypeMove.push({id:0,name:"Efectivo Propio"});
            $scope.lists.subTypeMove.push({id:1,name:"Efectivo de la Empresa"});

        switch(state) {
            case 'home.movesAdd': {
                $scope.lists.typeMoves = new Array();
                $scope.lists.typeMoves.push({id:1,name:"Entrada"});
                $scope.lists.typeMoves.push({id:2,name:"Salida"});
            }break;

            case 'home.movesList' : {

                $scope.lists.moves = [];
                MovesDao.all().then(function(arrayResponse,result){
                    $scope.lists.moves = arrayResponse;
                }).catch(function(error){
                    console.log(error);
                });

            }break;
        }


    };

    var cleanInputsAdd = function(){
        $scope.new.value = '';
        $scope.new.description = '';
        $scope.new.type = {id : ''};
    };

    var getStringSubtype = function(subtype){
        return (subtype == 0) ? "Efectivo Propio" : "Efectivo de la Empresa";
    };


    init();
});

kubeApp.filter("showHour",function(){
    return function(text){
        var vectorInfo = text.split(":");
        if(vectorInfo.length == 3){
            var result = '';
            var time = "AM";

            var hour = parseInt(vectorInfo[0]);
            var minute = parseInt(vectorInfo[1]);
            var second = parseInt(vectorInfo[2]);
            if(hour > 12){
                hour-=12;
                time ="PM";
            }else{
                hour = '0'+hour;
            }

            minute = (minute < 10 ) ? '0'+minute : minute;
            second = (second < 10) ? '0'+second : second;

            return hour+":"+minute+":"+second+" "+time;
        }
        return text;
    };
});

kubeApp.filter("filterTable",function(){
    return function(input,filter){
        var output = new Array();

        if(typeof filter == "undefined" || filter == null || filter.length == 0){
            filter = "";
        }
        for(var i=0; i<input.length; i++){
            switch(filter){
                case '' :{
                    output.push(input[i]);
                }break;
                default : {
                    if(input[i].subType == filter){
                        output.push(input[i])
                    }
                }
            }
        }

        return output;
    };
});