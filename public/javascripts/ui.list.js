(function(window){

    var MyList = function(host, option){
        this.host = host;

        this.option = {
            dataSourse:[],
            preEvent:null,
            nextEvent:null
        }

        if(option){
            for(var i in option){
                this.option[i] = option[i];
            }
        }

        this.preEvent = this.option.preEvent;
        this.nextEvent = this.option.nextEvent;
        this.init();
        this.drow();
    }
    MyList.prototype = {
        host:null,
        option:null,
        rootEle:null,
        line:null,
        preEle:null,
        nextEle:null,
        lineWidth:7,
        gap:50,
        firstGap:10,
        lastGap:100,
        total:null,
        dataCount:0,
        direction:"v",
        itemHosts:[],
        pointEles:[],
        timePos:{},
        showi:0,

        preEvent:null,
        nextEvent:null,

        createItem : function(date,l){
            var lf = l%2==0?"left":"right";
            var html =
                "<div class='oneitem' style='"+lf+":20px'>"+
                    "<div class='title'>"+date.title+"<div>"
            "<div class='subtitle'>"+date.date+"<div>"
            +"<div>"
            return html;
        },
        PreNextEvent:function(){
            var that = this;
          addEvent(this.preEle,"click",function(){
                if(that.preEvent){
                    that.preEvent();
                }
            },false);
            addEvent(this.nextEle,"click",function(){
                if(that.nextEvent){
                    that.nextEvent();
                }
            },false);
        },
        init:function(){
            this.itemHosts=[];
            this.pointEles=[];
            this.timePos={};
            this.showi=0;
            var eles = createLine(this.lineWidth);
            this.rootEle = eles.list;
            this.line = eles.line;
            this.preEle = eles.preEle;
            this.nextEle = eles.nextEle;
            if(this.direction == "v"){
                //this.line.style.left = "50%";
                this.rootEle.style.left = "50%";
                this.rootEle.style.width = this.lineWidth+"px";
            }else{
                //this.line.style.top = "50%";
                this.rootEle.style.top = "50%";
                this.rootEle.style.height = this.lineWidth+"px";
            }
            this.host.appendChild(this.rootEle);
            this.dataCount = this.option.dataSourse.length;
            this.total = this.gap * (this.dataCount + 1);
            this.PreNextEvent();
        },
        drow:function(){
            var lineStyle = {"overflow":"none"},
                fx = "height",
                pfx = "top";
            if(this.direction == "v"){
                fx = "height";
                pfx = "top";
            }else{
                fx = "width";
                pfx = "left";
            }
            lineStyle[fx] = (this.firstGap+this.lastGap+(this.gap*(this.dataCount-1)))+"px";
            var that = this;
            $(this.line).animate(lineStyle,function(){
                $(that.preEle).fadeIn();
                $(that.nextEle).fadeIn();
            });
            for(var i = 1;i<=this.dataCount; i++){

                var point = createPoint();
                var itemHost = createItemHost();
                if(i == 1){
                    point.style[pfx] = this.firstGap+"px";
                    itemHost.style[pfx] = this.firstGap+"px";
                }else{
                    point.style[pfx] = (this.firstGap+(this.gap*(i-1)))+"px";
                    itemHost.style[pfx] = (this.firstGap+(this.gap*(i-1)))+"px";
                }

                this.rootEle.appendChild(point);
                this.rootEle.appendChild(itemHost);
                this.itemHosts.push(itemHost);
                this.pointEles.push(point);
            }
        },
        showItems:function(){
            var that = this;
            if(!that.option || !that.option.dataSourse)return;
            var dataSourse = that.option.dataSourse;
            var pointStyle = {width:this.lineWidth+"px",height:this.lineWidth+"px"};
            if(that.showi<that.dataCount){
                var oneDate = dataSourse[that.showi];
                var oneItemHost = that.itemHosts[that.showi];
                that.timePos[oneDate.date.month] = oneItemHost.style.top;
                $(that.pointEles).animate(pointStyle);
                $(oneItemHost).html(that.createItem(oneDate,that.showi)).fadeIn(function(){
                    that.showi ++;
                    that.showItems();
                });
            }
        },
        disable:function(){
            this.host.innerHTML="";
            this.host=null;
            this.option=null;
            this.rootEle=null;
            this.line=null;
            this.preEle=null;
            this.nextEle=null;
            this.lineWidth=7;
            this.gap=50;
            this.firstGap=10;
            this.lastGap=100;
            this.total=null;
            this.dataCount=0;
            this.direction="v";
            this.itemHosts=[];
            this.pointEles=[];
            this.timePos={};
            this.showi=0;

            this.preEvent=null;
            this.nextEvent=null;
        }


    }


    var createItemHost = function(){
        var ih = document.createElement("div");
        ih.className = "itemhost";
        return ih;
    }

    var createPoint = function(){
        var onePoint = document.createElement("div");
        onePoint.className = "point";
        return onePoint;
    }

    var createLine = function(l){
        var list = document.createElement("div");
        var line = document.createElement("div");
        list.className = "ui-mylist";
        line.style.width = l;
        line.style.height = l;
        line.className = "myline";
        list.appendChild(line);

        var preEle = document.createElement("div");
        preEle.className = "preEle";
        preEle.innerHTML="<div id='a1' class='th1'></div><div id='a2' class='th1'></div><div id='a3' class='th1'></div>";
        var nextEle = document.createElement("div");
        nextEle.className = "nextEle";
        nextEle.innerHTML="<div id='a1' class='th1'></div><div id='a2' class='th1'></div><div id='a3' class='th1'></div>";
        line.appendChild(preEle);
        line.appendChild(nextEle);
        return {list:list,line:line,preEle:preEle,nextEle:nextEle};
    }

    function addEvent( obj, type, fn ) {
        if ( obj.attachEvent ) {
            obj['e'+type+fn] = fn;
            obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
            obj.attachEvent( 'on'+type, obj[type+fn] );
        } else
            obj.addEventListener( type, fn, false );
    }
    function removeEvent( obj, type, fn ) {
        if ( obj.detachEvent ) {
            obj.detachEvent( 'on'+type, obj[type+fn] );
            obj[type+fn] = null;
        } else
            obj.removeEventListener( type, fn, false );
    }
    window.MyList = MyList;
})(window);