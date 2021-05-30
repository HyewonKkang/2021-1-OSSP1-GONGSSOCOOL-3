'use strict';

/* eslint-disable */
/* eslint-env jquery */
/* global moment, tui, chance */
/* global findCalendar, CalendarList, ScheduleList, generateSchedule */

var request = axios.create({
    baseURL: '/api',
    withCredentials: true
});

(function(window, Calendar) {
    var cal, resizeThrottled;
    var useCreationPopup = true;
    var useDetailPopup = true;
    var datePicker, selectedCalendar;

    cal = new Calendar('#calendar', {
        defaultView: 'month',
        useCreationPopup: useCreationPopup,
        useDetailPopup: useDetailPopup,
        calendars: CalendarList,
        template: {
            milestone: function(model) {
                return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + model.bgColor + '">' + model.title + '</span>';
            },
            allday: function(schedule) {
                return getTimeTemplate(schedule, true);
            },
            time: function(schedule) {
                return getTimeTemplate(schedule, false);
            }
        }
    });

    // event handlers
    cal.on({
        'clickMore': function(e) {
            console.log('clickMore', e);
        },
        'clickSchedule': function(e) {
            console.log('clickSchedule', e);
            const {event, schedule} = e;
            const {id, calendarId} = e.schedule;

            const elSchedule = cal.getElement(id, calendarId);
            const scheduleRect = elSchedule.getBoundingClientRect();
            console.log(elSchedule, scheduleRect);
        },
        'clickDayname': function(date) {
            console.log('clickDayname', date);
        },
        'beforeCreateSchedule': function(e) {
            console.log('beforeCreateSchedule', e);
            //saveNewSchedule(e);
            var schedule = createScheduleData(e);
            var calendar = e.calendar || findCalendar(e.calendarId);
            var duration = "", importance = "", times = "";
    
            duration = $('#schedule-duration').val();
            importance = $('#schedule-importance').val();
            times = $('#schedule-times').val();

            if(duration !== "" && importance !== "" && times !== "") {
                autoScheduling(e);
            } else {
                request.post('/schedule', schedule).then(function(res) {
                    var data = res.data;
                    var schedule = createScheduleData(data);
                    createSchedules(schedule);
                });
            }
        },
        'beforeUpdateSchedule': function(e) {
            var schedule = e.schedule;
            var changes = e.changes;

            console.log('beforeUpdateSchedule', e);

            if (changes && !changes.isAllDay && schedule.category === 'allday') {
                changes.category = 'time';
            }
            var form = $.extend({id: schedule.id}, changes);
            if (form.start && form.start._date) {
                form.start = form.start._date;
            }
            if (form.end && form.end._date) {
                form.end = form.end._date;
            }
            request.put('/schedule', form).then(function() {
                cal.updateSchedule(schedule.id, schedule.calendarId, changes);
                refreshScheduleVisibility();
            });
        },
        'beforeDeleteSchedule': function(e) {
            console.log('beforeDeleteSchedule', e);
            
            request.delete('/schedule', {
                data: {
                    id: e.schedule.id,
                    calendarId: e.schedule.calendarId
                }
            }).then(function(res) {
                var data = res.data;
                cal.deleteSchedule(data.id, data.calendarId);
            });
            // cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
        },
        'afterRenderSchedule': function(e) {
            var schedule = e.schedule;
            // var element = cal.getElement(schedule.id, schedule.calendarId);
            // console.log('afterRenderSchedule', element);
        },
        'clickTimezonesCollapseBtn': function(timezonesCollapsed) {
            console.log('timezonesCollapsed', timezonesCollapsed);

            if (timezonesCollapsed) {
                cal.setTheme({
                    'week.daygridLeft.width': '77px',
                    'week.timegridLeft.width': '77px'
                });
            } else {
                cal.setTheme({
                    'week.daygridLeft.width': '60px',
                    'week.timegridLeft.width': '60px'
                });
            }

            return true;
        }
    });

    /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    function getTimeTemplate(schedule, isAllDay) {
        var html = [];
        var start = moment(schedule.start.toUTCString());
        if (!isAllDay) {
            html.push('<strong>' + start.format('HH:mm') + '</strong> ');
        }
        if (schedule.isPrivate) {
            html.push('<span class="calendar-font-icon ic-lock-b"></span>');
            html.push(' Private');
        } else {
            if (schedule.isReadOnly) {
                html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
            } else if (schedule.recurrenceRule) {
                html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
            } else if (schedule.attendees.length) {
                html.push('<span class="calendar-font-icon ic-user-b"></span>');
            } else if (schedule.location) {
                html.push('<span class="calendar-font-icon ic-location-b"></span>');
            }
            html.push(' ' + schedule.title);
        }

        return html.join('');
    }

    /**
     * A listener for click the menu
     * @param {Event} e - click event
     */
    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';

        console.log(target);
        console.log(action);
        switch (action) {
            case 'toggle-daily':
                viewName = 'day';
                break;
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
                viewName = 'month';
                break;
            case 'toggle-weeks2':
                options.month.visibleWeeksCount = 2;
                viewName = 'month';
                break;
            case 'toggle-weeks3':
                options.month.visibleWeeksCount = 3;
                viewName = 'month';
                break;
            case 'toggle-narrow-weekend':
                options.month.narrowWeekend = !options.month.narrowWeekend;
                options.week.narrowWeekend = !options.week.narrowWeekend;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.narrowWeekend;
                break;
            case 'toggle-start-day-1':
                options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
                options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.startDayOfWeek;
                break;
            case 'toggle-workweek':
                options.month.workweek = !options.month.workweek;
                options.week.workweek = !options.week.workweek;
                viewName = cal.getViewName();

                target.querySelector('input').checked = !options.month.workweek;
                break;
            default:
                break;
        }

        cal.setOptions(options, true);
        cal.changeView(viewName, true);

        setDropdownCalendarType();
        setRenderRangeText();
        setSchedules();
    }

    function onClickNavi(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }

        setRenderRangeText();
        setSchedules();
    }

    function onNewSchedule() {
        var title = $('#new-schedule-title').val();
        var location = $('#new-schedule-location').val();
        var isAllDay = document.getElementById('new-schedule-allday').checked;
        var start = datePicker.getStartDate();
        var end = datePicker.getEndDate();
        var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];

        if (!title) {
            return;
        }

        cal.createSchedules([{
            id: scheduleData.id,
            calendarId: calendar.id,
            title: title,
            isAllDay: isAllDay,
            start: start,
            end: end,
            category: isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            raw: {
                location: location,
                duration: duration,
                importance: importance,
                times: times
            },
            state: 'Busy'
        }]);

        $('#modal-new-schedule').modal('hide');
    }

    function onChangeNewScheduleCalendar(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var calendarId = getDataAction(target);
        changeNewScheduleCalendar(calendarId);
    }

    function changeNewScheduleCalendar(calendarId) {
        var calendarNameElement = document.getElementById('calendarName');
        var calendar = findCalendar(calendarId);
        var html = [];

        html.push('<span class="calendar-bar" style="background-color: ' + calendar.bgColor + '; border-color:' + calendar.borderColor + ';"></span>');
        html.push('<span class="calendar-name">' + calendar.name + '</span>');

        calendarNameElement.innerHTML = html.join('');

        selectedCalendar = calendar;
    }

    function createNewSchedule(event) {
        var start = event.start ? new Date(event.start.getTime()) : new Date();
        var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

        if (useCreationPopup) {
            cal.openCreationPopup({
                start: start,
                end: end
            });
        }
    }
    function create2DArray(rows, columns) {
        var arr = Array.from(Array(rows), () => Array(columns).fill(0)); // =arr[48][cols], initialize 0
        return arr;
    }
    function autoScheduling(scheduleData) {
        var schedule = createScheduleData(scheduleData);
        
        var temp_schedules = new Array(); // 임시로 고정 일정 저장
        var fixed_schedules = new Array(); // 고정 일정
        var auto_schedules = new Array(); // 자동 스케줄링 일정

        var auto_start = Date.parse(schedule.start);
        var auto_end = Date.parse(schedule.end);
        var min_start, max_end;

        console.log('autoScheduling');
        function getData() {
            return new Promise(function(resolve) {
                request.get('/schedule').then(function(res) {
                    var list = res.data;
                    $.each(list, function(index, item) {
                        if (item.raw['duration'] !== null && item.raw['importance'] !== null && item.raw['times'] !== null){ 
                            var cmp_start = Date.parse(item.start);
                            var cmp_end = Date.parse(item.end);
                            if((auto_end < cmp_start) || (cmp_end < auto_start)) {
        
                            } else { // 겹치는 일정이 있는 경우
                                auto_schedules.push(item);
                            }   
                        }
                        else { temp_schedules.push(item) };
                    });
                    resolve(res);
                })
            })
        }
        getData().then(function() { // 정렬 작업
            auto_schedules.push(schedule);

            auto_schedules.sort(function (a, b) { // startDate 오름차순 정렬
                return Date.parse(a.start) < Date.parse(b.start) ? -1 : Date.parse(a.start) > Date.parse(b.start) ? 1 : 0;
            })
            
            min_start = auto_schedules[0].start; // 최소 시작 Date
            min_start.setHours(9);
            min_start.setMinutes(0);
            min_start.setSeconds(0);

            auto_schedules.sort(function (a, b) { // endDate + importance 순 정렬
                if (Date.parse(a.end) > Date.parse(b.end)) return 1;
                else if (Date.parse(a.end) < Date.parse(b.end)) return -1;
                else if (a.raw['importance'] < b.raw['importance']) return 1;
                else if (a.raw['importance'] > b.raw['importance']) return -1;
                return 0;
            })

            max_end = auto_schedules[auto_schedules.length-1].end; // 최대 마감 Date
            max_end.setHours(23);
            max_end.setMinutes(59);
        })
        .then(function() { // 최소 시작 ~ 최대 마감 테이블 생성
            var start_ = new Date(min_start);
            var end_ = new Date(max_end);
            var cols = end_.getDate() - start_.getDate() + 1;
            var rows = 48;
            
            var timetable = create2DArray(rows, cols);

            for(var i=0; i<temp_schedules.length; i++) {
                if ((Date.parse(temp_schedules[i].end)) < (Date.parse(start_)) || (Date.parse(end_)) < (Date.parse(temp_schedules[i].start))) {

                }
                else { // 최소 시간 ~ 최대 마감 부분과 겹칠 때
                    fixed_schedules.push(temp_schedules[i]);
                }
            } 

            for(var i=0; i<fixed_schedules.length; i++) {
                console.log("fixed : ", fixed_schedules[i].title, fixed_schedules[i].start, fixed_schedules[i].end);
                var data_start = new Date(fixed_schedules[i].start);
                var data_end = new Date(fixed_schedules[i].end);
                if (data_start.getDate() != data_end.getDate()) continue; // all day 일정
                
                var data_start_month = data_start.getMonth();
                var data_start_date = data_start.getDate();
                var data_start_hours = data_start.getHours();
                var data_start_minutes = data_start.getMinutes();
                var data_end_month = data_end.getMonth();
                var data_end_date = data_end.getDate();
                var data_end_hours = data_end.getHours();
                var data_end_minutes = data_end.getMinutes();

                var j_start, j_end;
                j_start = (data_start_minutes < 30) ? data_start_hours * 2 : data_start_hours * 2 + 1;
                if (data_end_minutes === 0) j_end = data_end_hours * 2 - 1;
                else if (data_end_minutes <= 30) j_end = data_end_hours * 2;
                else if (data_end_minutes > 30) j_end = data_end_hours * 2 + 1;

                for(var k=data_start_date - start_.getDate(); k<=data_end_date - start_.getDate(); k++) {
                    for(var j=j_start; j<=j_end; j++) {
                        timetable[j][k] = 1;
                    }
                }
            }
            for(var z=0; z<auto_schedules.length; z++){
                var auto_start = new Date(auto_schedules[z].start);
                var auto_end = new Date(auto_schedules[z].end);
                var auto_start_month = auto_start.getMonth();
                var auto_start_date = auto_start.getDate();
                var auto_start_hours = auto_start.getHours();
                var auto_start_minutes = auto_start.getMinutes();
                var auto_end_month = auto_end.getMonth();
                var auto_end_date = auto_end.getDate();
                var auto_end_hours = auto_end.getHours();
                var auto_end_minutes = auto_end.getMinutes();

                var auto_times = parseInt(auto_schedules[z].raw['times']);
                var auto_duration = parseInt(auto_schedules[z].raw['duration']);
                var divided_times = auto_times / auto_duration;
                var time;

                var len =  auto_end_date - auto_start_date + 1;
                var start_date = auto_start_date;
                // 필요 시간 배정
                if(Number.isInteger(divided_times)){
                    time = divided_times*2;
                }
                else{
                    if(divided_times-parseInt(divided_times) <= 0.5){
                        time = parseInt(divided_times) * 2 + 1;
                    }
                    else{
                        time = (parseInt(divided_times) + 1) * 2;
                    }
                }
                
                var dates = new Array();
                var times = new Array();
                var duration_count = auto_duration;
                
                for(var i=0; i<len; i++){
                    for(var j=18; j<48-time; j++){
                        if(timetable[j][i] === 0){
                            var flag=0;
                            for(var k=0; k<time; k++){ // 타임블럭이 들어가지는지 확인
                                if(timetable[j+k][i] === 0){ 
                                    flag++;
                                }
                            }
                            if(flag === time){ // 들어가짐
                                duration_count--;
                                dates.push(i);
                                times.push(j);
                                for(var k=0; k<time; k++){ // 타임블럭이 들어갔으므로 1로 변환
                                    timetable[j+k][i] = 1;
                                }
                                break;
                            }
                        }
                    }
                    if(duration_count === 0){
                        break;
                    }
                }
                
                setAutoSchedule(z);

                async function setAutoSchedule(z) {
                    for(var a=0; a<auto_duration; a++){
                        auto_start_date = start_date + dates[a];
                        auto_start_hours = parseInt(times[a]/2);
                        if(times[a]%2 === 0){auto_start_minutes = 0;}
                        else{auto_start_minutes = 30;}
                        
                        auto_end_date = auto_start_date;
                        auto_end_hours = parseInt((times[a] + time)/2);
                        if((times[a]+time)%2 == 0){auto_end_minutes = 0;}
                        else{auto_end_minutes = 30;}
    
                        auto_start.setDate(auto_start_date);
                        auto_start.setHours(auto_start_hours);
                        auto_start.setMinutes(auto_start_minutes);
                        auto_end.setDate(auto_end_date);
                        auto_end.setHours(auto_end_hours);
                        auto_end.setMinutes(auto_end_minutes);
                        
                        var push_schedule = {};
                        push_schedule.title = auto_schedules[z].title;
                        push_schedule.isAllDay = auto_schedules[z].isAllDay;
                        push_schedule.location = auto_schedules[z].location;
                        push_schedule.category = auto_schedules[z].category;
                        push_schedule.dueDateClass = auto_schedules[z].dueDateClass;
                        push_schedule.color = auto_schedules[z].color;
                        push_schedule.bgColor = auto_schedules[z].bgColor;
                        push_schedule.dragBgColor = auto_schedules[z].dragBgColor;
                        push_schedule.borderColor = auto_schedules[z].borderColor;
                        push_schedule.start = auto_start;
                        push_schedule.end = auto_end;
                        push_schedule.raw = {};
                        push_schedule.raw.class=auto_schedules[z].raw['class'];
                        //push_schedule.raw.duration="";
                        //push_schedule.raw.importance = "";
                        //push_schedule.raw.times = "";
                        await fetchSchedule(push_schedule);
                    }
                }
                
                
                function fetchSchedule(schedule) {
                    return new Promise(function(resolve) {
                        var schedule_ = createScheduleData(schedule);
                        schedule_.raw.duration="";
                        schedule_.raw.importance="";
                        schedule_.raw.times="";
                        request.post('/schedule', schedule_).then(function(res) {
                            var data = res.data;
                            var schedule_ = createScheduleData(data);
                            createSchedules(schedule_);
                        });
                    resolve();
                    })
                }
            }
        })
    }
    function createScheduleData(scheduleData) {
        var calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
        var duration = "", importance = "", times = "";

        duration = $('#schedule-duration').val();
        importance = $('#schedule-importance').val();
        times = $('#schedule-times').val();

        var schedule = {
            id: scheduleData.id,
            title: scheduleData.title,
            isAllDay: scheduleData.isAllDay,
            start: scheduleData.start._date ? scheduleData.start._date : scheduleData.start,
            end: scheduleData.end._date ? scheduleData.end._date : scheduleData.end,
            category: scheduleData.isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            location: scheduleData.location,
            raw: {
                class: scheduleData.raw['class'],
                duration: duration,
                importance: importance,
                times: times
            },
            state: scheduleData.state
        };
        if (calendar) {
            schedule.calendarId = calendar.id;
            schedule.color = calendar.color;
            schedule.bgColor = calendar.bgColor;
            schedule.borderColor = calendar.borderColor;
        }
        return schedule;
    }

    function createSchedules(schedule) {

        cal.createSchedules([schedule]);

        refreshScheduleVisibility();
    }

    function onChangeCalendars(e) {
        var calendarId = e.target.value;
        var checked = e.target.checked;
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function(input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
            });

            CalendarList.forEach(function(calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function(input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }

        refreshScheduleVisibility();
    }

    function refreshScheduleVisibility() {
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

        CalendarList.forEach(function(calendar) {
            cal.toggleSchedules(calendar.id, !calendar.checked, false);
        });

        cal.render(true);

        calendarElements.forEach(function(input) {
            var span = input.nextElementSibling;
            span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
        });
    }

    function setDropdownCalendarType() {
        var calendarTypeName = document.getElementById('calendarTypeName');
        var calendarTypeIcon = document.getElementById('calendarTypeIcon');
        var options = cal.getOptions();
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'day') {
            type = 'Daily';
            iconClassName = 'calendar-icon ic_view_day';
        } else if (type === 'week') {
            type = 'Weekly';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 2) {
            type = '2 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 3) {
            type = '3 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else {
            type = 'Monthly';
            iconClassName = 'calendar-icon ic_view_month';
        }

        calendarTypeName.innerHTML = type;
        calendarTypeIcon.className = iconClassName;
    }

    function currentCalendarDate(format) {
      var currentDate = moment([cal.getDate().getFullYear(), cal.getDate().getMonth(), cal.getDate().getDate()]);

      return currentDate.format(format);
    }

    function setRenderRangeText() {
        var renderRange = document.getElementById('renderRange');
        var options = cal.getOptions();
        var viewName = cal.getViewName();

        var html = [];
        if (viewName === 'day') {
            html.push(currentCalendarDate('YYYY.MM.DD'));
        } else if (viewName === 'month' &&
            (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
            html.push(currentCalendarDate('YYYY.MM'));
        } else {
            html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
            html.push(' ~ ');
            html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
        }
        renderRange.innerHTML = html.join('');
    }

    function setSchedules() {
        cal.clear();
        //generateSchedule(cal.getViewName(), cal.getDateRangeStart(), cal.getDateRangeEnd());
        // cal.createSchedules(ScheduleList);
        request.get('/schedule').then(function(res) {
            var list = res.data;
            $.each(list, function(index, item) {
                var schedule = createScheduleData(item);
                createSchedules(schedule, true);
            });
            refreshScheduleVisibility();
        });
    }

    function setEventListener() {
        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
        $('#lnb-calendars').on('change', onChangeCalendars);

        $('#btn-save-schedule').on('click', onNewSchedule);
        $('#btn-new-schedule').on('click', createNewSchedule);

        $('#dropdownMenu-calendars-list').on('click', onChangeNewScheduleCalendar);

        window.addEventListener('resize', resizeThrottled);
    }

    function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
    }

    resizeThrottled = tui.util.throttle(function() {
        cal.render();
    }, 50);

    window.cal = cal;

    setDropdownCalendarType();
    setRenderRangeText();
    setSchedules();
    setEventListener();
})(window, tui.Calendar);

// set calendars
(function() {
    var calendarList = document.getElementById('calendarList');
    var html = [];
    CalendarList.forEach(function(calendar) {
        html.push('<div class="lnb-calendars-item"><label>' +
            '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
            '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
            '<span>' + calendar.name + '</span>' +
            '</label></div>'
        );
    });
    calendarList.innerHTML = html.join('\n');
})();

let isLogin = false;
request.get('/loged').then(function() {
    isLogin = true;
    $('#btn-logout').show();
}).catch(function() {
    $('#btn-login').show();
});

$('#btn-login').on('click', function() {
    window.location.href = 'login.html';
});

$('#btn-logout').on('click', function() {
    request.get('/logout').then(function() {
        window.location.href = 'login.html';
    });
});