/**
 *
 * @param queryConfigs
 * @param options
 * @param queryName
 */
import { parseOperationConfig } from './build-operation';

export function combineQueries(queryConfigs: any, options?: any, queryName?: string) {
    if (queryConfigs && typeof queryConfigs === 'object') {
        options = options || {};
        queryName = queryName || '';
        const customQueryName = !!queryName;
        let variables = {},
            graphQlQuery = '',
            defaultValues = {},
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
                    // setting default variable values of query
                    defaultValues = { ...queryParams.defaultValues, ...defaultValues };
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

        return { query, queryName, variables: { ...defaultValues, ...variables } };
    }
    return null;
}
