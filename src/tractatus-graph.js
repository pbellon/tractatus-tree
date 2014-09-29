angular.module('tractatus-tree').directive('tractatusGraph', [
    '$rootScope',
    'constant.events',
    function($rootScope, EVENTS){

        /** 
        The tractatus graph will display a tree visualization of Wittgenstein's 
        tractatus. 

        Features: 
        - tree navigation / visualization
        **/
        var directive = {
            restrict: "A",
            template: "<div><svg></svg></div>",
            replace: true,
            link: function(scope, elem, attr){
                var colors = {
                    opened: 'white',
                    closed: '#B3B3B3'
                }

                var margin = {top: 20, right: 10, bottom: 20, left: 120},
                    width = 1800 - margin.right - margin.left,
                    height = 700 - margin.top - margin.bottom;
                    
                var i = 0,
                    duration = 750,
                    root=null;
   
                var getWidth = function(){
                     return width;
                };

                var getHeight = function(){
                    return height;
                };

                var collapseNode = function(node){
                    if (node.children) {
                        node._children = node.children;
                        node._children.forEach(collapseNode);
                        node.children = null;
                    }
                };

                var nodeHasChildren = function(node){
                    children = node.children || node._children;
                    children = children || [];
                    return children.length > 0;
                };

                var getNodeColor = function(node){
                    return nodeIsOpen(node) ? colors.opened : colors.closed;
                };

                var getTextColor = function(node){
                    return nodeIsOpen(node) ?  colors.closed : colors.opened;
                };

                var nodeIsOpen = function(node){
                    return !!node.opened;
                };

                var toggleOpen = function(node){
                    if(nodeIsOpen(node)){
                        node.opened = false;
                        collapseNode(node);
                    } else { 
                        node.opened = true;
                        node.children = node._children;
                        scope.$parent.$broadcast(EVENTS.node.selected, node);  
                    }
                    update(node);
                };


                // Toggle children on click.
                var onNodeClicked = function(node) {
                    toggleOpen(node);
                };

                var svg = d3.select(elem[0]).selectAll('svg')
                            .attr('width',  getWidth())
                            .attr('height', getHeight())
                            .append("g").attr("transform", "translate(40,0)");

                var tree     = d3.layout.tree().size( [ getHeight(), getWidth() ]);
                var diagonal = d3.svg.diagonal().projection(function(node){
                    return [node.y, node.x];
                });

                d3.json('data/tractatus.json', function(error, jsonRoot){
                    root = jsonRoot;
                    root.x0 = height / 2;
                    root.y0 = 0;
                    root.children.forEach(collapseNode);
                    update(root);
                });

                var update = function(source){
                    // Compute the new tree layout.
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);

                    // Normalize for fixed-depth.
                    nodes.forEach(function(node) { node.y = node.depth * 180; });

                    // Update the nodes…
                    var node = svg.selectAll("g.node")
                        .data(nodes, function(node) { return node.id || (node.id = ++i); });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", function(node){
                            return !!node.opened ? 'node opened' : 'node closed';
                        })
                        .attr("transform", function(node) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                        .on("click", onNodeClicked);

                    nodeEnter.append("rect")
                        .attr("width", 60)
                        .attr("height", 20)
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .attr("y", -10)
                        .style("stroke", "#000000")
                        .style("stroke-width", 1);


                    nodeEnter.append("text")
                        .attr("dy", ".35em")
                        .attr("x", 30)
                        .attr("text-anchor", "middle")
                        .text(function(node) { return node.key; })
                        .style("fill", getTextColor)
                        .style("fill-opacity", 1e-6);

                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(node) { return "translate(" + node.y + "," + node.x + ")"; });

                    nodeUpdate.select("rect")
                        .style("fill", getNodeColor);
                        

                    nodeUpdate.select("text")
                        .style("fill", getTextColor)
                        .style("fill-opacity", 1)

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(node) { return "translate(" + source.y + "," + source.x  + ")"; })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 1e-6);

                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);

                    // Update the links…
                    var link = svg.selectAll("path.link")
                        .data(links, function(node) { return node.target.id; });

                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function(node) {
                          var o = {x: source.x0, y: source.y0};
                          return diagonal({source: o, target: o});
                        });

                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                        .attr("d", diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr("d", function(node) {
                          var o = {x: source.x, y: source.y};
                          return diagonal({source: o, target: o});
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function(node) {
                      node.x0 = node.x;
                      node.y0 = node.y;
                    });
                };
            }
        };
        return directive;
    }
]);