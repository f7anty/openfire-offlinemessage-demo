var BOSH_SERVICE = 'http://localhost:7070/http-bind/';
var connection = null;

// 创建自己的命名空间对象MessageHandler
var MessageHandler = {
    connection: null,
    // 输出日志
    log: function(msg){
        $('#log').append("<p>"+msg+"</p>");
    },
    // 定义打招呼用的节内容，并连接server。连接成功以后调用handler操作。
    send_ping: function(to){
        var ping = $iq({
            to: to,
            type: "get",
            id: "getOfflineMsg"
        }).c("message", {xmlns: "com:ls:im:offlineMsg"});
        MessageHandler.log("Sending ping to "+to+".");
        MessageHandler.connection.send(ping);
    },
    // 连接后的handler方法
    handle_pong: function(iq){//这里只是简单的获取IQ的信息，根据业务情况进行处理
    	
    	var to = iq.getAttribute('to');
    	var from = iq.getAttribute('from');
    	MessageHandler.log("Message: from "+from+" to "+to+" \n\r message count:" +iq.textContent);//返回的iq是单个节点，故简单的用iq.textContent
        return true;//不销毁
    }
}
// XMPP连接通过Strophe.Connection对象管理
$(document).ready(function(){
	$("#btnConnect").click(function(){
	    $(document).trigger('connect', {//启动connect自定义事件，传入jid和password
            jid: $('#jid').val(),
            password: $('#password').val()
        });
	});
	
	
	$("#btnOnline").click(function(){
	    $(document).trigger('online', {//用户上线
            jid: $('#jid').val(),
            password: $('#password').val()
        });
	});
	
	
	$("#btnDisconnect").click(function(){//释放连接
		 $(document).trigger('disconnected');
	});

    // 1) 处理XMPP的connect事件，即创建Strophe.Connection对象并调用connect()方法。
    // 2) 提供一个能够相应连接状态变化的回调函数
    $(document).bind('connect', function(ev, data){
        var conn = new Strophe.Connection(BOSH_SERVICE);
        conn.connect(data.jid, data.password, function(status){
            if(status == Strophe.Status.CONNECTED){
            	
                $(document).trigger('connected');
            }else if(status == Strophe.Status.DISCONNECTED){
                $(document).trigger('disconnected');
            }
        });    
        MessageHandler.connection = conn;
            
    });
     
    $(document).bind('connected', function(){
        MessageHandler.log("Connection established.");// 通知用户
        //addHandler:function (handler,ns,name,type,id,from,options)
        MessageHandler.connection.addHandler(MessageHandler.handle_pong, "com:ls:im:offlineMsg", "iq", "result", "getOfflineMsg",null);// handler在send_ping里的send完成之后立马执行，此处只是提前声明handler
        var domain = Strophe.getDomainFromJid(MessageHandler.connection.jid);
        console.log(domain);
        MessageHandler.send_ping(domain);
    });
     
    $(document).bind('disconnected', function(){
        MessageHandler.log("Connection terminated.");
        MessageHandler.connection = null;// 释放已销毁的connection对象引用
    });
    
    $(document).bind('online', function(ev, data){

    	 MessageHandler.connection.send($pres().tree());
    	 MessageHandler.log("user is online,clear offline message");
    });
       
});



































/*function notifyUser(msg) 
{
    if (msg.getAttribute('from') == "admin@172.21.200.8") {
    	var elems = msg.getElementsByTagName('body');
    	var body = elems[0];
    	$('#notifications').append(Strophe.getText(body));
    }
	return true;
}

function onConnect(status)
{
	if (status == Strophe.Status.CONNECTED) {
		connection.addHandler(notifyUser, null, 'message', null, null,  null);
		connection.send($pres().tree());
	}		
}

$(document).ready(function () {

    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.connect(	"admin@app1",
	    					"receivinguserpass",
	    					onConnect);
    });*/
