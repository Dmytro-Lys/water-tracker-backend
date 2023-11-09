export const handleSaveError = (error, data, next) => {
    const { name, code } = error;
    const email = error.keyValue?.email
    error.status =  400;
    if (name === "MongoServerError" && code === 11000) {
        error.status = 409;
        if (email) error.message = "Email in use"
    }
    next();
}

export const runValidatorsAtUpdate = function(next) {
    this.options.runValidators = true;
    this.options.new = true;
    next();
}