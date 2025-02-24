const createError =(code,message)=>{
//step 1: Create Error
const error = new Error(message);
error.statusCode = code
throw error;
};


module.exports =createError;