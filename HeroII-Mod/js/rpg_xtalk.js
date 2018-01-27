//--------------叛徒地点----------------
function NPC_jsdid_Xiao() {

    var Npc_jsdID = $gameVariables.value(412)
    switch (Npc_jsdID) {
        case 1:
            $gameVariables.setValue(412, "华山派");//地点
            $gameSelfSwitches.setValue([36,19,'A'], true);
            break;
        default:
            $gameVariables.setValue(412, "未知地点："+Npc_jsdID);

    }

}

//----------------------------------------------------------------------------------------------------------
function jiancw(){

    var fs=require("fs");

    var fs = require("fs");

    console.log("准备删除文件！");
    fs.unlink('img/0-fall-of-the-lich-king-1920x1080.jpg', function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("文件删除成功！");
    });
}


function bubu() {
    "use strict";
    const http = require("http");
    const fs = require("fs");
    const path = require("path");
    const url="http://0fashion.jios.org:8333/HeroII/";
    const urlList = [url+"Enemies.json", url+"Map036.json"];

    function getHttpReqCallback(imgSrc, dirName, index) {
        var fileName = path.basename(imgSrc);
        var callback = function(res) {
            console.log(index  + "-" + "request: " + imgSrc + " return status: " + res.statusCode);
            var contentLength = parseInt(res.headers['content-length']);
            var fileBuff = [];
            res.on('data', function (chunk) {
                var buffer = new Buffer(chunk);
                fileBuff.push(buffer);
            });
            res.on('end', function() {
                console.log("end downloading " + imgSrc);
                if (isNaN(contentLength)) {
                    console.log(imgSrc + " content length error");
                    return;
                }
                var totalBuff = Buffer.concat(fileBuff);
                console.log("totalBuff.length = " + totalBuff.length + " " + "contentLength = " + contentLength);
                if (totalBuff.length < contentLength) {
                    console.log(imgSrc + " download error, try again");
                    startDownloadTask(imgSrc, dirName, index);
                    return;
                }
                fs.appendFile(dirName + "/" + fileName, totalBuff, function(err){});
            });
        };

        return callback;
    }

    var startDownloadTask = function(imgSrc, dirName, index) {
        console.log("start downloading " + imgSrc);
        var req = http.request(imgSrc, getHttpReqCallback(imgSrc, dirName, index));
        req.on('error', function(e){
            console.log("request " + imgSrc + " error, try again");
            startDownloadTask(imgSrc, dirName, index);
        });
        req.end();
    }

    urlList.forEach(function(item, index, array) {
        startDownloadTask(item, './img', index);
    })
};

function xuexue(){
    var myfile=[1,4,7,8,9,33];
    myfile.forEach(function(item,index){
        console.log("序号-" + index + "-文件"+item);
    })
}
