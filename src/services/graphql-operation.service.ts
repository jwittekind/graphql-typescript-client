import { ApolloQueryResult, MutationOptions, QueryOptions, WatchQueryOptions } from 'apollo-client';
import gql from 'graphql-tag';
import { Apollo, QueryRef } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { GqlJazzQueryFields } from '@graphql-jazz';
import { map } from 'rxjs/operators';
import { buildOperation, TypeGQLOperation } from '../operation-builder/build-operation';
import { GraphqlSchemaService } from './graphql-schema.service';

@Injectable()
export class GraphqlOperationService {

    constructor(private apollo: Apollo) {
    }

    /**
     *
     * @param operation
     * @param options
     * @param queryName
     */
    query<R, V>(operation: TypeGQLOperation, options?: QueryOptions<V>, queryName?: string) {
        // query = query?.__fields ? query.__fields : GraphqlSchemaService.getType(constructorName);
        // query = typeof query === 'string' ? GraphqlSchemaService.getType(query) : query;
        const query = buildOperation(operation) as GqlJazzQueryFields;
        return this.apollo.query<R>({
            query: gql(query.query),
            variables: {
                ...query.defaultValues,
                ...query?.variables,
            },
        });
    }

    /**
     *
     * @param operation
     * @param options
     * @param queryName
     */
    watchQuery<R, V = any>(operation: TypeGQLOperation, options: WatchQueryOptions<V>, queryName: string) {
        operation = typeof operation === 'function' ? new operation() : operation;
        const watchQueryConfig = buildOperation(operation) as GqlJazzQueryFields;
        const watchQueryRef = this.apollo.watchQuery<R>({
            query: gql(watchQueryConfig.query),
            variables: {
                ...watchQueryConfig.defaultValues,
                ...watchQueryConfig?.variables,
            },
        });
        watchQueryRef.valueChanges = watchQueryRef.valueChanges.pipe(
            map((res: ApolloQueryResult<any>) => {
                const resultModel = GraphqlSchemaService.instantiateDataType(res.data[operation.queryName]);
                return resultModel ? { ...res, data: { ...res.data, [operation.queryName]: resultModel } } : res;
            }),
        );
        return watchQueryRef as QueryRef<R>;
    }

    /**
     *
     */
    mutate<R, V>(operation: TypeGQLOperation, options: MutationOptions, queryName?: string) {

    }

}
