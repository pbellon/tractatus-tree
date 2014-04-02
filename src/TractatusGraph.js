angular.module('tractatus-tree').directive('tractatusGraph', [
    function(scope, element, attr){
        console.log('init');
        var directive = {
            restrict: "A",
            template: "<div><svg></svg></div>",
            replace: true,
            link: function(scope, elem, attr){
                var width = 900, height = 1200;
                var update = function(){

                    var getWidth = function(){
                        return width;
                    };

                    var getHeight = function(){
                        return height;
                    };

                    var svg      = d3.select(elem[0]).selectAll('svg')
                                     .attr('width',  getWidth())
                                     .attr('height', getHeight())
                                     .append("g").attr("transform", "translate(40,0)");

                    var cluster  = d3.layout.cluster().size(getHeight(), getWidth());
                    var diagonal = d3.svg.diagonal().projection(function(d){
                        return [d.y, d.x];
                    });

                    d3.json('data/tractatus.json', function(error, root){
                        console.log(error, root);

                        var nodes = cluster.nodes(root),
                            links = cluster.links(nodes);

                        var link = svg.selectAll(".link")
                                      .data(links)
                                      .enter().append("path")
                                      .attr("class", "link")
                                      .attr("d", diagonal);

                        var node = svg.selectAll(".node")
                                      .data(nodes)
                                      .enter().append("g")
                                      .attr("class", "node")
                                      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                        node.append("circle")
                            .attr("r", 4.5);

                        node.append("text")
                            .attr("dx", function(d) { return d.children ? -8 : 8; })
                            .attr("dy", 3)
                            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
                            .text(function(d) { return d.key; });

                        d3.select(elem[0]).style("height", height + "px");
                    });
                };

                update();
            }
        };
        return directive;
    }
]);