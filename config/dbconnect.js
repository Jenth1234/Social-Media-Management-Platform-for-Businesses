const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const password = encodeURIComponent("tttt2024group2#@")
const connectDB = `mongodb://internship_group_2:${password}@dtuct.ddns.net:6969/DASHBOARD_COMMENT`
const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(connectDB);
        if (conn.connection.readyState === 1) console.log('connect success!');
        else console.log('connecting to the database...');
    } catch (error) {
        console.log('Database connection failed');
        throw new Error(error);
    }
}

module.exports = dbConnect;
