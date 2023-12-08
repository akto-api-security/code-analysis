import Parser from "web-tree-sitter";
import { JavaFileParser, ServerType } from "./FileParser";

export class StrutsFileParser extends JavaFileParser{
    constructor(filePath: string, fileContent: string, parser: Parser) {
        super(filePath, fileContent, parser)
    }

    getType(): ServerType {
        return ServerType.STRUTS
    }

    getSwagger(): string {
        return ''
    }
}