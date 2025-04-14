import React from 'react';
import { Paper, Indicator } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';

interface EventCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  hasEvent: (date: Date) => boolean;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ 
  selectedDate, 
  onSelectDate, 
  hasEvent 
}) => {
  return (
    <Paper 
      shadow="sm" 
      p="md" 
      radius="md" 
      withBorder
      style={{
        maxWidth: 'fit-content',
        margin: '0 auto'
      }}
    >
      <Calendar 
        size="xl"
        getDayProps={(date) => ({
          selected: selectedDate ? dayjs(date).isSame(selectedDate, 'date') : false,
          onClick: () => onSelectDate(date),
          style: { position: 'relative' }
        })}
        styles={{
          calendarHeader: { marginBottom: 20 },
          day: { height: 50, fontSize: 16 }
        }}
        renderDay={(date) => {
          const day = date.getDate();
          return (
            <Indicator 
              size={6} 
              color="blue" 
              offset={-2} 
              disabled={!hasEvent(date)}
            >
              <div>{day}</div>
            </Indicator>
          );
        }}
      />
    </Paper>
  );
};

export default EventCalendar; 