// Bước 2: Tạo mảng tạm users
let users = [
    { id: 1, name: 'Lê Văn Sĩ', email: 'si224697@student.nctu.edu.vn' },
    { id: 2, name: 'Trần Minh Kha', email: '220576@student.nctu,edu.vn' }
];

// Biến dùng để tạo id mới cho người dùng
let nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

// ------------------------------------------------------------------
// BƯỚC 3: Viết API
// ------------------------------------------------------------------

// 1. API GET /users: Lấy tất cả người dùng
exports.getAllUsers = (req, res) => {
    // Trả về mảng users dưới dạng JSON
    res.status(200).json(users);
};

// 2. API POST /users: Tạo người dùng mới
exports.createUser = (req, res) => {
    // Lấy dữ liệu từ body của request
    const { name, email } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !email) {
        return res.status(400).json({ message: 'Tên và Email là bắt buộc.' });
    }

    // Tạo đối tượng người dùng mới
    const newUser = {
        id: nextId++, // Tăng id cho lần sau
        name,
        email
    };

    // Thêm người dùng mới vào mảng
    users.push(newUser);

    // Trả về đối tượng người dùng vừa tạo với mã 201 (Created)
    res.status(201).json(newUser);
};