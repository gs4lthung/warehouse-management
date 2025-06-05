class CreateBaseItemDTO {
    constructor(name,genericName,description,category, brand, countryOfOrigin, indication, contraindication, sideEffect, storageType) {
        this.name = name;
        this.genericName = genericName;
        this.description = description;
        this.category = category;
        this.brand = brand;
        this.countryOfOrigin = countryOfOrigin;
        this.indication = indication;
        this.contraindication = contraindication;
        this.sideEffect = sideEffect;
        this.storageType = storageType;
    }
}
module.exports = CreateBaseItemDTO;