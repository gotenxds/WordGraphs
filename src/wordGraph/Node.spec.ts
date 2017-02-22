'use strict';

import 'jest';
import {Node} from './Node';
import {Trie} from '../trie/Trie';

//noinspection TsLint
require('babel-core/register');
//noinspection TsLint
require('babel-polyfill');

let node: Node;

beforeEach(() => {
    node = new Node();
});

describe('nodeOf', () => {
    it('should return undefined if there is no node connected to given char.', () => {
        expect(node.nodeOf('a')).toBeUndefined();
    });

    it('should return the node connected to char.', () => {
        let aNode = new Node();

        node.addState(aNode, 'a');

        expect(node.nodeOf('a')).toBe(aNode);
    });
});

describe('addState', () => {
    it('should throw if char is null.', () => {
        let aNode = new Node();

        expect(() => node.addState(aNode, null)).toThrow();
    });

    it('should throw if char is undefined.', () => {
        let aNode = new Node();

        expect(() => node.addState(aNode, undefined)).toThrow();
    });

    it('should throw if node is null.', () => {
        expect(() => node.addState(null, 'a')).toThrow();
    });

    it('should throw if node is undefined.', () => {
        expect(() => node.addState(undefined, 'a')).toThrow();
    });

    it('should set node to char.', () => {
        let aNode = new Node();

        node.addState(aNode, 'a');

        expect(node.nodeOf('a')).toBe(aNode);
    });
});

describe('shallowSize', () => {
    it('should return zero on creation.', () => {
        expect(node.shallowSize()).toBe(0);
    });

    it('should return one after one addition.', () => {
        node.addState(new Node(), 'a');

        expect(node.shallowSize()).toBe(1);
    });

    it('should return two after two addition.', () => {
        node.addState(new Node(), 'a');
        node.addState(new Node(), 'b');

        expect(node.shallowSize()).toBe(2);
    });

    it('should return N, N being a random number.', () => {
        let N = Math.round(Math.random() * 20);
        let char = 97; // Ascii value of a.

        for (let i = 0; i < N; i++) {
            node.addState(new Node(), String.fromCharCode(char++));
        }

        expect(node.shallowSize()).toBe(N);
    });

    it('should return 1 if two additions to the same char.', () => {
        node.addState(new Node(), 'a');
        node.addState(new Node(), 'a');

        expect(node.shallowSize()).toBe(1);
    });
});

describe('equalRightLanguage', () => {
    it('Should return false if different sizes.', () => {
        node.addState(new Node(), 'a');

        expect(node.equalRightLanguage(new Node())).toBeFalsy();
    });

    it('Should return true for empty nodes.', () => {
        expect(node.equalRightLanguage(new Node())).toBeTruthy();
    });

    it('Should return true for nodes with same child.', () => {
        let aNode = new Node();
        let bNode = new Node();

        node.addState(bNode, 'b');
        aNode.addState(bNode, 'b');

        expect(node.equalRightLanguage(aNode)).toBeTruthy();
    });

    it('Should return true for nodes with same child char but different nodes with size 0.', () => {
        let aNode = new Node();

        node.addState(new Node(), 'b');
        aNode.addState(new Node(), 'b');

        expect(node.equalRightLanguage(aNode)).toBeTruthy();
    });

    it('Should return false for nodes with different child but same size.', () => {
        let aNode = new Node();

        node.addState(new Node(), 'b');
        aNode.addState(new Node(), 'a');

        expect(node.equalRightLanguage(aNode)).toBeFalsy();
    });

    it('Should return true for a trie of at list height 2 with same rLanguage.', () => {
        let trie = new Trie();
        trie.add('catnip');
        trie.add('turnip');

        let tOfCatnip = trie.root.nodeOf('c').nodeOf('a').nodeOf('t');
        let rOfTurnip = trie.root.nodeOf('t').nodeOf('u').nodeOf('r');

        expect(tOfCatnip.equalRightLanguage(rOfTurnip)).toBeTruthy();
    });

    it('Should be symmetric.', () => {
        let trie = new Trie();
        trie.add('catnip');
        trie.add('turnip');

        let tOfCatnip = trie.root.nodeOf('c').nodeOf('a').nodeOf('t');
        let rOfTurnip = trie.root.nodeOf('t').nodeOf('u').nodeOf('r');

        expect(rOfTurnip.equalRightLanguage(tOfCatnip)).toBeTruthy();
    });
});

describe('equals', () => {
    let tOfCatnip;
    let rOfTurnip;

    beforeEach(() => {
        let trie = new Trie();
        trie.add('catnip');
        trie.add('turnip');

        tOfCatnip = trie.root.nodeOf('c').nodeOf('a').nodeOf('t');
        rOfTurnip = trie.root.nodeOf('t').nodeOf('u').nodeOf('r');
    });

    it('should return false if one is final and one is not.', () => {
        let finalNode = new Node();
        finalNode.final = true;

        expect(node.equals(finalNode)).toBeFalsy();
    });

    it('should return false if one is final and one is not but they both have same rLanguage.', () => {
        tOfCatnip.final = true;

        expect(tOfCatnip.equals(rOfTurnip)).toBeFalsy();
    });

    it('should return true if none are final and same rLanguage.', () => {
        expect(tOfCatnip.equals(rOfTurnip)).toBeTruthy();
    });

    it('should return true if both are final and same rLanguage.', () => {
        tOfCatnip.final = true;
        rOfTurnip.final = true;

        expect(tOfCatnip.equals(rOfTurnip)).toBeTruthy();
    });
});
