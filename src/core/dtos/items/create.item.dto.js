class CreateItemDTO {
    constructor (baseItemId, code, status, manufactureDate, expiredDate, unit) {
        this.baseItemId = baseItemId;
        this.code = code
        this.status = status
        this.manufactureDate = manufactureDate
        this.expiredDate = expiredDate
        this.unit = unit
    }
}
module.exports = CreateItemDTO;