document.addEventListener('DOMContentLoaded', function() {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const storeItems = document.querySelectorAll('.store-item');
    const noResults = document.querySelector('.no-results');

    // Data mapping tỉnh/thành phố với quận/huyện
    const districtData = {
        'hanoi': [
            { value: 'hoankiem', label: 'Hoàn Kiếm' },
            { value: 'badinh', label: 'Ba Đình' },
            { value: 'dongda', label: 'Đống Đa' },
            { value: 'haibatrung', label: 'Hai Bà Trưng' },
            { value: 'tayho', label: 'Tây Hồ' }
        ],
        'hcm': [
            { value: 'quan1', label: 'Quận 1' },
            { value: 'quan3', label: 'Quận 3' },
            { value: 'quan5', label: 'Quận 5' },
            { value: 'quan7', label: 'Quận 7' },
            { value: 'quan10', label: 'Quận 10' }
        ],
        'danang': [
            { value: 'haichau', label: 'Hải Châu' },
            { value: 'thanhkhe', label: 'Thanh Khê' },
            { value: 'sontra', label: 'Sơn Trà' },
            { value: 'nguhanhson', label: 'Ngũ Hành Sơn' },
            { value: 'lienchieu', label: 'Liên Chiểu' }
        ],
        'haiphong': [
            { value: 'honggai', label: 'Hồng Gai' },
            { value: 'ngogiatu', label: 'Ngô Quyền' }
        ],
        'cantho': [
            { value: 'ninhkieu', label: 'Ninh Kiều' },
            { value: 'binhthuy', label: 'Bình Thủy' }
        ]
    };

    // Cập nhật dropdown quận/huyện khi thay đổi tỉnh/thành phố
    provinceSelect.addEventListener('change', function() {
        const selectedProvince = this.value;
        
        // Reset district dropdown
        districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
        
        // Thêm các quận/huyện tương ứng với tỉnh/thành phố đã chọn
        if (selectedProvince && districtData[selectedProvince]) {
            districtData[selectedProvince].forEach(district => {
                const option = document.createElement('option');
                option.value = district.value;
                option.textContent = district.label;
                districtSelect.appendChild(option);
            });
            districtSelect.disabled = false;
        } else {
            districtSelect.disabled = true;
        }
        
        // Lọc danh sách cửa hàng
        filterStores();
    });

    // Lọc cửa hàng khi thay đổi quận/huyện
    districtSelect.addEventListener('change', filterStores);

    // Hàm lọc cửa hàng
    function filterStores() {
        const selectedProvince = provinceSelect.value;
        const selectedDistrict = districtSelect.value;
        let visibleStores = 0;

        storeItems.forEach(store => {
            const storeProvince = store.getAttribute('data-province');
            const storeDistrict = store.getAttribute('data-district');

            const provinceMatch = !selectedProvince || storeProvince === selectedProvince;
            const districtMatch = !selectedDistrict || storeDistrict === selectedDistrict;

            if (provinceMatch && districtMatch) {
                store.style.display = 'block';
                visibleStores++;
            } else {
                store.style.display = 'none';
            }
        });

        // Hiển thị thông báo nếu không có cửa hàng nào
        if (visibleStores === 0 && (selectedProvince || selectedDistrict)) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }

    // Khởi tạo trạng thái ban đầu
    function initializeStores() {
        // Nếu có tham số tỉnh/thành trong URL, chọn giá trị tương ứng
        const urlParams = new URLSearchParams(window.location.search);
        const provinceParam = urlParams.get('province');
        
        if (provinceParam) {
            const option = provinceSelect.querySelector(`option[value="${provinceParam}"]`);
            if (option) {
                provinceSelect.value = provinceParam;
                // Trigger change event để cập nhật quận/huyện
                const event = new Event('change');
                provinceSelect.dispatchEvent(event);
                
                // Nếu có tham số quận/huyện, chọn giá trị tương ứng
                const districtParam = urlParams.get('district');
                if (districtParam) {
                    setTimeout(() => {
                        const distOption = districtSelect.querySelector(`option[value="${districtParam}"]`);
                        if (distOption) {
                            districtSelect.value = districtParam;
                            // Trigger change event để lọc cửa hàng
                            districtSelect.dispatchEvent(new Event('change'));
                        }
                    }, 100);
                }
            }
        }
        
        // Nếu không có tham số, hiển thị tất cả cửa hàng
        filterStores();
    }

    // Khởi tạo khi load trang
    initializeStores();
}); 