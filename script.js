
// ================================================
// RADHA MADHAV PRESS - COMPLETE BILLING SYSTEM
// ================================================


// ================================================
// 1. PRODUCT DATA
// ================================================

let products = [];

try {
    products = JSON.parse(
        localStorage.getItem("pressProducts") || "[]"
    );

    if (!Array.isArray(products)) products = [];
} catch (error) {
    products = [];
}

let editingIndex = -1;


// ================================================
// 2. PRODUCT MENU
// ================================================

const menu = [
    { name: "Visiting Card", price: 2 },
    { name: "School Report Card", price: 25 },
    { name: "School Notebook Sticker", price: 40 },
    { name: "School ID Card", price: 60 }
];


// ================================================
// 3. GET HTML ELEMENTS
// ================================================

const dateInput = document.getElementById("date");
const customerInput = document.getElementById("customerName");
const productInput = document.getElementById("product");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const totalInput = document.getElementById("total");
const deductionInput = document.getElementById("deduction");


// ================================================
// 4. IN-WEBSITE NOTIFICATION SYSTEM
// ================================================

// Add notification styles automatically

const notificationStyle = document.createElement("style");

notificationStyle.textContent = `
#pressNotification {
    position: fixed;
    bottom: 20px;
    left: 20px;
    top: auto;
    right: auto;
    z-index: 99999;
    width: min(350px, calc(100vw - 40px));
    padding: 15px 18px;
    border-radius: 12px;
    background: #ffffff;
    color: #173f34;
    box-shadow: 0 8px 30px rgba(0,0,0,0.18);
    border-left: 5px solid #c49a4a;
    display: none;
    align-items: center;
    gap: 12px;
    font-family: Arial, sans-serif;
    animation: pressSlideIn 0.3s ease;
}

    #pressNotification.show {
        display: flex;
    }

    #pressNotification.success {
        border-left-color: #238653;
    }

    #pressNotification.error {
        border-left-color: #dc4545;
    }

    #pressNotification.warning {
        border-left-color: #c49a4a;
    }

    #pressNotification .press-notification-icon {
        font-size: 23px;
    }

    #pressNotification .press-notification-message {
        font-size: 14px;
        line-height: 1.5;
        flex: 1;
    }

    #pressNotification .press-notification-close {
        border: none;
        background: none;
        font-size: 20px;
        cursor: pointer;
        color: #777;
    }

    #pressConfirmOverlay {
        position: fixed;
        inset: 0;
        z-index: 100000;
        background: rgba(0,0,0,0.5);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    #pressConfirmOverlay.show {
        display: flex;
    }

    .press-confirm-box {
        background: white;
        width: 100%;
        max-width: 350px;
        padding: 25px;
        border-radius: 15px;
        text-align: center;
        font-family: Arial, sans-serif;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        animation: pressSlideIn 0.25s ease;
    }

    .press-confirm-box h3 {
        color: #153e33;
        margin: 0 0 12px;
    }

    .press-confirm-box p {
        color: #666;
        font-size: 14px;
        line-height: 1.5;
    }

    .press-confirm-actions {
        display: flex;
        gap: 10px;
        margin-top: 22px;
    }

    .press-confirm-actions button {
        flex: 1;
        padding: 11px;
        border: none;
        border-radius: 7px;
        cursor: pointer;
        font-weight: bold;
    }

    #pressConfirmCancel {
        background: #eeeeee;
        color: #333;
    }

    #pressConfirmOK {
        background: #153e33;
        color: white;
    }

    @keyframes pressSlideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
        @media(max-width: 500px) {
    #pressNotification {
        bottom: 12px;
        left: 10px;
        top: auto;
        right: auto;
        width: calc(100vw - 20px);
    }
}
`;

document.head.appendChild(notificationStyle);


// Create notification element

const notification = document.createElement("div");

notification.id = "pressNotification";

notification.innerHTML = `
    <span class="press-notification-icon"></span>
    <span class="press-notification-message"></span>
    <button class="press-notification-close"
        type="button" aria-label="Close">&times;</button>
`;

