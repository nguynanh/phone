const modNames = {
    "0": "Cánh gió", "1": "Cản trước", "2": "Cản sau", "3": "Hông xe", "4": "Ống xả", "5": "Khung", "6": "Lưới tản nhiệt", "7": "Nắp ca-pô", "8": "Chắn bùn", "9": "Chắn bùn phải", "10": "Mui xe",
    "11": "Động cơ", "12": "Phanh", "13": "Hộp số", "14": "Còi", "15": "Hệ thống treo", "16": "Giáp",
    "18": "Turbo", "22": "Đèn Xenon", "23": "Mâm xe", "25": "Sơn nóc", "27": "Màu khói lốp", "28": "Màu gầm", "38": "Màu nội thất", "46": "Màu sơn",
    "48": "Họa tiết"
};
const moddedVehicleList = [
    // "cheburek", // ví dụ
    // "italirsx", // ví dụ
];
// -- [KẾT THÚC KHAI BÁO] --

// Hàm tìm kiếm xe khi người dùng gõ vào ô tìm kiếm
$("#garage-search-input").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".garage-vehicle-list .garage-card").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

/**
 * Hàm chính để thiết lập và hiển thị danh sách xe trong gara
 * @param {Array} Vehicles - Dữ liệu tất cả các xe của người chơi
 */
SetupGarageVehicles = function(Vehicles) {
    $(".garage-vehicle-list").html(""); // Luôn xóa danh sách cũ trước khi tạo mới

    if (Vehicles && Vehicles.length > 0) {
        Vehicles.sort((a, b) => a.fullname.localeCompare(b.fullname));

        $.each(Vehicles, function(i, vehicle) {
            
            // --- LOGIC LẤY ẢNH ---
            let vehicleImageHTML;
            const model = vehicle.model.toLowerCase();

            if (moddedVehicleList.includes(model)) {
                vehicleImageHTML = `<img src="./images/${model}.png" onerror="this.onerror=null; this.src='./img/default.png';">`;
            } else {
                vehicleImageHTML = `<img src="https://docs.fivem.net/vehicles/${model}.webp" onerror="this.onerror=null; this.src='./img/default.png';">`;
            }

            // Lấy và định dạng dữ liệu xe
            const fuelLevel = vehicle.fuel !== undefined ? `${Math.ceil(vehicle.fuel)}%` : 'N/A';
            const engineHealth = vehicle.engine !== undefined ? `${Math.ceil(vehicle.engine / 10)}%` : 'N/A';
            const bodyHealth = vehicle.body !== undefined ? `${Math.ceil(vehicle.body / 10)}%` : 'N/A';
            const garageLocation = vehicle.garage ? `In ${vehicle.garage}` : 'N/A';

            // DÒNG SỬA LỖI ĐÚNG - PHẢI NẰM BÊN TRONG VÒNG LẶP NÀY
            const statusClass = vehicle.state ? 'status-in' : 'status-out';

            // Tạo thẻ HTML mới với class trạng thái đã được thêm vào
            const element = `
                <div class="garage-card ${statusClass}" data-plate="${vehicle.plate}">
                    <div class="garage-card-image">
                        ${vehicleImageHTML}
                    </div>
                    <div class="garage-card-details">
                        <div class="vehicle-name">${vehicle.fullname}</div>
                        <div class="vehicle-info">
                            Fuel: ${fuelLevel}<br>
                            Engine: ${engineHealth} | Body: ${bodyHealth}<br>
                            Garage: ${garageLocation}
                        </div>
                    </div>
                </div>
            `;

            $(".garage-vehicle-list").append(element);
            $(`[data-plate="${vehicle.plate}"]`).data('VehicleData', vehicle);
        });
    } else {
        $(".garage-vehicle-list").html("<p style='color: #8f8f8f; text-align: center; margin-top: 5vh;'>You have no vehicles.</p>");
    }
}

