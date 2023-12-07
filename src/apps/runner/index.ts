import {readFilesRecursively, readFileContents} from '../../libs/files/fileUtils';
import {FileParser, ParserFactory, ServerType, DjangoFileParser} from '../../libs/parser/FileParser'

async function parseFile(filePath: string, fileContent: string): Promise<FileParser> {
    const parser = await ParserFactory.createParser(filePath, fileContent)
    return parser
}

async function readAndParseFile(filePath: string) {
    let parser: FileParser = null as any

    await readFileContents(
        filePath, 
        async (content: string) => {
            parser = await parseFile(filePath, content)
            // console.log("parser type: " + parser.getType() + " for file " + filePath)
            
            if (parser.getType() != ServerType.UNKNOWN) {
                parser.getSwagger()
            }
            if (parser.filePath.endsWith("/djangofiles/urls.py")) {
                // console.log("AST", parser.getAST().getStr())
                // console.log("method size :-", DjangoFileParser.map.size)
                // DjangoFileParser.map.forEach((value, key) => {
                //     console.log("key:- ", key)
                //     console.log("value:- ", value)
                // })
            }
            return
        },
        console.log
    )

}

function checkForInclude(map: Map<string, Array<Map<string, string>>>): boolean {
    map.forEach((value, key) => {
        value.forEach((urlMap) => {
            if (urlMap.has('include')) {
                return true;
            }
        })
    })
    return false;
}

export async function extractAPIs(directory: string) {
    // console.log("Reading directory: ", directory)
    const files = readFilesRecursively(directory)
    for (const file of files) {
        // console.log(file);

        await readAndParseFile(file)
    }  
    
    let urlsArray : Array<string> = new Array()

    let map = DjangoFileParser.map
    console.log(map)
    let mapKeys = map.keys()
    map.forEach((value, key) => {
        for (const urlMap of value) {
            let url = urlMap.get('url')!
            if (urlMap.has('include')) {
                let includedPath = urlMap.get('include')
                includedPath = includedPath?.replace(/[\.]/g, "/")
                for (const filePath of mapKeys) {
                    let removeExtension = filePath.replace(/\.py$/, "")
                    if (removeExtension.endsWith(includedPath!)) {
                        let includedURLs = map.get(filePath)
                        if (includedURLs !== undefined) {
                            for (const includedURLMap of includedURLs) {
                                let includedURL = includedURLMap.get('url')
                                urlsArray.push(url + includedURL)
                            }
                        }
                        break;
                    }
                }
            } else {
                urlsArray.push(url)
            }
        }
    })

    console.log(urlsArray)

    // console.log(map)

    // while(checkForInclude(map)) {
    //     for (let filePath of map.keys()) {
    //         let urlsArray = map.get(filePath);
    //         let include = false;
    //         let includedURL;
    //         urlsArray?.forEach((urlMap) => {
    //             if (urlMap.has('include')) {
    //                 include = true;
    //                 includedURL = urlMap;
    //             }
    //         })
    //     }
    // }

}


  

// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/truck_signs_api")
// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/django-files")
// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/saleor")
// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/kipartman")
extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/django-shop")
// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/django-rest-swagger")
// extractAPIs("/Users/shivamrawat/source-code-inventory/spring-boot-tutorial-master")
// extractAPIs("/Users/shivamrawat/Downloads/code-analysis-feature-detect_language")