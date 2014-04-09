angular.module('tractatus-tree').directive('tractatusGraph', [
    function(scope, element, attr){
        var directive = {
            restrict: "A",
            template: "<div><svg></svg></div>",
            replace: true,
            link: function(scope, elem, attr){
                var margin = {top: 20, right: 120, bottom: 20, left: 120},
                    width = 1200 - margin.right - margin.left,
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

                var collapseNode = function(d){
                    if (d.children) {
                        d._children = d.children;
                        d._children.forEach(collapseNode);
                        d.children = null;
                    }
                };

                var nodeHasChildren = function(d){
                    children = d.children || d._children;
                    children = children || [];
                    return children.length > 0;
                };

                var getNodeColor = function(d){
                    return nodeHasChildren(d) ? "green" : "red";
                };

                // Toggle children on click.
                var onNodeClicked = function(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = undefined;
                    } else {
                        d.children = d._children;
                        d._children = undefined;
                    }
                    update(d);
                };

                var svg = d3.select(elem[0]).selectAll('svg')
                            .attr('width',  getWidth())
                            .attr('height', getHeight())
                            .append("g").attr("transform", "translate(40,0)");

                var tree     = d3.layout.tree().size( [ getHeight(), getWidth() ]);
                var diagonal = d3.svg.diagonal().projection(function(d){
                    return [d.y, d.x];
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
                    nodes.forEach(function(d) { d.y = d.depth * 180; });

                    // Update the nodes…
                    var node = svg.selectAll("g.node")
                        .data(nodes, function(d) { return d.id || (d.id = ++i); });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                        .on("click", onNodeClicked);

                    nodeEnter.append("circle")
                        .attr("r", 1e-6)
                        .style("fill", getNodeColor);

                    nodeEnter.append("text")
                        .attr("x", function(d) { return nodeHasChildren(d) ? -10 : 10; })
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) { return nodeHasChildren(d) ? "end" : "start"; })
                        .text(function(d) { return d.key; })
                        .style("fill-opacity", 1e-6);

                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                    nodeUpdate.select("circle")
                        .attr("r", 4.5)
                        .style("fill", getNodeColor);

                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 1e-6);

                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);

                    // Update the links…
                    var link = svg.selectAll("path.link")
                        .data(links, function(d) { return d.target.id; });

                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function(d) {
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
                        .attr("d", function(d) {
                          var o = {x: source.x, y: source.y};
                          return diagonal({source: o, target: o});
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                      d.x0 = d.x;
                      d.y0 = d.y;
                    });
                };
            }
        };
        return directive;
    }
]);