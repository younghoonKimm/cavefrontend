import Calendar from 'react-calendar';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';

interface CustomCalendarType {
  date: Date;
  setDate: (date: any) => void;
}

function CustomCalendar({ date, setDate }: CustomCalendarType) {
  return (
    <CalendarContainer>
      <Calendar
        locale="US"
        onChange={setDate}
        value={date}
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
`;

export default CustomCalendar;
