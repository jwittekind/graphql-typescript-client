/**
 *
 * Sorry for the mess!
 *
 * This CLI Tool generates type graphql client typescript classes
 * for your operations, types, variables from a graphql-schema.json
 *
 * i've been writing this in my @nrwl/angular monorepo,
 * that's why the angular devkit is required
 *
 * use
 *
 * $ npm run tgql-client:generate
 *
 * to create classes from the gql-schema.json
 *
 */

import { strings } from '@angular-devkit/core';
import {
    Rule,
    SchematicContext,
    Tree,
    branchAndMerge,
    chain,
    template,
    mergeWith,
    apply,
    url,
    filter,
    move,
} from '@angular-devkit/schematics';

export function graphqlJazz(options: any): Rule {
    return (tree: Tree, context: SchematicContext) => {
        const DEBUG = false;

        const schemaFilePath = './gql-schema.json';
        const content: any = JSON.parse(tree.read(schemaFilePath)?.toString() || '');

        const templateSources: any[] = [],
            types: any[] = content.__schema.types,
            vars: any = processTypes(types, context);

        if (DEBUG) {
            templateSources.push(mergeWith(apply(url('./files'), [
                filter(path => path.endsWith('log.json')),
                template({
                    ...strings,
                    type: JSON.stringify(vars),
                }),
                move(options.sourceDir, 'result'),
            ])));
        } else {
            Object.keys(vars).forEach((key: any) => {
                let applyUrl: string | null = options.types && key === 'types' ? '.model.ts' : null;
                applyUrl = options.variables && key === 'variables' ? '.variables.ts' : applyUrl;
                applyUrl = options.operations && key === 'operations' ? '.operations.ts' : applyUrl;

                // this condition splits the job to process only the given type at a time.
                // i had errors when creating too many files from larger schema.json
                if (applyUrl && key === 'types') {
                    const { models, globalImports } = vars[key] as any;
                    Object.keys(models).forEach((typeName: any) => {
                        const type = models[typeName];
                        type.fields = type.fields || [];
                        type.name = type.name || typeName;
                    });
                    templateSources.push(mergeWith(apply(url('./files'), [
                        filter(path => path.endsWith(applyUrl as string)),
                        template({
                            ...strings,
                            imports: globalImports,
                            name: 'graphql-types',
                            path: './generated/types',
                            types: Object.keys(models).map((k) => models[k]),
                        }),
                        move(options.sourceDir, 'result'),
                    ])));
                    const exports: string[] = [];
                    exports.push('export * from \'./graphql-types.model\';');
                    tree.create('./generated/types/index.ts', exports.join('\n'));
                } else if (applyUrl) {
                    const exports: string[] = [];
                    Object.keys(vars[key]).forEach((typeName: any) => {
                        const type = vars[key][typeName];
                        type.fields = type.fields || [];
                        type.name = type.name || typeName;
                        type.path = './generated/' + key;
                        const kebabTypeName: string = typeName
                            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
                            .toLowerCase()
                            .substring(1);
                        exports.push('export * from \'./' + kebabTypeName + (applyUrl as string).slice(0, -3) + '\';');
                        templateSources.push(mergeWith(apply(url('./files'), [
                            filter(path => path.endsWith(applyUrl as string)),
                            template({
                                ...strings,
                                ...type,
                            }),
                            move(options.sourceDir, 'result'),
                        ])));
                    });
                    tree.create(
                        './generated/' + key + '/index.ts',
                        exports.sort((a: string, b: string) => a.length - b.length).join('\n'),
                    );
                }
            });
            if (!tree.exists('./generated/index.ts')) {
                const dirExports = [
                    'export * from \'./types\';',
                    'export * from \'./variables\';',
                    'export * from \'./operations\';',
                ];
                tree.create('./generated/index.ts', dirExports.join('\n'));
            }
        }

        const rule = chain([branchAndMerge(chain(templateSources.slice(options.offset, options.offset + options.limit)))]);

        return rule(tree, context);
    };
}

