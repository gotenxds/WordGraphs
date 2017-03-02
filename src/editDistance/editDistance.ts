import {Node} from '../wordGraph/Node';

export function editDistance(node: Node, word: string, options: {maxDistance: number, maxResults: number} =
                                                                {maxDistance: 3, maxResults: Number.MAX_VALUE}) {
    return searchForSimilarWords(node, word, options);
}

function searchForSimilarWords(node: Node, word: string,
                               options: {maxDistance: number, maxResults: number} = {maxDistance: 3, maxResults: Number.MAX_VALUE},
                               comparedWord = '', table = initializeEditDistanceMatrix(word.length)) {
    let results = [];
    for (let key of Object.keys(node.states)) {
        let currentWord = comparedWord + key;

        for (let wordIndex = 0; wordIndex <= word.length; wordIndex++) {
            let currentWordIndex = currentWord.length;

            table[wordIndex][currentWordIndex] = editDistanceOf({
                wordIndex: wordIndex,
                currentWordIndex: currentWordIndex,
                word: word,
                comparedWord: currentWord,
                table: table,
            });
        }

        let editDistanceValue = table[word.length][currentWord.length];

        if (node.nodeOf(key).final && editDistanceValue <= options.maxDistance) {
            results.push(currentWord);
        }

        if (results.length >= options.maxResults) {
            return results.slice(0, options.maxResults);
        }

        results = results.concat(searchForSimilarWords(node.nodeOf(key), word, options, currentWord, table));
    }

    return results.slice(0, options.maxResults);
}

function editDistanceOf(data) {
    let table = data.table;
    let firstIndex = data.wordIndex;
    let secondIndex = data.currentWordIndex;

    if (Math.min(firstIndex, secondIndex) === 0) {
        return Math.max(firstIndex, secondIndex);
    }

    let inequalityPunishment = data.word[firstIndex - 1] === data.comparedWord[secondIndex - 1] ? 0 : 1;

    return Math.min(table[firstIndex][secondIndex - 1] + 1,
        table[firstIndex - 1][secondIndex] + 1,
        table[firstIndex - 1][secondIndex - 1] + inequalityPunishment);
}

function initializeEditDistanceMatrix(len) {
    let matrix = [];

    for (let index = 0; index <= len; index++) {
        matrix[index] = [index];
    }

    return matrix;
}
