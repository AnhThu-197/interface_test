IF EXISTS (SELECT name FROM sys.databases WHERE name = N'MyPhamDB')
BEGIN
    use master
    ALTER DATABASE MyPhamDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE MyPhamDB;
END;
GO

CREATE DATABASE MyPhamDB;
GO

USE MyPhamDB;
GO

-- 1. DanhMuc
CREATE TABLE DanhMuc (
	maDanhMuc CHAR(4) PRIMARY KEY,
    tenDanhMuc NVARCHAR(100) NOT NULL,
    moTa NVARCHAR(255)
);

-- 3. TinhThanh
CREATE TABLE TinhThanh (
    maTinhThanh CHAR(4) PRIMARY KEY,
    tenTinhThanh NVARCHAR(100) NOT NULL,
);

-- 4. QuanHuyen
CREATE TABLE QuanHuyen (
    maQuanHuyen CHAR(4) PRIMARY KEY,
    tenQuanHuyen NVARCHAR(100) NOT NULL,
    maTinhThanh CHAR(4) FOREIGN KEY REFERENCES TinhThanh(MaTinhThanh)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- 5. PhuongXa
CREATE TABLE PhuongXa (
    maPhuongXa CHAR(5) PRIMARY KEY,
    tenPhuongXa NVARCHAR(100) NOT NULL,
    maQuanHuyen CHAR(4) FOREIGN KEY REFERENCES QuanHuyen(maQuanHuyen)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- 6. ThuongHieu
CREATE TABLE ThuongHieu (
    maThuongHieu CHAR(4) PRIMARY KEY,
    tenThuongHieu NVARCHAR(100) NOT NULL
);

-- 7. SanPham
CREATE TABLE SanPham (
    maSanPham CHAR(4) PRIMARY KEY,
    tenSanPham NVARCHAR(150) NOT NULL,
    maThuongHieu CHAR(4) FOREIGN KEY REFERENCES ThuongHieu(maThuongHieu) 
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    gia DECIMAL(18,2) NOT NULL,
    moTa NVARCHAR(MAX),
	soLuongTon int not null,
	soLuongBan int not null,
	hinhAnh VARCHAR(255),
    trangThaiSP NVARCHAR(50) CHECK(trangThaiSP in(N'Còn hàng', N'Hết hàng', N'Đã hủy')) DEFAULT N'Còn hàng',
    maDanhMuc CHAR(4) FOREIGN KEY REFERENCES DanhMuc(maDanhMuc)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
--8. KhachHang
CREATE TABLE KhachHang (
    maKhachHang CHAR(5) PRIMARY KEY,
    taiKhoan NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    matKhau NVARCHAR(100) NOT NULL,
    soDienThoai varCHAR(11) NOT NULL UNIQUE
);
-- 9. GioHang
CREATE TABLE GioHang 
(
    maGioHang CHAR(4) PRIMARY KEY,
    maKhachHang CHAR(5) FOREIGN KEY REFERENCES KhachHang(maKhachHang) 
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    ngayTao DATE DEFAULT GETDATE()
);

-- 10. ChiTietGioHang
CREATE TABLE ChiTietGioHang (
    maGioHang CHAR(4),
    maSanPham CHAR(4),
    soLuong INT,
    PRIMARY KEY (maGioHang, maSanPham),
    FOREIGN KEY (maGioHang) REFERENCES GioHang(maGioHang)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- 19. DonDatHang_HoaDon
CREATE TABLE DonDatHang_HoaDon (
    maDonHang CHAR(4) PRIMARY KEY,
    maKhachHang CHAR(5) FOREIGN KEY REFERENCES KhachHang(maKhachHang)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
	diaChiGiaoHang nvarchar(100) not null,
    maPhuong CHAR(5) FOREIGN KEY(maPhuong) REFERENCES PhuongXa(maPhuongXa)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
	SDTGiaoHang varCHAR(11) NOT NULL UNIQUE,
    ngayTaoHD DATE DEFAULT GETDATE() NOT NULL,
	ngayGiaoHang DATE NOT NULL,
    ngayThanhToan Date NOT NULL,
    tongTien DECIMAL(18,2),
    trangThaiDH NVARCHAR(50)  CHECK(trangThaiDH in (N'Đang xác nhận', N'Đang giao', N'Đã giao', N'Đã hủy')) DEFAULT N'Đang xác nhận'
);
-- 12. ChiTietDonHang
CREATE TABLE ChiTietDonHang (
    maDonHang CHAR(4),
    maSanPham CHAR(4),
    soLuongDat INT,
    donGia DECIMAL(18,2),
    PRIMARY KEY (maDonHang, maSanPham),
    FOREIGN KEY (maDonHang) REFERENCES DonDatHang_HoaDon(maDonHang)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- 13. DanhGia
CREATE TABLE DanhGia (
    maDanhGia CHAR(4) PRIMARY KEY,
    maSanPham CHAR(4) FOREIGN KEY REFERENCES SanPham(maSanPham)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    maKhachHang CHAR(5) FOREIGN KEY REFERENCES KhachHang(maKhachHang)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    soSao INT CHECK (SoSao BETWEEN 1 AND 5),
    binhLuan NVARCHAR(500),
    ngayDanhGia date not null
);

-- 15. ThanhToan
CREATE TABLE ThanhToan (
    maThanhToan CHAR(4) PRIMARY KEY,
    maDonHang CHAR(4),
	FOREIGN KEY (maDonHang) REFERENCES DonDatHang_HoaDon(maDonHang)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    phuongThucThanhToan NVARCHAR(100),
    soTien DECIMAL(18,2),
    trangThaiTT NVARCHAR(50) CHECK(trangThaiTT in (N'Đã thanh toán', N'Chưa thanh toán')) DEFAULT N'Chưa thanh toán',
    ngayThanhToan DATE
);
--21. Nhà cung cấp
CREATE TABLE NhaCungCap(
	maNhaCungCap CHAR(4) PRIMARY KEY,
	tenNhaCungCap NVARCHAR(50),
	soDienThoai varCHAR(11) NOT NULL UNIQUE,     
	trangThai NVARCHAR(30) CHECK(trangThai in ( N'Đang hợp tác', N'Dừng hợp tác', N'Đã giao thành công', N'Đã giao thất bại', N'Đã hủy' )) DEFAULT N'Đang hợp tác'
)
-- 16. PhieuNhap
CREATE TABLE PhieuNhap (
    maPhieuNhap CHAR(4) PRIMARY KEY,
    ngayNhap DATE DEFAULT GETDATE(),
    maNhanVien CHAR(5),
	maNhaCungCap CHAR(4),
    ghiChu NVARCHAR(255),
    FOREIGN KEY (maNhanVien) REFERENCES KhachHang(maKhachHang)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
	FOREIGN KEY (maNhaCungCap) REFERENCES NhaCungCap(maNhaCungCap)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- 17. ChiTietPhieuNhap
CREATE TABLE ChiTietPhieuNhap (
    maPhieuNhap CHAR(4),
    maSanPham CHAR(4),
    soLuong INT,
    donGiaNhap DECIMAL(18,2),
    PRIMARY KEY (maPhieuNhap, maSanPham),
    FOREIGN KEY (maPhieuNhap) REFERENCES PhieuNhap(maPhieuNhap)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (maSanPham) REFERENCES SanPham(maSanPham)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

--18. GiamGia
CREATE TABLE Voucher(
	maVoucher CHAR(4) PRIMARY kEY,
	moTa NVARCHAR(225),
	giaTriGiam DECIMAL(18,2),
    ngayBatDau DATE ,
    ngayKetThuc DATE,
    soLuong INT,
    dieuKienApDung NVARCHAR(255),
    trangThaiGG NVARCHAR(30)  CHECK(trangThaiGG in (N'Còn hiệu lực', N'Hết hiệu lực', N'Đã hủy')) DEFAULT N'Còn hiệu lực'
)

--=====================================================Các ràng buộc================================================================
--Kết nối bảng đơn hàng với voucher
ALTER TABLE DonDatHang_HoaDon
ADD maVoucher CHAR(4),
    FOREIGN KEY (maVoucher) REFERENCES Voucher(maVoucher)
        ON UPDATE CASCADE
        ON DELETE SET NULL;

-- Ràng buộc các giá trị số lượng, đơn giá >= 0
ALTER TABLE SanPham
ADD CONSTRAINT CK_SanPham_gia 
		CHECK (gia >= 0)
ALTER TABLE ChiTietDonHang
ADD CONSTRAINT CK_ChiTietDonHang_soLuongDat
		CHECK (soLuongDat > 0),
	CONSTRAINT CK_CHITIETDONHANG_donGia
		CHECK (donGia > 0)

-- Ngày thanh toán >= ngày tạo đơn hàng
ALTER TABLE DonDatHang_HoaDon
ADD CONSTRAINT CK_DDHHD_ngayThanhToan 
	CHECK (ngayThanhToan >= ngayTaoHD)

-- Ngày giao hàng >= ngày thanh toán
ALTER TABLE DonDatHang_HoaDon
ADD CONSTRAINT CK_DDHHD_ngayGiaoHang 
	CHECK (ngayGiaoHang >= ngayThanhToan)

-- Ràng buộc Sđt chỉ gồm 10 or 11 số cho bảng Người dùng

ALTER TABLE KhachHang
ADD CONSTRAINT CK_NguoiDung_SDT
	CHECK ( soDienThoai like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
		 or soDienThoai like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')

-- Ràng buộc Sđt chỉ gồm 10 or 11 số cho bảng Nhà cung cấp
ALTER TABLE NhaCungCap
ADD CONSTRAINT CK_NhaCungCap_SDT
	CHECK ( soDienThoai like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
		 or soDienThoai  like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
	
-- Ràng buộc Sđt chỉ gồm 10 or 11 số cho bảng Đơn đặt hàng - Hóa đơn
ALTER TABLE DonDatHang_HoaDon
ADD CONSTRAINT CK_DonDatHang_HoaDon_SDTGiaoHang
	CHECK ( SDTGiaoHang like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
		 or SDTGiaoHang like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')

-- Ràng buộc Email bắt đầu bằng chữ cái + có @ cho bảng Khách hàng
ALTER TABLE KhachHang
	ADD CONSTRAINT CK_NguoiDung_Email
		CHECK (email like '[a-zA-Z]%@%_')
		
			-----------------------------------INSERT DỮ LIỆU------------------------------------------------

-- Tỉnh Thành
INSERT INTO TinhThanh (maTinhThanh, tenTinhThanh)
VALUES
    ('TT01', N'Hà Nội'),
    ('TT02', N'Hồ Chí Minh'),
    ('TT03', N'Đà Nẵng'),
    ('TT04', N'Hải Phòng'),
    ('TT05', N'Cần Thơ'),
    ('TT06', N'Nha Trang'),
    ('TT07', N'Huế'),
    ('TT08', N'Vũng Tàu');

-- Quận/Huyện
INSERT INTO QuanHuyen (maQuanHuyen, tenQuanHuyen, maTinhThanh)
VALUES
-- Hà Nội
	('QH01', N'Ba Đình', 'TT01'),
	('QH02', N'Hoàn Kiếm', 'TT01'),
	('QH03', N'Đống Đa', 'TT01'),
	('QH04', N'Tây Hồ', 'TT01'),
	('QH05', N'Cầu Giấy', 'TT01'),

-- Hồ Chí Minh
	('QH06', N'Quận 1', 'TT02'),
	('QH07', N'Quận 3', 'TT02'),
	('QH08', N'Quận 5', 'TT02'),
	('QH09', N'Quận 7', 'TT02'),
	('QH10', N'Quận Bình Thạnh', 'TT02'),

-- Đà Nẵng
	('QH11', N'Hải Châu', 'TT03'),
	('QH12', N'Thanh Khê', 'TT03'),
	('QH13', N'Ngũ Hành Sơn', 'TT03'),
	('QH14', N'Sơn Trà', 'TT03'),
	('QH15', N'Hòa Vang', 'TT03'),

-- Hải Phòng
	('QH16', N'Lê Chân', 'TT04'),
	('QH17', N'Ngô Quyền', 'TT04'),
	('QH18', N'Hồng Bàng', 'TT04'),
	('QH19', N'Kiến An', 'TT04'),
	('QH20', N'Thủy Nguyên', 'TT04'),

-- Cần Thơ
	('QH21', N'Ninh Kiều', 'TT05'),
	('QH22', N'Bình Thủy', 'TT05'),
	('QH23', N'Cái Răng', 'TT05'),
	('QH24', N'Thốt Nốt', 'TT05'),
	('QH25', N'Phong Điền', 'TT05'),

-- Nha Trang
	('QH26', N'TP Nha Trang', 'TT06'),
	('QH27', N'Cam Ranh', 'TT06'),
	('QH28', N'Diên Khánh', 'TT06'),
	('QH29', N'Vạn Ninh', 'TT06'),
	('QH30', N'Ninh Hòa', 'TT06'),

-- Huế
	('QH31', N'Phú Lộc', 'TT07'),
	('QH32', N'Hương Thủy', 'TT07'),
	('QH33', N'Hương Trà', 'TT07'),
	('QH34', N'Phong Điền', 'TT07'),
	('QH35', N'Phú Vang', 'TT07'),

-- Vũng Tàu
	('QH36', N'TP Vũng Tàu', 'TT08'),
	('QH37', N'TP Bà Rịa', 'TT08'),
	('QH38', N'Châu Đức', 'TT08'),
	('QH39', N'Đất Đỏ', 'TT08'),
	('QH40', N'Xuyên Mộc', 'TT08');

-- Phường/Xã
INSERT INTO PhuongXa (maPhuongXa, tenPhuongXa, maQuanHuyen)
VALUES
	-- QH01: Ba Đình (Hà Nội)
		('PX001', N'Phúc Xá', 'QH01'),
		('PX002', N'Trúc Bạch', 'QH01'),
		('PX003', N'Cống Vị', 'QH01'),
		('PX004', N'Điện Biên', 'QH01'),
		('PX005', N'Ngọc Hà', 'QH01'),

	-- QH02: Hoàn Kiếm (Hà Nội)
		('PX006', N'Hàng Bạc', 'QH02'),
		('PX007', N'Hàng Bồ', 'QH02'),
		('PX008', N'Hàng Đào', 'QH02'),
		('PX009', N'Lý Thái Tổ', 'QH02'),
		('PX010', N'Tràng Tiền', 'QH02'),

	-- QH03: Đống Đa (Hà Nội)
		('PX011', N'Phương Mai', 'QH03'),
		('PX012', N'Thịnh Quang', 'QH03'),
		('PX013', N'Thổ Quan', 'QH03'),
		('PX014', N'Khâm Thiên', 'QH03'),
		('PX015', N'Nam Đồng', 'QH03'),

	-- QH04: Tây Hồ (Hà Nội)
		('PX016', N'Quảng An', 'QH04'),
		('PX017', N'Tứ Liên', 'QH04'),
		('PX018', N'Yên Phụ', 'QH04'),
		('PX019', N'Nhật Tân', 'QH04'),
		('PX020', N'Bưởi', 'QH04'),

	-- QH05: Cầu Giấy (Hà Nội)
		('PX021', N'Dịch Vọng', 'QH05'),
		('PX022', N'Mai Dịch', 'QH05'),
		('PX023', N'Nghĩa Tân', 'QH05'),
		('PX024', N'Nghĩa Đô', 'QH05'),
		('PX025', N'Yên Hòa', 'QH05'),

	-- QH06: Quận 1 (Hồ Chí Minh)
		('PX026', N'Bến Nghé', 'QH06'),
		('PX027', N'Bến Thành', 'QH06'),
		('PX028', N'Cầu Kho', 'QH06'),
		('PX029', N'Cô Giang', 'QH06'),
		('PX030', N'Đa Kao', 'QH06'),

	-- QH07: Quận 3 (Hồ Chí Minh)
		('PX031', N'Phường 1', 'QH07'),
		('PX032', N'Phường 2', 'QH07'),
		('PX033', N'Phường 3', 'QH07'),
		('PX034', N'Phường 4', 'QH07'),
		('PX035', N'Phường 5', 'QH07'),

	-- QH08: Quận 5 (Hồ Chí Minh)
		('PX036', N'Phường 1', 'QH08'),
		('PX037', N'Phường 2', 'QH08'),
		('PX038', N'Phường 3', 'QH08'),
		('PX039', N'Phường 4', 'QH08'),
		('PX040', N'Phường 5', 'QH08'),

	-- QH09: Quận 7 (Hồ Chí Minh)
		('PX041', N'Tân Phong', 'QH09'),
		('PX042', N'Tân Hưng', 'QH09'),
		('PX043', N'Phú Mỹ', 'QH09'),
		('PX044', N'Tân Quy', 'QH09'),
		('PX045', N'Bình Thuận', 'QH09'),

	-- QH10: Quận Bình Thạnh (Hồ Chí Minh)
		('PX046', N'Phường 1', 'QH10'),
		('PX047', N'Phường 2', 'QH10'),
		('PX048', N'Phường 3', 'QH10'),
		('PX049', N'Phường 4', 'QH10'),
		('PX050', N'Phường 5', 'QH10'),

	-- QH11: Hải Châu (Đà Nẵng)
		('PX051', N'Hải Châu 1', 'QH11'),
		('PX052', N'Hải Châu 2', 'QH11'),
		('PX053', N'Thạch Thang', 'QH11'),
		('PX054', N'Thanh Bình', 'QH11'),
		('PX055', N'Thuận Phước', 'QH11'),

	-- QH12: Thanh Khê (Đà Nẵng)
		('PX056', N'Thanh Khê Đông', 'QH12'),
		('PX057', N'Thanh Khê Tây', 'QH12'),
		('PX058', N'Xuân Hà', 'QH12'),
		('PX059', N'Tân Chính', 'QH12'),
		('PX060', N'Chính Gián', 'QH12'),

	-- QH13: Ngũ Hành Sơn (Đà Nẵng)
		('PX061', N'Mỹ An', 'QH13'),
		('PX062', N'Khuê Mỹ', 'QH13'),
		('PX063', N'Hoà Quý', 'QH13'),
		('PX064', N'Hoà Hải', 'QH13'),
		('PX065', N'Mỹ Đa', 'QH13'),

	-- QH14: Sơn Trà (Đà Nẵng)
		('PX066', N'An Hải Bắc', 'QH14'),
		('PX067', N'An Hải Tây', 'QH14'),
		('PX068', N'An Hải Đông', 'QH14'),
		('PX069', N'Mân Thái', 'QH14'),
		('PX070', N'Thọ Quang', 'QH14'),

	-- QH15: Hòa Vang (Đà Nẵng)
		('PX071', N'Hoà Phong', 'QH15'),
		('PX072', N'Hoà Khương', 'QH15'),
		('PX073', N'Hoà Tiến', 'QH15'),
		('PX074', N'Hoà Châu', 'QH15'),
		('PX075', N'Hoà Nhơn', 'QH15'),

	-- QH16: Lê Chân (Hải Phòng)
		('PX076', N'Dư Hàng', 'QH16'),
		('PX077', N'Đông Hải', 'QH16'),
		('PX078', N'Hàng Kênh', 'QH16'),
		('PX079', N'Niệm Nghĩa', 'QH16'),
		('PX080', N'Trại Chuối', 'QH16'),

	-- QH17: Ngô Quyền (Hải Phòng)
		('PX081', N'Đông Khê', 'QH17'),
		('PX082', N'Lạch Tray', 'QH17'),
		('PX083', N'Lê Lợi', 'QH17'),
		('PX084', N'Máy Chai', 'QH17'),
		('PX085', N'Máy Tơ', 'QH17'),

	-- QH18: Hồng Bàng (Hải Phòng)
		('PX086', N'Hoàng Văn Thụ', 'QH18'),
		('PX087', N'Minh Khai', 'QH18'),
		('PX088', N'Quán Toan', 'QH18'),
		('PX089', N'Sở Dầu', 'QH18'),
		('PX090', N'Thượng Lý', 'QH18'),

	-- QH19: Kiến An (Hải Phòng)
		('PX091', N'Bắc Sơn', 'QH19'),
		('PX092', N'Đồng Hoà', 'QH19'),
		('PX093', N'Nam Sơn', 'QH19'),
		('PX094', N'Ngọc Sơn', 'QH19'),
		('PX095', N'Phù Liễn', 'QH19'),

	-- QH20: Thủy Nguyên (Hải Phòng)
		('PX096', N'Núi Đèo', 'QH20'),
		('PX097', N'Minh Đức', 'QH20'),
		('PX098', N'An Lư', 'QH20'),
		('PX099', N'Kênh Giang', 'QH20'),
		('PX100', N'Lập Lễ', 'QH20'),

	-- QH21: Ninh Kiều (Cần Thơ)
		('PX101', N'An Hoà', 'QH21'),
		('PX102', N'An Khánh', 'QH21'),
		('PX103', N'Cái Khế', 'QH21'),
		('PX104', N'Tân An', 'QH21'),
		('PX105', N'Xuân Khánh', 'QH21'),

	-- QH22: Bình Thủy (Cần Thơ)
		('PX106', N'An Thới', 'QH22'),
		('PX107', N'Bình Thủy', 'QH22'),
		('PX108', N'Long Hòa', 'QH22'),
		('PX109', N'Long Tuyền', 'QH22'),
		('PX110', N'Trà Nóc', 'QH22'),

	-- QH23: Cái Răng (Cần Thơ)
		('PX111', N'Hưng Phú', 'QH23'),
		('PX112', N'Hưng Thạnh', 'QH23'),
		('PX113', N'Lê Bình', 'QH23'),
		('PX114', N'Phú Thứ', 'QH23'),
		('PX115', N'Tân Phú', 'QH23'),

	-- QH24: Thốt Nốt (Cần Thơ)
		('PX116', N'Thốt Nốt', 'QH24'),
		('PX117', N'Thới Thuận', 'QH24'),
		('PX118', N'Thuận An', 'QH24'),
		('PX119', N'Tân Lộc', 'QH24'),
		('PX120', N'Trung Nhứt', 'QH24'),

	-- QH25: Phong Điền (Cần Thơ)
		('PX121', N'Nhơn Ái', 'QH25'),
		('PX122', N'Tân Thới', 'QH25'),
		('PX123', N'Trường Long', 'QH25'),
		('PX124', N'Mỹ Khánh', 'QH25'),
		('PX125', N'Giai Xuân', 'QH25'),

	-- QH26: TP Nha Trang (Khánh Hòa)
		('PX126', N'Vĩnh Nguyên', 'QH26'),
		('PX127', N'Vĩnh Hải', 'QH26'),
		('PX128', N'Vĩnh Phước', 'QH26'),
		('PX129', N'Phương Sài', 'QH26'),
		('PX130', N'Lộc Thọ', 'QH26'),

	-- QH27: Cam Ranh (Khánh Hòa)
		('PX131', N'Cam Nghĩa', 'QH27'),
		('PX132', N'Cam Phúc Bắc', 'QH27'),
		('PX133', N'Cam Phúc Nam', 'QH27'),
		('PX134', N'Cam Lộc', 'QH27'),
		('PX135', N'Cam Thuận', 'QH27'),

	-- QH28: Diên Khánh (Khánh Hòa)
		('PX136', N'Diên An', 'QH28'),
		('PX137', N'Diên Lạc', 'QH28'),
		('PX138', N'Diên Toàn', 'QH28'),
		('PX139', N'Diên Thạnh', 'QH28'),
		('PX140', N'Diên Điền', 'QH28'),

	-- QH29: Vạn Ninh (Khánh Hòa)
		('PX141', N'Vạn Thắng', 'QH29'),
		('PX142', N'Vạn Thạnh', 'QH29'),
		('PX143', N'Vạn Phước', 'QH29'),
		('PX144', N'Vạn Long', 'QH29'),
		('PX145', N'Vạn Hưng', 'QH29'),

	-- QH30: Ninh Hòa (Khánh Hòa)
		('PX146', N'Ninh Diêm', 'QH30'),
		('PX147', N'Ninh Hải', 'QH30'),
		('PX148', N'Ninh Thọ', 'QH30'),
		('PX149', N'Ninh Phụng', 'QH30'),
		('PX150', N'Ninh Giang', 'QH30'),

	-- QH31: Phú Lộc (Huế)
		('PX151', N'Lộc An', 'QH31'),
		('PX152', N'Lộc Bình', 'QH31'),
		('PX153', N'Lộc Sơn', 'QH31'),
		('PX154', N'Lộc Tiến', 'QH31'),
		('PX155', N'Lộc Vĩnh', 'QH31'),

	-- QH32: Hương Thủy (Huế)
		('PX156', N'Thủy Phương', 'QH32'),
		('PX157', N'Thủy Châu', 'QH32'),
		('PX158', N'Thủy Xuân', 'QH32'),
		('PX159', N'Thủy Vân', 'QH32'),
		('PX160', N'Thủy Thanh', 'QH32'),

	-- QH33: Hương Trà (Huế)
		('PX161', N'Tứ Hạ', 'QH33'),
		('PX162', N'Hương An', 'QH33'),
		('PX163', N'Hương Bình', 'QH33'),
		('PX164', N'Hương Hồ', 'QH33'),
		('PX165', N'Hương Vân', 'QH33'),

	-- QH34: Phong Điền (Huế)
		('PX166', N'Phong An', 'QH34'),
		('PX167', N'Phong Chương', 'QH34'),
		('PX168', N'Phong Hải', 'QH34'),
		('PX169', N'Phong Hiền', 'QH34'),
		('PX170', N'Phong Mỹ', 'QH34'),

	-- QH35: Phú Vang (Huế)
		('PX171', N'Phú Diên', 'QH35'),
		('PX172', N'Phú Đa', 'QH35'),
		('PX173', N'Phú Hải', 'QH35'),
		('PX174', N'Phú Xuân', 'QH35'),
		('PX175', N'Phú Mậu', 'QH35'),

	-- QH36: TP Vũng Tàu (Bà Rịa-Vũng Tàu)
		('PX176', N'Phường 1', 'QH36'),
		('PX177', N'Phường 2', 'QH36'),
		('PX178', N'Thắng Nhất', 'QH36'),
		('PX179', N'Thắng Nhì', 'QH36'),
		('PX180', N'Thắng Tam', 'QH36'),

	-- QH37: TP Bà Rịa (Bà Rịa-Vũng Tàu)
		('PX181', N'Phước Trung', 'QH37'),
		('PX182', N'Phước Hưng', 'QH37'),
		('PX183', N'Long Toàn', 'QH37'),
		('PX184', N'Long Tâm', 'QH37'),
		('PX185', N'Long Hương', 'QH37'),

	-- QH38: Châu Đức (Bà Rịa-Vũng Tàu)
		('PX186', N'Ngãi Giao', 'QH38'),
		('PX187', N'Bình Ba', 'QH38'),
		('PX188', N'Suối Nghệ', 'QH38'),
		('PX189', N'Xuân Sơn', 'QH38'),
		('PX190', N'Sơn Bình', 'QH38'),

	-- QH39: Đất Đỏ (Bà Rịa-Vũng Tàu)
		('PX191', N'Đất Đỏ', 'QH39'),
		('PX192', N'Phước Hội', 'QH39'),
		('PX193', N'Phước Long Thọ', 'QH39'),
		('PX194', N'Long Mỹ', 'QH39'),
		('PX195', N'Lộc An', 'QH39'),

	-- QH40: Xuyên Mộc (Bà Rịa-Vũng Tàu)
		('PX196', N'Phước Bửu', 'QH40'),
		('PX197', N'Bình Châu', 'QH40'),
		('PX198', N'Bưng Riềng', 'QH40'),
		('PX199', N'Hòa Bình', 'QH40'),
		('PX200', N'Hòa Hưng', 'QH40');

-- Danh Mục Sản Phẩm
INSERT INTO DanhMuc (maDanhMuc, tenDanhMuc, moTa) 
VALUES	('DM01', N'Chăm sóc da', N'Sản phẩm dành cho việc chăm sóc da mặt'),
		('DM02', N'Trang điểm', N'Sản phẩm trang điểm cho mặt'),
		('DM03', N'Chăm sóc tóc', N'Sản phẩm dành cho tóc khỏe mạnh'),
		('DM04', N'Nước hoa', N'Các loại nước hoa cao cấp'),
		('DM05', N'Chăm sóc cơ thể', N'Sản phẩm chăm sóc toàn thân'),
		('DM06', N'Sữa tắm', N'Sữa tắm dưỡng ẩm cho cơ thể'),
		('DM07', N'Chăm sóc mắt', N'Sản phẩm dưỡng mắt và vùng da quanh mắt'),
		('DM08', N'Kem chống nắng', N'Sản phẩm bảo vệ da khỏi ánh nắng mặt trời'),
		('DM09', N'Dưỡng môi', N'Sản phẩm dưỡng môi mềm mịn'),
		('DM10', N'Chăm sóc tay', N'Sản phẩm chăm sóc đôi tay mềm mại');

-- Thương Hiệu
INSERT INTO ThuongHieu (maThuongHieu, tenThuongHieu) 
VALUES	('TH01', N'Peripera'),
		('TH02', N'Cocoon'),
		('TH03', N'The Body Shop'),
		('TH04', N'Club Clio'),
		('TH05', N'Amuse'),
		('TH06', N'Banila Co'),
		('TH07', N'CNP'),
		('TH08', N'Cosrx'),
		('TH09', N'Evina'),
		('TH10', N'Garnier');
-- Sản phẩm
INSERT INTO SanPham (maSanPham, tenSanPham, maThuongHieu, gia, moTa, soLuongTon, soLuongBan,hinhAnh, trangThaiSP, maDanhMuc) 
VALUES	('SP01', N'Kem Chống Nắng Nâng Tông Da CNP Laboratory Tone-Up Protection Sun', 'TH01', 350000, N'Kem chống nắng dưỡng da, nâng tông tự nhiên với SPF42 PA+++',10,0,'images/sp1.1.webp',N'Còn hàng', 'DM08'),
		('SP02', N'Sữa Rửa Mặt Chăm Sóc Da Mụn Cosrx Ac Collection Calming Foam Cleanser', 'TH02', 280000, N'Sữa rửa mặt dịu nhẹ, sạch sâu',10,0,'images/sp2.1.webp', 'Còn hàng' ,'DM01'),
		('SP03', N'Nước Thần Keo Ong Cấp Ẩm, Phục Hồi Da CNP Propolis Treatment Ampoule', 'TH01', 420000, N'Cấp ẩm nhẹ nhàng, dịu nhẹ và lành tính cho da', 10,0,'images/sp3.1.webp',N'Còn hàng', 'DM01'),
		('SP04', N'Xịt Khoáng Cấp Ẩm, Làm Dịu Da Evian Brumisateur Natural Mineral Water', 'TH03', 180000, N'Cấp ẩm thần tốc, làm dịu da làn da khô căcng, thiếu sức sống',10,0,'images/sp4.1.webp', N'Còn hàng', 'DM01'),
		('SP05', N'Set 5 Mặt Nạ Se Khít Lỗ Chân Lông THE FACE SHOP The Solution Double-Up', 'TH04', 345000, N'Cấp ẩm, cân bằng da',10,0,'images/sp5.1.webp', N'Còn hàng', 'DM01'),
		('SP06', N'Nước Tẩy Trang Cho Da Dầu Mụn Garnier Micellar Cleansing Water For Oily & Acne', 'TH05', 165000, N'Làm sạch lớp bụi bẩn và trang điểm, sạch sâu, lành tính và nhẹ nhàng cho làn da nhạy cảm',10,0, 'images/sp6.1.webp',N'Còn hàng', 'DM01'),
		('SP07', N'Sữa Rửa Mặt Dạng Gel Cosrx Low Ph Good Morning Gel Cleanser 150Ml', 'TH02', 195000, N'Sữa rửa mặt dịu nhẹ, sạch sâu, phù hợp da nhạy cảm',10,0, 'images/sp7.1.webp',N'Còn hàng', 'DM01')
select * from KhachHang
select * from SanPham




