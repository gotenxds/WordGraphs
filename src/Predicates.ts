import {Node} from './WordGraph/Node';

export type Predicate = (node: Node, char: string, word: string) => boolean;

export function endsWith(suffix): Predicate {
    return (node, char, word) => word.endsWith(suffix);
}

export function containsAny(strings: string[]): Predicate {
    return (node, char, word) => strings.some(expression => RegExp(expression).test(word));
}

export function containsAll(strings: string[]): Predicate {
    return (node, char, word) => strings.every(expression => RegExp(expression).test(word));
}
