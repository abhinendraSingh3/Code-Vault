 //this is for the jwt module which will be imported by authmodule in order to extract the secret fron this file.
 
 console.log('JWT Secret is being loaded', process.env.jwtSecret);

 export const jwtConst={
    secret: process.env.jwtSecret 
    
 }