
export interface ArgDefinition<T = any> {
    value?: T;
    type: string;
    defaultValue?: T;
    variableName: string;
}

export interface GqlJazzQueryFields extends GqlJazzParams {
    query: string;
    queryName: string;
    operationName: string;
    variables?: { [key: string]: any };
}

export interface GqlJazzMutationFields extends GqlJazzParams {
    mutation: string;
    queryName: string;
    operationName: string;
    variables?: { [key: string]: any };
}

export interface GqlJazzParams {
    queryName: string;
    operationName: string;
    defaultValues: { [key: string]: any };
}

export declare interface GQLJQueryGet {
    get?(...args: any[]): QueryRef<any, any>;
}

export declare interface GQLJazzQueryDefinition {
    args?: string | {
        [key: string]: string | {
            type: string;
            variableName: string;
            defaultValue?: { [key: string]: any };
        };
    };
    params?: string | {
        // TODO: check if this can be required?
        __typename?: string;
        [key: string]: any | GQLJazzQueryDefinition;
    };

    [key: string]: any | GQLJazzQueryDefinition;
}
