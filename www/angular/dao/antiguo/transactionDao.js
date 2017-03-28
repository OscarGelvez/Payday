/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('TransactionDao', function (queries) {

    this.confirmTransactions = function ($transactions) {
        return queries.executeRequest('POST', 'transactions/confirm', $transactions);
    };

    return this;
});



