const express = require('express');

const expressGraphQL = require('express-graphql');

const schema = require('./schemas/schema');

const app = express();

app.use('/graphql',expressGraphQL({
  schema,
  graphiql:true
}));

app.get('/', (req,res)=>{
  res.send('<h1>Welcome</h1>');
});

const port = process.env.PORT || 5000;
app.listen(port,()=>{
  console.log(`Server Running on port ${port}`);
})
