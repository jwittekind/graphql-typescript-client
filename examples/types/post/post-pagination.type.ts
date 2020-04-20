/**
 * UserType
 * add a description here!
 */
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
