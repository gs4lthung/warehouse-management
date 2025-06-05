const { default: mongoose } = require("mongoose");

let convertToObjectId=(id)=>{
    return new mongoose.Types.ObjectId(id)
}

module.exports = {
    convertToObjectId
}