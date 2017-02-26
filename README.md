
#Word Graphs
Word graph is a NodeJs/Browser Typescript friendly library providing fast implementations of the trie and Minimal word graph (AKA DAWG, DAFSA)
while also trying to provide you with an easy to use API for querying data from the graphs.

#Table of contacts
* [Installation](#Installation)
    * [TS or any es6 modules](#typescript-or-es-6-modules)
    * [Script tag](#script-tag)
* [Preformance](#preformance)
    * [On my pc](#on-my-pc)
    * [Running the tests](#running-the-tests)
* [Usage](#usage)
    * [Trie](#trie)
    * [MinimalWordGraph Aka DAGW](#minimalwordgraph-aka-dagw)
      * [Making the DAGW immutable](#making-the-dagw-immutable)
* [Searching](#searching)
    * [Using built in methods of wordGraph](#using-built-in-methods-of-wordGraph)
    * [Using QueryBuilder](#using-querybuilder)
* [Credits](#credits)

## Tries and DAWGS:
Tries and DAWGS are final state automatons for solving problem's in many fields such as linguistics and bioinformatics
The main difference between the two is the size of the end result, In a quick test I ran a Trie containing 0.5M words had around the 1.5M states while the equivalent DAWG contained only 20 thousand.

## Installation
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

## Preformance
### On my pc
Some simple performance tests for the librery, ran on 0.5Mil words. 
My PC (i5-6600, 16GB ram windows 10 64bit).
```
    Add 0.5Mil words to trie: toke 1160.777 Ms or 1.160777 Sec
    Add 0.5Mil words to minimalWordGraph: toke 3162.078 Ms or 3.162078 Sec
```
As can be seen a trie constructs much faster then a DAWG.
```    
    Trie size: 1060026
    Compute trie size: toke 3015.024 Ms or 3.015024 Sec
    Mwg size: 222231
    Compute mwg size: toke 1476.980 Ms or 1.47698 Sec
```
But a DAWG is much smaller then a trie.
```    
    Look up long word in trie: toke 0.637 Ms or 0.000637 Sec
    Look up long word in mwg: toke 0.093 Ms or 0.000093 Sec
    Trie Starts with: toke 1.387 Ms or 0.001387 Sec
    Mwg Starts with: toke 1.010 Ms or 0.00101 Sec
    Trie Ends with: toke 1785.083 Ms or 1.785083 Sec
    Mwg Ends with: toke 1752.311 Ms or 1.752311 Sec
    QueryBuilder Trie startsWith, endsWith, containsAny: toke 55.003 Ms or 0.055003 Sec
    QueryBuilder Mwg startsWith, endsWith, containsAny: toke 51.406 Ms or 0.051406 Sec
```
As you can see a DAWG may be a bit faster then a trie.
```    
    Minimize trie, affectivly transforming it to a dawg.: toke 2428.354 Ms or 2.4283539999999997 Sec
```
 This is not linear and will take MUCH more time as the size grows.
### Running the tests
To run the tests simply:

1. Clone or fork this repository.
2. Run `npm i` in the root folder.
3. `cd ./src/PerformanceTests`
4. `node node performanceTests.js`

Good luck :)
## Usage

### Trie
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

### MinimalWordGraph Aka DAGW
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
####Making the DAGW immutable
It is highly recommanded that after you have finished building the dawg you call 
```javascript
   mwg.makeImmutable();
```
This will:
* Make the dawg immutable - calling the `add()` method will result in an exception.
* Free up unneeded resources.
* Allow the size of the dawg to be callculated once and saved thus making calls to `size()` O(1).

# Searching
WordGraphs tries you give you a powerfull yet quick search api, you can either use the built in search methods or the more advanced queryBuilder for complex queries.

### Using built in methods of wordGraph
```javascript
    let mwg = new MinimalWordGraph();

    mwg = new MinimalWordGraph();
    mwg.add('Cat');
    mwg.add('Catnip');
    mwg.add('taC');
    mwg.add('Turnip');
    
    mwg.startsWith('Cat'); // ['Cat', 'Catnip']
    mwg.endsWith('nip'); // ['Catnip', 'Turnip']
    mwg.containsAll('C', 'nip'); // ['Catnip']
    mwg.containsOnly('t', 'a', 'C'); // ['Cat', 'taC']
    
```

### Using QueryBuilder
```javascript
    let mwg = new MinimalWordGraph();

    mwg = new MinimalWordGraph();
    mwg.add('Cat');
    mwg.add('Catnip');
    mwg.add('taC');
    mwg.add('Turnip');
    
    let queryBuilder = new QueryBuilder(minimalWordGraph);
    queryBuilder
        .startsWith('C')
        .maxLength(3)
        .build()(); // ['Cat']
        
    queryBuilder
        .minLength(4)
        .endsWith('ip')
        .containsAny('t')
        .build()(); // ['Catnip', 'Turnip']
    
```

# Credits
* All **construction** algorithms used in this library are from the book [Optimization of Automata](http://pbc.gda.pl/dlibra/docmetadata?id=44644&from=&dirids=1&ver_id=&lp=1&QI=) by [Jan Daciuk](http://www.jandaciuk.pl/)
* I use [english-words](https://github.com/dwyl/english-words) - a github repo with just around .5MIL words for my performance tests.
