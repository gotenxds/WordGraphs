import {Node} from './Node';
import {Predicates} from '../Predicates';
import {throwIfAbsent} from '../PresentUtils';
import {editDistance} from '../editDistance/editDistance';

export abstract class WordGraph {
    protected _root: Node = new Node();

    get root(): Node {
        return this._root;
    }

    add(word: string) {
        throwIfAbsent(word, 'word');
    }

    lookup(word: string): boolean {
        let node = this.climbTo(word);

        return node ? node.final : false;
    }

    startsWith(prefix: string, ...predicates: ((node: Node, char: string, word: string) => boolean)[]): string[] {
        let node = this.climbTo(prefix);

        if (!node) {
            return [];
        }

        let words = [];

        if (this.wordShouldBeAdded(node, predicates, prefix[prefix.length - 1], prefix)) {
            words.push(prefix);
        }

        return words.concat(this.getWord(node, prefix, false, ...predicates));
    }

    endsWith(suffix: string): string[] {
        return this.getWord(this.root, '', false, Predicates.endsWith(suffix));
    }

    containsAny(strings: string[]): string[] {
        return this.getWord(this.root, '', false, Predicates.containsAny(...strings));
    }

    containsAll(strings: string[]): string[] {
        return this.getWord(this.root, '', false, Predicates.containsAll(...strings));
    }

    containsOnly(strings: string[]): string[] {
        let words = [];
        let regexp = RegExp(`^(${strings.join('|')})*$`); // Will produce a regexp like : ^(david|was|here)*$

        for (let subString of strings) {
            let node = this.climbTo(subString);

            if (node) {
                words = words.concat(this.getWord(node, subString, true, (node, char, word) => regexp.test(word)));
            }
        }

        return words;
    }

    getWord(node: Node, prefix: string = '', exitIfPredicateFail = false,
            ...predicates: ((node: Node, char: string, word: string) => boolean)[]): string[] {
        let words = [];

        Object.keys(node.states).forEach(char => {
            let subNode = node.states[char];
            let wordSoFar = prefix + char;

            if (this.wordShouldBeAdded(subNode, predicates, char, wordSoFar)) {
                words.push(wordSoFar);
                words = words.concat(this.getWord(subNode, wordSoFar, exitIfPredicateFail, ...predicates));
            } else if (!subNode.final || (subNode.final && !exitIfPredicateFail)) {
                words = words.concat(this.getWord(subNode, wordSoFar, exitIfPredicateFail, ...predicates));
            }
        });

        return words;
    }

    similarTo(word: string, options: {maxDistance: number, maxResults: number} = {maxDistance: 3, maxResults: Number.MAX_VALUE}) {
        return editDistance(this.root, word, options);
    }

    size(): number {
        return this.root.size();
    }

    protected climbTo(prefix: string): Node {
        let node = this.root;

        for (let char of prefix) {
            node = node.nodeOf(char);
            if (!node) {
                return null;
            }
        }

        return node;
    }

    private wordShouldBeAdded(subNode: Node, predicates: ((node: Node, char: string, word: string) => boolean)[], char, word: string) {
        return subNode.final && predicates.every(predicate => predicate(subNode, char, word));
    }
}
