let fs = require('fs');
let now = require('performance-now');
let lib = require('../../dist/main');

fs.readFile('englishWords', 'utf8', function(err, data) {
    if (err) throw err;

    let test = (name, func, beforeFunc) => {
        beforeFunc ? beforeFunc() : 0;

        let start = now();
        func();

        let inMs = Math.abs((start - now())).toFixed(3);
        console.log(`${name}: toke ${inMs} Ms or ${inMs/1000} Sec`);
    };

    let words = data.split('\r\n').sort();
    let trie;
    let minimalWordGraph;

    let initializeTrie = () => {
        trie = new lib.Trie();

        words.forEach(w => trie.add(w));
    };

    let initializeMinimalWordGraph = () => {
        minimalWordGraph = new lib.MinimalWordGraph();

        words.forEach(w => minimalWordGraph.add(w));
    };

    test('Add 0.5Mil words to trie', initializeTrie);

    test('Add 0.5Mil words to minimalWordGraph', initializeMinimalWordGraph);

    test('Look up long word in trie', () => {
        trie.lookup('unconsentaneousness');
    });

    test('Look up long word in mwg', () => {
        minimalWordGraph.lookup('unconsentaneousness');
    });

    test('Trie Starts with prefix', () => {
        trie.startsWith('pop');
    });

    test('Mwg Starts with prefix', () => {
        trie.startsWith('pop');
    });

    test('Trie Ends with prefix', () => {
        trie.endsWith('pop');
    });

    test('Mwg Ends with prefix', () => {
        trie.endsWith('pop');
    });

    test('QueryBuilder Trie startsWith, endsWith, containsAny', () => {
        new lib.QueryBuilder(trie)
            .startsWith('o')
            .endsWith('zo')
            .containsAny('ya')
            .build()();
    });

    test('QueryBuilder Mwg startsWith, endsWith, containsAny', () => {
        new lib.QueryBuilder(trie)
            .startsWith('o')
            .endsWith('zo')
            .containsAny('ya')
            .build()();
    });
});