
//Just an ASYNC Function Wrapper that Catches Errors and Sends to MiddleWare
module.exports = func => {
    return (req,res,next) => {
        func(req,res,next).catch(next);
    }
}