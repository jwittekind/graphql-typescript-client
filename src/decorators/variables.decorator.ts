import { GraphqlSchemaService } from '../services/graphql-schema.service';

/**
 *
 * @constructor
 */
export function ArgsType() {
    // pass arguments for queries here?
    return function(constructor) {
        let constructorName;
        if (typeof constructor === 'function' && constructor.name) {
            constructorName = constructor?.name;
        } else if (typeof constructor === 'object' && constructor?.constructor?.name) {
            constructorName = constructor?.constructor?.name;
        }
        GraphqlSchemaService.setArguments(constructorName, constructor);
    };
}
