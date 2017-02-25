'use strict';

import 'jest';
import {QueryBuilder} from './QueryBuilder';
import {MinimalWordGraph} from '../minimalWordGraph/MinimalWordGraph';

require('babel-core/register');
require('babel-polyfill');

let queryBuilder: QueryBuilder;
let minimalWordGraph: MinimalWordGraph;

beforeEach(() => {
    minimalWordGraph = new MinimalWordGraph();
    let words = ['cat', 'catnip', 'snip', 'turnip', 'zcatnip'];

    words.forEach(word => minimalWordGraph.add(word));
    minimalWordGraph.makeImmutable();

    queryBuilder = new QueryBuilder(minimalWordGraph);
});

describe('Starts with', () => {
    it('should return all results for empty string.', () => {
        expect(queryBuilder.startsWith('').build()().length).toBe(5);
    });

    it('should return 0 results for non existing prefix.', () => {
        expect(queryBuilder.startsWith('x').build()().length).toBe(0);
    });

    it('should return 0 results for half existing prefix.', () => {
        expect(queryBuilder.startsWith('catw').build()().length).toBe(0);
    });

    it('should return 1 results for existing prefix with 1 match.', () => {
        expect(queryBuilder.startsWith('catnip').build()().length).toBe(1);
    });

    it('should return 2 results for existing prefix with 2 match.', () => {
        expect(queryBuilder.startsWith('cat').build()().length).toBe(2);
    });

    it('should return 2 results for existing prefix with 2 match.', () => {
        expect(queryBuilder.startsWith('c').build()().length).toBe(2);
    });

    it('should return 3 results for existing prefixes.', () => {
        expect(queryBuilder.startsWith('ca', 't').build()().length).toBe(3);
    });
});

describe('Ends with', () => {
    it('should return all results for empty string.', () => {
        expect(queryBuilder.endsWith('').build()().length).toBe(5);
    });

    it('should return 0 results for non existing suffix.', () => {
        expect(queryBuilder.endsWith('x').build()().length).toBe(0);
    });

    it('should return 0 results for half existing suffix.', () => {
        expect(queryBuilder.endsWith('knip').build()().length).toBe(0);
    });

    it('should return 1 results for existing suffix with 1 match.', () => {
        expect(queryBuilder.endsWith('rnip').build()().length).toBe(1);
    });

    it('should return 2 results for existing suffix with 2 match.', () => {
        expect(queryBuilder.endsWith('tnip').build()().length).toBe(2);
    });

    it('should return 4 results for existing suffix with 2 match.', () => {
        expect(queryBuilder.endsWith('p').build()().length).toBe(4);
    });

    it('should return 3 results for existing suffixes.', () => {
        expect(queryBuilder.endsWith('at', 'tnip').build()().length).toBe(3);
    });
});

describe('contains all', () => {
    it('should return all results for empty string.', () => {
        expect(queryBuilder.containsAll('').build()().length).toBe(5);
    });

    it('should return 0 results for no match, single pattern.', () => {
        expect(queryBuilder.containsAll('pop').build()().length).toBe(0);
    });

    it('should return 0 results for no match, multiple patterns.', () => {
        expect(queryBuilder.containsAll('pop', 'shop').build()().length).toBe(0);
    });

    it('should return 0 results for 1 match out of 2 patterns.', () => {
        expect(queryBuilder.containsAll('tnip', 'shop').build()().length).toBe(0);
    });

    it('should return 1 results for 1 match, single pattern', () => {
        expect(queryBuilder.containsAll('sn').build()().length).toBe(1);
    });

    it('should return 1 results for 2 match, multiple patterns', () => {
        expect(queryBuilder.containsAll('sn', 'ip').build()().length).toBe(1);
    });

    it('should return 3 results for 1 matches, single pattern', () => {
        expect(queryBuilder.containsAll('at').build()().length).toBe(3);
    });

    it('should return 3 results for 1 matches, multiple patterns', () => {
        expect(queryBuilder.containsAll('t', 'nip').build()().length).toBe(3);
    });
});

describe('contains any', () => {
    it('should return all results for empty string.', () => {
        expect(queryBuilder.containsAny('').build()().length).toBe(5);
    });

    it('should return 0 results for no match, single pattern.', () => {
        expect(queryBuilder.containsAny('pop').build()().length).toBe(0);
    });

    it('should return 0 results for no match, multiple patterns.', () => {
        expect(queryBuilder.containsAny('pop', 'shop').build()().length).toBe(0);
    });

    it('should return 2 results for 2 matches.', () => {
        expect(queryBuilder.containsAny('tnip', 'shop').build()().length).toBe(2);
    });

    it('should return 1 results for 1 match, single pattern', () => {
        expect(queryBuilder.containsAny('sn').build()().length).toBe(1);
    });

    it('should return 4 results for 2 matches, multiple patterns', () => {
        expect(queryBuilder.containsAny('sn', 'ip').build()().length).toBe(4);
    });

    it('should return 3 results for 1 matches, single pattern', () => {
        expect(queryBuilder.containsAny('at').build()().length).toBe(3);
    });

    it('should return 5 results for 2 matches, multiple patterns', () => {
        expect(queryBuilder.containsAny('t', 'nip').build()().length).toBe(5);
    });
});

