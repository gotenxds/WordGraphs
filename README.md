
#Word Graphs
Word graph is a NodeJs/Browser Typescript friendly library providing fast implementations of the trie and Minimal word graph (AKA DAWG, DAFSA)
while also trying to provide you with an easy to use API for querying data from the graphs.

#Table of contacts
* [Installation](#Installation)
    * [TS or any es6 modules](#typescript-or-es-6-modules)
    * [Script tag](#script-tag)
* [Usage](#usage)
    * [Trie](#trie)
    * [MinimalWordGraph Aka DAGW](#minimalwordgraph-aka-dagw)
* [Credits](#credits)

##Tries and DAWGS:
Tries and DAWGS are final state automatons for solving problem's in many fields such as linguistics and bioinformatics
The main difference between the two is the size of the end result, In a quick test I ran a Trie containing 0.5M words had around the 1.5M states while the equivalent DAWG contained only 20 thousand.

##Installation
WordGraphs can be downloaded via NodeJs

`npm i word-graphs --save-dev`

WordGraphs uses a UMD module so you can use it in NodeJs or in the browser.
##### Typescript or es 6 modules
```javascript
import {Trie} from 'word-graphs';

let trie = new Trie();

trie.add('Simple');
trie.add('Example');

console.log(trie.containsAny(['mp'])); // Will print ['Simple', 'Example']
```

##### Script tag
```javascript
import {Trie} from 'word-graphs';

let trie = new Trie();

trie.add('Simple');
trie.add('Example');

console.log(trie.containsAny(['mp'])); // Will print ['Simple', 'Example']
```
##Usage

###Trie
Trie can accept words in any order:
```javascript
    // Creating a new Trie.
    let trie = new Trie();
    
    // Add some words
    trie.add('Cat');
    trie.add('Bat');
    trie.add('Tool');
    trie.add('David');
    
    // Lookup word
    trie.lookup('Cat') // true
    trie.lookup('Human') // false
    trie.lookup('cat') // false, graphs are case insensitive (autoConvert Option will be added in future).
```

###MinimalWordGraph Aka DAGW
MinimalWordGraph or DAGW needs words to be inserted in ascending alphabetical order:
```javascript
    // Creating a new MinimalWordGraph.
    let mwg = new MinimalWordGraph();
    
    // Add some words
    mwg.add('Cat');
    mwg.add('Bat'); // Will error!
    
    mwg = new MinimalWordGraph();
    mwg.add('Cat');
    mwg.add('Catnip');
    mwg.add('Turnip');
    
    // Lookup word
    mwg.lookup('Cat') // true
    mwg.lookup('Human') // false
    mwg.lookup('cat') // false, graphs are case insensitive (Option will be added in future).
```

#Credits
All **construction** algorithms used in this library are from the book [Optimization of Automata](http://pbc.gda.pl/dlibra/docmetadata?id=44644&from=&dirids=1&ver_id=&lp=1&QI=) by [Jan Daciuk](http://www.jandaciuk.pl/) 
