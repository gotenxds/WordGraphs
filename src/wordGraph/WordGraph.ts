import {Node} from './Node';
import {Predicates} from '../Predicates';

export abstract class WordGraph {
    protected _root: Node = new Node();

    get root(): Node {
        return this._root;
    }

    lookup(word: string): boolean {
        let node = this.climbTo(word);

        return node ? node.final : false;
    }

    startsWith(prefix: string, ...predicates: ((node: Node, char: string, word: string) => boolean)[]): string[] {
        let node = this.climbTo(prefix);

        return node ? this.getWord(node, prefix, false, ...predicates) : [];
    }

    endsWith(suffix: string): string[] {
        return this.getWord(this.root, '', false, Predicates.endsWith(suffix));
    }

    containsAny(strings: string[]): string[] {
        return this.getWord(this.root, '', false, Predicates.containsAny(strings));
    }

    containsAll(strings: string[]): string[] {
        return this.getWord(this.root, '', false, Predicates.containsAll(strings));
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

            if (subNode.final && predicates.every(predicate => predicate(subNode, char, wordSoFar))) {
                words.push(wordSoFar);
                words = words.concat(this.getWord(subNode, wordSoFar, exitIfPredicateFail, ...predicates));
            } else if (!subNode.final || (subNode.final && !exitIfPredicateFail)) {
                words = words.concat(this.getWord(subNode, wordSoFar, exitIfPredicateFail, ...predicates));
            }
        });

        return words;
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
}
