$(document).ready(function(){

    /*  page event  */
    var searchKey = $("#searchKey").val() || "";
    var filterDate = $("#filterDate").val();
    var filterTag = $("#filterTag").val();
    var nowPage = $("#nowPage").val();
    $(".nowpage").val(nowPage);
    var pageCount = $("#pageCount").val();
    $(".nowpage").change(function(){
        window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p="+this.value;
    });

    if(pageCount == "1"){
        $(".firstPage").css({color:"#ddd"});
        $(".prePage").css({color:"#ddd"});
        $(".lastPage").css({color:"#ddd"});
        $(".nextPage").css({color:"#ddd"});
    }else if(nowPage == "1"){
        $(".firstPage").css({color:"#ddd"});
        $(".prePage").css({color:"#ddd"});
        $(".lastPage").click(function(){
            window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p="+pageCount;
        });
        $(".nextPage").click(function(){
            window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p="+(parseInt(nowPage)+1);
        });
    }else if(nowPage == pageCount){
        $(".firstPage").click(function(){
            window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p=1"
        });
        $(".prePage").click(function(){
            window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p="+(parseInt(nowPage)-1);
        });
        $(".lastPage").css({color:"#ddd"});
        $(".nextPage").css({color:"#ddd"});
    }else{
        $(".firstPage").click(function(){
            window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p=1"
        });
        $(".prePage").click(function(){
            window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p="+(parseInt(nowPage)-1);
        });
        $(".lastPage").click(function(){
            window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p="+pageCount;
        });
        $(".nextPage").click(function(){
            window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p="+(parseInt(nowPage)+1);
        });
    }
    /*  page event end  */

    $("#filterTag").change(function(){
        window.location="/adminlist?filterdate="+filterDate+"&filtertag="+this.value+"&searchkey="+searchKey+"&p=1";
    });

    $("#filterDate").change(function(){
        window.location="/adminlist?filterdate="+this.value+"&filtertag="+filterTag+"&searchkey="+searchKey+"&p=1";
    });

    $("#searchbtn").click(function(){
        window.location="/adminlist?filterdate="+filterDate+"&filtertag="+filterTag+"&searchkey="+ $("#searchKey").val()+"&p=1";
    });

    $("#checkall").change(function(){
        var checkboxes = $(".articlecheckbox");
        for(var i= 0,len=checkboxes.length;i<len;i++){
            checkboxes[i].checked=this.checked
        }
    });

});