document.body.appendChild(notification);

let notificationTimer;


// Show notification

function showMessage(message, type = "success") {

    clearTimeout(notificationTimer);

    const icons = {
        success: "✓",
        error: "✕",
        warning: "!"
    };

    notification.className = type + " show";

    notification.querySelector(
        ".press-notification-icon"
    ).textContent = icons[type] || "✓";

    notification.querySelector(
        ".press-notification-message"
    ).textContent = message;

    notificationTimer = setTimeout(() => {
        notification.classList.remove("show");
    }, 3500);
}


// Close notification

notification.querySelector(
    ".press-notification-close"
).onclick = function () {
    notification.classList.remove("show");
};


// ================================================
// 5. CUSTOM CONFIRMATION POPUP
// ================================================

const confirmOverlay = document.createElement("div");

confirmOverlay.id = "pressConfirmOverlay";

confirmOverlay.innerHTML = `
    <div class="press-confirm-box">
        <h3 id="pressConfirmTitle">Are you sure?</h3>
        <p id="pressConfirmMessage"></p>

        <div class="press-confirm-actions">
            <button id="pressConfirmCancel" type="button">
                Cancel
            </button>

            <button id="pressConfirmOK" type="button">
                Confirm
            </button>
        </div>
    </div>
`;

document.body.appendChild(confirmOverlay);

let confirmCallback = null;

function showConfirm(message, callback, title = "Are you sure?") {

    document.getElementById("pressConfirmTitle").textContent =
        title;

    document.getElementById("pressConfirmMessage").textContent =
        message;

    confirmCallback = callback;

    confirmOverlay.classList.add("show");
}


function closeConfirm(result) {

    confirmOverlay.classList.remove("show");

    const callback = confirmCallback;

    confirmCallback = null;

    if (callback) callback(result);
}


document.getElementById("pressConfirmCancel").onclick =
    function () {
        closeConfirm(false);
    };


document.getElementById("pressConfirmOK").onclick =
    function () {
        closeConfirm(true);
    };


confirmOverlay.addEventListener("click", function (event) {

    if (event.target === confirmOverlay) {
        closeConfirm(false);
    }

});


// ================================================
// 6. SET TODAY'S DATE
// ================================================

const today = new Date();

const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

dateInput.value = localToday;


// RESTORE CUSTOMER NAME

customerInput.value =
    localStorage.getItem("pressCustomerName") || "";


customerInput.addEventListener("input", function () {

    localStorage.setItem(
        "pressCustomerName",
        this.value
    );

});


// ================================================
// 7. AUTOMATIC TOTAL CALCULATION
// ================================================

function calculateTotal() {

    const price = Number(priceInput.value) || 0;

    const quantity = Number(quantityInput.value) || 0;

    totalInput.value = (price * quantity).toFixed(2);
}


priceInput.addEventListener("input", calculateTotal);

quantityInput.addEventListener("input", calculateTotal);


// ================================================
// 8. SAVE DATA
// ================================================

function saveData() {

    localStorage.setItem(
        "pressProducts",
        JSON.stringify(products)
    );

}


// ================================================
// 9. ADD PRODUCT
// ================================================

function addProduct() {

    const date = dateInput.value;

    const product = productInput.value.trim();

    const priceValue = priceInput.value;

    const quantityValue = quantityInput.value;

    const price = Number(priceValue);

    const quantity = Number(quantityValue);


    if (!date || !product || priceValue === "" ||
        quantityValue === "") {

        showMessage(
            "Please fill all the product fields.",
            "warning"
        );

        return;
    }


    if (
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        showMessage(
            "Please enter a valid price and quantity.",
            "error"
        );

        return;
    }


    const item = {
        date: date,
        product: product,
        price: price,
        quantity: quantity,
        total: price * quantity
    };


    products.push(item);

    saveData();

    renderTable();

    clearInputs();

    showMessage("Product added successfully!", "success");

}


