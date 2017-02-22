import {throwIfAbsent} from '../PresentUtils';

export type States = { [key: string]: Node; };

export class Node {
    private static nextId: number = 0;

    private _states: States = {};
    private _id: number;
    private _final: boolean = false;

    constructor() {
        this._id = Node.nextId++;
    }

    get id(): number {
        return this._id;
    }

    get states(): States {
        return this._states;
    }

    get final(): boolean {
        return this._final;
    }

    set final(value: boolean) {
        this._final = value;
    }

    nodeOf(character: string) {
        return this._states[character];
    }

    addState(node: Node, character: string) {
        throwIfAbsent(node, 'node');
        throwIfAbsent(character, 'character');

        this._states[character] = node;
    }

    equals(node: Node): boolean {
        if (this.final !== node.final || Object.keys(this.states).length !== Object.keys(node.states).length) {
            return false;
        }

        return this.equalRightLanguage(node);
    }

    equalRightLanguage(node: Node): boolean {
        if (this.shallowSize() !== node.shallowSize()) {
            return false;
        }

        for (let key of Object.keys(this.states)) {
            let subNode = this.nodeOf(key);
            let testNode = node.nodeOf(key);
            let equal = testNode && testNode.equals(subNode);

            if (!equal) {
                return false;
            }
        }

        return true;
    }

    signatureToString(): string {
        let rightLanguage = this.final ? '1' : '0';

        for (let key of Object.keys(this.states).sort()) {
            rightLanguage += `${key}${this.nodeOf(key).id}`;
        }

        return rightLanguage;
    }

    shallowSize(): number {
        return Object.keys(this.states).length;
    }

    size(): number {
        return this.count();
    }

    private count(countedNodes: Set<String> = new Set()) {
        if (!countedNodes.has(this.signatureToString())) {
            countedNodes.add(this.signatureToString());
            let size = 1;

            for (let key of Object.keys(this.states)) {
                size += this.nodeOf(key).count(countedNodes);
            }

            return size;
        }

        return 0;
    }
}