function processTypes(types: any[], context: any) {
    const finalTypes: any = {},
        finalVariables: any = {},
        finalOperations: any = {};
    let globalImports: string[] = [];
    const operationsImports: string[] = [];
    types.forEach((type) => {
        const isOperation = type.name === 'Query' || type.name === 'Mutation',
            isCustomType = !isOperation && type.name.substr(0, 2) !== '__';
        // only render type if valid
        if (isOperation || isCustomType) {
            // parse fields
            if (type.fields?.length || type.inputFields?.length) {
                const fields = getFields(type.fields || type.inputFields, context),
                    typeInfo = getTypeName(type, context),
                    regex = /^[a-zA-Z]+$/;
                const typeName = typeInfo.gqlType
                    .split('')
                    .filter(x => regex.test(x))
                    .join('')
                    .replace(/^\w/, (c: string) => c.toUpperCase());
                if (typeName === 'Query' || typeName === 'Mutation') {
                    if (fields.length) {
                        fields.forEach((operation) => {
                            const operationClassName = operation.name.replace(/^\w/, (c: string) => c.toUpperCase()) + typeName;
                            const operationQuery: any = { name: operationClassName, operationName: operation.name };
                            const fieldTypeName = operation.type.tsType;
                            operation.operationType = typeName;
                            operation.operationName = operation.name;
                            operation.name = operationClassName;
                            const addTypeName = ['number', 'string', 'boolean'].indexOf(fieldTypeName) === -1;

                            if (addTypeName) {
                                finalTypes[fieldTypeName] = finalTypes[fieldTypeName] || {
                                    name: null,
                                    description: null,
                                    queries: [],
                                    mutations: [],
                                    variables: [],
                                };
                            }

                            operation.imports = operation.imports || [];
                            if (operation.args) {
                                const argsImports: string[] = [];
                                operation.args.forEach((arg: any) => {
                                    if (arg.type.tsType.indexOf('Type') >= 0) {
                                        argsImports.push(arg.type.tsType);
                                    }
                                    return arg.variableName =
                                        fieldTypeName.replace(/^\w/, (c: string) => c.toLowerCase()) +
                                        arg.name.replace(/^\w/, (c: string) => c.toUpperCase());
                                });
                                if (argsImports.length) {
                                    operation.imports.push(
                                        createCustomImport(argsImports.join(',\n    '), '../types'),
                                    );
                                }
                                finalVariables[operationClassName + 'Variables'] = {
                                    name: operationClassName + 'Variables',
                                    args: operation.args,
                                    imports: [createCustomImport(argsImports.join(', '), '../types')],
                                };
                                operation.argsName = operationClassName + 'Variables';
                                operation.imports.push(
                                    createCustomImport(operation.argsName, '../variables'),
                                );
                                operationQuery.args = operationClassName + 'Variables';
                                operationQuery.description = operation.description;
                            } else {
                                operation.args = null;
                            }
                            finalOperations[operationClassName] = operation;
                            if (addTypeName) {
                                finalTypes[fieldTypeName][typeName === 'Query' ? 'queries' : 'mutations'].push(operationQuery);
                                operationsImports.push(operationQuery.name);
                            }
                        });
                    }
                } else if (fields.length) {
                    let imports: string[] = [];
                    fields.forEach((field) => {
                        if (field.imports) {
                            imports = imports.concat(field.imports.map((imp: string) => createCustomImport(imp, '@ep-shared/graphql')));
                            delete field.imports;
                        }
                        if (field.args?.length) {
                            const fieldName = field.name.replace(/^\w/, (c: string) => c.toUpperCase()),
                                fieldVarsName = typeName + fieldName + 'Variables';
                            const argImports: string[] = [];
                            field.args.forEach((arg: any) => {
                                if (['string', 'number', 'boolean'].indexOf(arg.type.tsType) === -1) {
                                    argImports.push(arg.type.tsType);
                                }
                            });
                            finalVariables[fieldVarsName] = finalVariables[fieldVarsName] || {
                                name: fieldVarsName,
                                args: field.args,
                                imports: argImports.length ? [createCustomImport(argImports.join(',\n    '), '../types')] : [],
                            };
                            field.args = fieldVarsName;
                        }
                    });
                    globalImports = globalImports?.filter((val, i, arr) => arr.indexOf(val) === i);
                    globalImports = globalImports.sort((a: string, b: string) => a.length - b.length);
                    finalTypes[typeName] = {
                        queries: [],
                        mutations: [],
                        ...finalTypes[typeName],
                        fields,
                        name: typeName,
                        returnType: typeInfo,
                    };
                }
            }
        }
    });
    globalImports.push(
        createCustomImport('\n    ' +
            operationsImports.sort(
                (a: string, b: string) => a.length - b.length,
            ).join(',\n    ') + '\n',
            '../operations',
        ),
    );
    return { types: { models: finalTypes, globalImports }, variables: finalVariables, operations: finalOperations };
}

