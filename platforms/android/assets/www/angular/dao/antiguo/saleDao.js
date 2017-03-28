/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('SaleDao', function (queries) {

    /**
     * @param {Object} $customer: Customer information
     * @returns {promise}
     */
    this.create = function ($customer) {
        return queries.executeRequest('POST', 'sales/create', $customer);
    };

    this.createTest = function (sale) {
        return queries.executeRequest('POST', 'sales/createtest', sale);
    };

    this.update = function (sale) {

        params = {sale_id: sale.id, _method: 'PUT'};
        return queries.executeRequest('POST', 'sales/update', sale, params);
    };

    this.getProduct = function ($name) {

        $params = {name: $name};
        return queries.executeRequest('GET', 'sales/product', null, $params);
    };

    this.findFull = function (saleId) {

        $params = {sale_id: saleId};
        return queries.executeRequest('GET', 'sales/findfull', null, $params);
    };

    this.remove = function (sale) {

        $params = {
            sale_id: sale
        };

        return queries.executeRequest('DELETE', 'sales/destroy', null, $params);

    };

    this.reassess = function (saleId) {
        $params = {sale_id: saleId};
        return queries.executeRequest('PUT', 'sales/reassess', null, $params);
    };
    
    this.excelExport = function(params){
        return queries.executeRequest('GET', 'sales/exportexcel', null, params);
    };
    
    return this;
});