// NEW: Xử lý sự kiện khi bấm vào một thẻ xe
$(document).on('click', '.garage-card', function(e){
    e.preventDefault();
    const vehicleData = $(this).data('VehicleData');

    if (vehicleData) {
        // Lấy URL hình ảnh
        let vehicleImageURL;
        const model = vehicleData.model.toLowerCase();
        if (moddedVehicleList.includes(model)) {
            vehicleImageURL = `./images/${model}.png`;
        } else {
            vehicleImageURL = `https://docs.fivem.net/vehicles/${model}.webp`;
        }

        // Xử lý thông tin cơ bản
        let vehicleState = 'N/A';
        if (vehicleData.state === 1) { vehicleState = 'Trong Gara'; }
        else if (vehicleData.state === 0) { vehicleState = 'Bên ngoài'; }
        else if (vehicleData.state === 2) { vehicleState = 'Trong kho tạm giữ'; }

        let drivingDistance = 'N/A';
        if (vehicleData.drivingdistance && vehicleData.drivingdistance > 0) {
            drivingDistance = `${Math.round(vehicleData.drivingdistance / 1000)} km`;
        } else if (vehicleData.drivingdistance === 0) {
            drivingDistance = '0 km';
        }

        // Điền thông tin cơ bản vào HTML
        $('#detail-vehicle-name').text(vehicleData.fullname);
        $('#detail-vehicle-image').attr('src', vehicleImageURL).on('error', function() { $(this).attr('src', './img/default.png'); });
        $('#detail-vehicle-plate').text(vehicleData.plate);
        $('#detail-vehicle-fuel').text(vehicleData.fuel !== undefined ? `${Math.ceil(vehicleData.fuel)}%` : 'N/A');
        $('#detail-vehicle-engine').text(vehicleData.engine !== undefined ? `${Math.ceil(vehicleData.engine / 10)}%` : 'N/A');
        $('#detail-vehicle-body').text(vehicleData.body !== undefined ? `${Math.ceil(vehicleData.body / 10)}%` : 'N/A');
        $('#detail-vehicle-garage').text(vehicleData.garage || 'N/A');
        $('#detail-vehicle-state').text(vehicleState);
        $('#detail-vehicle-distance').text(drivingDistance);

        // ---- LOGIC MỚI: HIỂN THỊ CHI TIẾT ĐỒ ĐỘ ----
        const modsListContainer = $('#detail-vehicle-mods-list');
        modsListContainer.empty(); // Xóa danh sách cũ trước khi thêm mới

        if (vehicleData.mods && typeof vehicleData.mods === 'object' && Object.keys(vehicleData.mods).length > 0) {
            for (const modId in vehicleData.mods) {
                const modLevel = vehicleData.mods[modId];
                const modName = modNames[modId] || `Đồ độ #${modId}`;
                let modText = '';

                if (modId == "18" || modId == "22") { // Turbo và Xenon chỉ có bật/tắt
                     modText = `${modName}: <span class="mod-value">Đã lắp</span>`;
                } else if (modLevel >= 0) {
                    modText = `${modName}: <span class="mod-value">Cấp ${modLevel + 1}</span>`;
                }

                if (modText) {
                    modsListContainer.append(`<div class="mod-item">${modText}</div>`);
                }
            }
        } else {
            modsListContainer.append(`<div class="mod-item-none">Không có đồ độ</div>`);
        }

        // Hiển thị màn hình chi tiết
        $('#garage-vehicle-detail-view').css('display', 'flex').hide().fadeIn(200);
        $('.garage-app-header, .garage-search, .garage-vehicle-list').fadeOut(200);
    }
});

// NEW: Xử lý sự kiện khi bấm nút quay lại
$(document).on('click', '#garage-detail-back-button', function(e){
    e.preventDefault();
    $('#garage-vehicle-detail-view').fadeOut(200, function(){
        $(this).css('display', 'none');
    });
    $('.garage-app-header, .garage-search, .garage-vehicle-list').fadeIn(200);
});