const bcrypt = require('bcryptjs');
const hash = '$2b$10$xoLpOYYct8GUILCcD1gDwuVeuOwQv9gFYfGxLN15b0lDgkZSRWkle';
bcrypt.compare('123456', hash).then(r => console.log('Result:', r));