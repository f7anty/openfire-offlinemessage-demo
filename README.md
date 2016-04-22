# openfire-offlinemessage-demo
调用openfire-offlinemessage插件

### 流程

* 用户登录到业务系统并且登录openfire服务端，通过strophe建立长连接监听，并向服务端请求当前的离线消息数，
服务端接收请求发送当前用户的离线消息数。此后用户收到离线消息，由服务端自行推送消息数量给客户端
