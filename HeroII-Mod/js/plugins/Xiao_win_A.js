 /*:
* @plugindesc 萧遥小熊的综合内容放在这个地方.
* @author 萧遥小熊
*
*
* @help

  No
*/
/*-------------------------------获取臂力------------------------------------------*/
function Xiao_Gmat(){$gameVariables.setValue(37,$gameActors.actor($gameVariables.value(62)).mat);}
/*-------------------------------获取根骨------------------------------------------*/
function Xiao_Gmdf(){$gameVariables.setValue(38,$gameActors.actor($gameVariables.value(62)).mdf);}
/*-------------------------------获取敏捷------------------------------------------*/
function Xiao_Gagi(){$gameVariables.setValue(39,$gameActors.actor($gameVariables.value(62)).agi);}
/*-------------------------------获取悟性------------------------------------------*/
function Xiao_Gluk(){$gameVariables.setValue(40,$gameActors.actor($gameVariables.value(62)).luk);}
/*-------------------------------获取当前生命------------------------------------------*/
function Xiao_Ghp(){$gameVariables.setValue(33,$gameActors.actor($gameVariables.value(62)).hp);}
/*-------------------------------获取最大生命------------------------------------------*/
function Xiao_Gmhp(){$gameVariables.setValue(34,$gameActors.actor($gameVariables.value(62)).mhp);}
/*-------------------------------获取当前内力------------------------------------------*/
function Xiao_Gmp(){$gameVariables.setValue(35,$gameActors.actor($gameVariables.value(62)).mp);}
/*-------------------------------获取最大内力------------------------------------------*/
function Xiao_Gmmp(){$gameVariables.setValue(36,$gameActors.actor($gameVariables.value(62)).mmp);}


/*-------------------------------修改装备位置------------------------------------------*/

Window_EquipSlot.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    switch(index)
    {
        case 0:
            rect.x = 243; rect.y = 54; break;//手
        case 1:
            rect.x = 395; rect.y = 0; break;//头
        case 2:
            rect.x = 433; rect.y = 101; break;//身
        case 3:
            rect.x = 315; rect.y = 156; break;//脚
        case 4:
            rect.x = 58; rect.y = 69; break;//饰
    }
    rect.width = 40;
    rect.height = 40;
    return rect;
};

/*-------------------------------去掉敌人编号------------------------------------------*/

Game_Enemy.prototype.name = function() {return this.originalName()}

/*-------------------------------物品技能彩色------------------------------------------*/
Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    var sub_str = String(text).match(/\\c\[(\d+)\]/i);
    if (sub_str)
    {
        this.contents.textColor = this.textColor(Number(sub_str[1]));
        text = text.replace(/\\c\[(\d+)\]/ig,'');
        this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
        this.resetTextColor();
    }
    else
        this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};
/*-------------------------------套装属性装备------------------------------------------*/
/*
 * 套装的效果等同于额外装备了一件武器，要增加的属性就设定在该武器内；
 * 目前只支持基础属性的增加。
 * 在装备（武器、防具）备注栏里填入<Suit:套装序号,1,2件套对应武器编号,3件套,4件套……>
 * 例：<Suit:1,1,5,5,6>;
 * 套装序号从1开始，不同套装序号不同；序号后的“1”是固定值，别改，就是“1”；
 * 例如，2件套对应武器编号填了“5”，那么满足2件效果就会增加编号5武器的相应属性；
 * 3件套如果还是填的“5”，则等同于三件套无效果；
 * 如果4件套填了“6”，那么满足4件套效果会增加编号6武器的相应属性，之前2件套的效果会取消，
 * 所以设定编号“6”武器的属性的时候，一定要把之前编号“5”的武器的相关属性也算进去。
 *
 */
(function() {
    Game_Actor.prototype.param = function(paramId) {
        var value = this.paramBase(paramId) + this.paramPlus(paramId) + this.paramSuit(paramId);
        value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
        var maxValue = this.paramMax(paramId);
        var minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    };

    Game_Actor.prototype.paramSuit = function(paramId) {
        var value = 0;
        var suits = new Array();
        var equips = this.equips();
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item && item.meta.Suit) {
                var tempSuit = item.meta.Suit.split(",");
                var suitIndex = Number(tempSuit[0]);
                if (suits[suitIndex]) {
                    suits[suitIndex][1] += 1;
                } else {
                    suits[suitIndex] = tempSuit;
                    var suitNum = Number(suits[suitIndex][1]);
                    suits[suitIndex][1] = suitNum;
                }
            }
        }
        var currentSuits = suits;
        for (var j = 0; j < currentSuits.length; j++) {
            if (currentSuits[j] && Number(currentSuits[j][1]) > 1 ) {
                var indexSuit = Number(currentSuits[j][1]);
                var indexParam = Number(currentSuits[j][indexSuit]);
                value += $dataWeapons[indexParam].params[paramId];
            }
        }
        return value;
    }
}());

 /*-------------------------------修复动画镜像旋转错误------------------------------------------*/

 var Imported = Imported || {};
 Imported.Kien_MirrorAnimationFix = true;

 var Kien = Kien || {};
 Kien.MirroredAnimation = {};

 Kien.MirroredAnimation.Sprite_Animation_setup = Sprite_Animation.prototype.setup;
 Sprite_Animation.prototype.setup = function(target, animation, mirror, delay) {
     Kien.MirroredAnimation.Sprite_Animation_setup.apply(this,arguments);
     if (this._animation && this._mirror){
         this.scale.x = -1;
     }
 };

 Sprite_Animation.prototype.updateCellSprite = function(sprite, cell) {
     var pattern = cell[0];
     if (pattern >= 0) {
         var sx = pattern % 5 * 192;
         var sy = Math.floor(pattern % 100 / 5) * 192;
         var mirror = this._mirror;
         sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
         sprite.setFrame(sx, sy, 192, 192);
         sprite.x = cell[1];
         sprite.y = cell[2];
         sprite.rotation = cell[4] * Math.PI / 180;
         sprite.scale.x = cell[3] / 100;
         if (cell[5]) {
             sprite.scale.x *= -1;
         }
         sprite.scale.y = cell[3] / 100;
         sprite.opacity = cell[6];
         sprite.blendMode = cell[7];
         sprite.visible = this._target.visible;
     } else {
         sprite.visible = false;
     }
 };
