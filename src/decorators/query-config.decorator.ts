import {GraphqlSchemaService} from '../services/graphql-schema.service';

/**
 *
 * @constructor
 */
export function QueryConfig() {
    return (target: any, key: string, index: number) => {
        let constructorName;
        if (typeof target === 'function' && target.name) {
            // get class name by static class
            constructorName = target?.name;
        } else if (typeof target === 'object' && target?.constructor?.name) {
            // get class name by class instance
            constructorName = target?.constructor?.name;
        }
        // save Arguments
        GraphqlSchemaService.setConfigArguments(constructorName, key, { target, key, index });
    };
}
