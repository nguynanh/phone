$(document).ready(function() {
    // Khai báo các hằng số để xử lý đồ độ
    const modNames = {
        "11": "Động cơ",
        "13": "Hộp số",
        "16": "Giáp",
        "12": "Phanh",
        "15": "Hệ thống treo",
        "18": "Turbo"
    };
    const modKeyToIdMap = {
        "modEngine": "11",
        "modTransmission": "13",
        "modArmor": "16",
        "modBrakes": "12",
        "modSuspension": "15",
        "modTurbo": "18"
    };
    const modsToDisplay = ["11", "13", "16", "18"];

    // Hàm tìm kiếm xe
    $("#showroom-search-input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".showroom-vehicle-list .showroom-card").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Hàm thiết lập danh sách xe
    SetupShowroomVehicles = function(vehicles) {
        $(".showroom-vehicle-list").html("");
        if (vehicles && vehicles.length > 0) {
            vehicles.sort((a, b) => a.name.localeCompare(b.name));
            $.each(vehicles, function(i, vehicleData) {
                let model = vehicleData.model.toLowerCase();
                let imageUrl = `https://docs.fivem.net/vehicles/${model}.webp`;
                let vehicleImageHTML = `<img src="${imageUrl}" onerror="this.onerror=null; this.src='./img/default.png';">`;
                const formattedPrice = vehicleData.price.toLocaleString('en-US');
                const element = `
                    <div class="showroom-card" data-plate="${vehicleData.plate}">
                        <div class="showroom-card-image">${vehicleImageHTML}</div>
                        <div class="showroom-card-details">
                            <div class="vehicle-name">${vehicleData.name}</div>
                            <div class="vehicle-info">Giá: $${formattedPrice}</div>
                        </div>
                    </div>`;
                $(".showroom-vehicle-list").append(element);
                $(`[data-plate="${vehicleData.plate}"]`).data('VehicleData', vehicleData);
            });
        } else {
            $(".showroom-vehicle-list").html("<p style='color: #8f8f8f; text-align: center; margin-top: 5vh;'>Showroom hiện không có xe nào.</p>");
        }
    }

    // Xử lý sự kiện khi bấm vào xe để xem chi tiết
    $(document).on('click', '.showroom-card', function(e){
        e.preventDefault();
        const vehicleData = $(this).data('VehicleData');

        if (vehicleData) {
            let model = vehicleData.model.toLowerCase();
            let imageUrl = `https://docs.fivem.net/vehicles/${model}.webp`;

            // Điền thông tin cơ bản
            $('#detail-vehicle-name-showroom').text(vehicleData.name);
            $('#detail-vehicle-image-showroom').attr('src', imageUrl).on('error', function() { $(this).attr('src', './img/default.png'); });
            $('#detail-vehicle-category-showroom').text(vehicleData.category || 'Không xác định');
            $('#detail-vehicle-price-showroom').text(`$${vehicleData.price.toLocaleString('en-US')}`);
            $('#detail-vehicle-description-showroom').text(vehicleData.description || 'Không có mô tả.');

            // Xử lý và hiển thị thông tin đồ độ
            const modsListContainer = $('#detail-vehicle-mods-list-showroom');
            modsListContainer.empty();
            let hasRelevantMods = false;

            if (vehicleData.mods) {
                let modsObject = vehicleData.mods;
                if (typeof modsObject === 'string') {
                    try { modsObject = JSON.parse(modsObject); } catch (e) { modsObject = {}; }
                }
                
                if (typeof modsObject === 'object' && modsObject !== null) {
                    for (const key in modKeyToIdMap) {
                        if (modsObject.hasOwnProperty(key)) {
                            const modValue = modsObject[key];
                            const modId = modKeyToIdMap[key];
                            const modName = modNames[modId];
                            let modText = '';

                            if (modId === "18") { // **BƯỚC SỬA LỖI TURBO**
                                // Chỉ hiển thị "Đã lắp" nếu giá trị là true hoặc 1
                                if (modValue === true || modValue === 1) {
                                    modText = `${modName}: <span class="mod-value">Đã lắp</span>`;
                                }
                            } else if (modValue > -1) { // Chỉ hiển thị các món độ khác nếu đã được nâng cấp
                                modText = `${modName}: <span class="mod-value">Cấp ${modValue + 1}</span>`;
                            }

                            if (modText) {
                                modsListContainer.append(`<div class="mod-item-showroom">${modText}</div>`);
                                hasRelevantMods = true;
                            }
                        }
                    }
                }
            }

            if (!hasRelevantMods) {
                modsListContainer.append(`<div class="mod-item-none-showroom">Không có thông số.</div>`);
            }

            $('#showroom-vehicle-detail-view').css('display', 'flex').hide().fadeIn(200);
            $('.showroom-app-header, .showroom-search, .showroom-vehicle-list').fadeOut(200);
        }
    });

    // Xử lý sự kiện khi bấm nút quay lại
    $(document).on('click', '#showroom-detail-back-button', function(e){
        e.preventDefault();
        $('#showroom-vehicle-detail-view').fadeOut(200, function(){ $(this).css('display', 'none'); });
        $('.showroom-app-header, .showroom-search, .showroom-vehicle-list').fadeIn(200);
    });
});