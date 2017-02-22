
#Word Graphs
Word graph is a NodeJs/Browser Typescript friendly library providing fast implementations of the trie and Minimal word graph (AKA DAWG, DAFSA)
while also trying to provide you with an easy to use API for querying data from the graphs.

##Tries and DAWGS:
Tries and DAWGS are final state automatons for solving problem's in many fields such as linguistics and bioinformatics
The main difference between the two is the size of the end result, In a quick test I ran a Trie containing 0.5M words had around the 1.5M states while the equivalent DAWG contained only 20 thousand.
 
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