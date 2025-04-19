const generateResponse = (success, statusCode, data) => {
    const response = {
        success,
        statusCode,
        data,
    };

    return response;
};

module.exports = generateResponse;
