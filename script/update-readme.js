//config object
const config = {
    devMode: true,

    readmePath: "../readme.md",
    introductionPath: "./introduction.md",
    postDirPath: "../post/key",
    githubPostDirPath: "./post/key",

    regex: {
        number: /^[1-9]\d*.md$/
    },

    tableSectionTitle: "# 🏀 目录"
}

const fs = require("fs");

function readIntrduction() {
    return fs.readFileSync(config.introductionPath).toString();
}

function getMetaInfoByLine(line){
    const tokens = line.split(' ');
    let result = '';
    tokens.forEach((token, index) => { if(index > 0) {result += index === tokens.length - 1 ? token :` ${token }`;}});
    return result;
}

function getPostNames(){
    //read post dir
    let files = fs.readdirSync(config.postDirPath);

    //if filename does not match the regex number, remove it
    let postNames = []; 
    files.forEach((file) => { if(file.match(config.regex.number)) { postNames.push(file); } });

    //sort by number order
    postNames.sort((a, b) => {
        const numberA = parseInt(a.split('.')[0], 10);
        const numberB = parseInt(b.split('.')[0], 10);
        return numberB - numberA;
    })

    return postNames;
}

function getMetaInfos(postNames){
    let postMetaInfos = [];
    postNames.forEach((postName) => {
        //read file
        let content = fs.readFileSync(`${config.postDirPath}/${postName}`).toString();
        let lines = content.split('\n');

        //return meta info object
        return postMetaInfos.push({
            key: getMetaInfoByLine(lines[1]).replace('\r', ''),
            title: getMetaInfoByLine(lines[2]).replace('\r', ''),
            date: getMetaInfoByLine(lines[3]).replace('\r', ''),
            labels: getMetaInfoByLine(lines[4]).replace('\r', '').split(' ')
        })
    })

    return postMetaInfos;

}

function drawTables(metaInfos){
    let result = '';
    result += `${config.tableSectionTitle}\r\n`;
    result += '| 编号 | 标题 | 时间 | 链接 |\r\n';
    result += '| :- | :- | :- | :- |\r\n';
    metaInfos.forEach(metaInfo => {return result += `| ${metaInfo.key} | ${metaInfo.title} | ${metaInfo.date} | [传送门](${config.githubPostDirPath}/${metaInfo.key}.md) |\r\n`; });
    return result;
}

function mergeResult(introduction, tableSection){
    return `${introduction}\r\n\r\n` + `${tableSection}\r\n\r\n`;
}

function writeResultToReadmeFile(result){
    fs.writeFileSync(config.readmePath, result);
}

/**
 * main function
 */
(function(){
    let introduction = readIntrduction();
    let postNames = getPostNames();
    let metaInfos = getMetaInfos(postNames);
    let tableSection = drawTables(metaInfos);
    let result = mergeResult(introduction, tableSection);
    writeResultToReadmeFile(result);
})();