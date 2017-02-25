import {WordGraph} from '../wordGraph/WordGraph';
import {Predicates} from '../Predicates';

export class QueryBuilder {
    private wordGraph: WordGraph;
    private startsWithPatterns: string[] = [];
    private endsWithPatterns: string[] = [];
    private containsAllPatterns: string[] = [];
    private containsAnyPatterns: string[] = [];
    private containsOnlyPatterns: string[] = [];
    private excludePatterns: string[] = [];
    private predicates: any = {userPredicates: []};

    constructor(wordGraph: WordGraph) {
        this.wordGraph = wordGraph;
    };

    startsWith(...patterns: string[]): QueryBuilder {
        this.startsWithPatterns = this.startsWithPatterns.concat(patterns);

        return this;
    }

    endsWith(...patterns: string[]): QueryBuilder {
        this.endsWithPatterns = this.endsWithPatterns.concat(patterns);
        this.predicates.endsWithPatterns = Predicates.endsWith(...patterns);

        return this;
    }

    containsAll(...patterns: string[]): QueryBuilder {
        this.containsAllPatterns = this.containsAllPatterns.concat(patterns);
        this.predicates.containsAll = Predicates.containsAll(...patterns);

        return this;
    }

    containsAny(...patterns: string[]): QueryBuilder {
        this.containsAnyPatterns = this.containsAnyPatterns.concat(patterns);
        this.predicates.containsAny = Predicates.containsAny(...patterns);

        return this;
    }

    containsOnly(...patterns: string[]): QueryBuilder {
        this.containsOnlyPatterns = this.containsOnlyPatterns.concat(patterns);
        this.predicates.containsOnly = Predicates.containsOnly(...patterns);

        return this;
    }

    exclude(...patterns: string[]): QueryBuilder {
        this.excludePatterns = this.excludePatterns.concat(patterns);
        this.predicates.exclude = Predicates.exclude(...patterns);

        return this;
    }

    maxLength(length: number): QueryBuilder {
        this.predicates.minLength = Predicates.maxLength(length);

        return this;
    }

    minLength(length: number): QueryBuilder {
        this.predicates.minLength = Predicates.minLength(length);

        return this;
    }

    addPredicate(predicate: (node: Node, char: string, word: string) => boolean): QueryBuilder {
        this.predicates.userPredicates.push(predicate);

        return this;
    }

    build(): Function {
        let predicates = this.createAndSortPredicates();

        if (this.startsWithPatterns.length === 0) {
            this.startsWithPatterns.push('');
        }

        return () => {
            let results = [];
            this.startsWithPatterns.forEach(prefix => results = results.concat(this.wordGraph.startsWith(prefix, ...predicates)));

            return results;
        };
    }

    private createAndSortPredicates() {
        let predicates = this.predicates.userPredicates;
        delete this.predicates.userPredicates;

        for (let key of Object.keys(this.predicates)) {
            predicates.push(this.predicates[key]);
        }

        predicates.sort(predicate => predicate.precidence);

        return predicates;
    }
}
