export const globalError = (err, req, res, next) => {
        let code = err.statusCode || 500;
        res.status(code).json({
            error: "error",
            messages: err.message,
            code,
            stack: err.stack
        });
        next();
    
};



export function catchError (func) {
    return async (req, res , next)=>{
        func( req , res , next).catch(err=> next(err))
    }
  }
