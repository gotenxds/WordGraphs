import {WordGraph} from '../wordGraph/WordGraph';
import {Node} from '../wordGraph/Node';

export class MinimalWordGraph extends WordGraph {
    private lastWordAdded: string = '';
    private registry: {[key: string]: Node} = {};
    private immutableSize: number;

    add(word: string) {
        if (this.isImmutable()) {
            throw 'This MinimalWordGraph(DAWG) is immutable and words may no longer be added to it.';
        }
        if (word < this.lastWordAdded) {
            throw 'Words need to be added in lexicographical order.';
        }

        let {node: node, index: index} = this.climbUntilEmpty(word);

        if (index < this.lastWordAdded.length && this.lastWordAdded !== '') {
            let minimizedNode = this.minimize(node.nodeOf(this.lastWordAdded[index]), this.lastWordAdded.substr(index + 1));

            node.addState(minimizedNode, this.lastWordAdded[index]);
        }

        for (index; index < word.length; index++) {
            let newNode = new Node();
            node.addState(newNode, word[index]);
            node = newNode;
        }

        node.final = true;

        this.lastWordAdded = word;
    }

    minimize(node: Node, word: string) {
        if (word !== '') {
            let minimizedChild = this.minimize(node.nodeOf(word[0]), word.substr(1));

            node.addState(minimizedChild, word[0]);
        }

        let rightLanguage = node.signatureToString();
        let registeredNode = this.registry[rightLanguage];

        if (!registeredNode) {
            this.registry[rightLanguage] = node;
            registeredNode = node;
        }

        return registeredNode;
    }

    size(): number {
        return this.isImmutable() ? this.immutableSize : super.size();
    }

    makeImmutable(): void {
        this.minimize(this.root, this.lastWordAdded);

        this.lastWordAdded = null;
        this.registry = null;

        this.immutableSize = super.size();
    }

    isImmutable(): boolean {
        return this.registry === null;
    }

    private climbUntilEmpty(word: string): {node: Node, index: number} {
        let node = this._root;
        let index = 0;

        for (index; index < word.length; index++) {
            let nextNode = node.nodeOf(word[index]);

            if (nextNode) {
                node = nextNode;
            } else {
                break;
            }
        }

        return {node: node, index: index};
    }
}
