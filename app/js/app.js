'use strict';


// Declare app level module which depends on filters, and services
var cosmosUIDemo = angular.module('cosmosUIDemo', [
    'ngRoute',
    'ui.bootstrap',
    'ui.sortable',
    'ui.ace',
    'ui.select',
    'yaru22.jsonHuman',
    'LocalStorageModule',
    'cosmosUI.filters',
    'cosmosUI.services',
    'cosmosUI.directives',
    'cosmosUI.controllers'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/terminal', {templateUrl: 'lib/cosmos/partials/terminal.html', controller: 'TerminalCtrl'});

    $routeProvider.when('/install', {templateUrl: 'lib/cosmos/partials/install.html', controller: 'TerminalCtrl'});
    $routeProvider.when('/message', {templateUrl: 'lib/cosmos/partials/message.html', controller: 'MessageViewCtrl'});

    $routeProvider.when('/users', {templateUrl: 'lib/cosmos/partials/users.html', controller: 'UsersCtrl'});
    $routeProvider.when('/roles', {templateUrl: 'lib/cosmos/partials/roles.html', controller: 'RolesCtrl'});
    $routeProvider.when('/lists/', {templateUrl: 'lib/cosmos/partials/list.html', controller: 'ListCtrl'});
    $routeProvider.when('/login/', {templateUrl: 'lib/cosmos/partials/login.html', controller: 'LoginCtrl'});

    $routeProvider.when('/appstudio/:appPath?', {templateUrl: 'lib/cosmos/partials/appstudio.html', controller: 'AppStudioCtrl'});
    $routeProvider.when('/appstudio/page/:appPath/:pageId?', {templateUrl: 'lib/cosmos/partials/page-design.html', controller: 'PageDesignCtrl'});
    $routeProvider.when('/appstudio/form/:appPath/:formId?', {templateUrl: 'lib/cosmos/partials/form-design.html', controller: 'FormDesignController'});

    $routeProvider.when('/appstudio/:itemType/:appPath/:itemId?', {templateUrl: 'lib/cosmos/partials/item-design.html', controller: 'ItemDesignCtrl'});

    $routeProvider.when('/a/:appPath/formdesign/:formId?', {templateUrl: 'lib/cosmos/partials/form-design.html', controller: 'FormDesignController'});
    $routeProvider.when('/a/:appPath/pagedesign/:pageId?', {templateUrl: 'lib/cosmos/partials/page-design.html', controller: 'PageDesignCtrl'});


    $routeProvider.when('/a/:appPath?/', {templateUrl: 'lib/cosmos/partials/pageholder.html', controller: 'IndexCtrl'});
    $routeProvider.when('/a/:appPath/lists/:listId/', {templateUrl: 'lib/cosmos/partials/widget-host.html', controller: 'ListDetailCtrl'});

    $routeProvider.when('/a/:appPath/content/:fileObjectName/', {templateUrl: 'lib/cosmos/partials/uploadfile.html', controller: 'FileUploadCtrl'});
    $routeProvider.when('/a/:appPath/forms/:formId?/:dataId?', {templateUrl: 'lib/cosmos/partials/formview.html', controller: 'FormViewCtrl'});

    $routeProvider.when('/a/:appPath/page/:pageId?', {templateUrl: 'lib/cosmos/partials/page.html', controller: 'PageViewCtrl'});

    $routeProvider.when('/a/:appPath/view/:configId/:itemId/', {templateUrl: 'lib/cosmos/partials/singleitemview.html', controller: 'SingleItemViewCtrl'});

    $routeProvider.when('/applist/', {templateUrl: 'lib/cosmos/partials/applist.html', controller: 'AppListCtrl'});


    $routeProvider.otherwise({redirectTo: '/a/'});
}]);

cosmosUIDemo.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('cosmosUI');
});

cosmosUIDemo.factory('$templateCache', function($cacheFactory, $http, $injector) {
    var cache = $cacheFactory('templates');
    var widgetPromise;

    return {
        get: function(url) {
            var cached = cache.get(url);

            if (cached) {
                return cached;
            }

            if (!widgetPromise) {
                var uri='/service/cosmos.widgets/';

                widgetPromise = $http.get(uri).then(function(response) {
                    var template_data = JSON.parse(response.data._d);
                    angular.forEach(template_data, function (data, index) {
                        var template = '<script type="text/ng-template" id="' + data.name + '">' + data.template + '</script>';
                        $injector.get('$compile')(template);
                    });

                    var cached = cache.get(url);
                    if (cached) {
                        return cached;
                    }
                    else{
                        $http.get(url).then(function (response) {
                            return response;
                        });
                    }
                });
            }

            return widgetPromise.then(function(response){
                var cached = cache.get(url);
                if (cached) {
                    return cached;
                }
                //Fallback to request the server
                return $http.get(url).then(function(response){
                    return response;
                });
            })
        },

        put: function(key, value) {
            cache.put(key, value);
        }
    };
});