// ================================================
// 10. DISPLAY BILL TABLE
// ================================================

function renderTable() {

    const table = document.getElementById("billTable");

    table.innerHTML = "";


    if (products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No products added yet
                </td>
            </tr>
        `;

    }


    products.forEach((item, index) => {

        const row = document.createElement("tr");


        const values = [
            index + 1,
            item.product,
            "₹" + Number(item.price).toFixed(2),
            item.quantity,
            "₹" + Number(item.total).toFixed(2)
        ];


        values.forEach(value => {

            const td = document.createElement("td");

            td.textContent = value;

            row.appendChild(td);

        });


        // EDIT BUTTON

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className = "edit-btn";

        editButton.textContent = "Edit";

        editButton.onclick = function () {
            editProduct(index);
        };


        // DELETE BUTTON

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.onclick = function () {
            deleteProduct(index);
        };


        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        table.appendChild(row);

    });


    updateSummary();

}


// ================================================
// 11. UPDATE SUBTOTAL AND GRAND TOTAL
// ================================================

function updateSummary() {

    const subtotal = products.reduce(
        (sum, item) => sum + Number(item.total),
        0
    );


    const deduction = Math.max(
        0,
        Number(deductionInput.value) || 0
    );


    const grandTotal = Math.max(
        0,
        subtotal - deduction
    );


    document.getElementById("subtotal").textContent =
        subtotal.toFixed(2);

    document.getElementById("grandTotal").textContent =
        grandTotal.toFixed(2);

}


deductionInput.addEventListener("input", updateSummary);


// ================================================
// 12. EDIT PRODUCT - POPUP
// ================================================

function editProduct(index) {

    editingIndex = index;

    const item = products[index];


    document.getElementById("editDate").value =
        item.date;

    document.getElementById("editProduct").value =
        item.product;

    document.getElementById("editPrice").value =
        item.price;

    document.getElementById("editQuantity").value =
        item.quantity;


    document.getElementById("editModal").style.display =
        "block";

}


// ================================================
// 13. SAVE EDITED PRODUCT
// ================================================

function saveEdit() {

    if (
        editingIndex < 0 ||
        editingIndex >= products.length
    ) {
        return;
    }


    const date = document.getElementById("editDate").value;

    const product = document.getElementById("editProduct")
        .value.trim();

    const priceValue = document.getElementById("editPrice").value;

    const quantityValue =
        document.getElementById("editQuantity").value;


    const price = Number(priceValue);

    const quantity = Number(quantityValue);


    if (!date || !product ||
        priceValue === "" || quantityValue === "") {

        showMessage(
            "Please fill all the edit fields.",
            "warning"
        );

        return;
    }


    if (
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        showMessage(
            "Please enter a valid price and quantity.",
            "error"
        );

        return;
    }


    products[editingIndex] = {

        date: date,
        product: product,
        price: price,
        quantity: quantity,
        total: price * quantity

    };


    saveData();

    renderTable();

    closeEdit();

    showMessage("Product updated successfully!", "success");

}


// ================================================
// 14. CLOSE EDIT POPUP
// ================================================

function closeEdit() {

    document.getElementById("editModal").style.display =
        "none";

    editingIndex = -1;

}


// ================================================
// 15. DELETE PRODUCT
// ================================================

function deleteProduct(index) {

    showConfirm(
        "Are you sure you want to delete this product?",
        function (confirmed) {

            if (!confirmed) return;

            products.splice(index, 1);

            if (editingIndex === index) {
                closeEdit();
            } else if (editingIndex > index) {
                editingIndex--;
            }

            saveData();

            renderTable();

            showMessage("Product deleted successfully!", "success");

        },
        "Delete Product"
    );

}


// ================================================
// 16. CLEAR INPUT FIELDS
// ================================================

function clearInputs() {

    productInput.value = "";

    priceInput.value = "";

    quantityInput.value = "";

    totalInput.value = "";

}


// ================================================
// 17. CLEAR COMPLETE BILL
// ================================================

function clearBill() {

    showConfirm(
        "This will delete all products and customer details from the current bill. Continue?",
        function (confirmed) {

            if (!confirmed) return;

            products = [];

            editingIndex = -1;

            customerInput.value = "";

            deductionInput.value = "";

            localStorage.removeItem("pressCustomerName");

            clearInputs();

            closeEdit();

            saveData();

            renderTable();

            showMessage("Bill cleared successfully!", "success");

        },
        "Clear Entire Bill"
    );

}


// ================================================
// 18. VIEW MENU
// ================================================

function openMenu() {

    const menuItems = document.getElementById("menuItems");

    menuItems.innerHTML = "";


    menu.forEach((item, index) => {

        const div = document.createElement("div");

        div.className = "menu-item";


        const name = document.createElement("span");

        name.textContent = item.name;


        const price = document.createElement("strong");

        price.textContent = "₹" + item.price.toFixed(2);


        div.appendChild(name);

        div.appendChild(price);


        div.onclick = function () {
            selectMenuItem(index);
        };


        menuItems.appendChild(div);

    });


    document.getElementById("menuModal").style.display =
        "block";

}


// ================================================
// 19. CLOSE MENU
// ================================================

function closeMenu() {

    document.getElementById("menuModal").style.display =
        "none";

}


// ================================================
// 20. SELECT MENU PRODUCT
// ================================================

function selectMenuItem(index) {

    const item = menu[index];

    productInput.value = item.name;

    priceInput.value = item.price;

    calculateTotal();

    closeMenu();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ================================================
// 21. CLOSE POPUPS ON OUTSIDE CLICK
// ================================================

window.addEventListener("click", function (event) {

    const menuModal = document.getElementById("menuModal");

    const editModal = document.getElementById("editModal");


    if (event.target === menuModal) {
        closeMenu();
    }


    if (event.target === editModal) {
        closeEdit();
    }

});


// ================================================
// 22. PROFESSIONAL PDF DOWNLOAD
// ================================================


function downloadPDF() {

    // ======================================
    // 1. VALIDATION
    // ======================================

    if (products.length === 0) {
        showMessage("Please add at least one product.", "warning");
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        showMessage("PDF library not loaded. Check your internet connection.", "error");
        return;
    }

    const customerName = customerInput.value.trim();
    const billDate = dateInput.value;

    if (!customerName) {
        showMessage("Please enter the customer name.", "warning");
        return;
    }

    if (!billDate) {
        showMessage("Please select a bill date.", "warning");
        return;
    }

    // ======================================
    // 2. CALCULATE TOTALS
    // ======================================

    const subtotal = products.reduce(
        (sum, item) => sum + Number(item.total),
        0
    );

    const deductionValue = deductionInput.value.trim();

    const deduction = deductionValue === ""
        ? 0
        : Number(deductionValue);

    if (
        !Number.isFinite(deduction) ||
        deduction < 0 ||
        deduction > subtotal
    ) {
        showMessage("Please enter a valid deduction amount.", "error");
        return;
    }

    const grandTotal = subtotal - deduction;

    const hasDeduction =
        deductionValue !== "" && deduction > 0;

    // ======================================
    // 3. INITIALIZE PDF
    // ======================================

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p", "mm", "a4");

    if (typeof doc.autoTable !== "function") {
        showMessage("PDF table library is missing.", "error");
        return;
    }

    const pageWidth = 210;
    const pageHeight = 297;
    const bottomMargin = 20;

    // ======================================
    // 4. FOUR COLOUR THEME
    // ======================================

    const blue = [30, 100, 190];
    const darkBlue = [20, 65, 125];

    const green = [35, 145, 85];
    const darkGreen = [20, 105, 60];

    const red = [215, 55, 55];
    const darkRed = [165, 35, 35];

    const yellow = [255, 215, 70];
    const lightYellow = [255, 248, 215];

    const lightBlue = [235, 244, 255];
    const lightGreen = [235, 248, 239];

    const grey = [95, 100, 110];
    const white = [255, 255, 255];
    const black = [35, 35, 35];

    // ======================================
    // 5. DATE FORMAT
    // ======================================

    const dateParts = billDate.split("-");

    const formattedDate = dateParts.length === 3
        ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        : billDate;

    // ======================================
    // 6. PDF HEADER - BLUE
    // ======================================

    doc.setFillColor(...blue);
    doc.rect(0, 0, pageWidth, 49, "F");

    // Yellow bottom border

    doc.setFillColor(...yellow);
    doc.rect(0, 49, pageWidth, 2, "F");

    // Decorative lines

    doc.setDrawColor(...yellow);
    doc.setLineWidth(0.7);

    doc.line(27, 19, 47, 19);
    doc.line(163, 19, 183, 19);

    // Business name

    doc.setFont("helvetica", "bold");
    doc.setFontSize(23);
    doc.setTextColor(...white);

    doc.text(
        "RADHA MADHAV PRESS",
        105,
        20,
        { align: "center" }
    );

    // Location

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(235, 245, 255);

    doc.text(
        "SURI, BIRBHUM",
        105,
        29,
        { align: "center" }
    );

    // Bill label

    doc.setFillColor(...yellow);

    doc.roundedRect(
        76, 35, 58, 9, 3, 3, "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...darkBlue);

    doc.text(
        "BILL / INVOICE",
        105,
        41,
        { align: "center" }
    );

    // ======================================
    // 7. CUSTOMER INFORMATION BOX
    // ======================================

    // Compact box: 150 x 24 mm

    doc.setFillColor(...lightBlue);

    doc.roundedRect(
        30, 59, 150, 24, 4, 4, "F"
    );

    doc.setDrawColor(...blue);
    doc.setLineWidth(0.3);

    doc.roundedRect(
        30, 59, 150, 24, 4, 4, "S"
    );

    // Divider

    doc.setDrawColor(...green);

    doc.line(125, 64, 125, 78);

    // Customer label

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...grey);

    doc.text("CUSTOMER NAME", 38, 68);

    // Customer name

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...darkBlue);

    const customerLines = doc.splitTextToSize(
        customerName,
        80
    );

    doc.text(
        customerLines.slice(0, 1),
        38,
        76
    );

    // Date label

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...grey);

    doc.text("BILL DATE", 135, 68);

    // Date

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...darkBlue);

    doc.text(
        formattedDate,
        135,
        76
    );

    // ======================================
    // 8. ITEM DETAILS HEADING - GREEN
    // ======================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...darkGreen);

    doc.text("ITEM DETAILS", 15, 96);

    // Green underline

    doc.setFillColor(...green);

    doc.roundedRect(
        15, 99, 25, 1.5, 0.5, 0.5, "F"
    );

    // ======================================
    // 9. PRODUCT TABLE
    // ======================================

    const tableData = products.map((item, index) => [

        index + 1,

        item.product,

        "Rs. " + Number(item.price).toFixed(2),

        item.quantity,

        "Rs. " + Number(item.total).toFixed(2)

    ]);

    doc.autoTable({

        startY: 105,

        head: [[
            "NO.",
            "PRODUCT DESCRIPTION",
            "PRICE",
            "QTY",
            "AMOUNT"
        ]],

        body: tableData,

        theme: "grid",

        margin: {
            left: 15,
            right: 15,
            top: 15,
            bottom: bottomMargin
        },

        pageBreak: "auto",

        rowPageBreak: "avoid",

        showHead: "everyPage",

        styles: {
            font: "helvetica",
            fontSize: 9.5,
            cellPadding: 5,
            textColor: black,
            lineColor: [215, 225, 215],
            lineWidth: 0.25,
            valign: "middle",
            minCellHeight: 12,
            overflow: "linebreak"
        },

        headStyles: {
            fillColor: green,
            textColor: white,
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            cellPadding: 6
        },

        alternateRowStyles: {
            fillColor: lightGreen
        },

        columnStyles: {

            0: {
                cellWidth: 18,
                halign: "center"
            },

            1: {
                cellWidth: 72,
                halign: "left"
            },

            2: {
                cellWidth: 30,
                halign: "right"
            },

            3: {
                cellWidth: 20,
                halign: "center"
            },

            4: {
                cellWidth: 40,
                halign: "right",
                fontStyle: "bold"
            }

        }

    });

    // ======================================
    // 10. SUMMARY BOX - GREEN BORDER
    // ======================================

    const summaryHeight = hasDeduction ? 43 : 32;

    const summaryX = 103;
    const summaryWidth = 92;

    let finalY = doc.lastAutoTable.finalY + 12;

    const requiredHeight = summaryHeight + 65;

    // Start a new page if necessary

    if (
        finalY + requiredHeight >
        pageHeight - bottomMargin
    ) {
        doc.addPage();
        finalY = 25;
    }

    // Draw white background with green border

    doc.setFillColor(...white);
    doc.setDrawColor(190, 215, 200);
    doc.setLineWidth(0.5);

    doc.roundedRect(
        summaryX,
        finalY,
        summaryWidth,
        summaryHeight,
        3,
        3,
        "FD"
    );

    // ======================================
    // 11. SUBTOTAL - NORMAL TEXT
    // ======================================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...grey);

    doc.text(
        "Subtotal",
        110,
        finalY + 10
    );

    doc.setTextColor(...black);

    doc.text(
        "Rs. " + subtotal.toFixed(2),
        188,
        finalY + 10,
        { align: "right" }
    );

    // ======================================
    // 12. DEDUCTION - RED TEXT
    // ======================================

    let grandTotalY = finalY + 21;

    if (hasDeduction) {

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...red);

        doc.text(
            "Deduction",
            110,
            finalY + 20
        );

        doc.setFont("helvetica", "bold");
        doc.setTextColor(...red);

        doc.text(
            "- Rs. " + deduction.toFixed(2),
            188,
            finalY + 20,
            { align: "right" }
        );

        grandTotalY = finalY + 31;
    }

    // ======================================
    // 13. GRAND TOTAL - GREEN TEXT
    // ======================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...green);

    doc.text(
        "GRAND TOTAL",
        110,
        grandTotalY + 3
    );

    doc.text(
        "Rs. " + grandTotal.toFixed(2),
        188,
        grandTotalY + 3,
        { align: "right" }
    );

    // ======================================
    // 14. HARE KRISHNA FOOTER
    // ======================================

    const footerY = grandTotalY + 25;

    // Four-colour decorative separator

    doc.setLineWidth(1.2);

    doc.setDrawColor(...blue);
    doc.line(15, footerY - 8, 60, footerY - 8);

    doc.setDrawColor(...green);
    doc.line(60, footerY - 8, 105, footerY - 8);

    doc.setDrawColor(...red);
    doc.line(105, footerY - 8, 150, footerY - 8);

    doc.setDrawColor(...yellow);
    doc.line(150, footerY - 8, 195, footerY - 8);

    // HARE KRISHNA

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(...blue);

    doc.text(
        "HARE KRISHNA",
        105,
        footerY,
        { align: "center" }
    );

    // Thank you message

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...grey);

    // ======================================
    // 15. PAGE NUMBERS
    // ======================================

    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {

        doc.setPage(i);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...grey);

        doc.text(
            "Page " + i + " of " + totalPages,
            105,
            290,
            { align: "center" }
        );
    }

    // ======================================
    // 16. DOWNLOAD PDF
    // ======================================

    try {

        doc.save("Radha_Madhav_Press_Bill.pdf");

        showMessage(
            "Your colourful PDF bill is ready!",
            "success"
        );

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to download PDF. Please try again.",
            "error"
        );

    }

}

// ================================================
// 23. INITIAL TABLE LOAD
// ================================================

renderTable();

