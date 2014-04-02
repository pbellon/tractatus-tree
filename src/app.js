var tractatus = angular.module('tractatus-tree', [
        'ngRoute',
    ]).run([function(){
        // do stuff ?
    }]).config([
        '$routeProvider',
        function($routeProvider){
            $routeProvider
                .when('/', {
                    controller: 'MainCtrl',
                    templateUrl: "home.html"
                });

        }
    ]);


tractatus.controller('MainCtrl', ['$scope', function($scope){
    console.log("MainCtrl.init");
}]);