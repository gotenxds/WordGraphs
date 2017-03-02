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

    title('Creating word graphs.');

    test('Add 0.5Mil words to trie', initializeTrie);
    test('Add 0.5Mil words to minimalWordGraph', initializeMinimalWordGraph);

    title('Computing size.');

    test('Compute trie size', () => {
        console.log('Trie size: ' + trie.size());
    });

    test('Compute mwg size', () => {
        console.log('Mwg size: ' + minimalWordGraph.size());
    });

    title('Look up.');

    test('Look up long word in trie', () => {
        trie.lookup('unconsentaneousness');
    });

    test('Look up long word in mwg', () => {
        minimalWordGraph.lookup('unconsentaneousness');
    });

    title('Starts With.');

    test('Trie Starts with', () => {
        trie.startsWith('pop');
    });

    test('Mwg Starts with', () => {
        trie.startsWith('pop');
    });

    title('Ends With.');

    test('Trie Ends with', () => {
        trie.endsWith('pop');
    });

    test('Mwg Ends with', () => {
        trie.endsWith('pop');
    });

    title('Query builder.');

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

    title('Minimize.');

    test('Minimize trie, affectivly transforming it to a dawg.', () => {
        trie.minimize();
    });

    title('Edit distance.');

    test('Edit distance Trie.', () => {
        lib.editDistance(trie.root, 'festivally', 2);
    });

    test('Edit distance MWG.', () => {
        lib.editDistance(minimalWordGraph.root, 'festivally', 2);
    });

    test('Edit distance Trie, Max results set to 3, searching words similar to "pop".', () => {
        trie.similarTo('pop', {maxDistance:2, maxResults : 3});
    });

    test('Edit distance MWG. Max results set to 3, searching words similar to "pop".', () => {
        minimalWordGraph.similarTo('pop', {maxDistance:2, maxResults : 3});
    });
});

function title(title) {
    console.log(`\n-- ${title} --`);
}