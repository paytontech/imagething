import * as fs from 'fs'
main()
async function main() {
   const files = await readFilesInDirectory('https://sourceforge.net/projects/sshwindows/files/latest/download')

   console.log(await files)
}

async function readFilesInDirectory(path) {
    return await fs.readdir(path)
}