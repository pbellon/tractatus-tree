angular.module('tractatus-tree').constant('constant.nodes', {
    STATES: {
        CLOSED:  0,
        OPENED:  1,
        FOCUSED: 2
    }
});

angular.module('tractatus-tree').constant('constant.events', {
    node: {
        selected: 'node:selected',
        closed: 'node:closed'
    }
});

             
