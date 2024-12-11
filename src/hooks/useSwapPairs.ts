export const useSwapPairs = (wordOrder: string[], selectedWords: string[]) => {
    let alreadySwapped = [false, false, false, false];

        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                if (wordOrder[i] === selectedWords[j]) {
                    alreadySwapped[i] = true;
                    break;
                }
            }
        }

        let pairs: [number, number][] = [];

        for (let i=4; i<wordOrder.length; i++) {
            for (let j=0; j<4; j++) {
                if (wordOrder[i] === selectedWords[j]) {
                    for (let k=0; k<4; k++) {
                        if (alreadySwapped[k] === false) {
                            alreadySwapped[k] = true;
                            pairs.push([i, k]);
                            break;
                        }
                    }
                }
            }
        }

        return pairs;
};
