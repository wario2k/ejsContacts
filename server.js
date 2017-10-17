var connect = require('connect'); 
var logger = require('morgan'); 
var http = require('http'); 
var ejs = require('ejs');  
var serve_static = require('serve-static');
//var bodyparse = require('body-parser');


var app = connect()
    .use (logger('dev'))
    .use(serve_static('public'))
    //.use (bodyparse())
    .use (serve);


http.createServer(app).listen(3000, function(){
    console.log("Server Running on port 3000")
});

//global list
var list = [];

function serve (req, res) {
    if(req.method == 'POST'){
        process_post(req,res);
    }
    else{
        process_get(req,res)
    }
    
}

//rendering ejs files
function render (res, view, model) {
     ejs.renderFile(view + ".ejs" ,model,
        function(err, result) {
            if (!err) {
                res.end(result);
            }
            else {
            	console.log(err)
            	res.end("ERROR");
                
            }
        }
    );
}

function process_post(req, res) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    
    //break point
    req.on('end', function() {
        qs = require('querystring')
        var response = "<html><body><h1>Contact Information Submitted</h1>";
        var post =  qs.parse(body);

        var contact = qs.parse(body);
        
        var newContact = [];
        var phone = "No", email= "No", mail ="No"
        for ( q in post ) {
            newContact.push(post[q])  
        }

        //check if any selected does not go into further checking
        if(newContact[9] == "any" || newContact[9][1] == "any" || newContact[9][2] == "any")
        {
            phone = newContact[7]
            email = newContact[8]
            mail = "Yes"
        }
        else{ 
            //if first param is phone then assigns phone and follows up with other checks
            if(newContact[9]== "ph"){
            phone = newContact[7]
            if(newContact[9][1] == "mail"){
                mail = "Yes"
            if(newContact[9][2] == "email"){
                email = newContact[8]
            }    
            }
            else if(newContact[9][1] == "email")
            {
                email = newContact[8]
            }
        }

            else if(newContact[9]=="mail"){
                mail = "Yes"
                if(newContact[9][1] == "email")
                {
                    email = newContact[8]
                }
            }

            else if(newContact[9] == "email")
            {
                email = newContact[8]
            }
            }
        
        //response page
        
        response += ("<p>Name: "+ newContact[0]+ " "+ newContact[1] +" "+newContact[2]+"<br>")
        response += ("Address: "+ newContact[3] +", "+ newContact[4] +", "+newContact[5] + " " + newContact[6] + "<br>")
        response += ("Contact by Mail: "+ mail +"<br>")
        response += ("Contact by Phone: "+ phone +"<br>")
        response += ("Contact by Email: " + email+ "<br>")
        response += ("<a href=\"contacts\">Contacts Table</a>" )
        list.push(newContact)
        response += "</body></html>";
        res.end(response);
    });
}


function process_get(req,res){
    if(req.url == "/contacts"){
        render(res,"contacts",{contact : list})
    }
    else
        {res.end("Error, Page not found!")}
}