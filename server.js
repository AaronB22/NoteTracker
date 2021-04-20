//dependencies
const express=require('express');
const app=express();
const port=3000;
const path= require('path')
const fs = require('fs');
const jsonFile = fs.readFileSync('./Develop/db/db.json')
const parsedFile= JSON.parse(jsonFile)


//uses the Develop folder to allow the js and css files to run
app.use(express.static(__dirname+`/Develop`))

//uses the express.js dependencies
app.use(express.json());

//grabs the json file. Allowing it to be used.
app.get('/api/notes',(req,res)=>{
    console.log('Getting Past Notes')
    res.sendFile(path.join(__dirname,"./Develop/db/db.json"))
})

//directs user to the notes.html page
app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"))
   
})

//directs to homepage
app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,"./Develop/public/index.html"))
})
//main functionality of saving the user data to the json file
app.post('/api/notes',(req,res)=>{
    let idArr=[]
    let dataId=0;
    let stringedId=''
    //gets all the id's from the objects and put them into an array
    const getId= ()=>{
        for(let i=0; i<parsedFile.length;i++){
            
            idArr.push(parsedFile[i].primaryid);
            
        }
       
    }
    getId()
    console.log(idArr)
    //sorts the idArr. Using bubble sort since the array is so small. Sorting the array to get the highest number in createNewId().
    const bubbleSort_idArr=(a)=>{
        let swap;
        let n=a.length-1;
        let x=a;
        do {
            swapp = false;
            for (var i=0; i < n; i++)
            {
                if (x[i] < x[i+1])
                {
                   let temp = x[i];
                   x[i] = x[i+1];
                   x[i+1] = temp;
                   swapp = true;
                }
            }
            n--;
        } while (swapp);
     return x; 
    }
    bubbleSort_idArr(idArr)
   
    //gets new id for the new object
    const createNewId=()=>{
        //gets the largest id than add one to it for the new id.
        for (let i=0; i<idArr.length;i++){
            dataId= i +1
        }
        //creates a stringed id for front-end use
        stringedId= JSON.stringify(dataId)
    }
   createNewId()
   //applies all data into an object to be merged with the JSON file
    let data= 
        {
            "title": req.body.title,
            "text": req.body.text,
            "primaryid": dataId,
            "id":stringedId,
        }
    
    parsedFile.push(data)
    //stringifies the object to be merged
    jsonData=JSON.stringify(parsedFile);
    //merges
    fs.writeFileSync('./Develop/db/db.json',jsonData, err=>{
            if(err){
                console.log('error')
                return
            }
        })
})

//directs to home.html
app.get('*',(req,res)=>{
  
    res.sendFile(path.join(__dirname,"./Develop/public/index.html"))
    
})

app.listen(port,()=>console.log(`Server now running on ${port}`))