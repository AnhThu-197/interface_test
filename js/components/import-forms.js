// Import Form Modal Handling
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const newImportModal = document.getElementById('newImportFormModal');
    const editImportModal = document.getElementById('editImportFormModal');
    const importForm = document.getElementById('newImportForm');
    const editImportForm = document.getElementById('editImportForm');
    const createImportBtn = document.querySelector('.action-buttons .admin-btn');
    const closeModalBtns = document.querySelectorAll('.admin-modal-close, .modal-close-btn');
    const addMaterialBtn = document.getElementById('addMaterialRow');
    const editAddMaterialBtn = document.getElementById('editAddMaterialRow');
    const materialsList = document.getElementById('materialsList');
    const editMaterialsList = document.getElementById('editMaterialsList');
    const editButtons = document.querySelectorAll('.action-btn.edit-btn');

    // Sample data for demo purposes
    const importFormsData = {
        'PN001': {
            id: 'PN001',
            supplier: 'ncc1',
            importDate: '2023-06-15',
            receiveDate: '2023-06-18',
            status: 'received',
            notes: 'Giao hàng vào giờ hành chính. Kiểm tra kỹ chất lượng vải trước khi nhập kho.',
            materials: [
                { id: 'NL001', quantity: 100, price: 45000 },
                { id: 'NL007', quantity: 50, price: 60000 },
                { id: 'NL012', quantity: 50, price: 100000 }
            ]
        },
        'PN002': {
            id: 'PN002',
            supplier: 'ncc2',
            importDate: '2023-06-16',
            receiveDate: '',
            status: 'pending',
            notes: '',
            materials: [
                { id: 'NL002', quantity: 80, price: 45000 },
                { id: 'NL005', quantity: 100, price: 15000 }
            ]
        },
        'PN003': {
            id: 'PN003',
            supplier: 'ncc3',
            importDate: '2023-06-16',
            receiveDate: '',
            status: 'approved',
            notes: 'Cần kiểm tra kỹ số lượng khi nhận hàng',
            materials: [
                { id: 'NL008', quantity: 120, price: 25000 },
                { id: 'NL010', quantity: 200, price: 5000 }
            ]
        },
        'PN004': {
            id: 'PN004',
            supplier: 'ncc1',
            importDate: '2023-06-17',
            receiveDate: '',
            status: 'cancelled',
            notes: 'Đã hủy do nhà cung cấp không đáp ứng được yêu cầu về chất lượng',
            materials: [
                { id: 'NL004', quantity: 50, price: 100000 },
                { id: 'NL009', quantity: 100, price: 35000 }
            ]
        },
        'PN005': {
            id: 'PN005',
            supplier: 'ncc2',
            importDate: '2023-06-17',
            receiveDate: '2023-06-20',
            status: 'received',
            notes: '',
            materials: [
                { id: 'NL003', quantity: 70, price: 90000 },
                { id: 'NL006', quantity: 150, price: 15000 }
            ]
        }
    };

    // Show modal when clicking create button
    if (createImportBtn) {
        createImportBtn.addEventListener('click', function() {
            newImportModal.classList.add('show');
            
            // Set current date in the import-date field
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            document.getElementById('import-date').value = formattedDate;
        });
    }

    // Close modal when clicking close buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            newImportModal.classList.remove('show');
            editImportModal.classList.remove('show');
        });
    });

    // Close modal when clicking outside
    newImportModal.addEventListener('click', function(e) {
        if (e.target === newImportModal) {
            newImportModal.classList.remove('show');
        }
    });

    editImportModal.addEventListener('click', function(e) {
        if (e.target === editImportModal) {
            editImportModal.classList.remove('show');
        }
    });

    // Add new material row
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', function() {
            addNewMaterialRow(materialsList);
        });
    }

    // Add new material row in edit form
    if (editAddMaterialBtn) {
        editAddMaterialBtn.addEventListener('click', function() {
            addNewMaterialRow(editMaterialsList);
        });
    }

    // Function to add a new material row
    function addNewMaterialRow(targetList) {
        const rowCount = targetList.children.length + 1;
        const newRow = document.createElement('tr');
        newRow.className = 'material-row';
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>
                <select class="material-name admin-form-control" required>
                    <option value="">-- Chọn nguyên liệu --</option>
                    <option value="NL001">Vải Cotton Màu Trắng</option>
                    <option value="NL002">Vải Cotton Màu Đen</option>
                    <option value="NL003">Vải Lụa Màu Trắng</option>
                    <option value="NL004">Vải Lụa Màu Đen</option>
                    <option value="NL005">Chỉ May Màu Trắng</option>
                    <option value="NL006">Chỉ May Màu Đen</option>
                    <option value="NL007">Vải Tuyn Màu Hồng</option>
                    <option value="NL008">Nút Áo Nhựa</option>
                    <option value="NL009">Nút Áo Kim Loại</option>
                    <option value="NL010">Khóa Kéo Nhựa</option>
                    <option value="NL011">Khóa Kéo Kim Loại</option>
                    <option value="NL012">Vải Lụa Màu Đen</option>
                </select>
            </td>
            <td>
                <input type="text" class="material-unit admin-form-control" readonly>
            </td>
            <td>
                <input type="number" class="material-quantity admin-form-control" min="1" required>
            </td>
            <td>
                <input type="text" class="material-price admin-form-control" required>
            </td>
            <td>
                <input type="text" class="material-total admin-form-control" readonly>
            </td>
            <td>
                <button type="button" class="action-btn delete-btn" title="Xóa"><i class="fas fa-trash"></i></button>
            </td>
        `;
        targetList.appendChild(newRow);
        updateRowNumbers(targetList);
        attachMaterialRowEvents(newRow);
    }

    // Material data for auto-filling units
    const materialData = {
        'NL001': { unit: 'Mét', price: 45000 },
        'NL002': { unit: 'Mét', price: 45000 },
        'NL003': { unit: 'Mét', price: 90000 },
        'NL004': { unit: 'Mét', price: 100000 },
        'NL005': { unit: 'Cuộn', price: 15000 },
        'NL006': { unit: 'Cuộn', price: 15000 },
        'NL007': { unit: 'Mét', price: 60000 },
        'NL008': { unit: 'Túi', price: 25000 },
        'NL009': { unit: 'Túi', price: 35000 },
        'NL010': { unit: 'Chiếc', price: 5000 },
        'NL011': { unit: 'Chiếc', price: 8000 },
        'NL012': { unit: 'Mét', price: 100000 }
    };

    // Function to attach material selection events
    function attachMaterialRowEvents(row) {
        const deleteBtn = row.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                const parentTbody = row.parentNode;
                row.remove();
                updateRowNumbers(parentTbody);
                calculateTotal(parentTbody);
            });
        }

        // Calculate total for this row
        const quantityInput = row.querySelector('.material-quantity');
        const priceInput = row.querySelector('.material-price');
        const totalInput = row.querySelector('.material-total');

        [quantityInput, priceInput].forEach(input => {
            input.addEventListener('input', function() {
                calculateRowTotal(row);
                const parentTbody = row.parentNode;
                calculateTotal(parentTbody);
            });
        });

        // Auto-fill unit and price when material is selected
        const materialSelect = row.querySelector('.material-name');
        const unitInput = row.querySelector('.material-unit');
        
        if (materialSelect) {
            materialSelect.addEventListener('change', function() {
                const selectedMaterial = materialSelect.value;
                if (selectedMaterial && materialData[selectedMaterial]) {
                    unitInput.value = materialData[selectedMaterial].unit;
                    priceInput.value = materialData[selectedMaterial].price.toLocaleString('vi-VN') + '₫';
                    calculateRowTotal(row);
                    const parentTbody = row.parentNode;
                    calculateTotal(parentTbody);
                } else {
                    unitInput.value = '';
                    priceInput.value = '';
                    totalInput.value = '';
                }
            });
        }
    }

    // Calculate total for a single row
    function calculateRowTotal(row) {
        const quantity = parseFloat(row.querySelector('.material-quantity').value) || 0;
        const priceText = row.querySelector('.material-price').value.replace(/[^\d]/g, '');
        const price = parseFloat(priceText) || 0;
        const total = quantity * price;
        row.querySelector('.material-total').value = total.toLocaleString('vi-VN') + '₫';
    }

    // Calculate total amount for all rows
    function calculateTotal(tbody) {
        const rows = tbody.querySelectorAll('.material-row');
        let total = 0;
        rows.forEach(row => {
            const quantity = parseFloat(row.querySelector('.material-quantity').value) || 0;
            const priceText = row.querySelector('.material-price').value.replace(/[^\d]/g, '');
            const price = parseFloat(priceText) || 0;
            total += quantity * price;
        });
        
        // Determine which total amount field to update
        let totalAmountField;
        if (tbody.id === 'materialsList') {
            totalAmountField = document.getElementById('total-amount');
        } else if (tbody.id === 'editMaterialsList') {
            totalAmountField = document.getElementById('edit-total-amount');
        }
        
        if (totalAmountField) {
            totalAmountField.value = total.toLocaleString('vi-VN') + '₫';
        }
    }

    // Update row numbers
    function updateRowNumbers(tbody) {
        const rows = tbody.querySelectorAll('.material-row');
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }

    // Attach events to initial rows
    const initialRow = document.querySelector('#materialsList .material-row');
    if (initialRow) {
        attachMaterialRowEvents(initialRow);
    }

    const initialEditRow = document.querySelector('#editMaterialsList .material-row');
    if (initialEditRow) {
        attachMaterialRowEvents(initialEditRow);
    }

    // Handle form submission for new import form
    if (importForm) {
        importForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            console.log('New import form submitted');
            newImportModal.classList.remove('show');
        });
    }

    // Handle form submission for edit import form
    if (editImportForm) {
        editImportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            console.log('Edit import form submitted');
            editImportModal.classList.remove('show');
        });
    }

    // Save button click handler for new import form
    const saveButton = document.getElementById('saveImportForm');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            if (importForm.checkValidity()) {
                importForm.dispatchEvent(new Event('submit'));
            } else {
                importForm.reportValidity();
            }
        });
    }

    // Save button click handler for edit import form
    const saveEditButton = document.getElementById('saveEditImportForm');
    if (saveEditButton) {
        saveEditButton.addEventListener('click', function() {
            if (editImportForm.checkValidity()) {
                editImportForm.dispatchEvent(new Event('submit'));
            } else {
                editImportForm.reportValidity();
            }
        });
    }

    // Add event listeners to edit buttons
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            const importId = row.cells[1].textContent; // Get the import ID from the table
            openEditModal(importId);
        });
    });

    // Function to open edit modal with populated data
    function openEditModal(importId) {
        // Get the import form data
        const importData = importFormsData[importId];
        if (!importData) return;

        // Populate the form fields
        document.getElementById('edit-import-id').value = importData.id;
        document.getElementById('edit-supplier').value = importData.supplier;
        document.getElementById('edit-import-date').value = importData.importDate;
        document.getElementById('edit-status').value = importData.status;
        document.getElementById('edit-receive-date').value = importData.receiveDate;
        document.getElementById('edit-notes').value = importData.notes;

        // Clear existing material rows except the first one
        while (editMaterialsList.children.length > 1) {
            editMaterialsList.removeChild(editMaterialsList.lastChild);
        }

        // Clear the first row
        const firstRow = editMaterialsList.querySelector('.material-row');
        firstRow.querySelector('.material-name').value = '';
        firstRow.querySelector('.material-unit').value = '';
        firstRow.querySelector('.material-quantity').value = '';
        firstRow.querySelector('.material-price').value = '';
        firstRow.querySelector('.material-total').value = '';

        // Add material rows
        importData.materials.forEach((material, index) => {
            let materialRow;
            if (index === 0) {
                // Use the first row
                materialRow = firstRow;
            } else {
                // Add new rows for additional materials
                addNewMaterialRow(editMaterialsList);
                materialRow = editMaterialsList.children[index];
            }

            // Populate the material row
            materialRow.querySelector('.material-name').value = material.id;
            
            // Trigger the change event to auto-fill unit and price
            const event = new Event('change');
            materialRow.querySelector('.material-name').dispatchEvent(event);
            
            // Set quantity
            materialRow.querySelector('.material-quantity').value = material.quantity;
            
            // Recalculate row total
            calculateRowTotal(materialRow);
        });

        // Calculate total amount
        calculateTotal(editMaterialsList);

        // Show the modal
        editImportModal.classList.add('show');
    }
}); 