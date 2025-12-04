import type { NextConfig } from "next";

// Dedupe Lexical packages by forcing Turbopack/Webpack to transpile
// from the root node_modules copy. Avoid resolveAlias because Lexical
// does not export the package root (caused dev failure).
const lexicalPkgs = [
  "lexical",
  "@lexical/react",
  "@lexical/list",
  "@lexical/rich-text",
  "@lexical/utils",
  "@lexical/selection",
  "@lexical/code",
  "@lexical/link",
  "@lexical/markdown",
  "@lexical/table",
];

const nextConfig: NextConfig = {
  transpilePackages: lexicalPkgs,
};

export default nextConfig;
