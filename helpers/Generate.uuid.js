const crypto = require("crypto");

const generateUuid = () => {
  return [4, 2, 2, 2, 6]
    .map((group) => crypto.randomBytes(group).toString("hex"))
    .join("-");
};

module.exports = { generateUuid: generateUuid };
