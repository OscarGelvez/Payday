/**
 * Servicio para gestionar la sesión del usuario
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 2.0
 *
 */

var kubeApp = angular.module('kubeApp');

kubeApp.service('SessionService', function ($http, $state) {

    this.isAuthenticated = false;

    /**
     * Checks if current user is authenticated
     */
    this.isLoged = function () {

        if (localStorage['kubesoft.kubeApp.authenticated']) {
            return true;
        }
        return false;
    };

    /**
     * Creates a new session
     */
    this.create = function (info) {
        this.isAuthenticated = true;
        this.user_id = info.user.id;
        this.token = info.token;
        this.username = info.user.username;
        this.name = info.user.name;
        this.permissions = info.permissions;
        this.roles = info.user.roles;
        this.save();
    };

    /**
     * Destroys current session
     */
    this.destroy = function () {
        this.id = null;
        this.user_id = null;
        this.isAuthenticated = false;
        delete localStorage['kubesoft.kubeApp.authenticated'];
        delete localStorage['kubesoft.kubeApp.user_id'];
        delete localStorage['kubesoft.kubeApp.token'];
        delete localStorage['kubesoft.kubeApp.username'];
        delete localStorage['kubesoft.kubeApp.name'];
        delete localStorage['kubesoft.kubeApp.permissions'];
        delete localStorage['kubesoft.kubeApp.roles'];
        sessionStorage.clear();
    };

    /**
     * Store current session in local storage
     */
    this.save = function () {

        localStorage['kubesoft.kubeApp.authenticated'] = true;
        localStorage['kubesoft.kubeApp.user_id'] = this.user_id;
        localStorage['kubesoft.kubeApp.token'] = this.token;
        localStorage['kubesoft.kubeApp.username'] = this.username;
        localStorage['kubesoft.kubeApp.name'] = this.name;
        localStorage['kubesoft.kubeApp.permissions'] = JSON.stringify(this.permissions);
        localStorage['kubesoft.kubeApp.roles'] = JSON.stringify(this.roles);

        $http.defaults.headers.common['user'] = this.user_id;
        $http.defaults.headers.common['token'] = this.token;

    };

    /**
     * Reload session parameters
     */
    this.refresh = function () {

        if (this.isLoged()) {
            console.log("refresh fue true")
            info = {};
            info.user = {};
            info.user.id = localStorage['kubesoft.kubeApp.user_id'];
            info.token = localStorage['kubesoft.kubeApp.token'];
            info.user.username = localStorage['kubesoft.kubeApp.username'];
            info.user.name = localStorage['kubesoft.kubeApp.name'];
            info.permissions = JSON.parse(localStorage['kubesoft.kubeApp.permissions']);
            info.user.roles = JSON.parse(localStorage['kubesoft.kubeApp.roles']);
            this.create(info);
            $state.go('app.home');
        } else {
            console.log("refresh fue false")
            $state.go('login');
        }
    }

    /**
     * Redirect user to login state
     */
    this.redirectToLogin = function () {
        $state.go('login');
    };

    /**
     * Redirect user to error state
     */
    this.unauthorized = function () {
        $state.go('login');
    };

    this.notFound = function () {
        $state.go('login');
    };

    return this;

});