export interface GetTypeNameReturn {
    tsType: string;
    gqlType: string;
    imports?: string[];
    required: boolean;
    inputType?: boolean;
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param fields
 * @param context
 */
function getFields(fields: any[], context: any) {
    const finalFields: any[] = [];
    if (Array.isArray(fields) && fields.length) {
        fields.forEach((field) => {
            const fieldType = getTypeName(field.type, context);
            const typeField: any = {
                type: fieldType,
                name: field.name,
                setFieldParam: ['Int', 'String', 'Float', 'Boolean'].indexOf(
                    fieldType.gqlType.split('').filter(x => /^[a-zA-Z]+$/.test(x)).join(''),
                ) === -1,
                description: field.description,
            };
            // typeField.imports = fieldType.imports || [];
            // delete fieldType.imports;
            if (field.args?.length) {
                typeField.args = getVariables(field.args, context);
            }
            finalFields.push(typeField);
        });
    }
    return finalFields;
}

/**
 *
 * @param args
 * @param context
 */
function getVariables(args: any[], context: any) {
    if (args?.length) {
        const variables: any = [];
        args.forEach((arg) => {
            const finalType = getTypeName(arg.type, context);
            if (finalType) {
                variables.push({
                    name: arg.name,
                    type: finalType,
                    description: arg.description,
                    defaultValue: arg.defaultValue,
                });
            }
        });
        return variables;
    }
    return null;
}

/**
 *
 * @param type
 * @param context
 */
function getTypeName(type: { kind: string; name: string; ofType: any | null; }, context: any): GetTypeNameReturn {
    if (type.kind === 'OBJECT' || type.kind === 'INPUT_OBJECT') {
        return {
            required: false,
            tsType: type.name,
            gqlType: type.name,
            imports: [type.name],
            inputType: type.kind === 'INPUT_OBJECT',
        };
    } else if (type.kind === 'ENUM') {
        return {
            required: false,
            tsType: 'any',
            gqlType: type.name,
            imports: [type.name],
            inputType: false,
        };
    } else if (type.kind === 'SCALAR') {
        if (['Int', 'Float', 'String', 'Boolean'].indexOf(type.name) !== -1) {
            const tsType: string = type.name === 'Int' || type.name === 'Float' ? 'number' : type.name;
            return { gqlType: type.name, tsType: tsType.toLowerCase(), required: false };
        } else {
            return { gqlType: type.name, tsType: type.name, required: false };
        }
    } else if (type.kind === 'NON_NULL' && type.ofType) {
        const returnType = getTypeName(type.ofType, context);
        if (returnType) {
            returnType.required = true;
            returnType.gqlType += '!';
            return returnType;
        }
    } else if (type.kind === 'LIST' && type.ofType) {
        const returnType = getTypeName(type.ofType, context);
        if (returnType) {
            returnType.gqlType = '[' + returnType.gqlType + ']';
            return returnType;
        }
    }
    return { gqlType: '', tsType: '', required: false };
}

/**
 *
 * @param typeName
 * @param path
 */
function createCustomImport(typeName: string, path?: string) {
    return 'import { ' + typeName + ' } from \'' + path + '\';';
}
