import { GraphqlSchemaService } from '../services/graphql-schema.service';
import { GqlJazzMutationFields, GqlJazzQueryFields } from '../type-graphql-cli.models';

export type TypeGQLOperation = any | {
    args?: string;
    fields: string;
    queryName?: string;
    mutationName?: string;
};

/**
 *
 * Build Operation function
 *
 * This is kind of the core of our type-graphql-client.
 * So that where the magic happens :D
 *
 * The buildOperation method takes a js object/class
 * and creates a valid graphql query from it
 *
 * A valid operationConfig could be defined like so:

@QueryType('users')
class UsersQuery extends QueryType {
    // arguments are optional for an operation
    queryName?: 'users',
    mutationName?: '...',
    args: {
        id: { type: 'Int', variableName: 'userId', value: null },
        hasPosts: { type: 'Boolean', variableName: 'userHasPosts', value: false },
        pagination: { type: 'PaginationType!', variableName: 'userPagination', value: { limit: 10, offset: 0 } },
    },
    fields: {
        id: true, // queried
        lastName: true,
        firstName: false, // skipped
        Posts: {
            __call: true, // queried
            __args: { // 'UsersTypePostsVariables'
                pagination: {
                    type: 'PaginationType!',
                    variableName: 'userTypePostsPagination',
                    value: { limit: 10, offset: 0 }
                },
            },
            __fields: {
                id: true,
                text: true,
                title: true,
                Comments: {
                    __class: false // skipped
                    __fields: 'PostsCommentsType',
                    __args: 'PostsTypeCommentsVariables'
                }
            }
        }
    },
}

 * @param operation
 * @param options
 */
export function buildOperation(operation: TypeGQLOperation, options: any = {}): GqlJazzQueryFields | GqlJazzMutationFields {
    // instanciates the class if passed as function
    operation = typeof operation === 'function' ? new operation() : operation;
    // defines the type of the operation by looking fot query- or mutationName property
    const type = operation.queryName ? 'query' : (operation.mutationName && 'mutation') || null;
    // requires the definition of operation fields
    if (operation.fields && type) {
        // define the name of the operation
        const operationName = operation[type + 'Name'],
            // define the name of the query/mutation
            queryName = options.queryName || operationName;
        if (queryName) {
            // checks for graphql field directives in options(string)
            const directive: string = options.queryDirective || '',
                // passes fields, args and options to a recursive query methpd
                { variables, args, fields } = parseOperationConfig(
                    operation.fields,
                    operation.args,
                    options,
                );
            // Add named query Name
            const gqlj: string = (type + ' ' + queryName.charAt(0).toUpperCase() + queryName.substring(1) +
                // Add query variable names and types
                (args.length > 0 ? '(' + args.join(', ') + ')' : '') +
                // Add parameters to query with optional directive and sub params
                ` { ${operationName} ${directive} ${fields.join(' ')} }`)
                .replace(/\s\(\s/g, '(')
                .replace(/\s\)\s/g, ') ');

            // return result according to operation type
            if (type === 'query') {
                return { [type]: gqlj, queryName, operationName, variables } as GqlJazzQueryFields;
            } else {
                return { [type]: gqlj, queryName, operationName, variables } as GqlJazzMutationFields;
            }
        }
    }
}

/**
 *
 * @param fieldType
 * @param fieldArgs
 * @param options
 * @param args
 * @param path
 */
export function parseOperationConfig(fieldType, fieldArgs?: any, options?: any, args?: any[], path?: string[]) {
    args = args || [];
    path = path || [];
    let operationFields: string[] = [],
        operationArgs: string[] = [];
    const variables = {};
    // check if param is a TypeGraphqlClient definition
    fieldType = typeof fieldType === 'string' ? GraphqlSchemaService.getType(fieldType) : fieldType;
    if (fieldType?.__typename || (fieldType?.__call && fieldType.__fields)) {
        if (fieldType?.__call && fieldType.__fields) {
            // initializes sub params when defined as string again
            fieldType.__fields = typeof fieldType.__fields === 'string' ?
                GraphqlSchemaService.getType(fieldType.__fields) :
                fieldType.__fields;
            fieldType = fieldType.__fields;
        }
        if (fieldArgs) {
            // paramArguments are optional addition, when params provided
            const parsedArgs = parseOperationArguments(fieldArgs, args, variables);
            operationFields = operationFields.concat(parsedArgs.queryParams);
            operationArgs = parsedArgs.queryArguments;
            fieldArgs = null;
        }
        // check if param is a TypeGraphqlField definition
        if (fieldType?.__typename) {
            // pass fields, args and options, as well as registered variables, args and a path
            const parsedParams = parseOperationFields(fieldType, fieldArgs, variables, options, args, path);
            // !! Adding the fields to the operation
            operationFields = operationFields.concat(parsedParams.queryParams);
            // !! Adding the args to the operation
            operationArgs = operationArgs.concat(parsedParams.queryArguments);
        }
    }
    // only return variables when they exist
    return { fields: operationFields, args: operationArgs, variables: variables !== {} && variables || null };
}

