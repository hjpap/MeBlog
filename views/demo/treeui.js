/**********************
	tree info ui
***********************/
(function (w) {
    var TreeInfo = function (host, options) {
        this.hostDom = host;
        this.options = options;
        this.info = options.info;
        var that = this;
        var _g = {
            createRootDom: function () {
                that.rootDom = document.createElement("div");
                that.rootDom.className = "ftree-info";
            },
            createContent: function () {
                that.content = document.createElement("ul");
                that.rootDom.appendChild(that.content);
            },
            init: function () {
                this.createRootDom();
                this.createContent();
                that.showInfo(that.options.info);
                that.hostDom.appendChild(that.rootDom);
            }
        }
        this.createOneInfoDom = TreeInfo.createOneInfoDom || this.createOneInfoDom;
        _g.init();

    }
    TreeInfo.prototype = {
        emptyLi: null,
        showInfo: function (info) {
            this.info = info;
            this.content.innerHTML = "";

            if (!this.info)
                return;
            var l = this.info.length;
            if (l > 0) {
                this.emptyLi = document.createElement("li");
                this.emptyLi.className = "empty";
                this.content.appendChild(this.emptyLi);
            }
            for (var i = 0; i < l; i++) {
                var oneLi = document.createElement("li");
                if (this.info[i].type) {
                    oneLi.className = this.info[i].type;
                }
                var dom = this.createOneInfoDom(this.info[i]);
                if (typeof (dom) == 'string')
                    oneLi.innerHTML = dom;
                else
                    oneLi.appendChild(dom);
                this.content.appendChild(oneLi);
            }
        },
        createOneInfoDom: function (o) {
            var str = "<div class='date'>" + o.date + "</div><div class='text'>" + o.des + "</div>";
            return str;
        }
    }

    w.TreeInfo = TreeInfo;
})(window);

