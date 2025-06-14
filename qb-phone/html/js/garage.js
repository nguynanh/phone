// -- [BẮT ĐẦU KHAI BÁO BIẾN QUAN TRỌNG] --
// Đảm bảo phần này luôn có ở đầu tệp.
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

            const fuelLevel = vehicle.fuel !== undefined ? `${Math.ceil(vehicle.fuel)}%` : 'N/A';
            const engineHealth = vehicle.engine !== undefined ? `${Math.ceil(vehicle.engine / 10)}%` : 'N/A';
            const bodyHealth = vehicle.body !== undefined ? `${Math.ceil(vehicle.body / 10)}%` : 'N/A';
            const garageLocation = vehicle.garage ? `In ${vehicle.garage}` : 'N/A';
            const statusClass = vehicle.state ? 'status-in' : 'status-out';

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

        const vehicleState = vehicleData.state ? 'Trong Gara' : 'Bên ngoài';
        const drivingDistance = vehicleData.drivingdistance ? `${Math.round(vehicleData.drivingdistance / 1000)} km` : 'N/A';

        // --- BẮT ĐẦU LOGIC MỚI: Đếm số lượng đồ độ ---
        let modCount = 0;
        // Kiểm tra xem 'mods' có phải là một đối tượng và không rỗng
        if (vehicleData.mods && typeof vehicleData.mods === 'object' && Object.keys(vehicleData.mods).length > 0) {
            // Đếm số lượng key (món đồ) trong đối tượng mods
            modCount = Object.keys(vehicleData.mods).length;
        }
        const modsText = modCount > 0 ? `${modCount} món` : 'Không có';
        // --- KẾT THÚC LOGIC MỚI ---

        // Điền thông tin vào màn hình chi tiết
        $('#detail-vehicle-name').text(vehicleData.fullname);
        $('#detail-vehicle-image').attr('src', vehicleImageURL).on('error', function() {
            $(this).attr('src', './img/default.png'); // Fallback image
        });
        $('#detail-vehicle-plate').text(vehicleData.plate);
        $('#detail-vehicle-fuel').text(vehicleData.fuel !== undefined ? `${Math.ceil(vehicleData.fuel)}%` : 'N/A');
        $('#detail-vehicle-engine').text(vehicleData.engine !== undefined ? `${Math.ceil(vehicleData.engine / 10)}%` : 'N/A');
        $('#detail-vehicle-body').text(vehicleData.body !== undefined ? `${Math.ceil(vehicleData.body / 10)}%` : 'N/A');
        $('#detail-vehicle-garage').text(vehicleData.garage || 'N/A');
        $('#detail-vehicle-state').text(vehicleState);
        $('#detail-vehicle-distance').text(drivingDistance);
        $('#detail-vehicle-mods').text(modsText); // Điền thông tin đồ độ

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