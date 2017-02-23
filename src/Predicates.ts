import {Node} from './WordGraph/Node';

export type Predicate = (node: Node, char: string, word: string) => boolean;

export class Predicates {
    static endsWith(suffix) {
        return (node, char, word) => word.endsWith(suffix);
    }

    static containsAny(strings: string[]): (node: Node, char: string, word: string) => boolean {
        return (node: Node, char: string, word: string) => strings.some(expression => RegExp(expression).test(word));
    }

    static containsAll(strings: string[]): (node: Node, char: string, word: string) => boolean {
        return (node, char, word) => strings.every(expression => RegExp(expression).test(word));
    }
}
