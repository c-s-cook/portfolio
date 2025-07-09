/**
 * An async function that recursively searches an object for a specified 
 * key (`urlKey`) within a nested object up to a given depth.
 * 
 * Returns an object containing the property chain leading to the found key and its value, or `null` if not found.
 *
 * @param data - The object to search within.
 * @param urlKey - The key to search for within the nested object structure.
 * @param maxDepth - The maximum depth to search (default is 10). Must be a positive integer.
 * @returns An object with the property chain and found value, or `null` if the key is not found within the depth limit.
 *
 * @example
 * ```typescript
 * const result = await findKey(myObj, 'targetKey', 5);
 * if (result) {
 *   console.log(result.propChain); // Array of property names leading to the key
 *   console.log(result['targetKey']); // The value found at the key
 * }
 * ```
 */


const findKey = async (data: Object, urlKey: string, maxDepth: number = 10) => {

    // Validate params...
    if(!data || (typeof(data) !== 'object')) throw new TypeError(`findKey() Error: First param (required) must be an Object.`);
    if(!urlKey || (typeof(urlKey) !== 'string')) throw new TypeError(`findKey() Error: Second param (required) must be a string (the sought key).`);
    if((typeof(maxDepth) !== 'number' || (maxDepth < 1))) throw new Error(`findKey() Error: Third param (optional) must be a whole number greater than 1.`)  

    var depthDelved = 0;

    const findKeyNest = async (data: Object, urlKey: string, maxDepth: number = 10) => {
        // filter for keys of objects
        let keysOfObjects = Object.keys(data).filter((key) => typeof (data[key]) === 'object');

        if (keysOfObjects.length == 0) return null;

        for (const key of keysOfObjects) {
            if (data[key][urlKey]) {

                let results = {
                    propChain: [key, urlKey],
                };
                results[urlKey] = data[key][urlKey];

                return results
            }
        }

        // if we haven't returned results yet, recursively drill down another level...
        for (const key of keysOfObjects) {

            if (depthDelved >= maxDepth) return null;

            depthDelved++;

            let results = await findKeyNest(data[key], urlKey, maxDepth);

            depthDelved--;

            if (results) {
                results.propChain.unshift(key);
                return results;
            }
        }

        return null;

    }
    // end findKeyNest()

    return await findKeyNest(data, urlKey, maxDepth)
}

export default findKey;
