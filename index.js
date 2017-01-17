console.log("Hola Mundo");
var cron = require('node-cron');

var Client = require('node-rest-client').Client;
 
var client = new Client();

var message = "test cron";
var participants = ["4243219814"];
var author = "+13852690621";

var args = {
    data: {
        body: message,
        recipients: participants,
        author: author
    },
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer eyJhbGciOiJIUzUxMiJ9.eyJzY3AiOiJqaXZlLnYxLnVuZGVmaW5lZCIsInN1YiI6ImZtZW5kZXoiLCJsZGFwIjoiUGxhdGZvcm0tQWRtaW4sIFBsYXRmb3JtLUFkbWluLCBQbGF0Zm9ybS1DdXN0b21lci1TZXJ2aWNlIiwiaXNzIjoiZGVmYXVsdCIsInR5cCI6ImFjY2VzcyIsImdudCI6ImZlNzhiYTVhLTE5YmEtNDE2Zi1iYzgwLTI1MDI5ZWQ3ZTEzMiIsImV4cCI6MTQ4NTE5MTA5MSwianRpIjoiNDMwODZmNTktYTJiYi00Yjg0LTgxYmQtYTJmZDVmZmIxMDAzIiwiY2lkIjoiNWYzMzc1ZjUtYzhmZi00M2UyLWE3NzAtODIxZDY1YzA3NzY4In0.NPyo_aGqtAjNo6WBa1bsjRdZzod4_z2whn-MkDBOz0ZRt9rpme71nNDiuNd7wqG8gTscYV7CgC8SZrFHMtdXcQ'
    }
};

cron.schedule('* * * * *', function(){
    client.post("https://api.jive.com/chat/v1/message", args, function (data, response) {
        // parsed response body as js object 
        console.log("data: " + JSON.stringify(data));
    });
    console.log('running a task every minute');
});