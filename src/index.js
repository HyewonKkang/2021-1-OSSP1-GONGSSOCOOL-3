import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dayViewBtn = document.getElementById('dayViewBtn');
const weekViewBtn = document.getElementById('weekViewBtn');
const monthViewBtn = document.getElementById('monthViewBtn');

prevBtn.addEventListener('click', () => {

});

nextBtn.addEventListener('click', () => {

});

dayViewBtn.addEventListener('click', () => {

});

weekViewBtn.addEventListener('click', () => {

});

monthViewBtn.addEventListener('click', () => {

});

const calendar = new Calendar('#calendar', {
  defaultView: 'week', // 'day', 'week', 'month'
  useCreationPopup: true,
  useDetailPopup: true,
  taskView: true,
  scheduleView: true,
  month: {
    workweek: false,
    visibleWeeksCount: 6 // 2~6
  },
  week: {
    workweek: false
  }
});

calendar.render();

calendar.createSchedules([
  {
    id: '1',
    calendarId: 'Major Lecture',
    title: '자료 구조',
    category: 'time',
    start: '2021-05-03T10:30:00',
    end: '2021-05-03T12:30:00'
  },
  {
    id: '2',
    calendarId: 'General Lecture',
    title: '데이터베이스',
    category: 'time',
    dueDateClass: '',
    start: '2021-05-04T11:30:00',
    end: '2021-05-04T13:30:00',
    isReadOnly: true
  },
  {
    id: '3',
    calendarId: 'Travel',
    title: '강촌 OT',
    category: 'allday',
    start: '2021-05-04',
    end: '2021-05-04',
    color: '#ffffff',
    bgColor: '#03bd9e',
    dragBgColor: '#03bd9e',
    borderColor: '#03bd9e'
  },
  {
    id: '4',
    calendarId: 'Major Lecture',
    title: '소프트웨어 개론 레포트 제출',
    category: 'task',
    start: '2021-05-06T14:30:00',
    end: '2021-05-06T15:30:00',
    color: '#ffffff',
    bgColor: '#9e5fff',
    dragBgColor: '#9e5fff',
    borderColor: '#9e5fff'
  },
  {
    id: '5',
    calendarId: 'Homework',
    title: '중간고사 종료',
    category: 'milestone',
    start: '2021-05-05T19:30:00',
    end: '2021-05-05T20:30:00',
    color: '#bbdc00',
    bgColor: '#ffffff',
    dragBgColor: '#ffffff',
    borderColor: '#ffffff'
  }
]);
calendar.setCalendarColor('Major Lecture', {
  color: '#ffffff',
  bgColor: '#ff5583',
  dragBgColor: '#ff5583',
  borderColor: '#ff5583'
});
calendar.setCalendarColor('General Lecture', {
  color: '#ffffff',
  bgColor: '#dc9656',
  dragBgColor: '#dc9656',
  borderColor: '#dc9656'
});

// 일간 보기
// calendar.changeView('day', true);

// 주간 보기
calendar.changeView('week', true);

// 월간 보기
// calendar.changeView('month', true);

// 월간 2주 보기
// calendar.setOptions({month: {visibleWeeksCount: 2}}, true);
// calendar.changeView('month', true);
