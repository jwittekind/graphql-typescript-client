import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';

export type TypeQueryRef<T> = (queryName?: string) => Observable<ApolloQueryResult<T>>;

export type TypeWatchQueryRef<T, V> = (queryName?: string) => QueryRef<T, V>;
