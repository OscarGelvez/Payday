/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('CustomerDao', function (queries) {

    /**
     * Send a request to store a new Customer
     * 
     * @param {Object} $customer: Customer information
     * @returns {promise}
     */
    this.create = function ($customer) {

        return queries.executeRequest('POST', 'customers/create', $customer);
    };

    /**
     * Sends a request to query an user given its ID
     * 
     * @param {int} $id : User ID
     * @returns {promise}
     */
    this.find = function ($id) {

        $params = {customer_id: $id};

        return queries.executeRequest('GET', 'customers/find', null, $params);
    };

    /**
     * Sends a request to update an user
     * 
     * @param {type} customer : User to update
     * @returns {promise}
     */
    this.update = function (customer) {

        $params = {
            _method: "PUT"
        };
        return queries.executeRequest('POST', 'customers/update', customer, $params);
    };

    /**
     * Sends a request to query all zones
     * 
     * @returns {promise}
     */
    this.getZones = function () {
        return queries.executeRequest('GET', 'customers/zones');
    };

    /**
     * Sends a request to query all zones
     * 
     * @returns {promise}
     */
    this.getDocumentTypes = function () {
        return queries.executeRequest('GET', 'customers/documenttypes');
    };

    /**
     * Obtiene el listado de todos los clientes del sistema
     * 
     * @returns {promise}
     */
    this.getAll = function () {
        return queries.executeRequest('GET', 'customers/all');
    };

    this.getCustomerFiltered = function ($filter) {
        $params = {filter: $filter};
        return queries.executeRequest('GET', 'customers/filtered', null, $params);
    };

    /**
     * Sends a request to remove an user
     * 
     * @param {Integer} customerId :User ID to remove
     * @returns {promise}
     */
    this.remove = function (customerId) {

        $params = {
            customer_id: customerId
        };

        return queries.executeRequest('DELETE', 'customers/destroy', null, $params);
    };

    /**
     * Obtiene el saldo de utilidades que se le deben al cliente
     * @param {Integer} customerId : el id del cliente a consultar
     * @returns {promise}
     */
    this.getUtilitiesBalance = function (customerId) {

        $params = {
            customer_id: customerId
        };

        return queries.executeRequest('GET', 'customers/utilitiesbalance', null, $params);
    };

    this.findUtilitiesInfo = function ($id) {

        $params = {customer_id: $id};

        return queries.executeRequest('GET', 'customers/findutilitiesinfo', null, $params);
    };

    return this;
});
