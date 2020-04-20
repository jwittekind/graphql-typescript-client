import { UserType } from "../user/user.type";
import {Field, ObjectType, WatchQuery} from "../../../src";
import { PostsQuery } from "../../operations/posts-query.operations";

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
     * class instance of type PostsQuery ideally allows method chaining to add variables like:
     *

     new PostsQuery()
        .id(5)
        .pagination({ limit: 10, offset: 0 })
        .with('comments', (comments) => comments.pagination({ limit: 0, offset: 0 }))
        .watchQuery('myPostsQuery').valueChanges.subscribe(() => ...)

     */
    @WatchQuery(PostsQuery) getPosts: () => PostsQuery;
}