/**********************
	    tree ui
***********************/
(function (w) {
    //util ---------------------------

    function setClassName(e, value) {
        var name = e.className || "";
        if (typeof (name) == "string") {
            e.className = value;
        }
        return e;
    };

    function removeEmpties(arr) {
        var len = arr.length;
        for (var i = len - 1; i >= 0; i--) {
            if (!arr[i]) {
                arr.splice(i, 1);
                len--;
            }
        }
        return len;
    }

    function getClassName(e) {
        var name = e.className || "";
        if (typeof (name) == "string") {
            return name;
        }
        return "";
    };

    function addClass(element, name) {
        var className = getClassName(element);
        var names = className.split(" ");
        var l = removeEmpties(names);
        var toAdd;
        if (name.indexOf(" ") >= 0) {
            var namesToAdd = name.split(" ");
            removeEmpties(namesToAdd);
            for (var i = 0; i < l; i++) {
                var found = namesToAdd.indexOf(names[i]);
                if (found >= 0) {
                    namesToAdd.splice(found, 1);
                }
            }
            if (namesToAdd.length > 0) {
                toAdd = namesToAdd.join(" ");
            }
        }
        else {
            var saw = false;
            for (var i = 0; i < l; i++) {
                if (names[i] === name) {
                    saw = true;
                    break;
                }
            }
            if (!saw) { toAdd = name; }
        }
        if (toAdd) {
            if (l > 0 && names[0].length > 0) {
                setClassName(element, className + " " + toAdd);
            }
            else {
                setClassName(element, toAdd);
            }
        }
        return element;
    }

    function removeClass(element, name) {
        var original = getClassName(element);
        var namesToRemove;
        var namesToRemoveLen;

        if (name.indexOf(" ") >= 0) {
            namesToRemove = name.split(" ");
            namesToRemoveLen = removeEmpties(namesToRemove);
        }
        else {
            if (original.indexOf(name) < 0) {
                return element;
            }
            namesToRemove = [name];
            namesToRemoveLen = 1;
        }
        var removed;
        var names = original.split(" ");
        var namesLen = removeEmpties(names);

        for (var i = namesLen - 1; i >= 0; i--) {
            if (namesToRemove.indexOf(names[i]) >= 0) {
                names.splice(i, 1);
                removed = true;
            }
        }

        if (removed) {
            setClassName(element, names.join(" "));
        }
        return element;
    }
    function removeElementsByClass(elements) {
        var eles = [];
        for (var i = 0, l = elements.length; i < l; i++) {
            eles.push(elements[i]);
        }
        for (var i = 0, l = eles.length; i < l; i++) {
            eles[i].parentNode.removeChild(eles[i]);
        }
        eles = null;
    }
    function getDomPos(dom) {
        if (!dom)
            return;
        var l = dom.offsetLeft,
			t = dom.offsetTop,
			w = dom.clientWidth,
			h = dom.clientHeight;
        return { l: l, t: t, w: w, h: h }
    }
    function createOnePLine(pPos, cPos) {
        var lineHost = document.createElement("div");
        lineHost.className = "node_line";
        var hl = document.createElement("div");
        hl.className = "root_line line_h";
        var vl = document.createElement("div");
        vl.className = "root_line line_v";
        lineHost.appendChild(hl);
        lineHost.appendChild(vl);

        //add position
        hl.style.left = "-1px";
        hl.style.top = ((cPos.t / 2) - 2) + "px";
        hl.style.width = ((cPos.w / 2) + cPos.l - 67) + "px";

        vl.style.left = "-1px";
        vl.style.top = ((cPos.t / 2) - 2) + "px";
        vl.style.height = "12px";
        vl.style.left = ((cPos.w / 2) + cPos.l - 67) + "px";
        return lineHost;
    }
    // end util -----------------------
    var OrgChart = function (host, options, fun) {
        this.host = host;
        this._options = options;
        this.nodeClick = fun.nodeClick || function(){};
        this.dropEnd = fun.dropEnd || function(){};
        this.drawTreeEnd = fun.drawTreeEnd || function(){};
        this.init();
    }

    OrgChart.prototype = {
        _options: null,
        rootDom: null,
        hostDom: null,
        treeInfo: null,
        parentNode: null,
        targetOption: null,
        nodeClick: null,
        dropEnd: null,
        drawTreeEnd: null,
        getOption: function () {
            return this._options;
        },
        getTreeInfo: function () {
            this.treeInfo = {};
            this.setTreeInfo(this._options.tree);
            return this.treeInfo;
        },
        reInit: function () {
            this.rootDom.innerHTML = "";
            var liDom = document.createElement("li");
            this.rootDom.appendChild(liDom);
            this.setTreeInfo(this._options.tree);
            var doms = this.createDomsFunc(this.parentNode);
            liDom.appendChild(doms.nodeDom);
            liDom.appendChild(doms.nodeDomList);
        },
        init: function () {
            this.rootDom = document.createElement("ul");
            this.rootDom.className = "ft";
            var liDom = document.createElement("li");
            this.rootDom.appendChild(liDom);
            this.setTreeInfo(this._options.tree);
            var doms = this.createDomsFunc(this.parentNode);
            liDom.appendChild(doms.nodeDom);
            liDom.appendChild(doms.nodeDomList);
            
        },
        setTreeInfo: function (option) {
            this.treeInfo = {};
            if (!option) return;
            for (var i in option) {
                this.treeInfo[i] = this.treeInfo[i] || [];
                var parentName = option[i].parent;
                if (parentName) {
                    this.treeInfo[parentName] = this.treeInfo[parentName] || [];
                    this.treeInfo[parentName].push(i);
                } else {
                    //If have no parent - is root node
                    this.parentNode = i;
                }
            }
        },
        createDomsFunc: function (pNodeName) {
            var pNodeList = this.treeInfo[pNodeName],
			pNodeOption = this._options.tree[pNodeName];

            //var nodeDom = this.createOneNode(pNodeOption);
            var nodeDom = document.createElement("div");
            var that = this;
            nodeDom.addEventListener("click", function (e) {
                if (that.nodeClick) {
                    that.nodeClick({ e: e, data: pNodeOption });
                }
            }, false);

            nodeDom.id = "node_" + pNodeName;
            this.dragTargetFunc(nodeDom);
            if (pNodeOption.className)
                nodeDom.className = "node " + pNodeOption.className;
            else
                nodeDom.className = "node";
            var ele = this.createOneNode(pNodeOption);
            if (typeof ele == "object")
                nodeDom.appendChild(ele);
            else
                nodeDom.innerHTML = ele;
            var nodeDomList = document.createElement("ul");
            if (pNodeOption.parent == null) {
                nodeDomList.setAttribute("id", "parent_ul");
            }
            for (var i = 0, l = pNodeList.length; i < l; i++) {
                var liDom = document.createElement("li");
                liDom.id = "li_" + pNodeList[i];
                liDom.draggable = "true";
                this.dragEleFunc(liDom);
                var doms = this.createDomsFunc(pNodeList[i]);
                liDom.appendChild(doms.nodeDom);
                liDom.appendChild(doms.nodeDomList);
                nodeDomList.appendChild(liDom);
            }
            pNodeOption["nodeDom"] = nodeDom;
            pNodeOption["childrenDom"] = nodeDomList;

            return { nodeDom: nodeDom, nodeDomList: nodeDomList }
        },
        createOneNode: function (o) {
            var str = "<img src='" + o.img + "'/><div class='name'>" + o.name + "</div><div class='title'>" + o.title + "</div>";
            return str;
        },
        dragEleFunc: function (ele) {
            var id = ele.id.split('_')[1];
			
			$( ele ).draggable({ /*revert: true,*/ helper: "clone"/*,snap: ".node", snapMode: "outer" */});
			
        },
        dragTargetFunc: function (ele) {
            var that = this;
            var targetId = ele.id.split('_')[1];

			$( ele ).droppable({
				activeClass: "",
				hoverClass: "hover",
				drop: function( event, ui ) {
					var uls = that._options.tree[targetId]["childrenDom"];
					uls.appendChild(ui.draggable.context);
					var dragDomId = ui.draggable.context.id.split('_')[1];
					that._options.tree[dragDomId]['parent'] = targetId;
					
					if (that.dropEnd) {
                        that.dropEnd(dragDomId, targetId);
                    }
                    that.getTreeInfo();
                    that.createLine();
                    if (that.drawTreeEnd) {
                        that.drawTreeEnd();
                    }
				}
			});
        },
        createLine: function (nodeName) {
            var lineEles = document.getElementsByClassName("node_line");
            removeElementsByClass(lineEles);
            var nodeEles = document.getElementsByClassName("node");
            for (var i = 0, l = nodeEles.length; i < l; i++) {
                removeClass(nodeEles[i], "no-child");
            }
            for (var i in this.treeInfo) {
                if (i == this.parentNode) {
                    this.createParentLine();
                    continue;
                }
                var lineNode = document.createElement('div');
                lineNode.className = "node_line";
                lineNode.id = "line_" + i;
                if (this.treeInfo[i].length == 0)
                    addClass(this._options.tree[i]['nodeDom'], "no-child");
                var lineNode2 = document.createElement('div');
                addClass(lineNode2, "node_line2");

                this._options.tree[i]['nodeDom'].appendChild(lineNode);
                lineNode.appendChild(lineNode2);

                var uls = this._options.tree[i]['childrenDom'];
                var l = uls['childNodes'].length;
                var t = this._options.tree[i]['nodeDom'].offsetTop;
                var h = 0;//父Node到最后一个子NOde的距离
                for (var j = 0; j < l; j++) {
					if(getClassName(uls['childNodes'][j]).indexOf("ui-draggable-dragging")!=-1){
						continue;
					}
                    var lineNode3 = document.createElement('div');
                    addClass(lineNode3, "node_line3");

                    lineNode.appendChild(lineNode3);
                    var ch = uls.offsetTop + uls['childNodes'][j].offsetTop;
                    h = ch - t > h ? (ch - t) : h;
                    lineNode3.style.top = (uls['childNodes'][j].offsetTop + 41) + "px";
                }
                lineNode2.style.height = (h - 32) + "px";
            }
        },
        createParentLine: function () {
            var pNode = this._options.tree[this.parentNode]['nodeDom'];
			pNode.left="";
            addClass(pNode, "rootNode");
            var pNodePos = getDomPos(pNode);
            var nodeList = this.treeInfo[this.parentNode];
            for (var i = 0, l = nodeList.length; i < l; i++) {
                var cNode = this._options.tree[nodeList[i]]['nodeDom'];
                var cNodePos = getDomPos(cNode);
                var line = createOnePLine(pNodePos, cNodePos);
                pNode.appendChild(line);
            }
        },
        forceLayout: function () {
            this.host.appendChild(this.rootDom);
            this.createLine();
            if (this.drawTreeEnd) {
                this.drawTreeEnd();
            }
        },
        addNode: function (o) {

        }
    }

    w.OrgChart = OrgChart;
})(window)
