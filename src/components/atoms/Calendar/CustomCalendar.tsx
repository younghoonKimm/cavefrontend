import Calendar from 'react-calendar';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';

interface CustomCalendarType {
  date: Date;
  setDate: (date: any) => void;
}

function CustomCalendar({ date, setDate }: CustomCalendarType) {
  return (
    <CalendarContainer>
      <Calendar
        locale="en-US"
        onChange={setDate}
        value={date}
        formatDay={(locale, date) => dayjs(date).format('DD')}
        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
      />
    </CalendarContainer>
  );
}

const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */

  margin: auto;
  margin-top: 20px;
  background-color: #d4f7d4;
  padding: 10px;
  border-radius: 3px;

  .react-calendar__navigation {
    position: relative;
  }

  .react-calendar__navigation__prev2-button,
  .react-calendar__navigation__next2-button {
    display: none;
  }
  .react-calendar__navigation__label {
    position: absolute;
    left: 28px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .react-calendar__navigation__prev-button,
  .react-calendar__navigation__next-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .react-calendar__navigation__prev-button {
    right: 44px;
  }
  .react-calendar__navigation__next-button {
    right: 0;
  }
`;

export default CustomCalendar;
