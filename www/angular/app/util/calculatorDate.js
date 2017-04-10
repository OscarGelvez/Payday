var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('CalculatorDate', function($translate){
    var operators = ['+','*'];
    var dia1 = $translate.instant('Simulator.Days.Sunday');
    var dia2 = $translate.instant('Simulator.Days.Monday');
    var dia3 = $translate.instant('Simulator.Days.Tuesday');
    var dia4 = $translate.instant('Simulator.Days.Wednesday');
    var dia5 = $translate.instant('Simulator.Days.Thursday');
    var dia6 = $translate.instant('Simulator.Days.Friday');
    var dia7 = $translate.instant('Simulator.Days.Saturday');

    this.daysWeek = [
        {
            id : 0,
            name : ""+dia1
        },
        {
            id : 1,
            name : ""+dia2
        },
        {
            id : 2,
            name : ''+dia3
        },
        {
            id : 3,
            name : ''+dia4
        },
        {
            id : 4,
            name : ''+dia5
        },
        {
            id : 5,
            name : ''+dia6
        },
        {
            id: 6,
            name : ''+dia7
        }
    ];

    this.defaultFormat = 'yyyy-mm-dd';


    this.curDateString = function(separator,stringFormat){
        var date = new Date();
        separator = separator || '-';
        stringFormat = stringFormat || 'dd-mm-yyyy';
        var vector = stringFormat.split(separator);
        var arrayResponse = new Array();

        for(var i=0; i<vector.length; i++){
            switch (vector[i]) {
                case 'd':
                case 'dd':
                {
                    arrayResponse.push(
                        includeZero(date.getDate(),vector[i])
                    );
                }break;

                case 'm':
                case 'mm':
                {
                    arrayResponse.push(
                        includeZero(date.getMonth()+1,vector[i])
                    );
                }break;

                case 'yyyy':
                {
                    arrayResponse.push(
                        date.getFullYear()
                    );
                }break;
            }

        }
        return getBasicReturn(arrayResponse,separator);
    };

    this.curHour = function(){
        var d= new Date();
        return d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds();
    };

    this.curDate = function(){
        return new Date();
    };

    this.parseDateToString = function(date,stringFormat,separator){
        var arrayResponse = new Array();
        var vector = stringFormat.split(separator);
        for(var i=0; i<vector.length; i++){
            switch(vector[i]){
                case 'd':
                case 'dd':{
                    arrayResponse.push(
                        includeZero(date.getDate(),vector[i])
                    );
                }break;
                case 'm':
                case 'mm':{
                    arrayResponse.push(
                        includeZero(date.getMonth()+1,vector[i])
                    );
                }break;
                case 'yyyy':{
                    arrayResponse.push(date.getFullYear());
                }

            }
        }
        return getBasicReturn(arrayResponse,separator);
    };

    this.parseStringToDate = function(stringDate,separator,stringFormat){
        separator = separator || '-';

        var arrayInfo = stringDate.split(separator);
        var arrayInfoFormat = stringFormat.split(separator);

        var date=0;
        var month=0;
        var year = 0;

        for(var i=0; i<arrayInfoFormat.length; i++){
            switch(arrayInfoFormat[i]){
                case 'd':
                case 'dd':{
                    date =  arrayInfo[i];
                }break;
                case 'm':
                case 'mm':{
                    month = arrayInfo[i]-1;
                }break;
                case 'yyyy':{
                    year = arrayInfo[i];
                }break;
            }
        }

        return new Date(year,month,date,0,0,0,0);
    };

    this.reorganizeStringDate = function(stringDate,inputStringFormat,outputStringFormat,inputSeparator,outputSeparator){
        inputSeparator = inputSeparator || '-';
        outputSeparator = outputSeparator || inputSeparator;

        var arrayInfo = stringDate.split(inputSeparator);
        var arrayInputFormat = inputStringFormat.split(inputSeparator);
        var arrayOutputFormat = outputStringFormat.split(outputSeparator);

        var arrayResponse = new Array();
        for(var i=0; i<arrayOutputFormat.length; i++){
            var component = arrayOutputFormat[i];
            for(var j=0; j<arrayInputFormat.length; j++){
                if(equalsComponent(component, arrayInputFormat[j])){
                    arrayResponse.push(
                        includeZero(arrayInfo[j],arrayInputFormat[j])
                    );
                }
            }
        }
        return getBasicReturn(arrayResponse,outputSeparator);
    };

    this.nextDate = function(date,stringFormat){
        console.log(stringFormat);
        var increments = getIncreases(stringFormat);
        var dateResponse;

        switch(increments.length){
            case 3:{

                dateResponse = incrementDate(date,increments);

            }break;
            case 4:{

                var newIncrements;
                console.log("increments[0] : "+increments[0].value);
                console.log("date.getDay() :"+date.getDay());

                if(increments[0].value > date.getDay()){
                    console.log("entro por aca");
                    console.log(date.getDay()-increments[0].value );
                    newIncrements = [
                        new Modifier("increment",increments[0].value -date.getDay()),
                        new Modifier("increment",0),
                        new Modifier("increment",0)
                    ];
                }else if(increments[0].value == date.getDay()){
                    newIncrements = [
                        new Modifier("increment",7),
                        new Modifier("increment",0),
                        new Modifier("increment",0)
                    ];
                }else{
                    var difference =  increments[0].value-date.getDay();
                    
                    newIncrements = [
                        new Modifier("increment",7+difference),
                        new Modifier("increment",0),
                        new Modifier("increment",0)
                    ];
                }
                console.log(newIncrements);

                dateResponse = incrementDate(date,newIncrements);

            }break;
            default:{
                return null;
            }
        }
        
        return dateResponse;
    };

    this.yesterday = function(date){
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()-1,
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        );
    };

    this.getDatesBetween = function(dateStart ,dateEnd , stringFormat ){

        var arrayDates = new Array();
        if(typeof dateStart === "object" && typeof dateEnd === "object"){
            if(dateStart < dateEnd){

                var increments = getIncreases(stringFormat);

                if(increments.length  === 3){
                    var currentDate = dateStart;
                    while(currentDate <= dateEnd){
                        //console.log(currentDate);
                        arrayDates.push(currentDate);
                        currentDate = incrementDate(currentDate, increments);
                    }
                }else if (increments.length === 4){

                    var currentDate =  dateStart;
                    var newIncrements = [
                        new Modifier("increment",7),
                        new Modifier("increment",0),
                        new Modifier("increment",0)
                    ];

                    while(currentDate <= dateEnd){
                        //console.log(currentDate);
                        arrayDates.push(currentDate);
                        currentDate = incrementDate(currentDate, newIncrements);
                    }
                }

            }
        }
        return arrayDates;
    };

    var nextDay = function(date,index){
        if(date.getDay() === index){
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()+8,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
        }else if(date.getDay() < index){
            var delta = index-date.getDay();
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()+delta,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
        }else{

            var delta = 7 - date.getDay();
            delta += index;
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()+delta,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
        }
    };

    var incrementDate = function(date,arrayIncrement){

        if(arrayIncrement.length > 0){
            return new Date(
                arrayIncrement[2].calculate(date.getFullYear()),
                arrayIncrement[1].calculate(date.getMonth()),
                arrayIncrement[0].calculate(date.getDate()),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
        }

    };

    var getIncreases = function(stringFormat){

        format=stringFormat.replace(/ /g,'');
        var vector = format.split(',');
        var array = new Array();
        for(var i=0; i<vector.length; i++){
            var x = parseFormatToValue(vector[i]);

            array.push(x);
        }

        return array;
    };

    var parseFormatToValue = function(stringFormat){
        var sf = stringFormat.replace(/ /g,'');

        if(hasOperator(sf)){
            if(sf.length === 1){
                switch (sf){
                    case '*' :{
                        return new Modifier(
                            "increment",
                            0
                        );
                    }break;
                    case '+' :{
                        return new Modifier(
                            "increment",
                            1
                        );
                    }break;
                }
            }else{
                if(hasOperator(stringFormat,['+'])){
                    var stringValue = removeOperator(stringFormat);

                    return new Modifier(
                        "increment",
                        parseInt(stringValue)
                    );
                }
            }
        }

        return new Modifier("constant",parseInt(stringFormat));
    };

    var hasOperator = function(string,arrayOperatorsSearch){
        arrayOperatorsSearch = arrayOperatorsSearch || operators;

        for(var i=0; i<arrayOperatorsSearch.length; i++){
            if(string.indexOf(arrayOperatorsSearch[i]) !== -1){
                return true;
            }
        }
        return false;
    };

    var removeOperator = function(string, operator){

        return string.replace(
            eval("/\\"+operator+"/g"),
            ""
        );
    };



    var Modifier = function(type, value){
        this.isConstant = false;
        this.isIncrement = false;

        var type = type.toLowerCase();
        switch (type){
            case "constant":{
                this.isConstant = true;
            }break;
            case "increment":{
                this.isIncrement = true;
            }
        }

        this.value = value ;

        this.calculate = function(val){
            if(this.isConstant){
                return this.value;
            }else if(this.isIncrement){
                return val+this.value;
            }

        }

    };

    var equalsComponent = function(component1, component2){
        component2 = component2.toLowerCase().trim();
        switch (component1){
            case 'd':
            case 'dd' : {
                return (component2 === "d" || component2 === "dd");
            }
            case 'm':
            case 'mm':{
                return (component2 === "m" || component2 === "mm");
            }
            case 'yyyy':{
                return (component2 === "yyyy");
            }
            default :{
                return false;
            }
        }
    };

    var getBasicReturn=function(arrayResponse,separator){
        return arrayResponse[0]+separator+arrayResponse[1]+separator+arrayResponse[2];
    };

    var includeZero =function(component,format){
        var myComponent = String(component).replace(/ /g,'');
        if(format == "dd" || format == "mm"){
            return (myComponent.length == 1) ?
                    "0"+myComponent :
                    myComponent;
        }
        return myComponent;
    };


    return this;
});