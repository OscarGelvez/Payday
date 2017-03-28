/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('AccountDao', function (queries) {

    /**
     * Send a request to store a new Account
     * 
     * @param {Object} $customer: Account information
     * @returns {promise}
     */
    this.create = function ($account) {

        return queries.executeRequest('POST', 'accounts/create', $account);
    };

    /**
     * Sends a request to query an user given its ID
     * 
     * @param {int} $id : User ID
     * @returns {promise}
     */
    this.find = function ($id) {

        $params = {account_id: $id};

        return queries.executeRequest('GET', 'accounts/find', null, $params);
    };

    /**
     * Sends a request to update an user
     * 
     * @param {type} $user : User to update
     * @returns {promise}
     */
    this.update = function ($user) {

        $params = {
            _method: "PUT"
        };
        return queries.executeRequest('POST', 'users/update', $user, $params);
    };

    /**
     * Sends a request to query all zones
     * 
     * @returns {promise}
     */
    this.getZones = function () {
        return queries.executeRequest('GET', 'customers/zones');
    };

    this.getProducts = function () {
        return queries.executeRequest('GET', 'accounts/products');
    };

    this.getBank = function ($bankCode) {

        $params = {
            bank_code: $bankCode
        };

        return queries.executeRequest('GET', 'accounts/bank', null, $params);
    };

    this.getAll = function () {
        return queries.executeRequest('GET', 'accounts/all');
    };

    this.getByProduct = function ($product_name) {

        params = {product_name: $product_name};
        return queries.executeRequest('GET', 'accounts/byproduct', null, params);
    };

    this.getAccount = function ($accountNumber) {

        $params = {
            account_number: $accountNumber
        };

        return queries.executeRequest('GET', 'accounts/account', null, $params);
    };

    /**
     * Sends a request to remove an user
     * 
     * @param {Integer} userId :User ID to remove
     * @returns {promise}
     */
    this.remove = function (userId) {

        $params = {
            user_id: userId
        };

        return queries.executeRequest('DELETE', 'users/destroy', null, $params);
    };

    this.getAccountFiltered = function (filter) {
        $params = {filter: filter};
        return queries.executeRequest('GET', 'accounts/filtered', null, $params);
    };
    
    /**
     * Envía una petición POST al servicio asociado a la fiscalización de archivos
     * 
     * @param {file} : El archivo que contiene los datos de la fiscalización
     * @param {Object} Contiene información de la cuenta que se va a fiscalizar
     * @returns {promise}
     */
    this.supervise = function (file, transaction) {
        return queries.upload('POST', 'accounts/supervise', transaction, file);
    };

    return this;
});
