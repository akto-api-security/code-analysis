import Parser, { SyntaxNode, TreeCursor } from "web-tree-sitter"
import path from "path"
import { getFileExtension } from "../files/fileUtils"
import { AST } from "./AST"
import { url } from "inspector"

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
        // console.log(this.filePath)

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
        `);

        let matches = query.matches(this.getAST().getRootNode());

        let interface_endpoint = "";
        //   console.log(JSON.stringify(matches))
        for (const match of matches) {
            const annotationNameNode = match.captures[0].node;
            const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
            // console.log("Annotation Type:", annotationName);
            if (annotationName.endsWith("Mapping")) {
                const annotation_argument_list = match.captures[1].node
                const string_literal_name = this.fileContent.slice(annotation_argument_list.startIndex, annotation_argument_list.endIndex)
                // console.log("annotation_argument_list: ", string_literal_name, this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex), 
                // this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex))
                interface_endpoint = this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex);
            }
        }

        query = this.parser.getLanguage().query(`         (interface_declaration
            (modifiers
            (annotation
                name: (identifier) @name
                arguments: (annotation_argument_list (string_literal) @value)  @annotation_argument_list ))
            name: (identifier) 
            ) 
        `);

        matches = query.matches(this.getAST().getRootNode());

        // console.log(this.filePath)
        for (const match of matches) {
            const annotationNameNode = match.captures[0].node;
            const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
            // console.log("Annotation Type:", annotationName);
            if (annotationName.endsWith("Mapping")) {
                // console.log("annotation_argument_list: ", string_literal_name, this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex), 
                // this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex))
                interface_endpoint = this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex);
            }
        }





        query = this.parser.getLanguage().query(`         (class_declaration
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

        // console.log(this.filePath)
        for (const match of matches) {
            const annotationNameNode = match.captures[0].node;
            const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
            // console.log("Annotation Type:", annotationName);
            if (annotationName.endsWith("Mapping")) {
                // console.log("annotation_argument_list: ", string_literal_name, this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex), 
                // this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex))
                interface_endpoint = this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex);
            }
        }

        query = this.parser.getLanguage().query(`         (class_declaration
            (modifiers
            (annotation
                name: (identifier) @name
                arguments: (annotation_argument_list (string_literal) @value)  @annotation_argument_list ))
            name: (identifier) 
            ) 
        `);

        matches = query.matches(this.getAST().getRootNode());

        for (const match of matches) {
            const annotationNameNode = match.captures[0].node;
            const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
            // console.log("Annotation Type:", annotationName);
            if (annotationName.endsWith("Mapping")) {
                // console.log("annotation_argument_list: ", string_literal_name, this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex), 
                // this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex))
                interface_endpoint = this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex);
            }
        }

        query = this.parser.getLanguage().query(`         (method_declaration
            (modifiers
            (annotation
                name: (identifier) @name
                arguments: (annotation_argument_list
                    
                    (element_value_pair
                        key: (identifier) @key
                        value: (element_value_array_initializer) @value))
                            @annotation_argument_list ))
            name: (identifier) 
            ) 
        `);

        matches = query.matches(this.getAST().getRootNode());
        //   console.log(JSON.stringify(matches))
        for (const match of matches) {
            const annotationNameNode = match.captures[0].node;
            const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
            if (annotationName.endsWith("Mapping")) {
                const annotation_argument_list = match.captures[1].node
                const string_literal_name = this.fileContent.slice(annotation_argument_list.startIndex, annotation_argument_list.endIndex)
                let value = this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex);
                let methodURL = this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex);
                let method = ""
                if (value !== "value") {
                    continue;
                }
                // console.log("Annotation Type:", annotationName);
                // console.log("annotation_argument_list: ", string_literal_name)

                if (annotationName === "RequestMapping") {
                    let annotationArray = string_literal_name.split(",")
                    for (let index in annotationArray) {
                        if (annotationArray[index].trim().startsWith("method")) {
                            method = annotationArray[index].trim();
                            method = method.split("=")[1]
                            method = method.trim()
                            method = method.replace(")", "")
                            method = method.replace("RequestMethod.", "")
                        }
                    }
                } else {
                    method = method.replace("Mapping", "")
                }

                if (method === "") {
                    method = "ALL"
                }

                let url = ""
                if (methodURL.startsWith("{")) {//multiple url case
                    methodURL = methodURL.replace("{", "");
                    methodURL = methodURL.replace("}", "");
                    let methodURLs = methodURL.split(",");
                    for (let urlIndex in methodURLs) {

                        url = "\"" + (interface_endpoint + methodURLs[urlIndex].trim()).replace(/\"/g, "") + "\"";
                    }
                } else {
                    url = "\"" + (interface_endpoint + methodURL).replace(/\"/g, "") + "\"";
                }
                // console.log(value);
                console.log(method, " ", url.replace(/\"/g, ""))
            }
        }
        query = this.parser.getLanguage().query(`         (method_declaration
                (modifiers
                (annotation
                    name: (identifier) @name
                    arguments: (annotation_argument_list
                        
                        (element_value_pair
                            key: (identifier) @key
                            value: (string_literal) @value))
                                @annotation_argument_list ))
                name: (identifier) 
                ) 
        `);

        matches = query.matches(this.getAST().getRootNode());
        //   console.log(JSON.stringify(matches))
        for (const match of matches) {
            const annotationNameNode = match.captures[0].node;
            const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
            if (annotationName.endsWith("Mapping")) {
                const annotation_argument_list = match.captures[1].node
                const string_literal_name = this.fileContent.slice(annotation_argument_list.startIndex, annotation_argument_list.endIndex)
                let value = this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex);
                let methodURL = this.fileContent.slice(match.captures[3].node.startIndex, match.captures[3].node.endIndex);
                let method = ""
                if (value !== "value") {
                    continue;
                }
                // console.log("Annotation Type:", annotationName);
                // console.log("annotation_argument_list: ", string_literal_name)

                if (annotationName === "RequestMapping") {
                    let annotationArray = string_literal_name.split(",")
                    for (let index in annotationArray) {
                        if (annotationArray[index].trim().startsWith("method")) {
                            method = annotationArray[index].trim();
                            method = method.split("=")[1]
                            method = method.trim()
                            method = method.replace(")", "")
                            method = method.replace("RequestMethod.", "")
                        }
                    }
                } else {
                    method = annotationName.replace("Mapping", "")
                }
                if (method === "") {
                    method = "ALL"
                }
                let url = ""
                if (methodURL.startsWith("{")) {//multiple url case
                    methodURL = methodURL.replace("{", "");
                    methodURL = methodURL.replace("}", "");
                    let methodURLs = methodURL.split(",");
                    for (let urlIndex in methodURLs) {
                        url = "\"" + (interface_endpoint + methodURLs[urlIndex].trim()).replace(/\"/g, "") + "\"";
                        // console.log(value);
                        // console.log("METHOD:-", method)
                        // console.log("URL : - ", url);
                    }
                } else {
                    url = "\"" + (interface_endpoint + methodURL).replace(/\"/g, "") + "\"";
                }

                // console.log(value);
                console.log(method, " ", url.replace(/\"/g, ""))

            }
        }


        query = this.parser.getLanguage().query(`         (method_declaration
            (modifiers
            (annotation
                name: (identifier) @name
                arguments: (annotation_argument_list (string_literal) @value)  @annotation_argument_list ))
            name: (identifier) 
            ) 
        `);

        matches = query.matches(this.getAST().getRootNode());
        // console.log(JSON.stringify(matches))
        for (const match of matches) {
            const annotationNameNode = match.captures[0].node;
            const annotationName = this.fileContent.slice(annotationNameNode.startIndex, annotationNameNode.endIndex);
            if (annotationName.endsWith("Mapping")) {
                const annotation_argument_list = match.captures[1].node
                const string_literal_name = this.fileContent.slice(annotation_argument_list.startIndex, annotation_argument_list.endIndex)
                let methodURL = this.fileContent.slice(match.captures[2].node.startIndex, match.captures[2].node.endIndex);
                let method = ""
                // console.log("Annotation Type:", annotationName);
                // console.log("annotation_argument_list: ", string_literal_name)

                if (annotationName === "RequestMapping") {
                    let annotationArray = string_literal_name.split(",")
                    for (let index in annotationArray) {
                        if (annotationArray[index].trim().startsWith("method")) {
                            method = annotationArray[index].trim();
                            method = method.split("=")[1]
                            method = method.trim()
                            method = method.replace(")", "")
                            method = method.replace("RequestMethod.", "")
                        }
                    }
                } else {
                    method = annotationName.replace("Mapping", "")
                }
                if (method === "") {
                    method = "ALL"
                }
                let url = ""
                if (methodURL.startsWith("{")) {//multiple url case
                    methodURL = methodURL.replace("{", "");
                    methodURL = methodURL.replace("}", "");
                    let methodURLs = methodURL.split(",");
                    for (let urlIndex in methodURLs) {
                        url = "\"" + (interface_endpoint + methodURLs[urlIndex].trim()).replace(/\"/g, "") + "\"";
                        // console.log(value);
                        // console.log("METHOD:-", method)
                        // console.log("URL : - ", url);
                    }
                } else {
                    url = "\"" + (interface_endpoint + methodURL).replace(/\"/g, "") + "\"";
                }

                // console.log(value);
                console.log(method, " ", url.replace(/\"/g, ""))

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

export class DjangoFileParser extends FileParser {
    static map: Map<string, Array<Map<string, string>>> = new Map();
    parser: Parser
    expressionArray: Array<Map<string, string | undefined>> = new Array();
    concatenation : Array<Map<string, string| undefined>> = new Array();
    constructor(filePath: string, fileContent: string, parser: Parser) {
        super(filePath, fileContent)
        this.parser = parser
    }

    getType(): ServerType {
        return ServerType.DJANGO
    }

    getAST(): AST {
        return new AST(this.parser.parse(this.fileContent))
    }

    getExpressionMap(rootNode: SyntaxNode | null, identifier: string = '', path: string | undefined = '', doConcatenation: boolean = false) {

        if (rootNode == null) {
            return
        }
        if (rootNode.type === 'assignment') {
            if (rootNode.firstNamedChild?.type === 'identifier') {
                identifier = rootNode.firstNamedChild.text;
            }
        }

        // if (rootNode.type === 'binary_operator') {
        //     console.log("binary_operator text: ", rootNode.child(1)?.text)
        //     console.log("binary_operator type: ", rootNode.child(1)?.type)
        // }
        if (rootNode.type === 'binary_operator' && rootNode.child(1)?.type === '+') {//do concatenation
            doConcatenation = true;
        }

        if (rootNode.parent?.type === 'binary_operator' && (rootNode.previousSibling?.type === '+' || rootNode.nextSibling?.type === '+') && rootNode.type === 'identifier') {
            if (doConcatenation) {
                let map : Map<string, string | undefined> = new Map();
                map.set(identifier, "IDENTIFIER:" + rootNode.text)
                this.concatenation.push(map);
            }
        }

        if (rootNode.parent?.type === 'call' && ['path', 'url','re_path'].includes(rootNode?.previousNamedSibling?.text!)) {
            let map : Map<string, string | undefined> = new Map();
            path += rootNode.child(1)?.text.replace(/['"]/g,"");
            
            if (!rootNode.child(3)?.text.startsWith("include") ) {
                if (doConcatenation) {
                    map.set(identifier, "PATH:" + path);
                    this.concatenation.push(map);
                } else {
                    map.set(identifier, path);
                    this.expressionArray.push(map);
                }
            }
        }

        if (rootNode.parent?.type === 'call' && ['include'].includes(rootNode?.previousNamedSibling?.text!)) {

            let map : Map<string, string | undefined> = new Map();
            // console.log("includes:", rootNode?.child(1)?.type)
            
            if ( ['string', 'attribute', 'identifier'].includes(rootNode?.child(1)?.type!)) {//case of including from another file
                let includes : string | undefined = path + ":" + rootNode?.child(1)?.type.toUpperCase() + ":" + rootNode?.child(1)?.text
                map.set(identifier, includes);
                if (doConcatenation) {
                    map.set(identifier, "PATH:" + includes)
                    this.concatenation.push(map)
                } else {
                    this.expressionArray.push(map);
                }
            } 
        }

        // if (rootNode !== null && rootNode.type === 'assignment') {
        //     if (rootNode.firstNamedChild?.type === 'identifier') {
        //         let localMap : Map<string, SyntaxNode | null> = new Map();
        //         localMap.set(rootNode.firstNamedChild?.text, rootNode.child(2))
        //         this.expressionArray.push(localMap)
        //     }
        // }
        // if (rootNode?.children !== undefined) {
        //     let index = 0;
        //     for (const child of rootNode?.children) {
        //         console.log("index", index)
        //         console.log("type",child.type)
        //         console.log("text", child.text)
        //         index++
        //     }
        // }
        if (rootNode?.children !== undefined) {
            for (const child of rootNode?.children) {
                this.getExpressionMap(child, identifier,path, doConcatenation)
            }
        }
    }

    findURLPatternsNode(rootNode: SyntaxNode, find: Map<string, SyntaxNode>) {
        for (let node in rootNode.children) {
            this.findURLPatternsNode(rootNode.children[node], find)
        }
        if (rootNode.text === "urlpatterns") {
            find.set("urlpatterns", rootNode);
        }
    }

    traverse({ rootNode }: { rootNode: SyntaxNode | null }) {
        if (rootNode === null) {
            return
        }
        console.log(rootNode.previousNamedSibling?.text)
        if ((rootNode.previousNamedSibling?.text === 'path' || rootNode.previousNamedSibling?.text === 'url' || rootNode.previousNamedSibling?.text === 're_path') && rootNode.parent?.type === 'call') {
            console.log("Parent Node text:- ", rootNode.text)
            console.log("Parent Node type:-", rootNode.type)
            console.log("Parent fileContent:- ",this.fileContent.slice(rootNode.startIndex, rootNode.endIndex))
            let urls = DjangoFileParser.map.get(this.filePath)
            if (urls === null || urls === undefined) {
                urls = new Array<Map<string, string>>();
            }
            let url = new Map<string, string>();
            urls.push(url);
            DjangoFileParser.map.set(this.filePath, urls)
            for (let node in rootNode.children) {
                if (rootNode.children[node].isNamed()) {
                    // console.log("url text:- ", rootNode.children[node].text)
                    if (node === '1') {
                        url.set("url",rootNode.children[node].text)
                    }
                    // console.log("node :", node)
                    // console.log("text :", rootNode.children[node].text)
                    if (node === '3' && rootNode.children[node].type === 'call' && rootNode.children[node].text.startsWith('include')) {//include function
                        let includeNode = rootNode.children[node];
                        includeNode = includeNode.children[1]
                        for (let childNode in includeNode.children) {
                            // console.log("node",childNode, "includes", includeNode.children[childNode].text)
                            if (childNode === '1') {
                                url.set("include",includeNode.children[childNode].text)
                            }
                        }
                    }
                    // console.log("Node type:-", rootNode.children[node].type)
                    // console.log("fileContent:- ",this.fileContent.slice(rootNode.children[node].startIndex, rootNode.children[node].endIndex))
                }
            }
        }
        for (let node in rootNode.children) {
            if (rootNode.children[node].isNamed()) {
                // console.log("Node text:- ", rootNode.children[node].text)
                // console.log("Node type:-", rootNode.children[node].type)
                // console.log("fileContent:- ",this.fileContent.slice(rootNode.children[node].startIndex, rootNode.children[node].endIndex))
                this.traverse({ rootNode: rootNode.children[node] })
            }
        }
    }

    getSwagger(): string {
        const extn = getFileExtension(this.filePath)
        // console.log(this.filePath)
        let ast = this.getAST()
        this.getExpressionMap(ast.getRootNode())


        let expressionsMap : Map<string, Array<string>> = new Map()

        for (const identifierMap of this.concatenation) {
            identifierMap.forEach((value, key) => {
                let pathArray : Array<string> | undefined = expressionsMap.get(key)
                if (pathArray === undefined) {
                    pathArray = new Array()
                }

                if (value?.startsWith('PATH:')) {
                    value = value.split('PATH:')[1]
                    if (!pathArray.includes(value)) {
                        pathArray.push(value)
                    }
                }
                expressionsMap.set(key, pathArray)
            })
        }

        for (const identifierMap of this.expressionArray) {
            identifierMap.forEach((value, key) => {
                let pathArray : Array<string> | undefined = expressionsMap.get(key)
                if (pathArray === undefined) {
                    pathArray = new Array()
                }

                if (value === undefined) {
                    return
                }

                if (!pathArray.includes(value)) {
                    pathArray.push(value)
                }
                expressionsMap.set(key, pathArray)
            })
        }

        for (const identifierMap of this.concatenation) {
            identifierMap.forEach((value, key) => {
                let pathArray : Array<string> | undefined = expressionsMap.get(key)
                if (pathArray === undefined) {
                    pathArray = new Array()
                }

                if (value?.startsWith('IDENTIFIER:')) {
                    value = value.slice('IDENTIFIER:'.length)
                    let identifierPathArray = expressionsMap.get(value)
                    if (value !== key && identifierPathArray !== undefined) {
                        for (const path of identifierPathArray) {
                            if (!pathArray.includes(path)) {
                                pathArray.push(path)
                            }
                        }
                    }
                }
                expressionsMap.set(key, pathArray)
            })
        }

        expressionsMap.forEach((value, key) => {
            let newPathArray : Array<string> = new Array()
            for (const path of value) {
                if (path.includes(":IDENTIFIER:")) {
                    let pathArray = path.split(":IDENTIFIER:")
                    let identifier = pathArray[1]
                    if (identifier !== key) {
                        let identifierPathArray =  expressionsMap.get(identifier)
                        if (identifierPathArray !== undefined) {
                            for (const identifierPath of identifierPathArray) {
                                let finalPath = pathArray[0] + identifierPath
                                if (!newPathArray.includes(finalPath)) {
                                    newPathArray.push(finalPath)
                                }
                            }
                        }
                    }
                } else {
                    newPathArray.push(path)
                }
            }

            value.splice(0)
            value.push(...newPathArray)
        })

        if (expressionsMap.has("urlpatterns")) {
            let urlPatternsPath = expressionsMap.get("urlpatterns")
            let arrayOfPath : Array<Map<string,string>> = new Array()
            if (urlPatternsPath === undefined) {
                return ''
            }
            for (const path of urlPatternsPath) {
                let newMap : Map<string, string> = new Map()
                if (path.includes(":STRING:")) {
                    let pathArray = path.split(":STRING:")
                    let includePath = (pathArray.length > 1 ? pathArray[1] :  pathArray[0]).replace(/['"']/g,"")
                    newMap.set("url", pathArray.length > 1 ? pathArray[0] : "")
                    newMap.set("include", includePath)
                } else {
                    newMap.set("url", path)
                }
                arrayOfPath.push(newMap)
            }
            DjangoFileParser.map.set(this.filePath, arrayOfPath)
        }


        // let urlPatternsNode: Map<string, SyntaxNode> = new Map();
        // if ('py' === extn) {
        //     this.findURLPatternsNode(ast.getRootNode(), urlPatternsNode)
        // }

        // // console.log(urlPatternsNode.has("urlpatterns"))
        
        // if (urlPatternsNode.has("urlpatterns")) {
        //     let urlpatterns: SyntaxNode | undefined = urlPatternsNode.get("urlpatterns");
        //     if (urlpatterns !== undefined) {
        //         let sibling = urlpatterns.nextNamedSibling;
        //         console.log(sibling)
        //         console.log(urlpatterns)
        //         this.traverse({ rootNode: sibling })
        //     }
        // }
        // // console.log(ast.getStr())
        return ''
    }

}


export class ParserFactory {
    static async createParser(filePath: string, fileContent: string): Promise<FileParser> {
        const extn = getFileExtension(filePath)
        switch (extn.toLowerCase()) {

            case "java":
                return await Parser.init().then(async () => {
                    const parser = new Parser();
                    //   console.log(__dirname);
                    const Java = await Parser.Language.load(
                        path.resolve(__dirname, "tree-sitter-parsers/tree-sitter-java.wasm")
                    );
                    parser.setLanguage(Java);
                    return new SpringBootFileParser(filePath, fileContent, parser)
                })
            case "py":
                return await Parser.init().then(async () => {
                    const parser = new Parser();
                    //   console.log(__dirname);
                    const Python = await Parser.Language.load(
                        path.resolve(__dirname, "tree-sitter-parsers/tree-sitter-python.wasm")
                    );
                    parser.setLanguage(Python);
                    return new DjangoFileParser(filePath, fileContent, parser)
                })
            default:
                return new UnknownFileParser(filePath, fileContent)

        }
    }
}