// Employee Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    const viewBtns = document.querySelectorAll('.view-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    
    const addEmployeeModal = document.getElementById('add-employee-modal');
    const editEmployeeModal = document.getElementById('edit-employee-modal');
    const viewEmployeeModal = document.getElementById('view-employee-modal');
    
    // Sample employee data for demo purposes
    const employeeData = {
        'NV001': {
            id: 'NV001',
            name: 'Nguyễn Văn An',
            department: 'technical',
            position: 'team-lead',
            email: 'nguyenvanan@example.com',
            phone: '0912345678',
            dob: '1990-05-15',
            startDate: '2022-03-15',
            address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
            status: 'active',
            notes: 'Nhân viên giỏi, làm việc chăm chỉ.'
        },
        'NV002': {
            id: 'NV002',
            name: 'Trần Thị Bình',
            department: 'customer-support',
            position: 'staff',
            email: 'tranthibinh@example.com',
            phone: '0923456789',
            dob: '1992-08-20',
            startDate: '2022-04-10',
            address: '456 Lê Văn Lương, Quận 7, TP.HCM',
            status: 'on-leave',
            notes: 'Đang nghỉ phép từ 10/5 đến 20/5.'
        },
        'NV003': {
            id: 'NV003',
            name: 'Lê Hoàng Cường',
            department: 'warehouse',
            position: 'manager',
            email: 'lehoangcuong@example.com',
            phone: '0934567890',
            dob: '1988-11-25',
            startDate: '2021-10-05',
            address: '789 Nguyễn Hữu Thọ, Quận 7, TP.HCM',
            status: 'active',
            notes: ''
        }
    };
    
    // Show "Add Employee" modal
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', function() {
            if (addEmployeeModal) {
                addEmployeeModal.style.display = 'block';
            }
        });
    }
    
    // Handle edit buttons
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const employeeId = row.cells[1].textContent;
            openEditModal(employeeId);
        });
    });
    
    // Handle view buttons
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const employeeId = row.cells[1].textContent;
            // Open view modal functionality would go here
            if (viewEmployeeModal) {
                viewEmployeeModal.style.display = 'block';
            }
        });
    });
    
    // Handle delete buttons
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const employeeId = row.cells[1].textContent;
            const employeeName = row.cells[2].textContent;
            
            if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ${employeeName} (${employeeId})?`)) {
                // Delete functionality would go here
                console.log(`Đã xóa nhân viên ${employeeId}`);
                row.remove();
            }
        });
    });
    
    // Close all modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (addEmployeeModal) addEmployeeModal.style.display = 'none';
            if (editEmployeeModal) editEmployeeModal.style.display = 'none';
            if (viewEmployeeModal) viewEmployeeModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addEmployeeModal) {
            addEmployeeModal.style.display = 'none';
        }
        if (event.target === editEmployeeModal) {
            editEmployeeModal.style.display = 'none';
        }
        if (event.target === viewEmployeeModal) {
            viewEmployeeModal.style.display = 'none';
        }
    });
    
    // Function to open and populate the edit modal
    function openEditModal(employeeId) {
        if (!editEmployeeModal) return;
        
        // Get employee data from our sample data
        const employee = employeeData[employeeId];
        if (!employee) {
            alert('Không tìm thấy thông tin nhân viên!');
            return;
        }
        
        // Populate the form with employee data
        document.getElementById('edit-employee-id').value = employee.id;
        document.getElementById('edit-employee-name').value = employee.name;
        document.getElementById('edit-employee-department').value = employee.department;
        document.getElementById('edit-employee-position').value = employee.position;
        document.getElementById('edit-employee-email').value = employee.email;
        document.getElementById('edit-employee-phone').value = employee.phone;
        document.getElementById('edit-employee-dob').value = employee.dob;
        document.getElementById('edit-employee-start-date').value = employee.startDate;
        document.getElementById('edit-employee-address').value = employee.address;
        document.getElementById('edit-employee-status').value = employee.status;
        document.getElementById('edit-employee-notes').value = employee.notes;
        
        // Show the modal
        editEmployeeModal.style.display = 'block';
    }
    
    // Handle form submissions
    const addEmployeeForm = document.getElementById('add-employee-form');
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add employee functionality would go here
            console.log('Thêm nhân viên mới');
            addEmployeeModal.style.display = 'none';
        });
    }
    
    const editEmployeeForm = document.getElementById('edit-employee-form');
    if (editEmployeeForm) {
        editEmployeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const employeeId = document.getElementById('edit-employee-id').value;
            const department = document.getElementById('edit-employee-department').value;
            const position = document.getElementById('edit-employee-position').value;
            const startDate = document.getElementById('edit-employee-start-date').value;
            const address = document.getElementById('edit-employee-address').value;
            const status = document.getElementById('edit-employee-status').value;
            const notes = document.getElementById('edit-employee-notes').value;
            
            // In a real application, you would send this data to the server
            console.log('Cập nhật thông tin nhân viên:', {
                id: employeeId,
                department,
                position,
                startDate,
                address,
                status,
                notes
            });
            
            // Update the table row
            const rows = document.querySelectorAll('.employees-table tbody tr');
            rows.forEach(row => {
                if (row.cells[1].textContent === employeeId) {
                    // Update status cell with new badge
                    let statusText = 'Đang làm việc';
                    let statusClass = 'status-active';
                    
                    if (status === 'on-leave') {
                        statusText = 'Nghỉ phép';
                        statusClass = 'status-on-leave';
                    } else if (status === 'suspended') {
                        statusText = 'Tạm đình chỉ';
                        statusClass = 'status-suspended';
                    } else if (status === 'terminated') {
                        statusText = 'Đã nghỉ việc';
                        statusClass = 'status-terminated';
                    }
                    
                    row.cells[5].innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;
                }
            });
            
            // Close the modal
            editEmployeeModal.style.display = 'none';
        });
    }
}); 