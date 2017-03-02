'use strict';

import 'jest';
import {MinimalWordGraph} from '../minimalWordGraph/MinimalWordGraph';
import {editDistance} from './editDistance';

require('babel-core/register');
require('babel-polyfill');

let minimalWordGraph: MinimalWordGraph;

beforeEach(() => {
    minimalWordGraph = new MinimalWordGraph();
    let words = ['cat', 'catnip', 'snip', 'turnip', 'zcatnip'];

    words.forEach(word => minimalWordGraph.add(word));
    minimalWordGraph.makeImmutable();
});

describe('EditDistance', () => {
    it('should return empty list if word has no matches.', () => {
        expect(editDistance(minimalWordGraph.root, 'quaqty').length).toBe(0);
    });

    it('should return empty list if maxDistance is negative.', () => {
        expect(editDistance(minimalWordGraph.root, 'cat', {maxDistance: -1, maxResults: 10}).length).toBe(0);
    });

    it('should return empty list if maxDistance is zero.', () => {
        expect(editDistance(minimalWordGraph.root, 'cat', {maxDistance: 0, maxResults: 10}).length).toBe(1);
    });

    it('should return cat if maxDistance is 1.', () => {
        expect(editDistance(minimalWordGraph.root, 'at', {maxDistance: 1, maxResults: 10})[0]).toBe('cat');
    });

    it('should return snip if maxDistance is 1.', () => {
        expect(editDistance(minimalWordGraph.root, 'nip', {maxDistance: 1, maxResults: 10})[0]).toBe('snip');
    });

    it('should return 4 results if maxDistance is 3.', () => {
        expect(editDistance(minimalWordGraph.root, 'nip', {maxDistance: 3, maxResults: 10}).length).toBe(4);
    });

    it('should return 2 results if maxDistance is 3 but max results is 2.', () => {
        expect(editDistance(minimalWordGraph.root, 'nip', {maxDistance: 3, maxResults: 2}).length).toBe(2);
    });
});
