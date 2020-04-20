/**
 *
 * Combine Queries
 *
 * This method has not been maintained.
 * It's supposed to combine multiple queries to one.
 *
 * Btw. this can also be accomplished by using the HttpBatchLink module
 *
 * @param queryConfigs {object} object of type { [queryName: string]: TypeGqlOperation }
 * @param options any
 * @param queryName {string}
 */
import { parseOperationConfig } from './build-operation';

export function combineQueries(queryConfigs: any, options?: any, queryName?: string) {
    if (queryConfigs && typeof queryConfigs === 'object') {
        options = options || {};
        queryName = queryName || '';
        const customQueryName = !!queryName;
        let variables = {},
            graphQlQuery = '',
            queryArguments = '';
        for (const operationName in queryConfigs) {
            if (queryConfigs.hasOwnProperty(operationName) && queryConfigs[operationName]) {
                const config = queryConfigs[operationName],
                    itemName = Object.keys(config.query)[0];
                if (config.query && itemName && config.query[itemName]) {
                    options = { ...config.options, ...options };
                    const queryParams = parseOperationConfig(config.query[itemName], options);
                    // saving custom values
                    variables = { ...variables, ...config.variables };
                    // adding query arguments
                    queryArguments += queryParams.args;
                    // adding query params and sub params
                    graphQlQuery += operationName + ': ' + itemName + queryParams.fields;
                    if (!customQueryName) {
                        const name = config.queryName ? config.queryName : operationName;
                        queryName += name.charAt(0).toUpperCase() + name.substring(1);
                    }
                }
            }
        }
        const query = 'query ' +
            (queryName.charAt(0).toUpperCase() + queryName.substring(1)) +
            (queryArguments.length > 0 ? '(' + queryArguments.substring(2).trim() + ')' : '') +
            ` { ${graphQlQuery} }`;

        return { query, queryName, variables };
    }
    return null;
}
