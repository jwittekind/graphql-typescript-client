import { QueryType } from '@type-graphql-cli';

<% if (imports && imports.length) { for (let imp of imports) { %>
<%= imp %><% } } %>

/**
 * <%= classify(name) %>
 */
export class <%= classify(name) %><R = any> extends QueryType<R, <% if(args && argsName) { %><%= argsName %><% } else { %>any<%} %>> {
    readonly fields = '<%= type.tsType %>';
    readonly <% if(operationType === 'Mutation') { %>mutationName<% } else { %>queryName<% } %> = '<%= operationName %>';
    readonly args = <% if(args && argsName) { %>new <%= argsName %>()<% } else { %>null<% } %>;

<% if (args && argsName) { for(let arg of args) { %><% if(arg.description) { %>    // <%= arg.description %><% } %>
    <%= arg.name %>?(<%= arg.variableName %>: <%= arg.type.tsType %><% if(arg.defaultValue) { %> = <%= JSON.stringify(arg.defaultValue) %><% } %>) {
        this.args.<%= arg.name %>.value = <%= arg.variableName %>;
        return this;
    }
<% } } %>
}
