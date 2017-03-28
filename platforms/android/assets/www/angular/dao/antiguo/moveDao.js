/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('MoveDao', function (queries) {

    /**
     * Send a request to store a new Customer
     * 
     * @param {Object} $customer: Customer information
     * @returns {promise}
     */
    this.create = function ($move) {

        return queries.executeRequest('POST', 'moves/create', $move);
    };

    this.getBalance = function () {
        return queries.executeRequest('GET', 'moves/balance');
    };

    this.remove = function (moveId) {

        $params = {
            move_id: moveId
        };

        return queries.executeRequest('DELETE', 'moves/destroy', null, $params);
    };

    this.find = function ($id) {

        $params = {move_id: $id};

        return queries.executeRequest('GET', 'moves/find', null, $params);
    };

    this.findFull = function ($id) {

        $params = {move_id: $id};

        return queries.executeRequest('GET', 'moves/findfull', null, $params);
    };

    this.update = function (move) {

        $params = {
            _method: "PUT"
        };
        return queries.executeRequest('POST', 'moves/update', move, $params);
    };

    return this;
});
