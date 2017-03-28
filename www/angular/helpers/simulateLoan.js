var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('SimulateLoan', function(localDatabase,CalculatorDate,$q){

    this.on = function(value,interest,arrayDates,type_paid){
        var defered = $q.defer();
        promise = defered.promise;

        localDatabase.query('select * from type_paids where id = ?',[type_paid]).then(
            function(result){
                if(result.rows.length > 0){
                    if(type_paid == 1 || result.rows.item(0).name.toLowerCase() == "con abono a capital"){
                        defered.resolve(simulateType1(arrayDates,value,interest));
                    }else if(type_paid == 2 || result.rows.item(0).name.toLowerCase() == "sin abono a capital"){
                        defered.resolve(simulateType2(arrayDates,value,interest));
                    }
                }else{
                    defered.resolve(null);
                }
            }
        ).catch(
            function(error){
                defered.reject(error);
            }
        );
        return promise;
    };

    var simulateType2 = function(arrayDates, value, interest){
        var i=0;
        var interestFee = value * (interest/100);
        var totalFee = interestFee * arrayDates.length;

        var paid = 0;
        arrayResponse = new Array();
        arrayResponse.push(createFee(value,totalFee,value+totalFee,CalculatorDate.curDate(),paid));

        for(; i<arrayDates.length-1; i++){
            totalFee-=interestFee;
            paid+=interestFee;
            arrayResponse.push(createFee(value,totalFee,value+totalFee,arrayDates[i],paid));
        }
        totalFee -= interestFee;
        paid += interestFee +value;
        value -= value;

        arrayResponse.push(createFee(value, totalFee, value+totalFee, arrayDates[i],paid));
        return arrayResponse;
    };

    var simulateType1 = function(arrayDates, value, interest){
        var arrayResponse = new Array();
        var interestTotal = value * (interest/100);
        var total = value + interestTotal;
        console.log(total);
        var feeInterest = interestTotal/arrayDates.length;
        feeInterest = removeTenths(feeInterest);

        var feeValue = value / arrayDates.length;
        feeValue = removeTenths(feeValue);

        var i=0;
        var parcialTotal = value;
        var parcialInterest = interestTotal;
        var totalCashed = 0;
        arrayResponse.push(createFee(value,interestTotal,total, CalculatorDate.curDate(),0));

        for(; i<arrayDates.length-1; i++){
            parcialInterest -= feeInterest;
            parcialTotal -= feeValue;
            var feeTotal = parcialInterest + parcialTotal;
            totalCashed += feeInterest+feeValue;
            arrayResponse.push(createFee(parcialTotal,parcialInterest,feeTotal,arrayDates[i],totalCashed));
        }
        var feeTotal = parcialInterest + parcialTotal;
        totalCashed += feeTotal;
        parcialInterest -= parcialInterest;
        parcialTotal -= parcialTotal;
        arrayResponse.push(createFee(parcialTotal,parcialInterest,feeTotal,arrayDates[i],totalCashed));
        return arrayResponse;

    };

    var createFee = function(balance,interest, total, date,paid){
        var obj= {
            balance : balance,
            interest : interest,
            total : total,
            paid : paid,
            date : date
        };
        return obj;
    };

    var removeTenths = function(value){
        value = value / 100;
        value = parseInt(value);
        value*=100;
        return value;
    };
    
    return this;
});