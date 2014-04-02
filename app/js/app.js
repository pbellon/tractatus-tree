angular.module('tractatusTree.services', []);
angular.module('tractatusTree.filters',  []);

var tractatus = angular.module('tractatusTree', [
        'ngRoute',
    ]).run([function(){
        // do stuff ?
    }]).config([
        '$routeProvider',
        function($routeProvider){
            $routeProvider
                .when('/', {
                    controller: 'MainCtrl',
                    template: ""
                });

        }
    ]);