/**
 *
 * @param typeArguments
 * @param args
 * @param variables
 */
function parseOperationArguments(typeArguments, args, variables) {
    let queryParams: string[] = [],
        queryArguments: string[] = [],
        fieldArguments: string[] = [];
    typeArguments = typeof typeArguments === 'function' ? new typeArguments() : typeArguments;
    // Add arguments to operation if given
    if (typeof typeArguments === 'object' && Object.keys(typeArguments).length) {
        for (const argument in typeArguments) {
            if (typeArguments.hasOwnProperty(argument)) {
                const { variableName, type, value } = typeArguments[argument];
                // type & variableName are required argument properties
                if (type && variableName) {
                    // global variables have to be unique - duplicate variable type declarations will be ignored
                    if (args.indexOf(variableName) === -1) {
                        args.push(variableName);
                        // create global operation variable types: "$objectId: Int!"
                        queryArguments.push('$' + variableName?.trim() + ': ' + type.trim());
                    }
                    // create argument variable pairs: "id: $objectId"
                    fieldArguments.push(argument + ': $' + variableName.trim());

                    if (typeArguments[argument].hasOwnProperty('defaultValue')) {
                        // save optional default value if available
                        if (typeof value !== 'undefined') {
                            variables[variableName] = value;
                        }
                    }
                }
            }
        }
        // enclose args with brackets when adding to the field
        fieldArguments = fieldArguments.length ? ['(', fieldArguments.join(', '), ')'] : fieldArguments;
        queryParams = queryArguments.length ? fieldArguments : queryParams;
        queryArguments = queryArguments.length ? queryArguments : queryArguments;
    }
    return { queryParams, queryArguments };
}

/**
 *
 * @param typeModel
 * @param paramArguments
 * @param defaultValues
 * @param options
 * @param args
 * @param path
 */
function parseOperationFields(typeModel: any, paramArguments: any, defaultValues: any, options: any, args: string[], path: string[]) {
    let queryParams: string[] = [],
        queryArguments: string[] = [];
    // stepping into a field -> pushing type of field to the path
    path.push(typeModel.__typename);
    // loop through all fields of given ObjectType
    for (const fieldName in typeModel) {
        if (typeModel.hasOwnProperty(fieldName)) {
            let typeField = typeModel[fieldName];
            // options.subParams can contain the properties as the
            // typeField but with boolean values. Those can override
            // the default boolean whether or not to query the field
            const subParams = options.subParams,
                // check whether or not to query the field
                fieldToQuery = typeof typeField === 'object' && typeField.hasOwnProperty('__call') ? typeField.__call : !!typeField,
                toQuery = (typeof subParams?.[fieldName] === 'boolean' || typeof subParams?.[fieldName] === 'object') ?
                    subParams?.[fieldName] : fieldToQuery;
            // define subParamOption for other potential sub fields
            const subParamOptions = typeof subParams?.[fieldName] === 'object' ? subParams?.[fieldName] : null;
            if (toQuery && typeField) {
                if (typeof typeField === 'object') {
                    // check if typeField is a GQLJazzType definition
                    if (typeField.__call) {
                        // initialize field as type if given as type definition
                        paramArguments = paramArguments || typeField.__args;
                        typeField = typeField.__fields;
                        typeField = typeof typeField === 'string' ? GraphqlSchemaService.getType(typeField) : typeField;
                        typeField = typeof typeField === 'function' ?
                            GraphqlSchemaService.getType(typeField.prototype?.__typename) : typeField;
                    }
                    // check if typeField is a GQLJazzField definition
                    if (typeField && (typeField.__typename || typeField.__call)) {
                        const subQueryParams = parseOperationConfig(typeField, paramArguments, subParamOptions || options, args, [...path]);
                        if (subQueryParams.fields.length) {
                            // only add arguments and fields if fields are provided
                            queryArguments = queryArguments.concat(subQueryParams.args);
                            for (const key in subQueryParams?.variables) {
                                if (subQueryParams.variables.hasOwnProperty(key) && !defaultValues[key]) {
                                    defaultValues[key] = subQueryParams.variables[key];
                                }
                            }
                            // !! Adding the fields to the operation
                            queryParams = queryParams.concat([fieldName, ...subQueryParams.fields]);
                        }
                    }
                } else {
                    // add field to operation as it is truthy
                    queryParams.push(fieldName);
                }
            }
        }
    }
    // enclose the fields in curly braces when adding the to the operation
    queryParams = queryParams.length ? ['{', ...queryParams, '}'] : [];
    return { queryArguments, queryParams };
}

