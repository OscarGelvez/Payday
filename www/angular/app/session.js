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

    this.isAuthenticated = 0;

    /**
     * Checks if current user is authenticated
     */
    this.isLoged = function () {

        if (localStorage['kubesoft.kubeApp.authenticated'] == 1) {
            return true;
        }
        return false;
    };

    /**
     * Creates a new session
     */
    this.create = function (info) {
        this.isAuthenticated = info.is_authenticated;
        this.user_id = info.id;
        this.username = info.username;
        this.name = info.name;
        this.email = info.email;
        this.code = info.code_activation;
        // this.permissions = info.permissions;
        // this.roles = info.user.roles;
        this.save();
    };





    /**
     * Destroys current session
     */
    this.destroy = function () {
        this.id = null;
        this.user_id = null;
        this.isAuthenticated = 0;
        delete localStorage['kubesoft.kubeApp.authenticated'];
        delete localStorage['kubesoft.kubeApp.user_id'];
        
        delete localStorage['kubesoft.kubeApp.username'];
        delete localStorage['kubesoft.kubeApp.name'];
         delete localStorage['kubesoft.kubeApp.email'];
         delete localStorage['kubesoft.kubeApp.code'];
        // delete localStorage['kubesoft.kubeApp.permissions'];
        // delete localStorage['kubesoft.kubeApp.roles'];
        sessionStorage.clear();
    };

    /**
     * Store current session in local storage
     */
    this.save = function () {

        localStorage['kubesoft.kubeApp.authenticated'] = this.isAuthenticated;
        localStorage['kubesoft.kubeApp.user_id'] = this.user_id;
      
        localStorage['kubesoft.kubeApp.username'] = this.username;
        localStorage['kubesoft.kubeApp.name'] = this.name;
        localStorage['kubesoft.kubeApp.email'] = this.email;
        localStorage['kubesoft.kubeApp.code'] = this.code;
        // localStorage['kubesoft.kubeApp.permissions'] = JSON.stringify(this.permissions);
        // localStorage['kubesoft.kubeApp.roles'] = JSON.stringify(this.roles);

        // $http.defaults.headers.common['user'] = this.user_id;
        // $http.defaults.headers.common['token'] = this.token;

    };

    /**
     * Reload session parameters
     */
    this.refresh = function () {

        if (this.isLoged()) {
            console.log("refresh fue true")
            info = {};
           
            info.id = localStorage['kubesoft.kubeApp.user_id'];      
            info.username = localStorage['kubesoft.kubeApp.username'];
            info.name = localStorage['kubesoft.kubeApp.name'];
            info.email = localStorage['kubesoft.kubeApp.email'];
            info.is_authenticated = localStorage['kubesoft.kubeApp.authenticated']; 
            info.code_activation = localStorage['kubesoft.kubeApp.code']; 

            // info.permissions = JSON.parse(localStorage['kubesoft.kubeApp.permissions']);
            // info.user.roles = JSON.parse(localStorage['kubesoft.kubeApp.roles']);
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
        console.log("paso por aqui") // quien llama a esta funcionn ???           
       // $state.go('login');
    };



    return this;

});
