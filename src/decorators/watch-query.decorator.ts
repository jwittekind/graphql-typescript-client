import { TypeGQLOperation } from '../operation-builder';

/**
 *
 * @param queryOperation
 * @param QueryName
 * @param someArg
 * @constructor
 */
export function WatchQuery(queryOperation: string | TypeGQLOperation, QueryName?: string | any, someArg?: any) {
    return function(target: any, key: string | symbol, descriptor?: PropertyDescriptor) {
        target[key] = function(queryName?: string) {
            return new queryOperation();
        };
    };
}
