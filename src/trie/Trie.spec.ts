'use strict';

import 'jest';
import {Trie} from './Trie';

require('babel-core/register');
require('babel-polyfill');

let trie: Trie;

beforeEach(() => trie = new Trie());

describe('Add', () => {
    it('Should be throw if word is null.', () => {
        expect(() => trie.add(null)).toThrow();
    });

    it('Should be throw if word is undefined.', () => {
        expect(() => trie.add(undefined)).toThrow();
    });

    it('Should be able to add a single character as word.', () => {
        trie.add('a');

        expect(trie.root.nodeOf('a')).toBeDefined();
    });

    it('Should be able to add a word.', () => {
        trie.add('david');

        expect(trie.lookup('david')).toBeTruthy();
    });

    it('Should be able to add a word.', () => {
        trie.add('david');

        expect(trie.lookup('david')).toBeTruthy();
    });

    it('Should mark last node as final.', () => {
        let word = 'david';
        trie.add(word);

        let node = trie.root;
        for (let i = 0; i < word.length; i++) {
            node = node.nodeOf(word[i]);
        }

        expect(node.final).toBeTruthy();
    });

    it('Should not mark nodes before last as final.', () => {
        let word = 'david';
        trie.add(word);

        let node = trie.root;
        for (let i = 0; i < word.length - 1; i++) {
            node = node.nodeOf(word[i]);
            expect(node.final).toBeFalsy();
        }
    });

    it('Should continue words with same prefix on same path.', () => {
        let word = 'catnip';
        trie.add('cat');
        trie.add(word);

        let node = trie.root;
        expect(node.shallowSize()).toBe(1);

        for (let index = 0; index < word.length - 1; index++) {
            node = node.nodeOf(word[index]);
            expect(node.shallowSize()).toBe(1);
        }
    });
});
