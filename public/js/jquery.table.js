/**
 * 基于jquery1.7+的table插件
 * author:navy
 * email:navyxie2010@gmail.com
 * qq:951178609
 * version:1.0beta
 * demo:
 *
 var testData = [
     {'name':'abc','age':0,'sex':'男','score':213,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
     {'name':'she','age':20,'sex':'女','score':120,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'},
     {'name':'av','age':30,'sex':'男','score':731,'img':'http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif',url:'http://www.baidu.com'}
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
 */
var NAVY = NAVY || {};
var console = console || {log:function(data){}};
NAVY.Table = function(jqObj,sourceData,targetData,options){
    var defaultOptions = {
        sortable:[],//可以排序的项
        ths:[],//表格头显示的文字
        skip:{},//需要隐藏的字段的key
        changeHanlder:function(data){console.log(data)},//当某个td可编辑失去焦点时的回调函数
        isFixHead:true,//固定表格头部
        footHtml:''//表格脚部内容
    };
    this.docs = targetData.length ? targetData : [];//sourceData经过map后的目标数据，用于页面显示
    this.sourceData = sourceData.length ? sourceData : [{}];//原始数据
    this.sourceDataKeys =this.getKey(this.sourceData[0]);//原始数据的key
    this.jqObj = $(jqObj);//table的容器
    $.extend(defaultOptions,options);
    this.options = defaultOptions;
    this.init();
};
NAVY.Table.prototype = {
    /**
     * 初始化函数
     */
    init:function(){
        this.makeTableHtml();//生成表格
        this.initEvent();//初始化事件
        return this;
    },
    /**
     * 初始化事件，目前只有绑定click,dbclick,blur事件
     */
    initEvent:function(){
        var jqObj = this.jqObj;
        var _this = this;
        var options = _this.options;
        var tableObj = jqObj.find('.navyTable');//生成的table对象
        var tableBody = tableObj.find('.navyTbody');//table的body
        var thObjs = tableObj.find('th');//table的th
        var trObjs = tableObj.find('.navyTableTr');//table的tr对象
        var trObjsLen = trObjs.length;
        jqObj.on('click','.sortAble',function(e){
            //对可编辑的td对象绑定点击事件
            var self = $(this);
            if(self.hasClass('sortAble')){
                var clickIndex = thObjs.index(self);
                var i = 0,isDesc = self.hasClass('desc');
                for(;i<trObjsLen;i++){
                    trObjs[i].compareValue = $(trObjs[i]).find('td').eq(clickIndex).text();
                }
                trObjs.sort(function(a,b){
                    if(isDesc){
                        //降序
                        return b.compareValue - a.compareValue
                    }else{
                        //升序

                        return a.compareValue - b.compareValue
                    }
                });

                trObjs = _this.resetEvenAndOdd(trObjs);//重设tr的even,odd class，提供css设置隔行样式
                tableBody.append(trObjs);//重新渲染table的body内容
                self.hasClass('desc') ? self.removeClass('desc').addClass('asc') : self.removeClass('asc').addClass('desc');//变化th的asc和desc类，用于排序的指示
            }
        }).on('blur','.contentContainer',function(){
                var self = $(this);
                if(self.hasClass('contentContainer')){
                    self.removeAttr('contentEditable');//失去焦点时让td下的div不可编辑
                    _this.onChangeHanlder(self);//处理编辑后的数据
                }
                return false;
            }).on('dblclick','.contentContainer',function(){
                //双击时使td下的div可编辑
                var self = $(this);
                if(self.hasClass('contentContainer')){
                    self.attr('contentEditable',true);
                }
                return false;
            });
        //规定表格头部
        if(options.isFixHead){
            tableObj.find('.navyThead').addClass('fixed');
        }
        return this;
    },
    /**
     * 每次排序后重新设置tr的class,主要用于提供给用户设置隔行样式
     * @param trObjs tr对象的集合
     */
    resetEvenAndOdd:function(trObjs){
        var i = 0 ,len = trObjs.length;
        for(;i<len;i++){
            var curTrObj = $(trObjs[i]);
            if((i+1)%2 === 0){
                if(curTrObj.hasClass('odd')){
                    curTrObj.removeClass('odd').addClass('even');
                }
            }else{
                if(curTrObj.hasClass('even')){
                    curTrObj.removeClass('even').addClass('odd');
                }
            }
        }
        return trObjs;
    },
    /**
     * 生成整个table的函数
     */
    makeTableHtml:function(){
        var docs = this.docs;//source数据经过map后的目标数据，用于页面的显示
        var tempArray = $.makeArray(docs),tempHtmlArr = [],options = this.options,sortAbleArr  = options.sortable,skip = options.skip;//需要隐藏的列
        var sortAbleLen = sortAbleArr.length,tableHead = [];
        tempHtmlArr.push('<table class="navyTable">');
        docs = $.isArray(docs) ? docs : $.isArray(tempArray) ? tempArray : [];
        var i = 0,docLen = docs.length,curDoc = docs[0],thLen ;
        //提取页面显示的列的key
        for(var thKey in curDoc){
            !(skip[thKey]) && tableHead.push(thKey);
        }
        thLen = tableHead.length;
        $.extend(tableHead,options.ths);
        tempHtmlArr.push('<thead class="navyThead">');
        //生成table 的 th
        for(i = 0 ; i < thLen ; i++){
            var isSortAble = '';
            for(var j = 0 ; j < sortAbleLen ; j++){
                if(sortAbleArr[j] === i){
                    isSortAble = 'sortAble';
                    break;
                }
            }
            tempHtmlArr.push('<th class="navyTableTh navyTableTh'+i+' '+isSortAble+'"><div class="thContainer">'+tableHead[i]+'</div><div class="arrowContainer upArrow hidden">↑</div><div class="arrowContainer downArrow hidden">↓</div></th>')
        }
        tempHtmlArr.push('</thead><tbody class="navyTbody">');
        //生成table body 的内容
        for(i = 0;i<docLen;i++){
            curDoc =  docs[i];
            var q = 0;
            if($.isPlainObject(curDoc) && !($.isEmptyObject(curDoc))){
                var hoverClass = 'odd';
                ((i+1)%2 === 0) && (hoverClass ='even');
                tempHtmlArr.push('<tr class="navyTableTr '+hoverClass+'">');
                for(var tempKey in curDoc){
                    tempHtmlArr.push('<td td-class="'+tempKey+'" class="'+(skip[tempKey] || '')+' navyTableTd '+tempKey+' navyTableTd'+(q++)+'"><div class="contentContainer">'+curDoc[tempKey]+'</div></td>');
                }
                tempHtmlArr.push('</tr>');
            }
        }
        var footHtml = options.footHtml ? ('<tfoot class="navyTableFoot"><tr><th colspan="'+thLen+'"><p class="footContainer">'+options.footHtml+'</p></th></tr></tfoot>') : '';
        tempHtmlArr.push('</tbody>'+footHtml+'</table>');
        this.jqObj.append(tempHtmlArr.join(''));
        return this;
    },
    /**
     * 获取原始数据的key
     * @param obj 原始数据的某一条记录
     */
    getKey:function(obj){
        var keys = [];
        for(var key in obj){
            keys.push(key);
        }
        return keys;
    },
    /**
     * 当用户编辑某个单元格后，失去焦点时的处理事件
     * @param self 当前编辑的td单元格下的div
     */
    onChangeHanlder:function(self){
        //self 当前编辑的td下的.contentContainer div
        var changeData = {};
        var sourceData = {};
        var sourceDataKeys = this.sourceDataKeys;
        var sourceDataKeysLen = sourceDataKeys.length;
        var selfParent = self.parent();
        changeData[selfParent.attr('td-class')] = self.html();
        var siblingsObj = selfParent.siblings('.navyTableTd');
        var i = 0;
        var siblingsLen = siblingsObj.length;
        //提取当前编辑行的数据
        for(;i< siblingsLen;i++){
            var curSiblingObj = $(siblingsObj[i]);
            changeData[curSiblingObj.attr('td-class')] = curSiblingObj.find('.contentContainer').html();
        }
        //过滤提取出来的数据，保留的原始数据的key-value
        for(i=0;i<sourceDataKeysLen;i++){
            sourceData[sourceDataKeys[i]] = changeData[sourceDataKeys[i]];
        }
        this.options.changeHanlder(sourceData);
    },
    /**
     * 销毁对象
     */
    destroy:function(){
        this.jqObj.unbind().empty();
        return this;
    },
    getTableHtml:function(){
        return this.jqObj.html();
    }
};