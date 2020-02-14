const express = require('express');
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;

const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');

mongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    console.log(err);
  }
  else {
    console.log('Successfully connected to the database');
    const db = client.db('companyDB');
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api', employeesRoutes);
    app.use('/api', departmentsRoutes);
    app.use('/api', productsRoutes);

    // find
    db.collection('employees').find(
      { department: 'IT' }, 
        (err, data) => {
          if(!err) {
            data.each((error, employee) => {
              console.log(employee);
            })
          }
        });  

    // findOne
    db.collection('employees').findOne(
      { department: 'IT' }, 
        (err, data) => {
          if(!err) {
            console.log(data);
          }
        });

    // insertOne
    // db.collection('departments').insertOne(
    //   { name: 'Management' }, 
    //     err => {
    //       if(err) console.log('err');
    //     });

    // updateOne
    // db.collection('employees').updateOne(
    //   { department: 'IT' }, 
    //   { $set: { salary: 6000 }}
    // );

    // updateOne + callback
    db.collection('employees').updateOne(
      { department: 'IT' }, 
      { $set: { salary: 6000 }}, 
        err => {
          if(err) console.log(err);
        });
     
    // deleteOne
    db.collection('departments').deleteOne(
      { name: 'Management' }, 
        (err) => {
          if(err) console.log(err);
        });

    app.use((req, res) => {
      res.status(404).send({ message: 'Not found...' });
    })

    app.listen('8000', () => {
      console.log('Server is running on port: 8000');
    });
  }
});