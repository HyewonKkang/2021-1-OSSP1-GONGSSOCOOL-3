/* 코드를 작성해 보세요. */

// 캘린더를 생성하기 위해 tui-calendar 객체와 스타일 코드 삽입
import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

const calendar = new Calendar('#calendar', {
  defaultView: 'week',
  useCreationPopup: true,
  useDetailPopup: true
});

calendar.render();

calendar.createSchedules([
    {
      id: '1',
      calendarId: 'Major Lecture',
      title: '자료 구조',
      category: 'time',
      start: '2018-11-20T10:30:00',
      end: '2018-11-20T12:30:00'
    },
    {
      id: '2',
      calendarId: 'General Lecture',
      title: '건강과 영양',
      category: 'time',
      dueDateClass: '',
      start: '2018-11-20T14:30:00',
      end: '2018-11-20T16:30:00',
      isReadOnly: true // schedule is read-only
    }
]);


/* ---------------------------------------------- */
/* 이동 및 뷰 타입 변경 버튼 이벤트 핸들러 */
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dayViewBtn = document.getElementById('dayViewBtn');
const weekViewBtn = document.getElementById('weekViewBtn');
const monthViewBtn = document.getElementById('monthViewBtn');


nextBtn.addEventListener('click', () => {
    calendar.next();                          // 현재 뷰 기준으로 다음 뷰로 이동
  });
  
  prevBtn.addEventListener('click', () => {
    calendar.prev();                          // 현재 뷰 기준으로 이전 뷰로 이동
  });
  
  dayViewBtn.addEventListener('click', () => {
    calendar.changeView('day', true);         // 일간 뷰 보기
  });
  
  weekViewBtn.addEventListener('click', () => {
    calendar.changeView('week', true);        // 주간 뷰 보기
  });
  
  monthViewBtn.addEventListener('click', () => {
    calendar.changeView('month', true);       // 월간 뷰 보기
  });