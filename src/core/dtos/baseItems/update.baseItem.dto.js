class UpdateBaseItemDTO {
  constructor(id, name, genericName, description, category, brand, countryOfOrigin, indication, contraindication, sideEffect, storageType) {
      this.id = id;
      this.name = name;
      this.description = genericName;
      this.category = description;
      this.category =category
      this.brand =brand
      this.countryOfOrigin =countryOfOrigin
      this.indication =indication
      this.contraindication =contraindication
      this.sideEffect =sideEffect
      this.storageType =storageType
  }
  async validate() {
      try {
          await validMongoObjectId(this.id)
      } catch (error) {
          throw error;
      }
  }
}
module.exports = UpdateBaseItemDTO;