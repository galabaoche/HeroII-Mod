//公告------------------------------------------------------------------------------------------
function Xiao_Gst(){
    $.get(Jurl+Nurl+"Title", function (result) {$gameVariables.setValue(110,result)});
    $.get(Jurl+Nurl+"Contents", function (result) {$gameVariables.setValue(111,result)});
    $.get(Jurl+Nurl+"Remark", function (result) {$gameVariables.setValue(112,result)})}
//签到------------------------------------------------------------------------------------------
function Xiao_Ci(){$.get(Jurl+Nurl+"CheckIn", function (result) {SessionData.CheckIn=result})}
//更新------------------------------------------------------------------------------------------
function Xiao_IosUrl(){$.get(Jurl+Uurl+"PGII", function (resulti) {eval(resulti)})}
function Xiao_AndroidUrl(){$.get(Jurl+Uurl+"AZII", function (resulta) {eval(resulta)})}
//评论------------------------------------------------------------------------------------------
function Xiao_Iost(){$.get(Jurl+Uurl+"PGII", function (resulti) {eval(resulti)})}
function Xiao_Androidt(){$.get(Jurl+Uurl+"AZII", function (resulta) {eval(resulta)})}
//Inform------------------------------------------------------------------------------------------
function Xiao_Inform(){
    $.get(Jurl+Iurl+"IsEnable", function (result) {SessionData.InformIE=result});
    $.get(Jurl+Iurl+"Number", function (result) {SessionData.InformNB=result;});
    $.get(Jurl+Iurl+"Talk", function (result) {$gameVariables.setValue(114,result)});
    $.get(Jurl+Iurl+"Name", function (result) {SessionData.InformNA=result;});
    $.get(Jurl+Iurl+"Way", function (result) {
        switch (parseInt(result)) {
            case 1://英雄群侠传I的玩家收到消息
                SessionData.InformIG=false;
                SessionData.InformIP=false;
                break;
            case 2://英雄群侠传II的玩家收到消息
                SessionData.InformIG=true;
                SessionData.InformIP=false;
                break;
            case 3://所有玩家收到消息
                SessionData.InformIG=true;
                SessionData.InformIP=false;
                break;
            case 4://特定玩家收到消息和道具
                    if ($gameActors._data[1]._name == SessionData.InformNA) {
                        SessionData.InformIG=true;
                        SessionData.InformIP=true;
                    }else{
                        SessionData.InformIG=false;
                        SessionData.InformIP=false};
                break;
            case 5://英雄群侠传II的玩家收到消息和道具
                SessionData.InformIG=true;
                SessionData.InformIP=true;
                break;
            default:
                SessionData.InformIG=false;
                SessionData.InformIP=false}})
};
function Xiao_InformJS(){$.get(Jurl+Iurl+"Js", function (result) {eval(result)})}
//Welfare------------------------------------------------------------------------------------------
function Xiao_Welfare(){
    $.get(Jurl+Wurl+"IsEnable", function (result) {SessionData.WelfareIE=result});
    $.get(Jurl+Wurl+"Number", function (result) {SessionData.WelfareNB=result});
    $.get(Jurl+Wurl+"Name", function (result) {SessionData.WelfareNA=result});
    $.get(Jurl+Wurl+"IdenCode", function (result) {SessionData.WelfareIC=result});
    $.get(Jurl+Wurl+"Contents", function (result) {$gameVariables.setValue(266,result)})}
function Xiao_WelfareJS(){$.get(Jurl+Wurl+"Js", function (result) {eval(result);});}
//Festival------------------------------------------------------------------------------------------
function Xiao_Festival(){
    $.get(Jurl+Furl+"IsEnable", function (result) {SessionData.FestivalIE=result});
    $.get(Jurl+Furl+"Number", function (result) {SessionData.FestivalNB=result});
    $.get(Jurl+Furl+"IdenCode", function (result) {SessionData.FestivalIC=result});
    $.get(Jurl+Furl+"Contents", function (result) {$gameVariables.setValue(263,result)})}
function Xiao_FestivalJS(){$.get(Jurl+Furl+"Js", function (result) {eval(result)})}
//Festival------------------------------------------------------------------------------------------
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
