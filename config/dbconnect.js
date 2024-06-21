const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
mongoose.set('strictQuery', false);

const password = encodeURIComponent("tttt2024group2#@")
const connectDB = `mongodb://internship_group_2:${password}@dtuct.ddns.net:6969/DASHBOARD_COMMENT`
const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(connectDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Kết nối cơ sở dữ liệu thành công!');
        return conn.connection; // Trả về đối tượng kết nối
    } catch (error) {
        console.error('Kết nối cơ sở dữ liệu thất bại:', error);
        throw new Error(error);
    }
}

module.exports = dbConnect;
