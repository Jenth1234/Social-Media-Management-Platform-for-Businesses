class Cache {
    constructor() {
        this.data = {};
    }

    put(key, value, ttl = 0) {
        // Kiểm tra xem ttl có được đặt không
        if (ttl === 0) {
            // Nếu không, lưu giá trị vào cache với key tương ứng
            this.data[key] = { value: value, expires: null };
        } else {
            // Nếu có, tính toán thời gian hết hạn và lưu giá trị vào cache
            const expiration = Date.now() + ttl;
            this.data[key] = { value: value, expires: expiration };
        }
    }

    get(key) {
        const item = this.data[key];
        if (!item) {
            // Nếu không tìm thấy key trong cache
            return undefined;
        }
        if (item.expires !== null && item.expires < Date.now()) {
            // Nếu key đã hết hạn
            delete this.data[key];
            return undefined;
        }
        // Trả về giá trị của key nếu nó tồn tại và chưa hết hạn
        return item.value;
    }

    remove(key) {
        // Xóa key khỏi cache
        delete this.data[key];
    }

    clear() {
        // Xóa tất cả các key trong cache
        this.data = {};
    }
}

// Sử dụng cache
const cache = new Cache();

// Đặt giá trị 'bar' cho key 'foo' trong cache
cache.put('foo', 'bar');

// Lấy giá trị của key 'foo' từ cache và log ra console
console.log(cache.get('foo')); // Output: bar

module.exports = new Cache();