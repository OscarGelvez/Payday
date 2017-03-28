/**
 * Archivo de definición de constantes y variables globales
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */

var kubeApp = angular.module('kubeApp');

kubeApp.constant('USE_CASE', {
    /** Contants for showing/hiding sections START */
    'LIST_CUSTOMERS': "RF01",
    'ADD_CUSTOMER': "RF02",
    'LIST_ACCOUNTS': "RF03",
    'ADD_ACCOUNT': "RF04",
    'ADD_BOLIVARS_SALE': "RF05",
    'ADD_DOLLARS_SALE': "RF06",
    'LIST_SALES': "RF07",
    'GENERATE_MOVE_REPORT': "RF08",
    'LIST_CUSTOMERS_BALANCE': "RF09",
    'DAILY_REPORT': "RF10",
    'ADD_BOLIVARS_PURCHASE': "RF11",
    'ADD_DOLLARS_PURCHASE': "RF12",
    'LIST_PURCHASES': "RF13",
    'LIST_DISPATCHS': "RF14",
    'DISPATCH_ACCOUNT': "RF15",
    'LIST_TRANSACTIONS_ACCOUNTS': "RF16",
    'CONFIRM_TRANSACTIONS': "RF17",
    'ADD_MOVE': "RF18",
    'LIST_MOVES': "RF19",
    'ADD_USER': "RF20",
    'LIST_USERS': "RF21",
    'REASSESS_SALES': "RF22",
    'SUPERVISE_TRANSACTIONS': "RF23",
    
    'SHOW_REPORTS_MODULE': "MostrarInformes",
    'SHOW_SALES_MODULE': "MostrarVentas",
    'SHOW_CUSTOMERS_MODULE': "MostrarClientes",
    'SHOW_ACCOUNTS_MODULE': "MostrarCuentasBancarias",
    'SHOW_PURCHASES_MODULE': "MostrarCompras",
    'SHOW_DISPATCHS_MODULE': "MostrarDespachos",
    'SHOW_TRANSACTIONS_MODULE': "MostrarTransacciones",
    'SHOW_MOVES_MODULE': "MostrarMovimientos",
    'SHOW_USERS_MODULE': "MostrarUsuarios",
    'SHOW_UTILITIES_MODULE': "MostrarUtilidades"
            /** Contants for showing/hiding sections END */
});

kubeApp.constant('PRODUCTS', {
    'BOLIVARS': "Bolívares",
    'DOLLARS': "Dólares"
});

kubeApp.constant('DATES', {
    'DAY': "Dia",
    'MONTH': "Mes",
    'YEAR': "Año"
});

