var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('arrays', function () {
    var arrays = {};

    arrays.getItem = function (array, item) {
        for (i = 0; i < array.length; i++) {
            if (parseInt(array[i].id) === parseInt(item.id)) {
                return array[i];
            }
        }

        return null;
    };

    arrays.getItemById = function (array, itemId) {
        for (i = 0; i < array.length; i++) {
            if (parseInt(array[i].id) === parseInt(itemId)) {
                return array[i];
            }
        }

        return null;
    };

    arrays.setItem = function (array, item) {
        for (i = 0; i < array.length; i++) {
            if (parseInt(array[i].id) === parseInt(item.id)) {
                array[i] = item;
                return true;
            }
        }

        return false;
    };

    arrays.getIndex = function (array, item) {
        for (i = 0; i < array.length; i++) {
            if (parseInt(array[i].id) === parseInt(item.id)) {
                return i;
            }
        }

        return -1;
    };

    arrays.getIndexById = function (array, id) {
        for (i = 0; i < array.length; i++) {
            if (array[i].id == id) {
                return i;
            }
        }

        return -1;
    };

    arrays.getItemByValue = function (array, value, property) {

        for (i = 0; i < array.length; i++) {
            if (array[i][property] == value) {
                return array[i];
            }
        }

        return null;
    };

    arrays.buildIndex = function (source, property) {
        var tempArray = [];
        for (var i = 0, len = source.length; i < len; ++i) {
            tempArray[source[i][property]] = source[i];
        }
        return tempArray;
    };

    arrays.setKey = function ($array, $oldKey, $newKey) {

        for (i = 0, l = $array.length; i < l; i++) {
            $array[i][$newKey] = $array[i][$oldKey];
            delete $array[i][$oldKey];
        }

        return true;
    };

    arrays.removeKeys = function ($array, $keytoKeep) {
        for (i = 0, l = $array.length; i < l; i++) {
            angular.forEach($array[i], function (value, key) {
                if (key !== $keytoKeep) {
                    delete $array[i][key];
                }
            });
        }
    };

    return arrays;
});
