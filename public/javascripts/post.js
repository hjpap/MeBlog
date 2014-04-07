
var ifmodify = false;
var artTypes=null;
$(document).ready(function(){
	var m = $('#ifmodify');
	if(m && m.val()=="modify"){
		ifmodify = true;
	}
	getType();
	
	(function setPostBox(){
		var radios = $('input[name="limit"]');
		var pwdInput = $('#articlepwdinput');
		if(radios.filter(':checked').val() == 2){
			pwdInput.fadeIn();
		}
		radios.click(function(){
			if(this.value == 2 ){
				pwdInput.fadeIn();
			}else{
				pwdInput.fadeOut();
			}
		});
	})();

	(function setCreateTime(){
		if(ifmodify){
			var datetime = $('#datetime');
			datetime.val(new Date(datetime.val()).format('yyyy-MM-dd hh:mm:ss'));

            artTypes=$("#artType").val();
            artTypes = artTypes.split(",");
		}else{
			$('#datetime').val(new Date().format('yyyy-MM-dd hh:mm:ss'));
		}
	})()

    $("#submitBtn").click(function(){
        var form = $("#articleForm");
        if(validate()){
            form.submit();
        }
    });
	$('#showBtn').click(function(e){
		e.defaultValue=false;
		$('#addType').fadeToggle();
	});
	$('#addTypeBtn').click(function(){
		var newtype = $('#newType').val();
		newtype=newtype.trim();
		if(!newtype){
            var toast=new Toast({text:"不能为空",time:1.5});
            toast.show();
		}else{
			addType(newtype);
		}
	});

    function validate(){
        //var toast=new UI.Toast({text:getString("noActivity"),time:1.5});
        //toast.show();
        var title = $("#title").val();
        var mytext = $("#myEditor").val();
        var sortBy = $("#sortBy").val();
        var datetime = $("#datetime").val();
        var types = $(".artiType");
        var limits = document.getElementsByName("limit");
        for(var i= 0,len=limits.length;i<len;i++){
            if((limits[i].checked || limits[i].checked == "checked") && limits[i].value == "2"){
                var pwdValue = document.getElementById("articlepwd").value;
                if(pwdValue == ""){
                    var toast=new Toast({text:"密码不能为空",time:1.5});
                    toast.show();
                    return false;
                }
                break;
            }
        }

        if(title == ""){
            var toast=new Toast({text:"标题不能为空",time:1.5});
            toast.show();
            return false;
        }
        if(mytext == ""){
            var toast=new Toast({text:"内容不能为空",time:1.5});
            toast.show();
            return false;
        }
        if(sortBy == "" && !isNaN(sortBy)){
            var toast=new Toast({text:"请正确输入排序",time:1.5});
            toast.show();
            return false;
        }
        if(datetime == ""){
            var toast=new Toast({text:"发布时间不能为空",time:1.5});
            toast.show();
            return false;
        }
        var flag = false;
        for(var i= 0,len=types.length;i<len;i++){
            if(types[i].checked){
                flag = true;
            };
        }
        if(!flag){
            var toast=new Toast({text:"请选择分类",time:1.5});
            toast.show();
        }
        return flag;
    }

    function getType(){
        $.ajax({
            url:"/ajaxGetType",
            type:"GET",
            error:function(err){
                var htmlStr="<div>无法获取数据</div>";
                $("#type-box").append(htmlStr);
            },
            success:function(data){
                // alert(JSON.stringify(data));
                var types = data.data;
                if(types && types.length>0){
                    for(var i= 0,len = types.length;i<len;i++){
                        var checked = false;
                        if(artTypes){
                            for(var j=0;j<artTypes.length;j++){
                                if(artTypes[j]==types[i]['_id']){
                                    checked = true;
                                }
                            }
                        }
                        var ifChecked = checked?"checked=checked":"";
                        var htmlStr="<div class='types-box'><input id='type' class='artiType' "+ifChecked+" name='type' type='checkbox' value='"+types[i]['_id']+"'/><label for='type'>"+types[i]['name']+"</label></div>";
                        $("#type-box").append(htmlStr);
                    }
                }else{
                    var htmlStr="<div>还没有数据</div>";
                    $("#type-box").append(htmlStr);
                }

            }
        });
    }

    function addType(val){
        $.ajax({
            url:"/addType",
            type:"GET",
            data:{typeName:val},
            error:function(err){
                var toast=new Toast({text:err,time:1.5});
                toast.show();
            },
            success:function(data){
                //alert(JSON.stringify(data));
                if(data.status==="success" && data.data){
                    var htmlStr="<div class='types-box'><input id='type' name='type' class='artiType' type='checkbox' value='"+data.data['_id']+"'/><label for='type'>"+data.data['name']+"</label></div>";
                    $("#type-box").append(htmlStr);
                }
                if(data.status==="have"){
                    var toast=new Toast({text:"已存在该类别",time:1.5});
                    toast.show();
                }
            }
        });
    }
});


