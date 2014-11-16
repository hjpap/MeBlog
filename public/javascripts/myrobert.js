/**
 * Created by Administrator on 2014/11/16.
 */
(function(){
    var host = $("#robothost");
    var robot;
    var _f = {
        initRobot:function(){
            robot = new WebRobot(host,{});
            robot.defaultRobotState = function(){
                robot.blinkEye();
                robot.setHandDefault();
            }
            robot.defaultRobotState();
            robot.bodyMouseDownHandle = function(){
                robot.defaultRobotState();
                robot.raiseHeightHead();
                robot.bigBody();
                robot.startEye();
                robot.waveHand();
            }
            robot.bodyMouseUpHandle = function(){
                robot.defaultRobotState();
                robot.bigBodyToDefault();
                robot.heightToRaiseHead();
            }
            robot.bodyMouseOverHandle = function(){
                robot.startEye();
            }
            robot.bodyMouseLeaveHandle = function(){
                robot.blinkEye();
            }
        },
        init:function(){
            this.initRobot();
        }
    }
    _pageEvent = {
        selectEvent:function(){
            $("#actionselect").on("change.changeEvent",function(){
                switch (this.value){
                    case "defaultcss":
                        robot.setDefaultCss();
                        break;
                    case "blinkEye":
                        robot.blinkEye();
                        break;
                    case "squintEye":
                        robot.squintEye();
                        break;
                    case "startEye":
                        robot.startEye();
                        break;
                    case "raiseHead":
                        robot.raiseHead();
                        break;
                    case "retractedHead":
                        robot.retractedHead();
                        break;
                    case "heightToRaiseHead":
                        robot.heightToRaiseHead();
                        break;
                    case "raiseHeightHead":
                        robot.raiseHeightHead();
                        break;
                    case "waveHand":
                        robot.waveHand();
                        break;
                    case "bigBody":
                        robot.bigBody();
                        break;
                    case "bigBodyToDefault":
                        robot.bigBodyToDefault();
                        break;
                    case "say":
                        robot.say();
                        break;
                    case "fretfully":
                        robot.fretfully();
                        break;
                }
            });
        },
        sayEvent:function(){
            var i = 0;
            setInterval(sayInter = function(){
                var stri;
                switch (i){
                    case 0:
                        stri="zZZZ...";
                        break;
                    case 1:
                        stri = "Hello , I'm Ricky.";
                        break;
                    case 2:
                        stri = "Welcome to my blog .";
                        break;
                    case 3:
                        stri = "please contact me if you have anything question ."
                        break;
                    case 4:
                        stri = false;
                        break;
                }
                if(stri!==false)
                    robot.say(stri);
                else
                    robot.showMsg(stri);
                i==4?i=0:i++;
            },4000);
        },
        init:function(){
            this.selectEvent();
            this.sayEvent();
        }
    }
    _f.init();
    _pageEvent.init();
    window.myRotbot = {
        robot:robot
    };
})();