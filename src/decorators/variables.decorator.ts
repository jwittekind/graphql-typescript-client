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
            // get class name by static class
            constructorName = constructor?.name;
        } else if (typeof constructor === 'object' && constructor?.constructor?.name) {
            // get class name by class instance
            constructorName = constructor?.constructor?.name;
        }
        // save arguments
        GraphqlSchemaService.setArguments(constructorName, constructor);
    };
}
