import { ApolloServer } from "apollo-server";
import { makeSchema, nullabilityGuardPlugin, authorizePlugin } from "nexus";
import path from "path";
import * as types from "./kitchen-sink-definitions";

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, "../kitchen-sink-schema.graphql"),
    typegen: path.join(__dirname, "./kitchen-sink-typegen.ts"),
  },
  plugins: [
    authorizePlugin(),
    nullabilityGuardPlugin({
      shouldGuard: true,
      fallbackValues: {
        ID: () => "MISSING_ID",
        Int: () => -1,
        Date: () => new Date(0),
        Boolean: () => false,
        String: () => "",
      },
    }),
  ],
});

const server = new ApolloServer({
  schema,
});

const port = process.env.PORT || 4000;

server.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
