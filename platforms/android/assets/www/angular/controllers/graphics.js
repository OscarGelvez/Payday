/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('GraphicController', function ($scope, RatesHelper, ReportDao, PRODUCTS) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {

        $scope.$parent.init();
        $scope.fecha = new Date().toString("yyyy-MM-dd");
        $scope.maxDate = Date.today().add(1).days().toString("yyyy-MM-dd");
        $scope.product = PRODUCTS.BOLIVARS;
        $scope.labels = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
        $scope.series = ['Tasa Promedio de Compra de Bs.', "Tasa Promedio de Venta de Bs."];

        RatesHelper.refresh().then(function (info) {
            $scope.tpcb = (info.tpc['Bolívares'] === undefined) ? 0 : info.tpc['Bolívares'].tpc;
            $scope.tpcd = (info.tpc['Dólares'] === undefined) ? 0 : info.tpc['Dólares'].tpc;
            $scope.getRates($scope.fecha, $scope.product);
        });
    }

    $scope.getRates = function (date, product) {
        date = (date === '') ? Date.today() : date;
        ReportDao.getRatesByDate(date, product).then(function (result) {
            formatResult(result.data);
        });
    };

    function formatResult(data) {

        var ventaBD = data['Venta'];
        var compraBD = data['Compra'];
        var arrayVenta = createArray(ventaBD);
        var arrayCompra = createArray(compraBD);

        if (arrayCompra['8:00'] == 0) {
            arrayCompra['8:00'] = ($scope.product == PRODUCTS.BOLIVARS) ? $scope.tpcb : $scope.tpcd;
        }

        var parsedArrayVenta = parseArray(arrayVenta);
        var parsedArrayCompra = parseArray(arrayCompra);

        $scope.data = [parsedArrayCompra, parsedArrayVenta];
        if ($scope.product == PRODUCTS.BOLIVARS) {
            $scope.series = ['Tasa Promedio de Compra de Bs.', "Tasa Promedio de Venta de Bs."];
        } else {
            $scope.series = ['Tasa Promedio de Compra de USD', "Tasa Promedio de Venta de USD"];
        }
    }

    function parseArray(array) {

        var parsedArray = [];
        for (var i = 0, hora = 8, max = 21; hora < max; i++, hora++) {

            var valueHora = array[(hora).toString() + ":00"];

            if (valueHora === 0 && hora > 8) {
                valueHora = parsedArray[i - 1];
            }

            parsedArray[i] = valueHora;
        }

        return parsedArray;
    }

    function createArray(bd) {

        var array = getArray();
        angular.forEach(bd, function (value, key) {
            array[key] = bd[key];
        });

        return array;
    }

    /**
     * Creo un array con 13 posiciones para almacenar los datos, inicializados en cero
     * @returns {Array}
     */
    function getArray() {

        var array = [];
        i = 8;

        while (i < 21) {
            array[(i++).toString() + ":00"] = 0;
        }
        return array;
    }

    $scope.onClick = function (points, evt) {
    };

    //Initialize
    init();
});
