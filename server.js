var express = require("express");
var app = express();
var fs = require('fs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); //look into public folder to serve up frontend
var path = require('path');
var PORT = 8080;

//return notes.html file.
app.get("/notes", function(req, res){
    console.log("accessing notes")
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/", function(req, res){
    console.log("Accessing index")
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/api/notes", function(req, res){
    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data)=>{  // one slash means go to the root.
        if(err){
        console.log("Something is wrong")
        }else {
        console.log("success");
        const jsonData = JSON.parse(data);
        console.log("accessing the json file");
        res.json(jsonData);
        }
    });
});

app.post("/api/notes", function(req, res){
    let newNote = req.body;
    let currentNote = fs.readFileSync(path.join(__dirname, "/db/db.json"), (err)=>{
      if(err){
        console.log("Something is wrong")
      }else {
        console.log("success");
      }
    });
    var obj = JSON.parse(currentNote);  //turn this into an object.
    if (obj.length == 0){
      newNote.id = 1;
    }else {
      newNote.id = obj[obj.length-1].id+1;
    }
    obj.push(newNote);
    var writeToFile = JSON.stringify(obj);
    fs.writeFile(path.join(__dirname, "/db/db.json"), writeToFile, (err)=>{
        if(err){
          throw err;
        }
        console.log("Written new note!");
    })
    res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res){
    var id = req.params.id;  
    id = parseInt(id);
    let currentNote = fs.readFileSync(path.join(__dirname, "/db/db.json"), (err)=>{
      if(err){
        console.log("Something is wrong")
      }else {
        console.log("success");
      }
    });
    
    var obj = JSON.parse(currentNote);  //turn this into an object.
    for (var i = 0; i < obj.length; i++){
      if (obj[i].id === id){
        obj.splice(i, 1);
      }
    }
    var writeToFile = JSON.stringify(obj);
    fs.writeFile(path.join(__dirname, "/db/db.json"), writeToFile, (err)=>{
        if(err){
          throw err;
        }
    });
    res.json(obj);
    //So make an id property for each other, if id matches the id of the object, delete it from the array.
    //run a for each loop, if id matches the id of an object, then 
    //delete it from the element.  

})
  
app.listen(PORT, function(){
    console.log("Listening on PORT 8080");
})