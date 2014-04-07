
(function(window){
    var dummyStyle=document.createElement('div').style;

    var vendor = (function(){
        var vendors = 't,webkitT,MozT,msT,OT'.split(',');
        var t;
        for(var i = 0,l = vendors.length; i < l; i++){
            t = vendors[i]+"ransform";
            if(t in dummyStyle){
                return vendors[i].substr(0, vendors[i].length - 1);
            }
        }
    })();
    ////css style
    var transform=getVendorCssStyle("transform");
    var transformOrigin=getVendorCssStyle("transformOrigin");
    var transitionProperty=getVendorCssStyle("transitionProperty");
    var transitionDuration=getVendorCssStyle("transitionDuration");
    var transitionTimingFunction=getVendorCssStyle("transitionTimingFunction");
    var transitionDelay=getVendorCssStyle("transitionDelay");
    var TRANSITION_END=getTransitionEvent(vendor);

	var Toast=function(config){
		this.text=config.text || "";
		this.config={
			time:0.5
		}
		if(this.config.time)this.config.time=config.time;
		if(config.width!=null) this.width=config.width;
		if(config.height!=null) this.height=config.height;
		if(config.icon!=null) this.icon=config.icon;
		this.init();
		document.body.appendChild(this.rootElement);
		return this;
	}
	Toast.prototype={
		text:"",
		width:null,
		height:null,
		icon:null,
		rootElement:null,
		textElement:null,
		init:function(){
			this.rootElement=document.createElement("div");
			this.rootElement.className="ui-toast";
			
			if(this.width!=null) this.rootElement.style.width=this.width+"px";
			if(this.height!=null) this.rootElement.style.height=this.height+"px";
			
			if(this.icon!=null){
				this.imgElement=document.createElement("img");
				this.imgElement.className="toast-icon";
				this.imgElement.src=this.icon;
				this.rootElement.appendChild(this.imgElement);
			}
			
			this.textElement=document.createElement("div");
			this.textElement.className=this.icon?"toast-text hasimg":"toast-text noimg";
			this.textElement.innerHTML=this.text;
			this.rootElement.appendChild(this.textElement);
			
			this.rootElement.style[transitionDuration]=this.config.time+"s";
			this.rootElement.style[transitionProperty]="opacity";
			this.rootElement.style[transitionTimingFunction]="ease-in";
		},
		show:function(){
			var that=this;
			var time=(that.config.time+2)*1000;
			setTimeout(function(e){that.rootElement.style.opacity=1;},0);
			
			var transEnd=function(){
				document.body.removeChild(that.rootElement);
				removeEvent(that.rootElement,TRANSITION_END,transEnd,false);
				that.text="";
				that.rootElement="";
			}
			
			setTimeout(function(e){
                that.rootElement.style.opacity=0;
                addEvent(that.rootElement,TRANSITION_END,transEnd,false);
            },time);
			
		}
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

    function getVendorCssStyle(style){
        if(vendor=='' || style==null)
            return style;
        style=style.charAt(0).toUpperCase()+style.substr(1);
        return vendor+style;
    }

    function getTransitionEvent(vendor){
        if ( vendor === false ) return false;

        var transitionEnd = {
            ''			: 'transitionend',
            'webkit'	: 'webkitTransitionEnd',
            'Moz'		: 'transitionend',
            'O'			: 'otransitionend',
            'ms'		: 'MSTransitionEnd'
        };

        return transitionEnd[vendor];
    }
	window.Toast=Toast;
})(window);

(function(window){
    var Loading = function(host){
        this.hostEle = host;
        this.rootEle = createLd();
    }
    Loading.prototype = {
        show:function(){
            this.hostEle.appendChild(this.rootEle);
        },
        disable:function(){
            this.hostEle.removeChild(this.rootEle);
        }
    }/*
     <div class="bubblingG">
     <span id="bubblingG_1">
     </span>
     <span id="bubblingG_2">
     </span>
     <span id="bubblingG_3">
     </span>
     </div>
    */
    var createLd = function(){
        var lde = document.createElement("div");
        lde.id = "fountainG";

        var l1 = document.createElement("div");
        l1.id = "fountainG_1";
        l1.className = "fountainG";
        var l2 = document.createElement("div");
        l2.id = "fountainG_2";
        l2.className = "fountainG";
        var l3 = document.createElement("div");
        l3.id = "fountainG_3";
        l3.className = "fountainG";
        var l4 = document.createElement("div");
        l4.id = "fountainG_4";
        l4.className = "fountainG";
        var l5 = document.createElement("div");
        l5.id = "fountainG_5";
        l5.className = "fountainG";
        var l6 = document.createElement("div");
        l6.id = "fountainG_6";
        l6.className = "fountainG";
        var l7 = document.createElement("div");
        l7.id = "fountainG_7";
        l7.className = "fountainG";
        var l8 = document.createElement("div");
        l8.id = "fountainG_8";
        l8.className = "fountainG";
        lde.appendChild(l1);
        lde.appendChild(l2);
        lde.appendChild(l3);
        lde.appendChild(l4);
        lde.appendChild(l5);
        lde.appendChild(l6);
        lde.appendChild(l7);
        lde.appendChild(l8);


        return lde;
    }
    window.Loading = Loading;
})(window);

// scorll to top
o = $;
o(function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    var doc = o(document);

    // top link
    o('#top').click(function(e){
        o('body').animate({ scrollTop: 0 }, 'fast');
        e.preventDefault();
    });

    // scrolling links
    var added;
    doc.scroll(function(e){
        if (doc.scrollTop() > 5) {
            if (added) return;
            added = true;
            o('body').addClass('scroll');
        } else {
            o('body').removeClass('scroll');
            added = false;
        }
    })

})