//����------------------------------------------------------------------------------------------
function Xiao_Gst(){
    $.get(Jurl+Nurl+"Title", function (result) {$gameVariables.setValue(110,result)});
    $.get(Jurl+Nurl+"Contents", function (result) {$gameVariables.setValue(111,result)});
    $.get(Jurl+Nurl+"Remark", function (result) {$gameVariables.setValue(112,result)})}
//ǩ��------------------------------------------------------------------------------------------
function Xiao_Ci(){$.get(Jurl+Nurl+"CheckIn", function (result) {SessionData.CheckIn=result})}
//����------------------------------------------------------------------------------------------
function Xiao_IosUrl(){$.get(Jurl+Uurl+"PGII", function (resulti) {eval(resulti)})}
function Xiao_AndroidUrl(){$.get(Jurl+Uurl+"AZII", function (resulta) {eval(resulta)})}
//����------------------------------------------------------------------------------------------
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
            case 1://Ӣ��Ⱥ����I������յ���Ϣ
                SessionData.InformIG=false;
                SessionData.InformIP=false;
                break;
            case 2://Ӣ��Ⱥ����II������յ���Ϣ
                SessionData.InformIG=true;
                SessionData.InformIP=false;
                break;
            case 3://��������յ���Ϣ
                SessionData.InformIG=true;
                SessionData.InformIP=false;
                break;
            case 4://�ض�����յ���Ϣ�͵���
                    if ($gameActors._data[1]._name == SessionData.InformNA) {
                        SessionData.InformIG=true;
                        SessionData.InformIP=true;
                    }else{
                        SessionData.InformIG=false;
                        SessionData.InformIP=false};
                break;
            case 5://Ӣ��Ⱥ����II������յ���Ϣ�͵���
                SessionData.InformIG=true;
                SessionData.InformIP=true;
                break;
            default:
                SessionData.InformIG=false;
                SessionData.InformIP=false}})
}
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