import { ArgsType, ArgDefinition } from '@type-graphql-cli';
<% if (imports && imports.length) { for (let imp of imports) { %>
<%= imp %><% } } %>

/**
 * <%= classify(name) %>
 */
@ArgsType()
export class <%= classify(name) %> {
<% if (args && args.length) { for (let arg of args) { %>
<% if (arg.description) { %>    // <%= arg.description %><% } %>
    <%= arg.name %><% if (!arg.type.required) { %>?<% } %>: ArgDefinition<<%= arg.type.tsType %>> = {
        type: '<%= arg.type.gqlType %>',
        variableName: '<%= arg.variableName %>'<% if (arg.defaultValue !== null) { %>,
        value: <%= arg.defaultValue %><% } %>
    };
<% } } %>
}
