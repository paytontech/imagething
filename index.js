import * as fs from 'fs'
import os from 'os'
import http from 'http'
import exp from 'express'
const app = exp()
main()
const imgRegex = new RegExp('\\.(jpg|jpeg|png|gif|bmp|svg)$', 'i');
const fileRegex = new RegExp('.+\\..+$');

async function main() {
    if (!fs.existsSync('./db.json')) {
        const data = []
        fs.writeFileSync('db.json', JSON.stringify(data))
    }
    fireUpHTTP()
    //windows directories
    const wDirs = ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos']
    //unix directories (accidentally the same!)
    const uDirs = ['Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos']
    // parseFiles(`${os.homedir()}/Downloads`)
    for (let dir of wDirs) {
        console.log(dir)
        parseFiles(`${os.homedir()}/${dir}`, dir)
    }
}

function fireUpHTTP() {
    app.get('/restore', (req, res) => {
        restore()
        res.send('restoring now. :/')
    })
    const server = app.listen(6342, () => {
        
    })
    console.log(server.address())
}

function replace(path, fileName, dir) {
    
    const data = JSON.parse(fs.readFileSync('./db.json').toString())
    for (var file2 of data) {
        if (file2.original == path || file2.currentPath == path) {
            return;
        }
    }
        const backup = fs.readFileSync(path)
    fs.mkdir(`${os.homedir()}/yourimages/${dir}`, {recursive: true}, (err) => {
        console.log(err)
    })
    
    fs.writeFileSync(`${os.homedir()}/yourimages/${dir}/${fileName}`, backup)
    pushToDB(fileName, path, `${os.homedir()}/yourimages/${dir}/${fileName}`)
    const file = fs.readFileSync('./img.jpg')
    fs.writeFileSync(path, file, (err) => {
        console.log(err)
    })
}

function pushToDB(fileName, origPath, currentPath) {
    const data = JSON.parse(fs.readFileSync('./db.json').toString())
    data.push({
        name: fileName,
        original: origPath,
        currentPath: currentPath
    })
    fs.writeFileSync('db.json', JSON.stringify(data))
}

function restore() {
    const data = JSON.parse(fs.readFileSync('./db.json').toString())
    for (let entry of data) {
        let fileName = entry.name
        let originalPath = entry.original
        let currentPath = entry.currentPath
        console.log(currentPath)
        let image = fs.readFileSync(currentPath)
        fs.writeFileSync(originalPath, image)
    }
}

async function parseFiles(path, dir) {
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
        for (let file of filesParsed) { replace(`${path}/${file}`, file, dir) }
        for (let file of files) {
            const fspath = `${path}/${file}`
            var isFile = false
            fs.lstat(fspath, (er2, stats) => {
                if (stats.isDirectory()) {
                    parseFiles(`${path}/${file}`, dir)
                }
            })
        }
    })

}