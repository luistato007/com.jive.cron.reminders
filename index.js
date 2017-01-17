var cron = require('node-cron');
var Client = require('node-rest-client').Client;
var admin = require("firebase-admin");
const util = require('util');

var client = new Client();

admin.initializeApp({
    credential: admin.credential.cert("credentials/jive-chat-firebase-adminsdk-n0zsp-c33bd2f54f.json"),
    databaseURL: "https://jive-chat.firebaseio.com"
});

cron.schedule('* * * * *', function(){
    console.log('cron');
    var events = admin.database().ref('events');
    events.orderByChild("timestamp").on("child_added", function(snapshot){
        var event = snapshot.val();
        
        if (!event['sent']) {

            var d = new Date();
            var n = d.getTime();

            var difference = Math.floor((event['timestamp'] - n)/1000/60);
            console.log(n);
            console.log(event['timestamp']);
            console.log(difference);
            if (difference > 0 && difference < 30) {

                var participants = event['participants'].split(',');

                var args = {
                    data: {
                        body: event['title'] + " : " + event['description'],
                        recipients: participants,
                        author: event['phone']
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer eyJhbGciOiJIUzUxMiJ9.eyJzY3AiOiJqaXZlLnYxLnVuZGVmaW5lZCIsInN1YiI6ImZtZW5kZXoiLCJsZGFwIjoiUGxhdGZvcm0tQWRtaW4sIFBsYXRmb3JtLUFkbWluLCBQbGF0Zm9ybS1DdXN0b21lci1TZXJ2aWNlIiwiaXNzIjoiZGVmYXVsdCIsInR5cCI6ImFjY2VzcyIsImdudCI6IjQyYmRiM2MxLWM3ZTktNGRlYy1hMjgyLTA2MzlhZjg5ZTM3MyIsImV4cCI6MTQ4NTI5OTc0NCwianRpIjoiMDg3MWM5OTEtMDZhZC00NjJlLThlODctY2Y1OTNiOGYxMDNiIiwiY2lkIjoiNWYzMzc1ZjUtYzhmZi00M2UyLWE3NzAtODIxZDY1YzA3NzY4In0.XR9zxvqlPMaPwI6PcgE4zP18y3mBJDY1flewL03dKFZaoJswZynPH21LjkCZTmPt5TcFwKM0XZTw5ArihykwEQ'
                    }
                };

                console.log(args);

                client.post("https://api.jive.com/chat/v1/message", args, function (data, response) {
                    console.log("data: " + JSON.stringify(data));
                });

                event['sent'] = true;
                var updates = {};
                updates['/events/' + snapshot.key] = event;
                admin.database().ref().update(updates); 
            }
        }

    });
});
