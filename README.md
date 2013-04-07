jquery-table
============

基于jquery的表格插件

demo:

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>table</title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <script type="text/javascript" src="public/js/jquery.js"></script>
    <script type="text/javascript" src="public/js/jquery.table.js"></script>  
    <style type="text/css">
        @charset "utf-8";
        *{margin:0;padding:0;}
        .kalengoTable{width:100%;padding:0;margin:0;border-collapse:collapse;border-spacing:0;}
        .kalengoTable .sortAble{cursor:pointer;}
        .kalengoTable .even{background:#999;}
        .kalengoTable .odd{background:#ccc;}
        .kalengoTable .hidden{display:none;}
        .kalengoTable img{border:none;vertical-align:middle;}
        .kalengoTable .kalengoThead{background:#333;color:#fff;}
        .kalengoTable .kalengoThead th{height:40px;line-height:40px;border:1px solid #333;text-align:center;position:relative;}
        .kalengoTable .kalengoThead .desc .downArrow{display:block;position:absolute;width:10px;top:0;right:10px;}
        .kalengoTable .kalengoThead .asc .upArrow{display:block;position:absolute;width:10px;top:0;right:10px;}
        .kalengoTable .kalengoTbody .kalengoTableTr:hover{background:#6CADD9;}
        .kalengoTable .kalengoTbody .kalengoTableTr .kalengoTableTd{vertical-align:middle;text-align:center;border:1px solid #333;padding:5px 10px;}
        .kalengoTable .kalengoTbody .kalengoTableTr .kalengoTableTd .contentContainer{width:100%;height:100%;}
        .kalengoTable .kalengoTableFoot{width:100%;height:35px;line-height:35px;background:#eee;text-align:center;color:#999;font-size:12px;}
        .kalengoTable .kalengoTableFoot th{text-align:center;}
    </style>
</head>
<body>
<div id="tableWrapper"></div>
<script type="text/javascript">
    var testData = [
        {'name':'海军','age':0,'sex':'男','score':213,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
        {'name':'鹏爷','age':20,'sex':'女','score':120,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
        {'name':'av','age':30,'sex':'男','score':731,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
        {'name':'tree','age':10,'sex':'女','score':254,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
        {'name':'打算打','age':23,'sex':'男','score':312,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
        {'name':'试试','age':45,'sex':'男','score':123,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
        {'name':'大大','age':44,'sex':'女','score':222,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
        {'name':'随时','age':33,'sex':'男','score':111,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'}
    ];
    function mapFunction(testData){
        var tempArr = [];
        var i = 0 , len = testData.length;
        for(;i<len;i++){
            var newObj = {};
            var curObj = testData[i];
            newObj['clickUrl'] = '<a target="_blank" href="'+curObj['url']+'"><img src="'+curObj['img']+'"/></a>';
            newObj['name'] = curObj['name'];
            newObj['age'] = curObj['age'];
            newObj['sex'] = curObj['sex'];
            newObj['score'] = curObj['score'];
            newObj['img'] = curObj['img'];
            newObj['url'] = curObj['url'];
            tempArr.push(newObj);
        }
        return tempArr;
    }
   var tempTable = new NAVY.Table($('#tableWrapper'),testData,mapFunction(testData),{ths:['头像','姓名','年龄','性别','得分'],sortable:[2,4],skip:{'img':'hidden','url':'hidden'}});
</script>
</body>
</html>
