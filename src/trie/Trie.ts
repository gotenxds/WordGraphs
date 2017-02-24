import {WordGraph} from '../wordGraph/WordGraph';
import {Node} from '../wordGraph/Node';

export class Trie extends WordGraph {
    add(word: string) {
        super.add(word);

        let node = this._root;

        for (let i = 0; i < word.length; i++) {
            let tempNode = node.nodeOf(word[i]);

            if (tempNode) {
                node = tempNode;
            } else {
                let nextNode = new Node();
                node.addState(nextNode, word[i]);
                node = nextNode;
            }
        }

        node.final = true;
    }

    minimize() {
        this.minimizeFrom(this.root);
    }

    private minimizeFrom(node: Node, registry: Node[] = []): Node {
        for (let char of Object.keys(node.states)) {
            node.addState(this.minimizeFrom(node.nodeOf(char), registry), char);
        }

        let rightLanguage = node.signatureToString();
        let registeredNode = registry[rightLanguage];

        if (!registeredNode) {
            registry[rightLanguage] = node;
            registeredNode = node;
        }

        return registeredNode;
    }
}
