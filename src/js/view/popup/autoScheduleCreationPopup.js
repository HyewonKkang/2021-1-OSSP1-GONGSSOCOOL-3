var personalWork = document.getElementById('btn-auto-schedule-creation');

function popup() {
    var url = "autoScheduleCreation";
    var name = "popup test";
    var option = "width=500, height=500, location=no";
    window.open(url, name, option);

    //$('#btn1').on('click', createNewSchedule);
}

personalWork.addEventListener('click', function() {
    popup();
})