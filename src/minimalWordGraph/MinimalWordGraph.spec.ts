'use strict';

import 'jest';
import {MinimalWordGraph} from './MinimalWordGraph';

require('babel-core/register');
require('babel-polyfill');

let minimalWordGraph: MinimalWordGraph;

beforeEach(() => minimalWordGraph = new MinimalWordGraph());

describe('Add', () => {
    it('Should be throw if word is null.', () => {
        expect(() => minimalWordGraph.add(null)).toThrow(`Error: word was not given.`);
    });

    it('Should be throw if word is undefined.', () => {
        expect(() => minimalWordGraph.add(undefined)).toThrow();
    });

    it('Should be throw if words are ot added in lexicographical order.', () => {
        let wordA = 'Banana';
        let wordB = 'Apple';

        minimalWordGraph.add(wordA);

        expect(() => minimalWordGraph.add(wordB)).toThrow(`Words need to be added in lexicographical order. ${wordB} after ${wordA}`);
    });

    it('Should be able to add a single character as word.', () => {
        minimalWordGraph.add('a');

        expect(minimalWordGraph.root.nodeOf('a')).toBeDefined();
    });

    it('Should be able to add a word.', () => {
        minimalWordGraph.add('david');

        expect(minimalWordGraph.lookup('david')).toBeTruthy();
    });

    it('Should be able to add a word.', () => {
        minimalWordGraph.add('david');

        expect(minimalWordGraph.lookup('david')).toBeTruthy();
    });

    it('Should mark last node as final.', () => {
        let word = 'david';
        minimalWordGraph.add(word);

        let node = minimalWordGraph.root;
        for (let i = 0; i < word.length; i++) {
            node = node.nodeOf(word[i]);
        }

        expect(node.final).toBeTruthy();
    });

    it('Should not mark nodes before last as final.', () => {
        let word = 'david';
        minimalWordGraph.add(word);

        let node = minimalWordGraph.root;
        for (let i = 0; i < word.length - 1; i++) {
            node = node.nodeOf(word[i]);
            expect(node.final).toBeFalsy();
        }
    });

    it('Should continue words with same prefix on same path.', () => {
        let word = 'catnip';
        minimalWordGraph.add('cat');
        minimalWordGraph.add(word);

        let node = minimalWordGraph.root;
        expect(node.shallowSize()).toBe(1);

        for (let index = 0; index < word.length - 1; index++) {
            node = node.nodeOf(word[index]);
            expect(node.shallowSize()).toBe(1);
        }
    });
});

describe('Minimality', () => {
    it('Should have size equal to length of single word. + 1 (root)', () => {
        let word = 'catnip';
        minimalWordGraph.add(word);

        expect(minimalWordGraph.size()).toBe(word.length + 1);
    });

    it('Should have size equal to length of two words with different prefixes.', () => {
        let word = 'catnip';
        let word2 = 'path';

        minimalWordGraph.add(word);
        minimalWordGraph.add(word2);

        expect(minimalWordGraph.size()).toBe(word.length + word2.length);
    });

    it('Should have size equal to length of two words - length of matching prefix.', () => {
        let word = 'cat';
        let word2 = 'catnip';

        minimalWordGraph.add(word);
        minimalWordGraph.add(word2);

        expect(minimalWordGraph.size()).toBe(word.length + word2.length - 3 + 1);
    });

    it('Should have size equal pre-checked size of word back (.5M words).', () => {
        let word = 'cat';
        let word2 = 'catnip';

        minimalWordGraph.add(word);
        minimalWordGraph.add(word2);

        expect(minimalWordGraph.size()).toBe(word.length + word2.length - 3 + 1);
    });

    it('Complex', () => {
        let words = ['cat', 'catnip', 'snip', 'turnip', 'zcatnip'];

        words.forEach(word => minimalWordGraph.add(word));
        minimalWordGraph.makeImmutable();

        expect(minimalWordGraph.size()).toBe(words.join().length - 17);
    });
});
