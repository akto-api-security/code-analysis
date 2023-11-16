import {readFilesRecursively, readFileContents} from '../../libs/files/fileUtils';
import {FileParser, ParserFactory, ServerType} from '../../libs/parser/FileParser'

async function parseFile(filePath: string, fileContent: string): Promise<FileParser> {
    const parser = await ParserFactory.createParser(filePath, fileContent)
    return parser
}

function readAndParseFile(filePath: string) {
    let parser: FileParser = null as any

    readFileContents(
        filePath, 
        async (content: string) => {
            parser = await parseFile(filePath, content)
            // console.log("parser type: " + parser.getType() + " for file " + filePath)
            
            if (parser.getType() != ServerType.UNKNOWN) {
                if (parser.filePath.endsWith("StoreApi.java")) {
                }
                parser.getSwagger()
                // console.log(parser.getAST().getStr())
            }
        },
        console.log
    )
}

export function extractAPIs(directory: string) {
    // console.log("Reading directory: ", directory)
    const files = readFilesRecursively(directory)
    for (const file of files) {
        // console.log(file);

        readAndParseFile(file)
    }      
}

extractAPIs("/Users/shivamrawat/source-code-inventory/spring-server-generated")
// extractAPIs("/Users/shivamrawat/Downloads/code-analysis-feature-detect_language")