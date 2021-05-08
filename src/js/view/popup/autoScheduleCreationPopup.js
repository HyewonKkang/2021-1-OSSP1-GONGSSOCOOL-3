var personalWork = document.getElementById('btn-auto-schedule-creation');

function popup() {
    var url = "/../template/popup/autoScheduleCreationPopup.html";
    var name = "popup test";
    var option = "width=500, height=500, location=no";
    window.open(url, name, option);
}

personalWork.addEventListener('click', function() {
    popup();
})