const { customAlphabet } = require("nanoid");

const generateMedicineCode = (name) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const nanoid = customAlphabet('0123456789', 3); 
    return `${prefix}-${nanoid()}`;
};

module.exports = {generateMedicineCode}