// src/mockData.js

// Đây là cấu trúc dữ liệu mà backend của bạn sẽ trả về
export const mockSuggestions = [
    {
        specialtyName: "Nội tiêu hóa",
        departmentName: "Khoa Nội Tổng Hợp",
        branches: [
            {
                branchName: "Bệnh viện A - Chi nhánh trung tâm",
                address: "123 Nguyễn Văn Cừ, Quận 1, TP.HCM",
                phoneNumber: "0123456789",
                coordinates: { latitude: 10.7769, longitude: 106.7009 },
            },
            {
                branchName: "Phòng khám Đa khoa B",
                address: "456 Lê Lợi, Quận 3, TP.HCM",
                phoneNumber: "0987654321",
                coordinates: { latitude: 10.782, longitude: 106.695 },
            },
        ],
    },
    {
        specialtyName: "Tim mạch",
        departmentName: "Khoa Tim Mạch Can Thiệp",
        branches: [
            {
                branchName: "Bệnh viện A - Chi nhánh trung tâm",
                address: "123 Nguyễn Văn Cừ, Quận 1, TP.HCM",
                phoneNumber: "0123456789",
                coordinates: { latitude: 10.7769, longitude: 106.7009 },
            },
        ],
    },
    // {
    //     specialtyName: "Thần kinh",
    //     departmentName: "Khoa Nội Thần Kinh",
    //     branches: [
    //         {
    //             branchName: "Bệnh viện C - Chuyên khoa Thần kinh",
    //             address: "789 An Dương Vương, Quận 5, TP.HCM",
    //             phoneNumber: "02838554269",
    //             coordinates: { latitude: 10.756, longitude: 106.666 },
    //         },
    //     ],
    // },
    {
        specialtyName: "Hô hấp",
        departmentName: "Khoa Hô Hấp",
        branches: [
            {
                branchName: "Bệnh viện D",
                address: "12 Trần Hưng Đạo, Quận 5, TP.HCM",
                phoneNumber: "02839393939",
                coordinates: { latitude: 10.75, longitude: 106.66 },
            },
        ],
    },
    {
        specialtyName: "Da liễu",
        departmentName: "Khoa Da Liễu",
        branches: [
            {
                branchName: "Phòng khám Da Liễu Sài Gòn",
                address: "101 Pasteur, Quận 3, TP.HCM",
                phoneNumber: "02838383838",
                coordinates: { latitude: 10.78, longitude: 106.69 },
            },
        ],
    },
    {
        specialtyName: "Tai Mũi Họng",
        departmentName: "Khoa Tai Mũi Họng",
        branches: [
            {
                branchName: "Bệnh viện Tai Mũi Họng TP.HCM",
                address: "155B Trần Quốc Thảo, Quận 3, TP.HCM",
                phoneNumber: "02839312345",
                coordinates: { latitude: 10.787, longitude: 106.686 },
            },
        ],
    },
    {
        specialtyName: "Chấn thương chỉnh hình",
        departmentName: "Khoa Chấn Thương Chỉnh Hình",
        branches: [
            {
                branchName: "Bệnh viện Chấn Thương Chỉnh Hình",
                address: "929 Trần Hưng Đạo, Quận 5, TP.HCM",
                phoneNumber: "02838554210",
                coordinates: { latitude: 10.76, longitude: 106.67 },
            },
        ],
    },
    // {
    //     specialtyName: "Ngoại thần kinh",
    //     departmentName: "Khoa Ngoại Thần Kinh",
    //     branches: [
    //         {
    //             branchName: "Bệnh viện Nhân Dân 115",
    //             address: "527 Sư Vạn Hạnh, Quận 10, TP.HCM",
    //             phoneNumber: "02838658115",
    //             coordinates: { latitude: 10.772, longitude: 106.667 },
    //         },
    //     ],
    // },
    {
        specialtyName: "Sản phụ khoa",
        departmentName: "Khoa Sản Phụ",
        branches: [
            {
                branchName: "Bệnh viện Từ Dũ",
                address: "284 Cống Quỳnh, Quận 1, TP.HCM",
                phoneNumber: "02854042629",
                coordinates: { latitude: 10.766, longitude: 106.692 },
            },
        ],
    },
    {
        specialtyName: "Nhi khoa",
        departmentName: "Khoa Nhi",
        branches: [
            {
                branchName: "Bệnh viện Nhi Đồng 1",
                address: "341 Sư Vạn Hạnh, Quận 10, TP.HCM",
                phoneNumber: "02839271119",
                coordinates: { latitude: 10.775, longitude: 106.668 },
            },
        ],
    },
    {
        specialtyName: "Thận - Tiết niệu",
        departmentName: "Khoa Thận - Tiết Niệu",
        branches: [
            {
                branchName: "Bệnh viện Bình Dân",
                address: "371 Điện Biên Phủ, Quận 3, TP.HCM",
                phoneNumber: "02838394747",
                coordinates: { latitude: 10.78, longitude: 106.69 },
            },
        ],
    },
    {
        specialtyName: "Ung bướu",
        departmentName: "Khoa Ung Bướu",
        branches: [
            {
                branchName: "Bệnh viện Ung Bướu TP.HCM",
                address: "3 Nơ Trang Long, Bình Thạnh, TP.HCM",
                phoneNumber: "02838412636",
                coordinates: { latitude: 10.82, longitude: 106.693 },
            },
        ],
    },
    {
        specialtyName: "Huyết học",
        departmentName: "Khoa Huyết Học",
        branches: [
            {
                branchName: "Viện Huyết học Truyền máu",
                address: "118 Hồng Bàng, Quận 5, TP.HCM",
                phoneNumber: "02838589654",
                coordinates: { latitude: 10.756, longitude: 106.671 },
            },
        ],
    },
    {
        specialtyName: "Răng hàm mặt",
        departmentName: "Khoa Răng Hàm Mặt",
        branches: [
            {
                branchName: "Bệnh viện Răng Hàm Mặt Trung Ương",
                address: "201A Nguyễn Chí Thanh, Quận 5, TP.HCM",
                phoneNumber: "02838535178",
                coordinates: { latitude: 10.76, longitude: 106.675 },
            },
        ],
    },
    {
        specialtyName: "Nội tiết",
        departmentName: "Khoa Nội Tiết",
        branches: [
            {
                branchName: "Bệnh viện Nội Tiết",
                address: "6 Nguyễn Thông, Quận 3, TP.HCM",
                phoneNumber: "02839320468",
                coordinates: { latitude: 10.78, longitude: 106.684 },
            },
        ],
    },
    {
        specialtyName: "Tiêu hóa gan mật",
        departmentName: "Khoa Tiêu Hóa Gan Mật",
        branches: [
            {
                branchName: "Bệnh viện Đại Học Y Dược",
                address: "215 Hồng Bàng, Quận 5, TP.HCM",
                phoneNumber: "02838555338",
                coordinates: { latitude: 10.755, longitude: 106.663 },
            },
        ],
    },
    {
        specialtyName: "Chăm sóc giảm nhẹ",
        departmentName: "Khoa Chăm Sóc Giảm Nhẹ",
        branches: [
            {
                branchName: "Bệnh viện H.O.P.E",
                address: "25 Nguyễn Văn Đậu, Bình Thạnh, TP.HCM",
                phoneNumber: "02838388222",
                coordinates: { latitude: 10.81, longitude: 106.68 },
            },
        ],
    },
    {
        specialtyName: "Hồi sức cấp cứu",
        departmentName: "Khoa Hồi Sức Tích Cực",
        branches: [
            {
                branchName: "Bệnh viện Chợ Rẫy",
                address: "201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
                phoneNumber: "02838554137",
                coordinates: { latitude: 10.759, longitude: 106.66 },
            },
        ],
    },
    {
        specialtyName: "Phục hồi chức năng",
        departmentName: "Khoa Phục Hồi Chức Năng",
        branches: [
            {
                branchName: "Bệnh viện Phục Hồi Chức Năng",
                address: "1A Lý Thường Kiệt, Quận 10, TP.HCM",
                phoneNumber: "02838650077",
                coordinates: { latitude: 10.774, longitude: 106.671 },
            },
        ],
    },
    // {
    //     specialtyName: "Tâm thần",
    //     departmentName: "Khoa Tâm Thần",
    //     branches: [
    //         {
    //             branchName: "Bệnh viện Tâm Thần TP.HCM",
    //             address: "766 Võ Văn Kiệt, Quận 5, TP.HCM",
    //             phoneNumber: "02839550810",
    //             coordinates: { latitude: 10.754, longitude: 106.675 },
    //         },
    //     ],
    // },
    {
        specialtyName: "Dinh dưỡng",
        departmentName: "Khoa Dinh Dưỡng",
        branches: [
            {
                branchName: "Viện Dinh Dưỡng TP.HCM",
                address: "91 Phạm Ngọc Thạch, Quận 3, TP.HCM",
                phoneNumber: "02838293011",
                coordinates: { latitude: 10.787, longitude: 106.692 },
            },
        ],
    },
];
