var personalWork = document.getElementById('btn-team-work');
/*
var DatePicker = require('tui-date-picker');
var timezone = require('../../common/timezone');
var datetime = require('../../common/datetime');
var TZDate = timezone.Date;


teamWorkPopup.prototype._createDatepicker = function(start, end) {

    this.rangePicker = DatePicker.createRangePicker({
        startpicker: {
            date: new TZDate(start).toDate(),
            input: '#' + 'tui-full-calendar-schedule-start-date',
            container: '#' + 'startpicker-container'
        },
        endpicker: {
            date: new TZDate(end).toDate(),
            input: '#' + 'tui-full-calendar-schedule-end-date',
            container: '#' + 'endpicker-container'
        },
        
        //usageStatistics: this._usageStatistics
    });
};
*/
function teamPopup() {
    var url = "teamWorkPopup.html";
    var name = "team-work";
    var option = "width=395, height=395, location=no";

    window.open(url, name, option);
}


personalWork.addEventListener('click', function() {
    //_createDatepicker();
    teamPopup();
})