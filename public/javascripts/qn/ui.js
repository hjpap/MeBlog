/**
 * Created by Administrator on 2014/11/18.
 */
(function(global){
    var templateStr = '<div class="qiniu-upload-ui">\
                <a id="filepicker" class="qn-upload-btn">上传文件</a>\
                <div id="qncontent" class="qiniu-upload-content">\
                <div id="qnclose" class="qn-upload-close"></div>\
                <div class="qiniu-upload-progress">\
                <div id="qnprogress" class="pro-bar"></div>\
                </div>\
                <div id="qnprom"></div>\
                <div id="qnresult" class="qiniu-upload-result"></div>\
                </div>\
                </div>';

    global.QnUpload = function(hostQuery){
        var self = this;
        if(hostQuery && typeof(hostQuery) == "string"){
            self.hostDom = $(hostQuery);
        }else{
            return;
        }

        var closeicon = null;
        var progressDom = null;
        var promDom = null;
        var resultDom = null;
        var contentDom = null;

        var _f = {
            dom:function(){
                var dom = $(templateStr);
                progressDom = dom.find("#qnprogress");
                resultDom = dom.find("#qnresult");
                closeicon = dom.find("#qnclose");
                contentDom = dom.find("#qncontent");
                promDom = dom.find("#qnprom");
                self.hostDom.append(dom);
            },
            domEvent:function(){
                closeicon.bind("click",function(){
                    contentDom.fadeOut();
                });
            },
            init:function(){
                this.dom();
                this.domEvent();
                var uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',
                    browse_button: 'filepicker',
                    container: 'uploadbody',
                    drop_element: 'uploadbody',
                    max_file_size: '100mb',
                    flash_swf_url:$('#url').val()+ '/javascripts/qn/plupload/Moxie.swf',
                    dragdrop: true,
                    chunk_size: '4mb',
                    uptoken_url: $('#uptoken_url').val(),
                    domain: $('#domain').val(),
                    auto_start: true,
                    init: {
                        'FilesAdded': function(up, files) {
                            console.log('FilesAdded');
                        },
                        'BeforeUpload': function(up, file) {
                            console.log('BeforeUpload');
                            promDom.html("正在上传... ");
                            contentDom.fadeIn();
                        },
                        'UploadProgress': function(up, file) {
                            var precent = file.percent;
                            progressDom.css('width',precent+'%');
                            console.log('UploadProgress');
                        },
                        'UploadComplete': function() {
                            console.log('UploadComplete');
                        },
                        'FileUploaded': function(up, file, info) {
                            console.log('FileUploaded');
                            console.log('File:'+file);
                            console.log('info:'+info);
                            var infoObj = JSON.parse(info);
                            var text = $("#domain").val()+"/"+infoObj.key;
                            promDom.html("上传完成:");
                            resultDom.append("<div class='qn-upload-res'>"+text+"</div>");
                        },
                        'Error': function(up, err, errTip) {

                        },
                        'Key': function(up, file) {
                            var k = new Date().format("yyyyMMddmmss")+Math.floor(Math.random()*99999)+file.name;
                            var key =k;
                            return key
                        }
                    }
                });
            }
        }
        _f.init();
    }
})(this)