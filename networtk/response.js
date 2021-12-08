//Se encarga de enviar el response en cada endpoint

function success(req, res, message,obj,status=200) {
    let bodyMessage=obj;
    if (!status) {
        status = 200;
    }
    res.status(status).send({ 
        status: status,
        message:message, 
        body: bodyMessage
    });
}

function error (req, res, obj,message="Internal server Error",status=500) {
    res.status(status).send({ 
        status: status,
        message:message, 
        body: obj
    });
}

module.exports = {success, error}