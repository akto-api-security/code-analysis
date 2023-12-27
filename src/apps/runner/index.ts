import {readFilesRecursively, readFileContents, writeToFile} from '../../libs/files/fileUtils';
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

function collateURLs() : Array<string> {
    let urlsArray : Array<string> = new Array()
    let map = DjangoFileParser.map

    let includedMap : Set<string> = new Set()
    map.forEach((value, key) => {
        let index = 0;
        while (index < value.length) {
            let urlMap = value[index]
            let url = urlMap.get('url')!
            let newEntryCreated = false;
            if (urlMap.has('include')) {
                let includedPath = urlMap.get('include')
                includedPath = includedPath?.replace(/[\.]/g, "/")
                let mapKeys = map.keys()
                for (const filePath of mapKeys) {
                    if (filePath.includes(includedPath!)) {
                        let includedURLs = map.get(filePath)
                        includedMap.add(filePath)
                        if (includedURLs !== undefined) {
                            for (const includedURLMap of includedURLs) {
                                let newURLMap = new Map<string, string>()
                                let includedURL = includedURLMap.get('url')
                                if (includedURL?.startsWith("r^")) {
                                    includedURL = includedURL?.replace("r^","");
                                }
                                newURLMap.set("url", url + includedURL!);
                                if (includedURLMap.has("include")) {
                                    newURLMap.set("include", includedURLMap.get("include")!);
                                }
                                value.push(newURLMap);
                                newEntryCreated = true;
                            }
                        }
                        break;
                    }
                }
                if (newEntryCreated) {
                    value.splice(index, 1);
                    index--;
                }
            }
            index++;
        }
    })

    map.forEach((value, key) => {
        if (!includedMap.has(key)) {
            for (const urlMap of value) {
                let url = urlMap.get("url");
                if (url?.startsWith("r^")) {
                    url = url.replace("r^","")
                }
                urlsArray.push(url!);
            }
        }
    })

    return urlsArray;
}


export async function extractAPIs(directory: string) {

    let projectDirectory : string = ''
    for (const args of process.argv) {
        if (args.startsWith('projectPath')) {
            projectDirectory = args.split('=')[1]
        }
    }
    if (projectDirectory.length !== 0) {
        directory = projectDirectory
    }
    console.log("Reading directory: ", directory)
    const files = readFilesRecursively(directory)
    for (const file of files) {
        // console.log(file);

        await readAndParseFile(file)
    }  

    

    let map = DjangoFileParser.map
    console.log(map)
    let urlsArray = collateURLs();
    console.log(urlsArray)

    let finalStringToWrite = ""
    for (const url of urlsArray) {
        finalStringToWrite += url + "\n"
    }
    let fileName = directory.substring(directory.lastIndexOf("/") + 1, directory.length) + ".txt"
    writeToFile(fileName, finalStringToWrite)

    return
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
extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/django-files")
// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/saleor")
// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/kipartman")
// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/django-shop")
// extractAPIs("/Users/shivamrawat/source-code-inventory/django-example-project/django-rest-swagger")
// extractAPIs("/Users/shivamrawat/source-code-inventory/spring-boot-tutorial-master")
// extractAPIs("/Users/shivamrawat/Downloads/code-analysis-feature-detect_language")