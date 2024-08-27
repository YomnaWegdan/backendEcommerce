// import { connect } from 'mongoose';

// export const dbConnection = async () => await connect("mongodb+srv://yomna:123654@cluster0.iarxr2l.mongodb.net/ecommerce").then(()=>{
//     console.log('database connected'); 
// }).catch((err)=>{
//     console.log({msg: 'database not connected', err});
// });


import { connect } from 'mongoose';

export const dbConnection = async () => await connect(process.env.DB_Online).then(()=>{
    console.log('database connected'); 
}).catch((err)=>{
    console.log({msg: 'database not connected', err});
});
