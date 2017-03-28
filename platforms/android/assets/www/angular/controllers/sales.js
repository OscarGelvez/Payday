/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('SaleController', function ($scope, $state, modal, CustomerDao, arrays, notifications, SaleDao, PRODUCTS, AccountDao, $stateParams, $window, APP) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {
        $scope.$parent.init();
        currentState = $state.$current.name;
        $scope.sale = {};
        $scope.sale.dispatch_accounts = [];
        $scope.sale.transactions = [];

        switch (currentState) {
            case 'home.AddBolivarsSale':
                $scope.product = PRODUCTS.BOLIVARS;
                SaleDao.getProduct($scope.product).then(function (result) {
                    $scope.sale.product_id = result.data.id;
                });
                CustomerDao.getDocumentTypes().then(function (result) {
                    $scope.documentTypes = result.data;
                });
                break;
            case 'home.AddDollarsSale':
                $scope.product = PRODUCTS.DOLLARS;
                SaleDao.getProduct($scope.product).then(function (result) {
                    $scope.sale.product_id = result.data.id;
                });
                CustomerDao.getDocumentTypes().then(function (result) {
                    $scope.documentTypes = result.data;
                });
                break;
            case 'home.ListSales':
                $scope.paginate();
                break;
            case 'home.EditBolivarsSale':
                $scope.product = PRODUCTS.BOLIVARS;
                initEditingStates();
                break;
            case 'home.EditDollarsSale':
                $scope.product = PRODUCTS.DOLLARS;
                initEditingStates();
                break;
            case 'home.ReassessSales':
                $scope.paginateSalesToReassess();
                break;
            case 'home.AddBolivarsTestSale':
                $scope.product = PRODUCTS.BOLIVARS;
                SaleDao.getProduct($scope.product).then(function (result) {
                    $scope.sale.product_id = result.data.id;
                });
                CustomerDao.getDocumentTypes().then(function (result) {
                    $scope.documentTypes = result.data;
                });
                AccountDao.getByProduct(PRODUCTS.BOLIVARS).then(function (result) {
                    $scope.accounts = result.data;
                });
                break;
            case 'home.AddDollarsTestSale':
                $scope.product = PRODUCTS.DOLLARS;
                SaleDao.getProduct($scope.product).then(function (result) {
                    $scope.sale.product_id = result.data.id;
                });
                CustomerDao.getDocumentTypes().then(function (result) {
                    $scope.documentTypes = result.data;
                });
                AccountDao.getByProduct(PRODUCTS.DOLLARS).then(function (result) {
                    $scope.accounts = result.data;
                });
                break;
        }
    }

    /**
     * Exporta la búsqueda actual de ventas a excel
     * 
     * @returns {void}
     */
    $scope.excelExport = function (fechaInicio, fechaFin, filtro) {
        params = {
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            filtro: filtro
        };
        SaleDao.excelExport(params).then(function (result) {
            $window.open(APP.FILES_URL + result.url);
        });
    };

    $scope.paginateSalesToReassess = function () {
        $scope.cargarListaAjax('sales/paginatesalestoreassess');
    };

    $scope.getTotal = function () {

        if ($scope.sale.transactions === undefined) {
            return;
        }

        var total = 0;

        angular.forEach($scope.sale.transactions, function (transaction) {
            if (!isNaN(transaction.amount)) {
                total += transaction.amount;
            }
        });

        $scope.sale.amount = total;
        return total;
    };

    function initEditingStates() {
        $scope.isEditing = true;
        CustomerDao.getDocumentTypes().then(function (result) {
            $scope.documentTypes = result.data;
        });
        SaleDao.findFull($stateParams.sale_id).then(function (result) {
            result.data.customer_nit = result.data.customer.customer_nit + ", " + result.data.customer.fullname + ", " + "Zona " + result.data.customer.zone.name;
            result.data.dispatch_accounts = result.data.dispatch_accounts.map(function (item) {
                item.document_number = parseInt(item.document_number);
                return item;
            });
            $scope.sale = result.data;
            $scope.addDispatchAccountsEnabled = true;
        });
    }

    $scope.checkEdit = function (sale) {
        SaleDao.findFull(sale.id).then(function (result) {
            if (emptySale(result.data.dispatch_accounts)) {
                if (result.data.product.name === PRODUCTS.BOLIVARS) {
                    $state.go('home.EditBolivarsSale', {sale_id: sale.id});
                } else if (result.data.product.name === PRODUCTS.DOLLARS) {
                    $state.go('home.EditDollarsSale', {sale_id: sale.id});
                }
            } else {
                modal.showInformationModal('La venta no se puede editar, ya existen transacciones asociadas a las cuentas de despacho');
            }
        });
    };

    $scope.checkRemove = function (sale) {
        SaleDao.findFull(sale.id).then(function (result) {
            if (emptySale(result.data.dispatch_accounts)) {
                var modalInstance = modal.showConfirmModal('¿Está seguro que desea eliminar la venta?');
                modalInstance.result.then(function (data) {
                    $scope.remove(sale);
                });

            } else {
                modal.showInformationModal('La venta no se puede eliminar, ya existen transacciones asociadas a las cuentas de despacho');
            }
        });
    };

    function emptySale(dispatch_accounts) {
        var valid = true;
        angular.forEach(dispatch_accounts, function (dispatch_account) {
            if (dispatch_account.state.name !== 'Registrada') {
                valid = false;
            }
        });

        return valid;
    }

    $scope.removeField = function (index) {
        $scope.sale.transactions.splice(index, 1);
    };

    $scope.getCustomer = function ($filter) {
        return CustomerDao.getCustomerFiltered($filter).then(function (result) {
            return result.data.map(function (item) {
                return item.customer_nit + ", " + item.fullname + ", " + "Zona " + item.zone;
            });
        });
    };

    $scope.showAddDispatchAccount = function ($data) {
        var modalInstance = modal.showModal('html/sales/templates/addDispatchAccount.html', null, $data);

        modalInstance.result.then(function (data) {

            var balance = calculateBalance();

            if ((balance + data.amount) > $scope.sale.amount) {
                notifications.showError("El monto ingresado supera el valor de la venta (" + $scope.sale.amount + ")");
                $scope.showAddDispatchAccount(data);
            } else {
                $scope.addDispatchAccount(data);
            }
        });
    };

    $scope.paginate = function () {
        $scope.cargarListaAjax('sales/paginate');
    };

    function calculateBalance() {

        var balance = 0;

        for (i = 0; i < $scope.sale.dispatch_accounts.length; i++) {
            var dispatchAccount = $scope.sale.dispatch_accounts[i];
            if (dispatchAccount.amount !== undefined) {
                balance += parseFloat(dispatchAccount.amount);
            }
        }

        return balance;
    }

    $scope.getBalance = function () {
        if ($scope.sale.amount === undefined) {
            return 0;
        }
        return (parseFloat($scope.sale.amount) - calculateBalance());
    };

    $scope.addNewDispatchAccount = function () {
        var dispatchAccount = {};
        $scope.sale.dispatch_accounts.push(dispatchAccount);
    };

    $scope.findBank = function ($account) {

        if ($account.account_number === undefined) {
            return;
        }

        $bankCode = $account.account_number.toString().substring(0, 4);

        AccountDao.getBank($bankCode).then(function (result) {

            if (result.data !== null) {
                $account.bank_name = result.data.name;
            } else {
                $account.bank_name = "desconocido";
            }
        });
    };

    $scope.addDispatchAccount = function ($account) {

        item = arrays.getItemByValue($scope.documentTypes, $account.document_type, 'name');

        $account.document_type_id = item.id;
        delete $account.document_type;

        $bankCode = $account.account_number.substring(0, 4);

        AccountDao.getBank($bankCode).then(function (result) {

            $account.bank_name = result.data.name;
            $scope.sale.dispatch_accounts.push($account);
        });


    };

    $scope.getDocumentType = function (id) {
        return arrays.getItemById($scope.documentTypes, id);
    };

    $scope.enableAddDispatchAccounts = function () {
        $scope.addDispatchAccountsEnabled = true;
        $scope.addNewDispatchAccount();
    };

    $scope.enableAddTransactions = function () {
        $scope.addTransactionsEnabled = true;
        $scope.addNewTransaction();
    };

    $scope.addNewTransaction = function () {
        var transaction = {};
        $scope.sale.transactions.push(transaction);
    };

    /**
     * Creates a new call script and, if success, redirects to Call scripts list view
     * 
     * @returns {void}
     */
    $scope.create = function () {

        if ($scope.formAddSale.$invalid) {
            return;
        }

        balance = calculateBalance();

        if (balance < $scope.sale.amount) {
            notifications.showError("El monto ingresado en las cuentas de despacho es inferior al monto de la venta");
            return;
        } else if (balance > $scope.sale.amount) {
            notifications.showError("El monto ingresado en las cuentas de despacho es mayor al monto de la venta");
            return;
        }

        $scope.sale.customer_nit = $scope.sale.customer_nit.split(",")[0];

        if ($scope.isEditing) {
            SaleDao.update($scope.sale).then(function (result) {
                $scope.$emit('newOperation');
                $state.go("home.ListSales");
            });
        } else {
            SaleDao.create($scope.sale).then(function (result) {
                $scope.$emit('newOperation');
                $state.go("home.ListSales");
            });
        }
    };

    $scope.createTest = function () {

        if ($scope.formAddTransactions.$invalid) {
            return;
        }

        $scope.sale.customer_nit = $scope.sale.customer_nit.split(",")[0];

        SaleDao.createTest($scope.sale).then(function (result) {
            $state.go("home.ListSales");
        });
    };

    /**
     * update a call script and, if success, redirects to call scripts list view
     * 
     * @returns {void}
     */
    $scope.update = function () {
        CallScriptDao.update($scope.callScript).then(function (result) {
            $state.go("home.callScriptList", {ally_id: $scope.ally_id, ally_name: $scope.ally_name});
        });
    };

    /**
     * Removes a Call Script
     * 
     * @param {Object} $callScript : Call Script to remove
     * @returns {void}
     */
    $scope.remove = function ($sale) {
        SaleDao.remove($sale.id).then(function (result) {
            $scope.reloadTable();
        });
    };

    /**
     * Shows a confirm modal to delete a call script, if confirmed, sends a request to delete it.
     * 
     * @param {Object} $callScript : Call Script to delete
     * @returns {undefined}
     */
    $scope.showConfirmRemove = function ($callScript) {
        var modalInstance = modal.showModal('assets/admin/templates/global/confirm.html');

        modalInstance.result.then(function (data) {
            $scope.remove($callScript);
        });
    };

    $scope.showConfirmReassess = function (sale) {
        var modalInstance = modal.showConfirmModal('¿Está seguro que desea reliquidar la Venta? (Precio total despues de reliquidar: ' + (sale.amount - sale.amount_rejected) + ")");

        modalInstance.result.then(function (data) {
            $scope.reassess(sale);
        });
    };

    $scope.reassess = function (sale) {
        SaleDao.reassess(sale.id).then(function (result) {
            $scope.reloadTable();
        });
    };

    //Initialize
    init();
});
