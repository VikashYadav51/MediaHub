const asynHandler = (requestHandler) =>{
    return (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => {
            if (typeof next === 'function') {
                next(err);
            } else {
                throw err;
            }
        });
    }
}

export default asynHandler;

