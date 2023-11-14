import Parser from "web-tree-sitter"
import path from "path"
import {getFileExtension} from "../files/fileUtils"
import { AST } from "./AST"

export enum ServerType {
    SPRING_BOOT,
    STRUTS,
    DJANGO,
    FLASK,
    EXPRESS,
    KOA,
    MUX,
    UNKNOWN
}

function unknownTypeErr(msg: string) {
    return new Error("unknown file type: " + msg)
}

export class FileParser {
    fileContent: string
    filePath: string

    constructor(filePath: string, fileContent: string) {
        this.filePath = filePath
        this.fileContent = fileContent
    }
    
    getType(): ServerType {
        throw unknownTypeErr(this.filePath)        
    }

    getAST(): AST {
        throw unknownTypeErr(this.filePath)
    }

    getSwagger(): string {
        throw unknownTypeErr(this.filePath)
    }
}

export class JavaFileParser extends FileParser {
    parser: Parser
    constructor(filePath: string, fileContent: string, parser: Parser) {
        super(filePath, fileContent)
        this.parser = parser
    }

    getAST(): AST {
        return new AST(this.parser.parse(this.fileContent))
    }
}

export class SpringBootFileParser extends JavaFileParser {
    constructor(filePath: string, fileContent: string, parser: Parser) {
        super(filePath, fileContent, parser)
    }

    getType(): ServerType {
        return ServerType.SPRING_BOOT
    }

    getSwagger(): string {
        let query = this.parser.getLanguage().query(`         (interface_declaration
            (modifiers
              (annotation
                name: (identifier) @name
                arguments: (annotation_argument_list
                             (element_value_pair
                               key: (identifier) @key
                               value: (string_literal) @value)) @annotation_argument_list ))
              name: (identifier) 
            ) 

            (method_declaration
                (modifiers
                (annotation
                    name: (identifier) @name
                    arguments: (annotation_argument_list
                                (element_value_pair
                                key: (identifier) @key
                                value: (string_literal) @value)) @annotation_argument_list ))
                name: (identifier) 
                ) 
      `);

      let matches = query.matches(this.getAST().getRootNode());

      let interface_endpoint = "";
    //   console.log(JSON.stringify(matches))
      for (const match of matches) {
        const annotationNameNode = match.captures[0].node;
        const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
        console.log("Annotation Type:", annotationName);
        if(annotationName.endsWith("Mapping")) {
            const annotation_argument_list = match.captures[1].node
            const string_literal_name = this.fileContent.slice(annotation_argument_list.startIndex, annotation_argument_list.endIndex)
            console.log("annotation_argument_list: ", string_literal_name, this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex), 
            this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex))
            interface_endpoint = this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex);
        }
    }

        query = this.parser.getLanguage().query(`         (method_declaration
            (modifiers
            (annotation
                name: (identifier) @name
                arguments: (annotation_argument_list
                            (element_value_pair
                            key: (identifier) @key
                            value: (string_literal) @value)) @annotation_argument_list ))
            name: (identifier) 
            ) 
    `);

    matches = query.matches(this.getAST().getRootNode());

    //   console.log(JSON.stringify(matches))
    for (const match of matches) {
        const annotationNameNode = match.captures[0].node;
        const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
        console.log("Annotation Type:", annotationName);
        if(annotationName.endsWith("Mapping")) {
        const annotation_argument_list = match.captures[1].node
        const string_literal_name = this.fileContent.slice(annotation_argument_list.startIndex, annotation_argument_list.endIndex)
        console.log("annotation_argument_list: ", string_literal_name, this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex), 
        "\"" + (interface_endpoint + (this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex))).replace(/\"/g,"") +"\"" )
        }
    }
    return ''
    }
}

export class UnknownFileParser extends FileParser {
    constructor(filePath: string, fileContent: string) {
        super(filePath, fileContent)
    }

    getType(): ServerType {
        return ServerType.UNKNOWN
    }

}

export class ParserFactory {
    static async createParser(filePath: string, fileContent: string): Promise<FileParser> {
        const extn = getFileExtension(filePath)

        switch (extn.toLowerCase()) {
            case "java":
                return await Parser.init().then(async () => {
                  const parser = new Parser();
                  console.log(__dirname);
                  const Java = await Parser.Language.load(
                    path.resolve(__dirname, "tree-sitter-parsers/tree-sitter-java.wasm")
                  );
                  parser.setLanguage(Java);
                  return new SpringBootFileParser(filePath, fileContent, parser)
                })
            default:
                return new UnknownFileParser(filePath, fileContent)
                                
        }
    }
}