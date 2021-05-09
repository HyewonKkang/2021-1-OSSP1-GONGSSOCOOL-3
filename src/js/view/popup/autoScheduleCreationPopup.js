var personalWork = document.getElementById('btn-auto-schedule-creation');

function autoSchedulePopup() {
    var url = "autoScheduleCreationPopup.html";
    var name = "auto-schedule-creation";
    var option = "width=475, height=275, location=no";

    window.open(url, name, option);
}

personalWork.addEventListener('click', function() {
    autoSchedulePopup();
})