const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const User = require('./models/Usermodel.js');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    await User.deleteMany({ email: { $in: ['abhijit@test.com', 'rohan@test.com'] } });
    console.log('✅ Test users deleted');
    process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
