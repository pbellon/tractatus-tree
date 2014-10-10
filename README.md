### Tractatus' tree

This project is a personnal experimentation of how we can use a data-driven tools like [D3.js][d3] to explore a Philosophy piece like the Tractatus logico-philosophicus (*Logisch-Philosophische Abhandlung* in its original name).

This book published in 1921 was written by Ludwig Wittgenstein. Its numbered propositions follows a tree structure,(*1*, then *1.1*, *1.2* etc.) which made me think we could easily visualize it. 
Please note that this project is not an attempt to explain nor justify the book, I prefer to let you do that.

### How 
The tree visualization is heavily inspired (understand "built on") on the [Collapsible Tree block][block] created by Mike Bostock using its visualization library [D3][d3]. I created a small [script][] to scrap an HTML version of the tractatus and create a JSON structure with extracted propositions based on their number. 


### Thanks to these projects
- [Scrapped website][edu]
- [Yeoman][yeoman]
- [GulpJS][gulp]
- [D3.js][d3]
- [block #/tree viz][block]

[edu]:http://people.umass.edu/phil335-klement-2/tlp/tlp.html
[d3]: http://d3js.org/
[block]: http://bl.ocks.org/mbostock/4339083
[gulp]: http://gulpjs.com/
[yeoman]: http://yeoman.io/
[script]: https://github.com/pbellon/tractatus-tree/blob/master/scripts/generate_json.py
