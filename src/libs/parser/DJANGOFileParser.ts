import Parser from "web-tree-sitter";
import { AST } from "./AST";
import { FileParser, ServerType } from "./FileParser";

export class DJANGOFileParser extends FileParser {
    parser: Parser
    constructor(filePath: string, fileContent: string, parser: Parser) {
        super(filePath, fileContent)
        this.parser = parser
    }

    getAST(): AST {
        return new AST(this.parser.parse(this.fileContent))
    }

    getType(): ServerType {
        return ServerType.DJANGO
    }

    getSwagger(): string {
        let ast  = this.getAST().getAstTree()
        ast.walk()
        return ''
    }
}