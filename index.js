import * as fs from 'fs'
import os from 'os'
main()
const imgRegex = new RegExp('\\.(jpg|jpeg|png|gif|bmp|svg)$', 'i');
const fileRegex = new RegExp('.+\\..+$');

async function main() {
    let dirs = ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos']
    // parseFiles(`${os.homedir()}\\Downloads`)
    for (let dir of dirs) {
        parseFiles(`${os.homedir()}\\${dir}`)
    }
}

function replace(path) {
    console.log(path)
}

async function parseFiles(path) {
    await fs.readdir(path, (err, files) => {
        if (err != null) {
            console.error(err)
            return
        }
        let filesParsed = []
        for (let file of files) {
            if (imgRegex.test(file)) {
                filesParsed.push(file)
            }
        }
        for (let file of filesParsed) { replace(`${path}/${file}`) }
        for (let file of files) {
            const fspath = `${path}/${file}`
            var isFile = false
            fs.lstat(fspath, (er2, stats) => {
                if (stats.isDirectory()) {
                    parseFiles(`${path}/${file}`)
                }
            })
        }
    })

}