const express = require("express");
require("dotenv").config();
const mongoUrl = process.env.MONGO_URL;
const MongoUtil = require("./MongoUtil");
const ObjectId = require("mongodb").ObjectId;

const cors=require('cors')

let app = express();


app.use(express.json());
app.use(cors());

async function main(){
    let db=await MongoUtil.connect(mongoUrl, 'missing_cases')

    app.get('/cases', async (req,res)=>{
        let results=await db.collection('cases').find({}).toArray();
        res.status(200);
        res.send(results);
    })

    app.post('/cases', async (req,res)=>{
        let name=req.body.name;
        let date=req.body.date;
        let location=req.body.location;
        let description=req.body.description;
        try{
            let result=await db.collection('cases').insertOne({
                name:name,
                date:date,
                location:location,
                description:description
            })
            res.status(200);
            res.send(result)
        }
        catch(e){
            res.status(500);
            res.send({
                error:'Internal server error'
            })
            console.log(e)
        }
    })
}
main()

app.listen(3000, () => {
  console.log("Server has started");
});