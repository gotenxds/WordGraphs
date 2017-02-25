import {Node} from './WordGraph/Node';

export type Predicate = (node: Node, char: string, word: string) => boolean;

export class Predicates {
    static endsWith(...suffixes: string[]) {
        return (node, char, word) => suffixes.some(suffix => word.endsWith(suffix));
    }

    static containsAny(...strings: string[]): (node: Node, char: string, word: string) => boolean {
        return (node: Node, char: string, word: string) => strings.some(expression => RegExp(expression).test(word));
    }

    static containsAll(...strings: string[]): (node: Node, char: string, word: string) => boolean {
        return (node, char, word) => strings.every(expression => RegExp(expression).test(word));
    }

    static containsOnly(...strings: string[]): (node: Node, char: string, word: string) => boolean {
        let expression = RegExp(`^((${strings.join(')|(')}))*$`); // Will return a regexp like so: /^((火)|(日)|(木))*$/

        return (node, char, word) => expression.test(word);
    }

    static exclude(...strings: string[]): (node: Node, char: string, word: string) => boolean {
        return (node, char, word) => !Predicates.containsAny(...strings)(node, char, word);
    }

    static maxLength(length: number): (node: Node, char: string, word: string) => boolean {
        return (node, char, word) => word.length <= length;
    }

    static minLength(length: number): (node: Node, char: string, word: string) => boolean {
        return (node, char, word) => word.length >= length;
    }
}
