const notFound =(req,res,next) =>{
    res.status(404).json({message:error.message || "Resouce is not found"})
    
    
    }
    
    module.exports = notFound;