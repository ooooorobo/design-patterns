const fs = require('fs')
const path = require('path')

const types = ['behavioral', 'creational', 'structural']

const authorToId = {
    '조예진': 'ooooorobo',
    'Paul An': 'anpaul0615',
    'paulan': 'anpaul0615',
    'pshdev1030': 'pshdev1030',
}
const authorToName = {
    '조예진': '조예진',
    'Paul An': '안바울',
    'paulan': '안바울',
    'pshdev1030': '박성현',
}
const typeToName = {
    'behavioral': '행동 패턴',
    'creational': '생성 패턴',
    'structural': '구조 패턴',
}

const readFromDirectory = async (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) reject(err)
            resolve(files)
        })
    })
}

const readFile = async (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(dirPath, (err, file) => {
            if (err) reject(err)
            resolve(file)
        })
    })
}
const writeFile = async (dirPath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(dirPath, data, (err, file) => {
            if (err) reject(err)
            resolve(file)
        })
    })
}

const isFile = async (filenameWithPath) => {
    return new Promise((resolve, reject) => {
        fs.stat(filenameWithPath, (err, stats) => {
            if (err) reject(err)
            resolve(stats.isFile())
        })
    })
}

const getAllFilePath = async (basePath) => {
    const dirPath = path.join(process.cwd(), basePath)
    const names = (await readFromDirectory(dirPath)).map(name => ['', name])
    const filePaths = []
    for (const [dir, name] of names) {
        const joined = path.join(dirPath, dir, name)
        if (await isFile(joined)) {
            filePaths.push([dir, name].join('/'))
        } else {
            names
                .push(
                    ...(await readFromDirectory(joined))
                        .map((foundName) => [[dir, name].join('/'), foundName])
                )
        }
    }
    return filePaths
}

const replaceWriting = (fileContents, toReplaced) => {
    return fileContents.replace(/(<!-- toc starts -->)(.|\n)*(<!-- toc ends -->)/, toReplaced)
}

const parseFrontMatter = (contents) => {
    const meta = {}
    const lines = contents.match(/---([\s\S]*?)---/)?.[0].split('\n')
    for (const line of lines) {
        if (line.startsWith('---')) continue;
        const colonPos = line.indexOf(':');
        const key = line.slice(0, colonPos), value = line.slice(colonPos + 1).trim()
        meta[key] = key === 'date' ? new Date(value) : value;
    }
    return meta
}


(async () => {
    const metaList = [];

    for (const type of types) {
        const paths = (await getAllFilePath(type)).filter(x => x.includes('.md'));
        for (const pathName of paths) {
            const contents = (await readFile(`${type}${pathName}`)).toString()
            metaList.push({...parseFrontMatter(contents), path: `./${type}${pathName}`});
        }
    }

    const header = '| Title | Author | Date |\n| ----------- | ----- | ---- |\n'
    const toc = types.map(type =>
        `\n\n### ${typeToName[type]}\n` +
        header +
        metaList
            .filter(x => x.type === type)
            .sort((a, b) => a.date - b.date)
            .map(x => `|[${x.title}](${x.path})|[${authorToName[x.author]}](https://github.com/${authorToId[x.author]})|${x.date.toLocaleDateString('ko')}|`)
            .join('\n')
    );

    const readme = (await readFile(path.join(process.cwd(), 'README_TEMPLATE.md'))).toString()
    await writeFile(path.join(process.cwd(), 'README.md'), replaceWriting(readme, toc))
})()
