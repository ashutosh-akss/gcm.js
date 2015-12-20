var http = require('http');
var querystring = require('querystring');

var gcmjs = {

   gcm_server_url:'android.googleapis.com',
   gcm_server_path:'/gcm/send',
   gcm_server_port:80,
   gcm_server_method:'POST',
   debug_mode:false,
   preserve_message:true,
   server_key:'',
   devices:[],
   send:function(user_message){
   		// Code for validation
   		if(!this.server_key || !this.server_key.length){
   			return this.handleError("Please enter a valid server key");
   		}else if(this.devices.length < 1){
   			return this.handleError("You must enter atleast 1 Device token");
   		}else if(typeof user_message !== 'object'){
   			return this.handleError("Please enter a valid message, it should be an object eg : {title:'New Comment',message:'you have 2 unread messages'}");
   		}

   		//Form GCM Message based on condition
   		var formatted_message = {
			notId:this.preserve_message?(Math.floor(Math.random() * 9999999) + 1000000):'1',
		    title:(typeof user_message.title !== 'undefined')?user_message.title:'New Notification',
		    message:user_message.message?user_message.message:'No Content',
   		}
   		console.log(formatted_message)

   		// Actual code to send Message
   		var post_data = {
			registration_ids:this.devices,
			data:formatted_message
   		}

   		var options = {
		  hostname: this.gcm_server_url,
		  path: this.gcm_server_path,
		  port: this.gcm_server_port,
		  method: this.gcm_server_method,
		  headers:{
		  	'Content-Type': 'application/json',
		  	'Authorization': 'key='+this.server_key,
		  }
		};

		var req = http.request(options, function(res) {
		  console.log('STATUS: ' + res.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.setEncoding('utf8');

		  res.on('data', function (chunk) {
		    console.log('BODY: ' + chunk);
		  });

		  res.on('end', function() {
		    console.log('No more data in response.')
		  });

		  res.on('error', function(err) {
		    console.log('Error in response')
		  });

		});

		req.write(JSON.stringify(post_data));

		req.end();

		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

   },/*send*/

   handleError:function(msg){
   	 if(this.debug_mode) console.log(msg);
   	 return msg;
   },/*handleError*/

}

module.exports = gcmjs;