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

            // Lấy và định dạng dữ liệu xe
            const fuelLevel = vehicle.fuel !== undefined ? `${Math.ceil(vehicle.fuel)}%` : 'N/A';
            const engineHealth = vehicle.engine !== undefined ? `${Math.ceil(vehicle.engine / 10)}%` : 'N/A';
            const bodyHealth = vehicle.body !== undefined ? `${Math.ceil(vehicle.body / 10)}%` : 'N/A';
            const garageLocation = vehicle.garage ? `In ${vehicle.garage}` : 'N/A';

            // ==========================================================
            // *** LOGIC MÀU SẮC ĐÚNG: Xe ở ngoài (state 0) màu đỏ, còn lại màu xanh ***
            const statusClass = vehicle.state === 0 ? 'status-out' : 'status-in';
            // ==========================================================

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

$(document).on('click', '#track-vehicle-button', function(e){
    e.preventDefault();
    let vehData = $(this).closest('.garage-card').data('VehicleData');
    if (vehData) {
        $.post("https://qb-phone/track-vehicle", JSON.stringify({
            veh: vehData,
        }));
    }
});