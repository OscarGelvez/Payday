var kubeApp = angular.module('kubeApp');

/**
 * Directiva para comparar campos
 *
 */
kubeApp.directive("passwordMatcher", function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=passwordMatcher"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.passwordMatcher = function (modelValue) {
                return modelValue === scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
});

/**
 * Directiva para limitar la introducción de caracteres a sólo números
 * @source http://jsfiddle.net/thomporter/DwKZh/
 */
kubeApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                //this next if is necessary for when using ng-required on your input.
                //In such cases, when a letter is typed first, this parser will be called
                //again, and the 2nd time, the value will be undefined
                if (inputValue == undefined)
                    return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});


/**
 * Directiva para el mostrar/ocultar contenido dependiendo de los permisos del usuario
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
kubeApp.directive('hasPermission', function (SessionService, USE_CASE) {

    return function (scope, element, attrs) {
        if (SessionService.permissions[USE_CASE[attrs["hasPermission"]]] === undefined) {
            element.remove();
        }
    }
});

/**
 * Directive for execute angularJS function when Enter key is pressed
 * @source unknown
 */
kubeApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

//http://www.sapiensworks.com/blog/post/2013/06/22/Binding-AngularJs-Model-to-Hidden-Fields.aspx
kubeApp.directive('ngUpdateHidden', function () {
    return function (scope, el, attr) {
        var model = attr['ngModel'];
        scope.$watch(model, function (nv) {
            el.val(nv);
        });

    };
});

//Handle Dropdown Hover Plugin Integration
kubeApp.directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});

//Handle Dropdown Toggle
kubeApp.directive('dropdownMenuToggle', function () {
    return {
        link: function (scope, elem) {
            // if you want it to work on click, too:
            elem.dropdown();
        }
    };
});

/**
 * directiva para capturar la tecla presionada sobre un elemento
 */
kubeApp.directive('ngKeyup',function(){
   return function(scope,element, attrs) {
       element.bind("keydup", function (event) {
            scope.$apply(attrs.ngKeyup);
        });
   };
});

kubeApp.directive('ngElementReady', [function() {
    return {
        priority: Number.MIN_SAFE_INTEGER, // execute last, after all other directives if any.
        restrict: "A",
        link: function($scope, $element, $attributes) {
            $scope.$eval($attributes.ngElementReady); // execute the expression in the attribute.
        }
    };
}]);

kubeApp.directive('isNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope) {    
            scope.$watch('wks.number', function(newValue,oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) return;
                if (arr.length === 2 && newValue === '-.') return;
                if (isNaN(newValue)) {
                    scope.wks.number = oldValue;
                }
            });
        }
    };
});
