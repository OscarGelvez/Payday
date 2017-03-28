/**
 * Service for users related queries
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('UserDao', function (queries) {

    /**
     * Sends a request to store a new User
     * 
     * @param {Object} $ally: User information
     * @returns {promise}
     */
    this.create = function ($user) {

        return queries.executeRequest('POST', 'users/create', $user);
    };

    /**
     * Sends a request to query an user given its ID
     * 
     * @param {int} $id : User ID
     * @returns {promise}
     */
    this.find = function ($id) {

        $params = {user_id: $id};

        return queries.executeRequest('GET', 'users/find', null, $params);
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
     * Sends a request to query all users
     * 
     * @returns {promise}
     */
    this.getUsers = function () {

        return queries.executeRequest('GET', 'users/users');
    };

    /**
     * Sends a request to query all coordinators
     *
     * @returns {promise}
     */
    this.getCoordinators = function () {
        return queries.executeRequest('GET', 'users/coordinators');
    };

    /**
     * Sends a request to query all document types
     * 
     * @returns {promise}
     */
    this.getDocumentTypes = function () {
        return queries.executeRequest('GET', 'users/documenttypes');
    };

    /**
     * Sends a request to query all user types
     * 
     * @returns {promise}
     */
    this.getUserTypes = function () {
        return queries.executeRequest('GET', 'users/usertypes');
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

    /**
     * Sends a request to change current's user password
     * 
     * @returns {promise}
     */
    this.changePassword = function ($user) {

        $params = {_method: "PUT"};

        return queries.executeRequest('POST', 'users/updatepassword', $user, $params);
    };

    /**
     * Sends a request to query all user allies
     *
     * @returns {promise}
     */
    this.getAllies = function () {

        return queries.executeRequest('GET', 'users/allies');
    };

    /**
     * Sends a request to query a users type agent
     * @returns {unresolved}
     */
    this.getUsersAgent = function () {
        return queries.executeRequest('GET', 'users/usersagent');
    };

    this.getUser = function () {
        return queries.executeRequest('GET', 'users/user');
    };

    this.getDispatchUsers = function () {
        return queries.executeRequest('GET', 'users/dispatchusers');
    };

    this.update = function (user) {

        $params = {
            _method: "PUT"
        };
        return queries.executeRequest('POST', 'users/update', user, $params);
    };

    return this;
});
