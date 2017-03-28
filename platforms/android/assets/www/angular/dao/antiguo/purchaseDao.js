/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('PurchaseDao', function (queries) {

    /**
     * Send a request to store a new Sale
     * 
     * @param {Object} $customer: Customer information
     * @returns {promise}
     */
    this.create = function ($customer) {
        return queries.executeRequest('POST', 'purchases/create', $customer);
    };

    return this;
});
