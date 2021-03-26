const express = require('express');
// const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'uCnNWie5zMd5jHuN';

const uri = "mongodb+srv://organicUser:uCnNWie5zMd5jHuN@cluster0.ggzrw.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false})
);

app.get('/',(req,res)=>{
   res.sendFile(__dirname + '/index.html');
})




client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
  app.get("/products",(req,res)=>{
    productCollection.find({})
    .toArray((err, documents)=>{
        res.send(documents);
    })
  })
  app.get('/product/:id',(req,res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,documents)=>{
        res.send(documents[0]);
    })
  })

  app.get('/product/:id',(req,res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,documents)=>{
        res.send(documents[0]);
    })
  })

    app.post("/addProduct",(req, res)=>{
        const product = req.body;
        productCollection.insertOne(product)
        .then(result =>{
            console.log('one product added');
            // res.send('success');
            res.redirect('/');
        })
       
    })

    app.patch('/update/:id',(req,res)=>{
        console.log(req.body.price);
        productCollection.updateOne({_id:ObjectId(req.params.id)},
        {
            $set: {price : req.body.price,quantity: req.body.quantity }
        }
        )  
        .then (result =>{
            res.send(result.modifiedCount > 0)
        })
    })
  
    app.delete('/delete/:id',(req,res)=>{
        console.log(req.params.id);
        productCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then ((result)=>{
           res.send(result.deletedCount > 0)
        })
    })

});


app.listen(3000);