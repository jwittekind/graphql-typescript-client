# Type GraphQL Client

This is decent draft of a new way to use GraphQL with apollo.
With this module i'd like to take a first step, 
so that graphql can be used with typescript more easily.

The idea is, to let the user write human readable methods that can be chained.
In the end, it could look similar to the way we write code in laravel PHP or other famous frameworks: 

`````
...

this.posts$ = PostPaginationType
    .getPosts()
    .byId(5)
    .byPagination({ limit: 10, offset: 0 })
    .withField('Comments', (comments: PostTypeComments) => {
        return comments.withPagination({ limit: 0, offset: 0 });
    })
    .watchQuery('myPostsQuery').valueChanges;

this.posts$.subscribe(() => ...);    

...
`````

## So How do we achieve that?

This idea came to my mind the first moment when i got to know graphql.
Actually i've almost barely worked with manually written graphql queries/mutations.

With my first implementation of graphql into an application, 
i started to write a service that converts js objects into the graphql query language. 
Though, over time my ideas have evolved and caused a lot of headache - i always sticked to that idea.
This repository is what i could make out of it.


With this repository i'd like to invite you into the work on this idea.

> ! There are a lot of comments and explanations in the code, but here you will find some examples of how i could imagine it to work: 

## Examples

###./posts.query.ts
`````
import {QueryType} from "../../src/graphql-type";
import {PostsQueryVariables} from "../variables/posts-query-variables.variables";

/**
 * PostsQuery
 */
export class PostsQuery<R = any> extends QueryType<R, PostsQueryVariables> {
    readonly fields = 'PostPaginationType';
    readonly queryName = 'posts';
    readonly args = new PostsQueryVariables();

    // The id of the Post
    id?(postPaginationTypeId: number) {
        this.args.id.value = postPaginationTypeId;
        return this;
    }

    // The slug of the Post
    slug?(postPaginationTypeSlug: string) {
        this.args.slug.value = postPaginationTypeSlug;
        return this;
    }

    // Post pagination
    pagination?(postPaginationTypePagination: any) { // PaginationInputType
        this.args.pagination.value = postPaginationTypePagination;
        return this;
    }
}


`````

###./posts-query.variables.ts
`````
import {ArgsType, ArgDefinition} from "../../src";

/**
 * PostsQueryVariables
 */
@ArgsType()
export class PostsQueryVariables {

    // The id of the Post
    id: ArgDefinition<number> = {
        type: 'Int',
        variableName: 'postPaginationTypeId'
    };

    // The slug of the Post
    slug: ArgDefinition<string> = {
        type: 'String',
        variableName: 'postPaginationTypeSlug'
    };

    // Post pagination
    pagination: ArgDefinition<any> = { // PaginationInputType
        type: 'PaginationType!',
        variableName: 'postPaginationTypePagination'
    };
}

`````

###./posts-pagination.type.ts
`````
import { Field, ObjectType } from "../../../src";
import { PostType } from "./post.type";

@ObjectType('PostPaginationType')
export class PostPaginationType {

    readonly __typename?: string = 'PostPaginationType';

    // An Array of users
    @Field(true, 'PostType') items?: PostType[];

    // The total amount of users to query
    @Field() itemTotal?: number;
}

`````

###./posts.type.ts
`````

/**
 * UserType
 */
@ObjectType('PostType')
export class PostType {

    readonly __typename?: string = 'PostType';

    // The title of the post
    @Field() title?: string;

    // The text of the post
    @Field() text?: string;

    // The Posts of the user - Here's where the struggle gets real: Circular Dependencies
    // UserType -> PostType -> UserType ... even though its only a typing :/
    @Field(false, 'UserType', 'PostTypeAuthorVariables') Author?: UserType;

    /**
     * Method gets defined by decorator
     */
    @WatchQuery(PostsQuery) getPosts: () => PostsQuery;
}

`````


## License

MIT
