angular.module('tractatus-tree').directive('tractatusGraph', [ '$rootScope', 'constant.events', 'constant.tree', ($rootScope, EVENTS, TREE)->
    restrict: "A",
    template: "<div><svg></svg></div>",
    replace: true,
    link: (scope, elem, attr)->
        activeNode = undefined
        colors =
            active: 'rgb(69, 69, 69)',
            inactive: 'rgb(179, 179, 179)'

        elemWidth = $(elem).outerWidth()

        margin = 
            top: 20
            right: 10
            bottom: 20
            left: 300

        width  = elemWidth
        height = 550
            
        i = 0
        duration = 750
        root = null

        getWidth =-> width

        getHeight =-> height

        collapseNode = (node)->
            if node.opened
                node.opened = false

            if node.children
                node._children = node.children
                node._children.forEach(collapseNode)
                node.children = null

            return

        nodeHasChildren = (node)->
            children = node.children or node._children
            children = angular.copy(children) or []
            has = children.length > 0
            has

        getNodeColor = (node)->
            if nodeIsActive(node.key) then colors.active else colors.inactive

        getTextColor = (node)->
            if nodeIsActive(node.key) then 'white' else colors.active

        nodeIsOpen = (node)->
            opened = !!node.opened
            opened

        nodeIsActive = (node_key)->
            is_active = activeNode and activeNode == node_key
            is_active 

        setActive = (node_key)-> 
            activeNode = node_key
            activeNode

        toggleOpen = (node)->
            if not nodeIsActive(node.key)
                setActive(node.key) unless nodeIsOpen(node)

            if nodeIsOpen(node)
                node.opened = false
                collapseNode(node)
            else
                node.opened = true
                node.children = node._children
                scope.$parent.$broadcast(EVENTS.node.selected, node)

            update(node)

        # Toggle children on click.
        onNodeClicked = toggleOpen

        svg = d3.select(elem[0]).selectAll('svg')
                    .attr('width',  getWidth())
                    .attr('height', getHeight())
                    .append("g").attr("transform", "translate(40,0)")

        tree     = d3.layout.tree().size( [ getHeight(), getWidth() ])
        diagonal = d3.svg.diagonal().projection((node)-> [node.y, node.x])

        init = ->
            root = TREE
            root.opened = true
            root.x0 = height / 2
            root.y0 = margin.left
            root.children.forEach(collapseNode)
            update(root)
        

        update = (source)->
            # Compute the new tree layout.
            nodes = tree.nodes(root).reverse()
            links = tree.links(nodes)

            # Normalize for fixed-depth.
            nodes.forEach (node)-> 
                node.y = node.depth * 120
                return

            # Update the nodes…
            node = svg.selectAll("g.node")
                .data nodes, (node)-> 
                    node.id or (node.id = ++i)

            # Enter any new nodes at the parent's previous position.
            nodeEnter = node.enter().append("g")
                .attr("class", 'node')
                .attr("transform", (node)-> "translate(" + source.y0 + "," + source.x0 + ")")
                .on("click", onNodeClicked)

            nodeEnter.append("rect")
                .attr("width", 60)
                .attr("height", 20)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("y", -10)
                .style("stroke", "#000000")
                .style("stroke-width", 1)


            nodeEnter.append("text")
                .attr("dy", ".35em")
                .attr("x", 30)
                .attr("text-anchor", "middle")
                .text((node)-> node.key)
                .style("fill", 'white')
                .style("fill-opacity", 1e-6)

            nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", (node)-> "translate(" + node.y + "," + node.x + ")" )

            nodeUpdate.select("rect")
                .style("fill", getNodeColor)
                

            nodeUpdate.select("text")
                .style("fill", 'white')
                .style("fill-opacity", 1)

            # Transition exiting nodes to the parent's new position.
            nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", (node)-> "translate(#{source.y},#{source.x})")
                .remove()

            nodeExit.select("circle").attr("r", 1e-6)

            nodeExit.select("text").style("fill-opacity", 1e-6)

            # Update the links…
            link = svg.selectAll("path.link")
                      .data(links, (node)-> node.target.id )

            # Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", (node) ->
                    o = 
                        x: source.x0
                        y: source.y0
                    diagonal
                        source: o
                        target: o
                )

            # Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal)

            # Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", (node) ->
                    o = 
                        x: source.x
                        y: source.y
                    diagonal 
                        source: o
                        target: o
                )
                .remove()

            # Stash the old positions for transition.
            nodes.forEach (node) ->
                node.x0 = node.x
                node.y0 = node.y
                return
            return
        init()
        return
])