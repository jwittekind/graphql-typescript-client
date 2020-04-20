/**
 * UserType
 * add a description here!
 */
import { Field, ObjectType } from "../../../src";
import {PostPaginationType} from "../post/post-pagination.type";

@ObjectType('UserType')
export class UserType {

    readonly __typename?: string = 'UserType';

    // The id of the user
    @Field() id?: number;

    // The email of user
    @Field() email?: string;

    // The lastName of user
    @Field() lastName?: string;

    // The firstName of user
    @Field() firstName?: string;

    // The Posts of the user
    @Field(false, 'PostPaginationType', 'UserTypePostsVariables') Posts?: PostPaginationType;
}
