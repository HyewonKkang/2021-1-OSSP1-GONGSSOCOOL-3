var personalWork = document.getElementById('btn-auto-schedule-creation');

function popup() {
    var url = "autoScheduleCreationPopup.html";
    var name = "popup test";
    var option = "width=475, height=275, location=no";
    window.open(url, name, option);
}

personalWork.addEventListener('click', function() {
    popup();
})