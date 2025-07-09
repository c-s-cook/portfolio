import findKey from "./findKey";

let testObj = {
    one: {
        levelA: "A",
        levelB: {
            '00001': {
                keep: {
                    going: {
                        down: true
                    }
                }
            },
            '00002': 'two',
            '00003': Number('three'),
            thisIsWhatIWant: 'https://fakenews.why/?a=jump'
        },

    },
    two: {
        levelB: "Baaahhhh",
        levelC: {
            'AAAAA': 1,
            'BBBBB': 'two',
            'CCCCC': Number('four'),
        },
        levelD: 25.3,
    },
    three: {
        levelC: "Crude",
        levelD: {
            '11111': 'A',
            '22222': 'two',
            '33333': Number('twelve'),
        },
        levelE: 21.121,
    },
    four: 'just a string',
    five: 5,
    six: {
        levelD: 'another object',
        levelE: 24,
        levelF: {
            AaAaA: 'last level',
            BbBbB: 3,
        }
    }
}

const testFindKey = async () => {
    let testResults = await findKey(testObj, 'URL', 3);
    console.log('findKey test -> ', testResults,);
};

testFindKey();