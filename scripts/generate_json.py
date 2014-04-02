# Encoding: utf-8

from BeautifulSoup import BeautifulSoup
import json 

def find_child(children, sub):
    candidate = None
    elems = filter(lambda x: x['sub_key'] == sub, children)
    if len(elems):
        candidate = elems[0]
    return candidate 

def get_parent_key(key):
    splitted   = key.split('.')
    nb_terms   = len(splitted) - 1
    return ".".join(splitted[:nb_terms])

def find_node(root={}, prop_key=None):
    splitted_key = prop_key.split('.')
    node = None
    parent_node = None
    partial_key = []

    for sub_key in splitted_key:
        partial_key.append(sub_key)

        if parent_node == None:
            parent_node = root

        node = find_child(parent_node['children'], sub_key)

        if node == None and int(sub_key) == 0:
            prop_key    = ".".join(partial_key)
            parent_node = find_node(root=root, prop_key=get_parent_key(prop_key))
            node        = create_node(full_key=prop_key, sub_key=sub_key, empty=True, parent=parent_node)

        # if we will have a next loop then we save this node as parent
        if node:
            parent_node = node

    if node == None: 
        import pdb; pdb.set_trace()
    return node

def create_node(full_key=None, empty=False, sub_key=0, parent=None, proposition={}):
    node = {
        'sub_key': sub_key,
        'key': full_key,
        'empty': empty,
        'children': [],
        'content': {}
    }
    if empty == False:
        node['content'].update(proposition)

    existing_node = find_child(parent['children'], sub_key)
    if existing_node == None:
        parent['children'].append(node)
    return node

def create_nodes(propositions=[]):
    root_node = { 'key':'0', 'children': [] }

    for (key, prop) in sorted(propositions.items()):
        splitted_key = key.split('.')

        if len(splitted_key) > 1: 
            sub_key     = splitted_key[len(splitted_key) - 1]
            parent_node = find_node(root=root_node, prop_key=get_parent_key(key))
        else:
            sub_key     = splitted_key[0]
            parent_node = root_node
        
        if parent_node == None:
            import pdb; pdb.set_trace()

        create_node(parent=parent_node, full_key=key, sub_key=sub_key, 
                    proposition=prop)

    # print "Create node {nb} with parent: {parent}".format(parent=parent_node['key'], nb=key)
    return root_node 



################################################################################
# 
#   HTML Processing utility function 
# 
################################################################################
def get_prop_content(prop):
    if prop is None:
        return ""
    elements = prop.contents
    elements_string = u''.join(
        map(
            lambda x: soup.toEncoding(x),
            elements
        )
    )

    return u"<p>{prop}</p>".format(prop=elements_string)

def atomize_key(key):
    key = key.replace('*', '')
    splitted = key.split('.')
    if len(splitted) > 1:
        m = splitted[1]
        numbers = [c for c in m]
        proper_key = "{n}.{m}".format(n=splitted[0], m=".".join(numbers))
    else:
        proper_key = splitted[0]
    return proper_key


def extract_propositions(page):
    propositions = {}
    table = page.table.findNext('table')
    rows = table.findChildren('tr')[1:]
    last_prop_key = None
    for tr in rows:
        pnum_td  = tr.find('td', { 'class': 'pnum' })

        if pnum_td and pnum_td.text == '':
            prop_key = last_prop_key
        elif pnum_td and pnum_td.text != '':
            prop_key = atomize_key(pnum_td.text)

        if prop_key:
            last_prop_key = prop_key
            prop_de  = get_prop_content(tr.find('td', { 'class': 'ger' }))
            prop_en  = get_prop_content(tr.find('td', { 'class': 'pmc' }))
            
            proposition = propositions.get(prop_key, None)

            if proposition != None:
                proposition['de'] += prop_de
                proposition['en'] += prop_en
            else:
                proposition = {
                    'de': prop_de,
                    'en': prop_en
                }
            propositions[ prop_key ] = proposition

    return propositions

soup         = BeautifulSoup(open('html_export/tractatus.html'))
propositions = extract_propositions(soup.body)
root         = create_nodes(propositions)

json_content = json.dumps(root, indent=4, sort_keys=True)
f = open('assets/data/tractatus.json', 'w+')
f.write(json_content)
