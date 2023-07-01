module.exports = (err, req, res, next) => {
    return res.json({
        message: err.message,
        statusCode: err.statusCode,
        data: err
    });
}