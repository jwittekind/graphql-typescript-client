import { TypeGQLOperation } from '../operation-builder';
import { GraphqlJazzInjectorInstance } from '../graphql-jazz.module';
import { GraphqlOperationService } from '../services/graphql-operation.service';

/**
 *
 * @param queryOperation
 * @param QueryName
 * @param someArg
 * @constructor
 */
export function Query(queryOperation: string | TypeGQLOperation, QueryName?: string | any, someArg?: any) {
    return function(target: any, key: string | symbol, descriptor?: PropertyDescriptor) {
        target[key] = function(queryName?: string) {
            return GraphqlJazzInjectorInstance.get(GraphqlOperationService)
                .query(queryOperation, null, queryName || QueryName);
        };
    };
}
