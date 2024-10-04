import * as csstree from "css-tree";

export function findCssPropValue(cssCode: string, cssProp: string): string {
  const ast = csstree.parse(cssCode);
  const result = csstree.find(ast, (node) => {
    return (
      node.type === "Declaration" && node.property === "--button-background"
    );
  });

  if (result.type === "Declaration" && result.value.type === "Raw") {
    return result.value.value.trim();
  }

  return null;
}
