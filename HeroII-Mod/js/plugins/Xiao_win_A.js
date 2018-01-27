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
 function Xiao_Saveme(){}
 function pyone(){}
 function pytwo(){}
 function puone(){}
 function putwo(){}
 function Xiao_Findme() {}
 function Xiao_Finderror(){}
 function Xiao_Loadme(){}
