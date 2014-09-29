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


tractatus.controller('MainCtrl', ['$scope', '$sce', 'constant.events', function($scope, $sce, EVENTS){
    $scope.selectedNode = undefined;

    $scope.$on(EVENTS.node.selected, function(evt, node){
        node.selectedLanguage = 'en';
        $scope.$apply(function(){
            $scope.selectedNode = node;
        });
    }); 

    $scope.changeLang = function(lang){
        $scope.selectedNode.selectedLanguage = lang;
    }

    $scope.getContent = function(){
        node = $scope.selectedNode
        return $sce.trustAsHtml(node.content[node.selectedLanguage]);
    }
}]);