const USER_ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  REPORT_STAFF: "Report Staff",
  INVENTORY_STAFF: "Inventory Staff",
  SUPPLIER: "Supplier",
  CUSTOMER: "Customer",
};

const FILTER_USER = {
  NORMAL_USER: {
    isDeleted: false,
  },
  DELETED_USER: {
    isDeleted: true
  },
}

const SELECT_USER = {
  DEFAULT: "fullName email role",
  FULL: "fullName email role isDeleted"
}

module.exports = { USER_ROLES, FILTER_USER, SELECT_USER };
