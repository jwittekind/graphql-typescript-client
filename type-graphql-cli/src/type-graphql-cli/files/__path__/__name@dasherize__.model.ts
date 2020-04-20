import { Field, Query, Mutation, ObjectType } from '@type-graphql-cli';
<% if (imports && imports.length) { for (let imp of imports) { %>
<%= imp %><% } } %>
<% if(types && types.length) { for(let type of types) { %>
/**
 * <%= classify(type.name) %>
 * add a description here!
 */
@ObjectType('<%= classify(type.name) %>')
export class <%= classify(type.name) %> {

    readonly __typename?: string = '<%= type.name %>';
<% if (type.fields && type.fields.length) { for (let field of type.fields) { %>
<% if (field.description) { %>    // <%= field.description %>
<% } %>    @Field(<% if(field.setFieldParam) { %>false, '<%= field.type.tsType %>'<% if (field.args) { %>, '<%= field.args %>'<% } %><% } %>) <%= field.name %>?: <%= field.type.tsType %>;
<% } } %>
<% if (type.queries && type.queries.length) { %>    /*
     * <%= classify(type.name) %>Queries
     */
<% for (let query of type.queries) { %><% if (query.description) { %>    // <%= query.description %><% } %>
    @Query(<%= query.name %>) <%= query.name %>?: () => <%= query.name %><<%= classify(type.name) %>>;
<% } } %>
<% if (type.mutations && type.mutations.length) { %>    /*
     * <%= classify(type.name) %>Mutations
     */
<% for (let mutation of type.mutations) { %><% if (mutation.description) { %>    // <%= mutation.description %><% } %>
    @Mutation(<%= mutation.name %>) <%= mutation.name %>?: () => <%= mutation.name %><<%= classify(type.name) %>>;
<% } %>
<% } %>}<% } } %>
