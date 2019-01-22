const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const axios = require('axios');

const CategoryType = new GraphQLObjectType({
  name:'Category',
  fields: ()=>( {
    id:{type:GraphQLString},
    name:{type:GraphQLString},
    products:{
      type:new GraphQLList(ProductType),
      resolve(parentValue,args){
        return axios.get(`http://localhost:3000/categories/${parentValue.id}/products`)
        .then(res=>res.data);
      }
    }
  })
});

const ProductType = new GraphQLObjectType({
  name:'Product',
  fields: ()=>( {
    id:{type:GraphQLString},
    name:{type:GraphQLString},
    image:{type:GraphQLString},
    price:{type:GraphQLInt},
    category:{
      type:CategoryType,
      resolve(parentValue,args){
        return axios.get(`http://localhost:3000/categories/${parentValue.categoryId}`)
        .then(res => res.data);
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({

  name:'RootQueryType',
  fields:{
    products:{
      type: new GraphQLList(ProductType),
      resolve(parentValue,args){
        return axios.get('http://localhost:3000/products')
          .then(res => res.data);
      }
    },

    product:{
      type:ProductType,
      args:{ id: { type:GraphQLString } },
      resolve(parentValue,args){
        return axios.get('http://localhost:3000/products/'+ args.id)
        .then(res => res.data);
      }
    },

    categories:{
      type: new GraphQLList(CategoryType),
      resolve(parentValue,args){
        return axios.get('http://localhost:3000/categories')
          .then(res => res.data);
      }
    },

    category:{
      type:CategoryType,
      args:{id:{type:GraphQLString}},
      resolve(parentValue,args){
        return axios.get(`http://localhost:3000/categories/${args.id}`)
        .then(res=>res.data);
      }
    }

  }

});

const mutation = new GraphQLObjectType({
  name:"Mutation",
  fields:{

    addCategory:{
      type:CategoryType,
      args:{
        name:{type: new GraphQLNonNull ( GraphQLString)}
      },
      resolve(parentValue,args){
        return axios.post(`http://localhost:3000/categories`,args)
        .then(res=>res.data);
      }
    },

    deleteCategory:{
      type:CategoryType,
      args:{
        id:{type:GraphQLString}
      },
      resolve(parentValue,args){
        return axios.delete(`http://localhost:3000/categories/${args.id}`)
        .then(res=>res.data);
      }
    },

    editCategory:{
      type:CategoryType,
      args:{
        id:{type:GraphQLString},
        name:{type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue,args){
        return axios.patch(`http://localhost:3000/categories/${args.id}`,args)
        .then(res =>res.data);
      }
    }

  }
});

module.exports = new GraphQLSchema({
  query:RootQuery,
  mutation
});