//----------------------------------------------------------------------------------------------------------
 function Xiao_Saveme(){for (var i=1;i<=3;i++) {Scene_File.prototype.onSavefileOk.call(this);$gameSystem.onBeforeSave();DataManager.saveGame(i)}LocalData.Finderror=500}
 function pyone(){$gameVariables.setValue(550,parseInt($gameVariables.value(550)+1));$gameVariables.setValue(551,parseInt($gameVariables.value(551)+1))}
 function pytwo(){$gameVariables.setValue(550,parseInt($gameVariables.value(550)+2));$gameVariables.setValue(551,parseInt($gameVariables.value(551)+1))}
 function puone(){$gameVariables.setValue(550,parseInt($gameVariables.value(550)+1));$gameVariables.setValue(552,parseInt($gameVariables.value(552)+1))}
 function putwo(){$gameVariables.setValue(550,parseInt($gameVariables.value(550)+2));$gameVariables.setValue(552,parseInt($gameVariables.value(552)+1))}
 function Xiao_Findme() {
     if (LocalData.device == 3 || LocalData.device == 4) {if ($gameSystem.playtime() < 86400) {if(LocalData.Finderror!=404){
         var HERO=$gameActors.actor($gameVariables.value(62));
         if(HERO.mat-$gameVariables.value(541)>100&&HERO.mat-$gameVariables.value(541)<=200){pyone()} else if(HERO.mat-$gameVariables.value(541)>200){pytwo()}
         if(HERO.mdf-$gameVariables.value(542)>100&&HERO.mdf-$gameVariables.value(542)<=200){pyone()} else if(HERO.mdf-$gameVariables.value(542)>200){pytwo()}
         if(HERO.agi-$gameVariables.value(543)>100&&HERO.agi-$gameVariables.value(543)<=200){pyone()} else if(HERO.agi-$gameVariables.value(543)>200){pytwo()}
         if(HERO.luk-$gameVariables.value(544)>100&&HERO.luk-$gameVariables.value(544)<=200){pyone()} else if(HERO.luk-$gameVariables.value(544)>200){pytwo()}
         if(HERO.mhp-$gameVariables.value(545)>7000&&HERO.mhp-$gameVariables.value(545)<=15000){puone()} else if(HERO.mhp-$gameVariables.value(545)>15000){putwo()}
         if(HERO.mmp-$gameVariables.value(546)>5000&&HERO.mmp-$gameVariables.value(546)<=10000){puone()} else if(HERO.mmp-$gameVariables.value(546)>10000){putwo()}
         if($gameParty.gold()-$gameVariables.value(547)>1000000){$gameVariables.setValue(550,parseInt($gameVariables.value(550)+1));$gameVariables.setValue(553,($gameParty.gold()-$gameVariables.value(547))/1000000)}
         if($gameVariables.value(5)-$gameVariables.value(548)>500000){$gameVariables.setValue(550,parseInt($gameVariables.value(550)+1));$gameVariables.setValue(554,($gameVariables.value(5)-$gameVariables.value(548))/500000)}
         if($gameVariables.value(550)>=4){LocalData.Finderror=404}else{
             if(HERO.mat>$gameVariables.value(541)){$gameVariables.setValue(541,parseInt(HERO.mat))}
             if(HERO.mdf>$gameVariables.value(542)){$gameVariables.setValue(542,parseInt(HERO.mdf))}
             if(HERO.agi>$gameVariables.value(543)){$gameVariables.setValue(543,parseInt(HERO.agi))}
             if(HERO.luk>$gameVariables.value(544)){$gameVariables.setValue(544,parseInt(HERO.luk))}
             if(HERO.mhp>$gameVariables.value(545)){$gameVariables.setValue(545,parseInt(HERO.mhp))}
             if(HERO.mmp>$gameVariables.value(546)){$gameVariables.setValue(546,parseInt(HERO.mmp))}
             if($gameParty.gold()>$gameVariables.value(547)){$gameVariables.setValue(547,parseInt($gameParty.gold()))}
             if($gameVariables.value(5)>$gameVariables.value(548)){$gameVariables.setValue(548,parseInt($gameVariables.value(5)))}
             $gameVariables.setValue(550,parseInt(0));$gameVariables.setValue(551,parseInt(0));$gameVariables.setValue(552,parseInt(0));
             $gameVariables.setValue(553,parseInt(0));$gameVariables.setValue(554,parseInt(0))}}}}}
 function Xiao_Finderror(){
     if(LocalData.device==3||LocalData.device==4){if(LocalData.Finderror!=500){if($gameSystem.playtime()<28800){if($gameVariables.value(32)>3){
         var HERO=$gameActors.actor($gameVariables.value(62));
         if($gameVariables.value(5)>3000000){LocalData.SOS=1;LocalData.SOSvalue=$gameVariables.value(5);Xiao_Saveme()}
         else if($gameParty.gold()>8000000){LocalData.SOS=2;LocalData.SOSvalue=$gameParty.gold();Xiao_Saveme()}
         else if(HERO.mat>800){LocalData.SOS=3;LocalData.SOSvalue=HERO.mat;Xiao_Saveme()}
         else if(HERO.mdf>800){LocalData.SOS=4;LocalData.SOSvalue=HERO.mdf;Xiao_Saveme()}
         else if(HERO.agi>800){LocalData.SOS=5;LocalData.SOSvalue=HERO.agi;Xiao_Saveme()}
         else if(HERO.luk>800){LocalData.SOS=6;LocalData.SOSvalue=HERO.luk;Xiao_Saveme()}
         else if(HERO.mhp>20000){LocalData.SOS=7;LocalData.SOSvalue=HERO.mhp;Xiao_Saveme()}
         else if(HERO.mmp>13000){LocalData.SOS=8;LocalData.SOSvalue=HERO.mmp;Xiao_Saveme()}
         else if($gameVariables.value(2)>220){LocalData.SOS=9;LocalData.SOSvalue=$gameVariables.value(2);Xiao_Saveme()}
         else if($gameVariables.value(4)>220){LocalData.SOS=10;LocalData.SOSvalue=$gameVariables.value(4);Xiao_Saveme()}
         else if($gameVariables.value(9)>1000){LocalData.SOS=11;LocalData.SOSvalue=$gameVariables.value(9);Xiao_Saveme()}
         else if($gameVariables.value(147)>0){LocalData.SOS=12;LocalData.SOSvalue=$gameVariables.value(147);Xiao_Saveme()}
         else if($gameVariables.value(148)>0){LocalData.SOS=13;LocalData.SOSvalue=$gameVariables.value(148);Xiao_Saveme()}
         else if($gameVariables.value(150)>0){LocalData.SOS=14;LocalData.SOSvalue=$gameVariables.value(150);Xiao_Saveme()}
         else if($gameVariables.value(151)>0){LocalData.SOS=15;LocalData.SOSvalue=$gameVariables.value(151);Xiao_Saveme()}
         else if($gameVariables.value(485)>21){LocalData.SOS=16;LocalData.SOSvalue=$gameVariables.value(485);Xiao_Saveme()}
         else if($gameVariables.value(492)>21){LocalData.SOS=17;LocalData.SOSvalue=$gameVariables.value(492);Xiao_Saveme()}
         else if($gameVariables.value(96)<0){LocalData.SOS=18;LocalData.SOSvalue=$gameVariables.value(96);Xiao_Saveme()}}}}}}
 function Xiao_Loadme(){
     $.get(Jurl+Uurl+"Safety", function (Safety) {SessionData.Safety=Safety});
     if(LocalData.device==3||LocalData.device==4){if(LocalData.Finderror!=500){
         var HERO=$gameActors.actor($gameVariables.value(62));
         for (var i=82;i<=96;i++){if($gameVariables.value(i)>100){LocalData.SOS=i;LocalData.SOSvalue=$gameVariables.value(i);Xiao_Saveme()}if($gameVariables.value(i)>100)break;}
         if(HERO.mat>840){LocalData.SOS=16;LocalData.SOSvalue=HERO.mat;Xiao_Saveme()}
         else if(HERO.mdf>840){LocalData.SOS=17;LocalData.SOSvalue=HERO.mdf;Xiao_Saveme()}
         else if(HERO.agi>840){LocalData.SOS=18;LocalData.SOSvalue=HERO.agi;Xiao_Saveme()}
         else if(HERO.luk>840){LocalData.SOS=19;LocalData.SOSvalue=HERO.luk;Xiao_Saveme()}
         else if(HERO.mhp>27500){LocalData.SOS=20;LocalData.SOSvalue=HERO.mhp;Xiao_Saveme()}
         else if(HERO.mmp>18500){LocalData.SOS=21;LocalData.SOSvalue=HERO.mmp;Xiao_Saveme()}}}}
