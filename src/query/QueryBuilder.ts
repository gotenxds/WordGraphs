import {WordGraph} from '../wordGraph/WordGraph';
import {Query} from './query';
export class QueryBuilder {
    private wordGraph: WordGraph;
    private query: Query;

    constructor(wordGraph: WordGraph) {
        this.wordGraph = wordGraph;
        this.query = new Query();
    };

    startsWith(...patterns: string[]): QueryBuilder {
        return this;
    }

    endsWith(...patterns: string[]): QueryBuilder {
        return this;

    }

    containsAll(...patterns: string[]): QueryBuilder {
        return this;
    }

    containsAny(...patterns: string[]): QueryBuilder {
        return this;

    }

    containsOnly(...patterns: string[]): QueryBuilder {
        return this;
    }

    exclude(...patterns: string[]): QueryBuilder {
        return this;
    }

    maxLength(length: number): QueryBuilder {
        return this;

    }

    minLength(length: number): QueryBuilder {
        return this;

    }

    build(): Query {
        return this.query;
    }
}

