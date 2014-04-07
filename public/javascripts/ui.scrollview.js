
(function(window){

    //var hasTouch='ontouchstart' in window;
	var hasTouch = ('ontouchstart' in window) && window.navigator.platform!="Win32" ;
    //var hasTouch = false;
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
	
	var cssVendor="-"+vendor.toLowerCase()+"-";
	
	var has3d = getVendorCssStyle('perspective') in dummyStyle;
	////css style
	var transform=getVendorCssStyle("transform");
	var transformOrigin=getVendorCssStyle("transformOrigin");
	var transitionProperty=getVendorCssStyle("transitionProperty");
	var transitionDuration=getVendorCssStyle("transitionDuration");
	var transitionTimingFunction=getVendorCssStyle("transitionTimingFunction");
	var transitionDelay=getVendorCssStyle("transitionDelay");
	translateZ = has3d ? ' translateZ(0)' : '';
	////end css style
	
	////event
	var RESIZE_EVENT='onorientationchange' in window ?'orientationchange':'resize';
	var START_EVENT= hasTouch?'touchstart':"mousedown";
	var MOVE_EVENT=hasTouch?'touchmove':'mousemove';
	var END_EVENT=hasTouch?'touchend':'mouseup';
	var CANCEL_EVENT=hasTouch?'touchcancel':'mouseup';
	var TRANSITION_END=getTransitionEvent(vendor);
	////end event
	
	var hasTransform=vendor!=null;
	var hasTransitionEnd=getVendorCssStyle('transition') in dummyStyle;
	
	var nextFrame=(function(){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})();
	
	var cancelFrame=(function(){
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			clearTimeout;
	})();
	
	//constructor
	var ScrollView=function(hostElement,options){
		
		this.hostElement=hostElement;
		if(options!=null){
			this.x=options.x!=null?options.x:this.x;
			this.y=options.y!=null?options.y:this.y;
			
			//this.useTransform=hasTransform && options.useTransform;
			//this.hScrollbar=this.hScroll && this.hScrollbar;
			//this.vScrollbar=this.vScroll && this.vScrollbar;
			//this.useTransition=hasTransitionEnd && this.useTransition;
			//this.x=options.x;
			//this.y=options.y;
			this.leftOffset=options.leftOffset!=null?options.leftOffset:this.leftOffset;
			this.hRefresh=!!options.hRefresh;
		}
		
		this.options={
			hScroll:true,
			vScroll:true,
			
			hScrollbar:true,
			vScrollbar:true,
			momentum:true,
            hideScrollbar:true,
            fadeScrollbar:true
		};
		
		for(var i in options){
			this.options[i]=options[i];
		}
		
		this.init();
	};
	
	ScrollView.prototype={
		enable:true,
		
		hostElement:null,
		rootElement:null,
		scrollerElement:null,
		
		scrollContentWidth:null,
		scrollContentHeight:null,
		
		scrollbarClassName:null,
		
		hScroll:true,
		vScroll:true,
		hScrollbar:true,
		vScrollbar:true,
		x:0,
		y:0,
		
		hRefresh:true,
		vRefresh:false,
		leftOffset:0,
		topOffset:0,
		minScrollX:0,
		minScrollY:0,

		useTransform:true,
		useTransition:true,
		fixedScrollbar:false,
        hideScrollbar:false,
        fadeScrollbar:false,
		zoom:false,
		bounce:true,
		lockDirection:true,
		bounceLock:false,
		
		scale:1,
		
		aniTime:null,
		
		//event
		onBeforeScrollStart:null,
		onScrollEnd:null,
		onBeforeScrollEnd:null,
		onTouchEnd:null,
		onAnimationEnd:null,
		onRefresh:null,
		onZoomStart:null,
		onScrollMove:null,
		//end event
		
		init:function(){
			this.rootElement=createRootElement();
			this.scrollerElement=this.createScrollerElement();
			this.scrollerFrontContent=this.createFrontScrollContent();
			this.scrollerLastContent=this.createLastScrollContent();
			this.scrollerElement.appendChild(this.scrollerFrontContent);
			this.scrollerElement.appendChild(this.scrollerLastContent);
			
			//this.refresh();
			this.bind(RESIZE_EVENT,window);
			this.bind(START_EVENT,this.rootElement);
		},
		
		createScrollerElement:function(){
			var scrollerElement=document.createElement("div");
			scrollerElement.style[transitionProperty]=this.useTransform?cssVendor+'transform':'top left';
			scrollerElement.style[transitionDuration]='0';
			scrollerElement.style[transformOrigin]='0 0';
			scrollerElement.className="scrollContent";
			if(this.useTransition){
				scrollerElement.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
			}
			if(this.useTransform){
				scrollerElement.style[transform]='translate('+this.x+'px,'+this.y+'px)'+translateZ;
			}else{
				scrollerElement.style.top=this.y+"px";
				scrollerElement.style.left=this.x+"px";
			}
			return scrollerElement;
		},
		
		bind:function(type,element,bubble){
			(element || this.scrollerElement).addEventListener(type,this,!!bubble);
		},
		
		unbind:function(type,element,bubble){
			(element || this.scrollerElement).removeEventListener(type,this,!!bubble);
		},
		
		handleEvent:function(e){
			var that=this;
			switch(e.type){
				case RESIZE_EVENT:
					that.resize(e);
					break;
				case START_EVENT:
					if(!hasTouch && e.button!==0) return;
					that.startE(e);
					break;
				case MOVE_EVENT:
					that.moveE(e);
					break;
				case END_EVENT:
				case CANCEL_EVENT:
					that.endE(e);
					break;
				case TRANSITION_END:
					that.transitionEnd(e);
					break;
			}
		},
		
		transitionTime:function(time){
			time+='ms';
			this.scrollerElement.style[transitionDuration]=time;
			if(this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration]=time;
			if(this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration]=time;
		},
		
		setMinScrollX:function(value){
			this.minScrollX=value;
			this.createFrontScrollContent();
			this.createLastScrollContent();
		},
		
		setMaxScrollX:function(value){
			this.maxScrollX=value;
			this.createFrontScrollContent();
			this.createLastScrollContent();
		},
		
		refresh:function(){
			var that=this,offset,els,
				pos=0,page=0;
			
			that.rootElementWidth=this.hostElement.clientWidth;
			that.rootElementHeight=this.hostElement.clientHeight;
			
			that.minScrollX=-that.leftOffset || 0;
			that.minScrollY=-that.topOffset || 0;
			that.scrollerWidth= that.scrollContentWidth || Math.round(that.scrollerElement.clientWidth*that.scale);
			//that.scrollerWidth=that.scrollContentWidth || that.scrollerWidth;
			that.scrollerHeight=Math.round((that.scrollerElement.clientHeight+that.minScrollY)*that.scale);
			that.maxScrollX=that.rootElementWidth-that.scrollerWidth;
			that.maxScrollY=that.rootElementHeight-that.scrollerHeight+that.minScrollY;
			that.dirX=0;
			that.dirY=0;
			
			if(that.onRefresh){
				that.onRefresh.call(that);
			}
			
			that.hScroll=that.options.hScroll && that.maxScrollX<0;
			that.vScroll=that.options.vScroll && (!that.bounceLock  && !that.hScroll || that.scrollerHeight > that.rootElementHeight);
			
			that.hScrollbar=that.hScroll && that.options.hScrollbar;
			that.vScrollbar=that.vScroll && that.options.vScrollbar && that.scrollerHeight>that.rootElementHeight;
			
			offset=that.offset(that.rootElement);
			that.rootElementOffsetLeft=-offset.left;
			that.rootElementOffsetTop=-offset.top;
			
			//front content
			this.createFrontScrollContent();
			this.createLastScrollContent();
			//end front content
			
			that.scrollbar('h');
			that.scrollbar('v');
			
			if(!that.zoomed){
				that.scrollerElement.style[transitionDuration]='0';
				that.resetPosition(400);
			}
		},
		
		scrollbar:function(dir){
			var that=this,bar,innerBar;
			
			if(!that[dir+'Scrollbar']){
				if(that[dir+'ScrollbarWrapper']){
					if(hasTransform){
						that[dir+'ScrollbarIndicator'].style[transform]='';
					}
					that[dir+'ScrollbarWrapper'].parentNode.removeChild(that[dir+'ScrollbarWrapper']);
					that[dir+'ScrollbarWrapper']=null;
					that[dir+'ScrollbarIndicator']=null;
				}
				return;
			}
			
			if(!that[dir+'ScrollbarWrapper']){
				bar=document.createElement('div');
				bar.className= dir=='h'?"scrollBarH":"scrollBarV";
				if(that.scrollbarClassName!=null) bar.className+=' '+that.scrollbarClassName;
				bar.style.opacity=that.hideScrollbar?'0':'1';
				bar.style.cssText+= cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0');
				that.rootElement.appendChild(bar);
				that[dir+'ScrollbarWrapper']=bar;
				////
				innerBar=document.createElement('div');
				innerBar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
				innerBar.style.cssText+=';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)'+translateZ ;
				if(that.useTransition) innerBar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';
				that[dir+'ScrollbarWrapper'].appendChild(innerBar);
				that[dir+'ScrollbarIndicator']=innerBar;
			}
			
			if(dir=='h'){
				that.hScrollbarSize=that.hScrollbarWrapper.clientWidth;
				that.hScrollbarIndicatorSize=Math.max(Math.round(that.hScrollbarSize*that.hScrollbarSize/that.scrollerWidth),8);
				that.hScrollbarIndicator.style.width=that.hScrollbarIndicatorSize+'px';
				that.hScrollbarMaxScroll=that.hScrollbarSize-that.hScrollbarIndicatorSize;
				that.hScrollbarProp=that.hScrollbarMaxScroll / that.maxScrollX;
			}else{
				that.vScrollbarSize=that.vScrollbarWrapper.clientHeight;
				that.vScrollbarIndicatorSize=Math.max(Math.round(that.vScrollbarSize*that.vScrollbarSize/that.scrollerHeight),8);
				that.vScrollbarIndicator.style.height=that.vScrollbarIndicatorSize+"px";
				that.vScrollbarMaxScroll=that.vScrollbarSize-that.vScrollbarIndicatorSize;
				that.vScrollbarProp=that.vScrollbarMaxScroll/that.maxScrollY;
			}
			that.scrollbarPosition(dir,true);
		},
		
		scrollbarPosition:function(dir,hidden){
			var that=this,
				pos=dir=='h'?that.x:that.y,
				size;
			
			if(!that[dir+'Scrollbar']) return;
			
			pos=that[dir+'ScrollbarProp']*pos;
			
			if(pos<0){
				if(!that.fixedScrollbar){
					size=that[dir+'ScrollbarIndicatorSize']+Math.round(pos*3);
					if(size<8) size=8;
					var dirHeight=dir=='h'?'width':'height';
					that[dir+'ScrollbarIndicator'].style[dirHeight]=size+'px';
				}
				pos=0;
			}else if(pos>that[dir+'ScrollbarMaxScroll']){
				if(!that.fixedScrollbar){
					size=that[dir+'ScrollbarIndicatorSize']-Math.round((pos-that[dir+'ScrollbarMaxScroll'])*3);
					if(size<8) size=8;
					var dirHeight=dir=='h'?'width':'height';
					that[dir+'ScrollbarIndicator'].style[dirHeight]=size+'px';
					pos=that[dir+'ScrollbarMaxScroll']+(that[dir+'ScrollbarIndicatorSize']-size);
				}else{
					pos=that[dir+'ScrollbarMaxScroll'];
				}
			}else{
				var dirHeight=dir=='h'?'width':'height';
				that[dir+'ScrollbarIndicator'].style[dirHeight]=that[dir+'ScrollbarIndicatorSize']+'px';
			}
			that[dir+'ScrollbarWrapper'].style[transitionDelay]='0';
			that[dir+'ScrollbarWrapper'].style.opacity=hidden && that.hideScrollbar?'0':'1';
			that[dir+'ScrollbarIndicator'].style[transform]='translate('+(dir=='h'?pos+'px,0)':'0,'+pos+'px)')+translateZ;
		},
		
		resize:function(){
			var that=this;
			setTimeout(function(){that.refresh()},0);
		},
		
		startE:function(e){
			var that=this,matrix,x,y,c1,c2;
			var point=hasTouch?e.touches[0]:e;
			
			if(!that.enable) return;
			
			if(this.onBeforeScrollStart!=null){
				that.onBeforeScrollStart.call(that,e);
			}
			if(that.useTransition){
				that.transitionTime(0);
			}
			
			that.moved=false;
			that.animating=false;
			that.zoomed=false;
			that.distX=0;
			that.distY=0;
			that.absDistX=0;
			that.absDistY=0;
			that.dirX=0;
			that.dirY=0;
			
			//hand gesture
			//1.zoom
			if(that.zoom && hasTouch && e.touches.length>1){
				var pageX0=e.touches[0].pageX,pageY0=e.touches[0].pageY;
				var pageX1=e.touches[1].pageX,pageY1=e.touches[1].pageY;
				
				c1=Math.abs(pageX0-pageX1);
				c2=Math.abs(pageY0-pageY1);
				that.touchesDistStart=Math.sqrt(c1*c1+c2*c2);
				
				that.originX=Math.abs( (pageX0+pageX1)/2 - that.rootElement.offsetLeft )-that.X;
				that.originY=Math.abs( (pageX0+pageX1)/2 - that.rootElement.offsetTop)-that.y;
			
				if(that.onZoomStart){
					that.onZoomStart.call(that,e);
				}
			}
			
			if(that.options.momentum){
				if(that.useTransform){
					matrix=getComputedStyle(that.scrollerElement,null)[transform].replace(/[^0-9\-.,]/g,'').split(',');
					x=+(matrix[12] || matrix[4]);
					y=+(matrix[13] || matrix[5]);
				}else{
					x+=getComputedStyle(that.scrollerElement,null).left.replace(/[^0-9-]/g,'');
					y+=getComputedStyle(that.scrollerElement,null).left.replace(/[^0-9-]/g,'');
				}
				
				if(x!=that.x || y!=that.y){
					if(that.useTransition){
						that.unbind(TRANSITION_END);
					}else{
						cancelFrame(that.aniTime);
					}
					that.steps=[];
					that.position(x,y);
					if(that.onScrollEnd) that.onScrollEnd.call(that);
				}
			}
			
			that.absStartX=that.x;
			that.absStartY=that.y;
			
			that.startX=that.x;
			that.startY=that.y;
			that.pointX=point.pageX;
			that.pointY=point.pageY;
			that.startTime=e.timeStamp||Date.now();
			
			if(that.onScrollStart) that.onScrollStart.call(that,e);
			
			that.bind(MOVE_EVENT,window);
			that.bind(END_EVENT,window);
			that.bind(CANCEL_EVENT,window);
		},
		
		moveE:function(e){
			var that=this,
				point=hasTouch?e.touches[0]:e,
				deltaX=point.pageX-that.pointX,
				deltaY=point.pageY-that.pointY,
				newX=that.x+deltaX,
				newY=that.y+deltaY,
				c1,c2,scale,
				timestamp=e.timeStamp || Date.now();
				
			if(that.zoom && hasTouch && e.touches.length>1)	{
			}
			
			that.pointX=point.pageX;
			that.pointY=point.pageY;
			
			if(newX>that.minScrollX || newX<that.maxScrollX){
				newX=that.bounce ? that.x + (deltaX/2) : (newX>=that.minScrollX || that.maxScrollX>=0?that.minScrollX:that.maxScrollX);
			}
			if(newY > that.minScrollY || newY<that.maxScrollY){
				newY=that.bounce ? that.y + (deltaY/2) : (newY>=that.minScrollY || that.maxScrollY>=0?that.minScrollY:that.maxScrollY);
			}
			
			that.distX += deltaX;
			that.distY += deltaY;
			that.absDistX = Math.abs(that.distX);
			that.absDistY = Math.abs(that.distY);
			
			if(that.absDistX <6 && that.absDistY<6){
				return;
			}
			
			if(that.lockDirection){
				if(that.absDistX>that.absDistY+5){
					newY=that.y;
					deltaY=0;
				}else if(that.absDistY>that.absDistX+5){
					newX=that.x;
					deltaX=0;
				}
			}
			
			that.moved=true;
			that.position(newX,newY);
			that.dirX=deltaX>0 ?-1:deltaX<0?1:0;
			that.dirY=deltaY>0 ?-1:deltaY<0?1:0;
			
			if(timestamp-that.startTime>300){
				that.startTime=timestamp;
				that.startX=that.x;
				that.startY=that.y;
			}
			
			if(that.onScrollMove){
				that.onScrollMove.call(that,e);
			}
		},
		
		endE:function(e){
			if(hasTouch && e.touches.length!==0)	return;
			
			var that=this,
				point = hasTouch?e.changedTouches[0]:e,
				target,ev,
				momentumX={dist:0,time:0},
				momentumY={dist:0,time:0},
				duration=(e.timeStamp || Date.now()) - that.startTime,
				newPosX=that.x,
				newPosY=that.y,
				distX,distY,
				newDuration,
				snap,
				scale;
					
			that.unbind(MOVE_EVENT,window);
			that.unbind(END_EVENT,window);
			that.unbind(CANCEL_EVENT,window);
			
			if(that.onBeforeScrollEnd) that.onBeforeScrollEnd.call(that,e);
			
			if(!that.moved){
				
				that.resetPosition(400);
				
				if(that.onTouchEnd){
					this.onTouchEnd.call(that,e);
				}
				return;
			}
			
			if(duration<300 && that.options.momentum){
				momentumX = newPosX ? that.momentum(newPosX - that.startX, duration, -that.x, that.scrollerWidth - that.rootElementWidth + that.x, that.bounce ? that.rootElementWidth : 0) : momentumX;
				momentumY = newPosY ? that.momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerHeight - that.rootElementHeight + that.y - that.minScrollY : 0), that.bounce ? that.rootElementHeight : 0) : momentumY;
				newPosX=that.x+momentumX.dist;
				newPosY=that.y+momentumY.dist;
				
				//if ((that.x > that.minScrollX && newPosX > that.minScrollX) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)){
				if ((that.x > that.minScrollX) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)){
					momentumX = { dist:0, time:0 };
				}
				if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) {
					momentumY = { dist:0, time:0 };
				}
			}
			if(momentumX.dist || momentumY.dist){
				newDuration=Math.max(Math.max(momentumX.time,momentumY.time),10);
				/*
				if(that.snap){
					distX=newPosX-that.absStartX;
					distY=newPosY-that.absStartY;
					if(Math.abs(distX)<that.snapThreshold && Math.abs(distY)<that.snapThreshold){
						that.scrollTo(that.absStartX,that.absStartY,200);
					}else{
						snap=that.snap(newPosX,newPosY);
						newPosX=snap.x;
						newPosY=snap.y;
						newDuration=Math.max(snap.time,newDuration);
					}
				}
				*/
				that.scrollTo(Math.round(newPosX),Math.round(newPosY),newDuration);
				
				if(that.onTouchEnd) that.onTouchEnd.call(that,e);
				return;
			}
			
			that.resetPosition(200);
			if(that.onTouchEnd) that.onTouchEnd.call(that,e);
				
			return;
		},
		
		transitionEnd:function(e){
			var that=this;
			if(e.target!=that.scrollerElement) return;
			that.unbind(TRANSITION_END);
			that.startAnimation();
		},
		
		momentum:function(dist,time,maxDistUpper,maxDistLower,size){
			var deceleration=0.0006,
				speed=Math.abs(dist)/time,
				newDist=(speed*speed)/(2*deceleration),
				newTime=0,outsideDist=0;
			
			if(dist>0 && newDist>maxDistUpper){
				outsideDist=size/(6/(newDist/speed*deceleration));
				maxDistUpper=maxDistUpper+outsideDist;
				speed=speed*maxDistUpper/newDist;
				newDist=maxDistUpper;
			}else if(dist<0 && newDist > maxDistLower){
				outsideDist=size/(6/(newDist/speed*deceleration));
				maxDistLower=maxDistLower+outsideDist;
				speed=speed*maxDistLower/newDist;
				newDist=maxDistLower;
			}
			
			newDist=newDist * (dist<0 ?-1:1);
			newTime=speed/deceleration;
			
			return {dist:newDist,time:Math.round(newTime)};
		},
		
		offset:function(element){
			var left=element.offsetLeft,
				top=element.offsetTop;
			
			while(element=element.offsetParent){
				left-=element.offsetLeft;
				top-=element.offsetTop;
			}
			if(element!=this.rootElement){
				left*=this.scale;
				top*=this.scale;
			}
			return {left:left,top:top};
		},
		
		position:function(x,y){
			if(this.zoomed) return;
			
			x=this.hScroll?x:0;
			y=this.vScroll?y:0;
			if(this.useTransform){
				this.scrollerElement.style[transform]='translate('+x+'px,'+y+'px) scale('+this.scale+')'+translateZ;
			}else{
				x=Math.round(x);
				y=Math.round(y);
				this.scrollerElement.style.left=x+'px';
				this.scrollerElement.style.top=y+'px';
			}
			this.x=x;
			this.y=y;
			
			this.scrollbarPosition('h');
			this.scrollbarPosition('v');
		},
		
		scrollTo:function(x,y,time,relative){
			var that=this,
				step=x;
			that.stop();
			
			if(!step.length){
				step=[{x:x, y:y, time:time, relative:relative}];
			}
			var count=step.length;
			for(var i=0;i<count;i++){
				if(step[i].relative){
					step[i].x=that.x-step[i].x;
					step[i].y=that.y-step[i].y;
				}
				that.steps.push({x:step[i].x , y:step[i].y, time:step[i].time||0});
			}
			that.startAnimation();
		},
		
		stop:function(){
			if(this.useTransition){
				this.unbind(TRANSITION_END);
			}else{
				cancelFrame(this.aniTime);
			}
			this.steps=[];
			this.moved=false;
			this.animating=false;
		},
		
		resetPosition:function(time){
			var that=this,
			//	resetX=that.x>=that.minScrollX || that.minScrollX>0?that.minScrollX:that.x < that.maxScrollX ? that.maxScrollX : that.x,
				resetX=that.x>=that.minScrollX || that.maxScrollX>0?that.minScrollX:that.x < that.maxScrollX ? that.maxScrollX : that.x,
				resetY=that.y>=that.minScrollY || that.maxScrollY>0?that.minScrollY:that.y<that.maxScrollY?that.maxScrollY:that.y;
			if(resetX==that.x && resetY==that.y){
				if(that.moved){
					that.moved=false;
					if(that.onScrollEnd)
						that.onScrollEnd.call(that);
				}
				if(that.hScrollbar && that.options.hideScrollbar){
					if(vendor='webkit') that.hScrollbarWrapper.style[transitionDelay]='300ms';
					that.hScrollbarWrapper.style.opacity='0';
				}
				if(that.vScrollbar && that.options.hideScrollbar){
					if(vendor=='webkit') that.vScrollbarWrapper.style[transitionDelay]='300ms';
					that.vScrollbarWrapper.style.opacity='0';
				}
				return;
			}
			that.scrollTo(resetX,resetY,time||0);
		},
	
		startAnimation:function(){
			var that=this,
				startX=that.x,startY=that.y,
				startTime=Date.now(),
				step,easeOut,animate;
				
			if(that.animating) return;
			
			if(!that.steps.length){
				that.resetPosition(400);
				return;
			}
			
			step=that.steps.shift();
			if(step.x==startX && step.y==startY) step.time=0;
			
			that.animating=true;
			that.moved=true;
			
			if(that.useTransition){
				that.transitionTime(step.time);
				that.position(step.x,step.y);
				that.animating=false;
				if(step.time){
					that.bind(TRANSITION_END);
				}else{
					that.resetPosition(0);
				}
				return;
			}
			
			animate=function(){
				var now=Date.now(),
					newX,newY;
				if(now>=startTime+step.time){
					that.position(step.x,step.y);
					that.animating=false;
					if(that.onAnimationEnd){
						that.onAnimationEnd.call(that);
					}
					that.startAnimation();
					return;
				}
				now=(now-startTime)/step.time-1;
				easeOut=Math.sqrt(1-now*now);
				newX=(step.x-startX)*easeOut+startX;
				newY=(step.y-startY)*easeOut+startY;
				that.position(newX,newY);
				if(that.animating) that.aniTime=nextFrame(animate);
			};
			
			animate();
		},
		
		addContent:function(domList){
			if(domList==null) return;
			if(domList instanceof Array){
				for(var i=0;i<domList.length;i++){
					var dom=domList[i];
					//this.scrollerElement.appendChild(dom);
					this.scrollerElement.insertBefore(dom,this.scrollerLastContent);
				}
			}else if(domList instanceof Node){
				//this.scrollerElement.appendChild(domList);
				this.scrollerElement.insertBefore(domList,this.scrollerLastContent);
			}
			this.refresh();
		},
		
		removeContent:function(){
			var nodes=this.scrollerElement.childNodes;
			var count = nodes.length;
			for(var i=count-1;i>=0;i--){
				var node=nodes[i];
				if(node!=this.scrollerFrontContent && node!=this.scrollerLastContent){
					this.scrollerElement.removeChild(node);
				}
			}
			this.refresh();
		},
		
		createFrontScrollContent:function(){
			if(this.scrollerFrontContent==null){
				this.scrollerFrontContent=document.createElement("div");
				this.scrollerFrontContent.className="frontContent";
				if(this.hRefresh==true) this.scrollerFrontContent.className+=" horizontal";
				if(this.vRefresh==true) this.scrollerFrontContent.className+=" vertical";
			}
			if(this.hRefresh==true){
				this.scrollerFrontContent.style.height=this.rootElementHeight+"px";
				var leftValue=this.minScrollX>0?this.minScrollX:150;
				this.scrollerFrontContent.style.width=leftValue+"px";
				this.scrollerFrontContent.style.left=-leftValue+"px";
			}
			return this.scrollerFrontContent;
		},
		
		createMainScrollContent:function(){
			var mainDom=document.createElement("div");
			mainDom.className="mainContent";
			return mainDom;
		},
		
		createLastScrollContent:function(){
			if(this.scrollerLastContent==null){
				this.scrollerLastContent=document.createElement("div");
				this.scrollerLastContent.className="lastContent";
				if(this.hRefresh==true) this.scrollerLastContent.className+=" horizontal";
				if(this.vRefresh==true) this.scrollerLastContent.classNmae+=" vertical";
			}
			if(this.hRefresh==true){
				this.scrollerLastContent.style.height=this.rootElementHeight+"px";
				var leftValue=this.minScrollX>0?this.minScrollX:150;
				this.scrollerLastContent.style.width=leftValue+"px";
				this.scrollerLastContent.style.right=-leftValue+"px";
			}
			
			return this.scrollerLastContent;
		},
		
		forceLayout:function(){
			this.rootElement.appendChild(this.scrollerElement);
			this.hostElement.appendChild(this.rootElement);
			this.refresh();
		}
	};
	
	
	
	function createRootElement(){
		var rootElement=document.createElement('div');
		rootElement.className="ui-scrollView";
		return rootElement;
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
	
	window.ScrollView=ScrollView;
})(window);