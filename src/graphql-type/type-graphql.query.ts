export type TypeQueryRef<T> = (queryName?: string) => any; // Observable<ApolloQueryResult<T>>

export type TypeWatchQueryRef<T, V> = (queryName?: string) => any; // QueryRef<T, V>
