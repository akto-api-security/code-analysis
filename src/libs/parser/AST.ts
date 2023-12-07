import { Tree } from "web-tree-sitter"

export class AST {
    ast: Tree
    constructor(tree: Tree) {
        this.ast = tree
    }

    getRootNode() {
        return this.ast.rootNode;
    }

    getAstTree() {
        return this.ast;
    }

    getStr() {
        return this.ast.rootNode.toString()
    }
}