describe('contains only', () => {
    it('should return zero results for empty string.', () => {
        expect(queryBuilder.containsOnly('').build()().length).toBe(0);
    });

    it('should return 0 results for no match, single pattern.', () => {
        expect(queryBuilder.containsOnly('pop').build()().length).toBe(0);
    });

    it('should return 0 results for no match, multiple patterns.', () => {
        expect(queryBuilder.containsOnly('pop', 'shop').build()().length).toBe(0);
    });

    it('should return 0 results for 0 matches.', () => {
        expect(queryBuilder.containsOnly('tnip', 'shop').build()().length).toBe(0);
    });

    it('should return 0 results for 0 match, single pattern', () => {
        expect(queryBuilder.containsOnly('sn').build()().length).toBe(0);
    });

    it('should return 1 results for 2 matches, multiple patterns', () => {
        expect(queryBuilder.containsOnly('sn', 'ip').build()().length).toBe(1);
    });

    it('should return 1 results for 1 matches, single pattern', () => {
        expect(queryBuilder.containsOnly('cat').build()().length).toBe(1);
    });

    it('should return 2 results for 3 matches, multiple patterns', () => {
        minimalWordGraph = new MinimalWordGraph();
        minimalWordGraph.add('cat');
        minimalWordGraph.add('tac');
        queryBuilder = new QueryBuilder(minimalWordGraph);

        expect(queryBuilder.containsOnly('t', 'c', 'a').build()().length).toBe(2);
    });
});

describe('exclude', () => {
    it('should return zero results for empty string.', () => {
        expect(queryBuilder.exclude('').build()().length).toBe(0);
    });

    it('should return all results for no match, single pattern.', () => {
        expect(queryBuilder.exclude('pop').build()().length).toBe(5);
    });

    it('should return 5 results for no match, multiple patterns.', () => {
        expect(queryBuilder.exclude('pop', 'shop').build()().length).toBe(5);
    });

    it('should return 3 results for 1 matches.', () => {
        expect(queryBuilder.exclude('tnip', 'shop').build()().length).toBe(3);
    });

    it('should return 4 results for 1 match, single pattern', () => {
        expect(queryBuilder.exclude('sn').build()().length).toBe(4);
    });

    it('should return 1 results for 4 matches, multiple patterns', () => {
        expect(queryBuilder.exclude('sn', 'ip').build()().length).toBe(1);
    });

    it('should return 2 results for 3 matches, single pattern', () => {
        expect(queryBuilder.exclude('cat').build()().length).toBe(2);
    });
});

describe('min length', () => {
    it('should return all results for 0 length.', () => {
        expect(queryBuilder.minLength(0).build()().length).toBe(5);
    });

    it('should return zero results for max length.', () => {
        expect(queryBuilder.minLength(Number.MAX_SAFE_INTEGER).build()().length).toBe(0);
    });

    it('should return all results for negative length.', () => {
        expect(queryBuilder.minLength(-8).build()().length).toBe(5);
    });

    it('should return 1 results for length 7.', () => {
        expect(queryBuilder.minLength(7).build()().length).toBe(1);
    });

    it('should return 3 results for length 6.', () => {
        expect(queryBuilder.minLength(6).build()().length).toBe(3);
    });

    it('should return all results for length 3.', () => {
        expect(queryBuilder.minLength(3).build()().length).toBe(5);
    });
});

describe('max length', () => {
    it('should return 0 results for 0 length.', () => {
        expect(queryBuilder.maxLength(0).build()().length).toBe(0);
    });

    it('should return 0 results for negative length.', () => {
        expect(queryBuilder.maxLength(-8).build()().length).toBe(0);
    });

    it('should return all results for max length.', () => {
        expect(queryBuilder.maxLength(Number.MAX_SAFE_INTEGER).build()().length).toBe(5);
    });

    it('should return all results for length 7.', () => {
        expect(queryBuilder.maxLength(7).build()().length).toBe(5);
    });

    it('should return 4 results for length 6.', () => {
        expect(queryBuilder.maxLength(6).build()().length).toBe(4);
    });

    it('should return 1 results for length 3.', () => {
        expect(queryBuilder.maxLength(3).build()().length).toBe(1);
    });

    it('should return 0 results for length 2.', () => {
        expect(queryBuilder.maxLength(2).build()().length).toBe(0);
    });
});

describe('addPredicate', () => {

    let firstCharBiggerThenLast = (node, char, word) => word[0] >= word[word.length - 1];

    it('should return 3 results.', () => {
        expect(queryBuilder.addPredicate(firstCharBiggerThenLast).build()().length).toBe(3);
    });
});


