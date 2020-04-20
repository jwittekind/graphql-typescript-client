import { GraphqlSchemaService } from '../services/graphql-schema.service';

/**
 *
 * @constructor
 */
export function QueryConfig() {
    return function(target: any, key: string | symbol, index: number) {
        let constructorName;
        if (typeof target === 'function' && target.name) {
            constructorName = target?.name;
        } else if (typeof target === 'object' && target?.constructor?.name) {
            constructorName = target?.constructor?.name;
        }
        GraphqlSchemaService.setConfigArguments(constructorName, key as string, { target, key, index });
    };
}
