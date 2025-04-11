import React, { useState } from 'react';
import { Container, Title, Text, Paper, Grid, Badge, Group, Stack } from '@mantine/core';
import '@mantine/dates/styles.css';
import EventCalendar from '../components/EventCalendar';

// Sample events data - in a real app, this would come from an API or database
const sampleEvents = [
  {
    id: 1,
    title: 'Educational Webinar',
    date: new Date(2025, 3, 14), // April 14, 2025
    type: 'webinar'
  },
  {
    id: 2,
    title: 'Chapter Meeting',
    date: new Date(2025, 3, 15), // April 15, 2025
    type: 'meeting'
  },
  {
    id: 3,
    title: 'Annual Chapter Meeting',
    date: new Date(2025, 3, 20), // April 20, 2025
    type: 'conference'
  },
  {
    id: 4,
    title: 'Networking Event',
    date: new Date(2025, 3, 24), // April 24, 2025
    type: 'networking'
  }
];

const Events: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Get events for the selected date
  const eventsForSelectedDate = sampleEvents.filter(event => {
    return selectedDate && 
    event.date.getDate() === selectedDate.getDate() && 
    event.date.getMonth() === selectedDate.getMonth() && 
    event.date.getFullYear() === selectedDate.getFullYear()
  });
  console.log(eventsForSelectedDate);
  
  // Get all events for the current month
  const currentMonthEvents = sampleEvents.filter(event => 
    selectedDate && 
    event.date.getMonth() === selectedDate.getMonth() && 
    event.date.getFullYear() === selectedDate.getFullYear()
  );
  
  // Function to check if a date has an event
  const hasEvent = (date: Date) => {
    return sampleEvents.some(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Function to handle date selection
  const handleSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Container size="xl">
      <Title order={1} mb="md">Chapter Events</Title>
      <Text size="lg" c="dimmed" mb="xl">
        Stay updated with our upcoming events, conferences, and educational programs.
      </Text>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <EventCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelect}
            hasEvent={hasEvent}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Title order={3} mb="md">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a date'}
            </Title>
            
            {eventsForSelectedDate.length > 0 ? (
              <Stack>
                {eventsForSelectedDate.map(event => (
                  <Paper key={event.id} p="sm" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>{event.title}</Text>
                      <Badge 
                        color={
                          event.type === 'meeting' ? 'blue' : 
                          event.type === 'conference' ? 'green' : 
                          event.type === 'webinar' ? 'violet' : 'orange'
                        }
                      >
                        {event.type}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {event.date.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text c="dimmed">No events scheduled for this date.</Text>
            )}
            
            <Title order={4} mt="xl" mb="md">Upcoming Events</Title>
            <Stack>
              {currentMonthEvents.map(event => (
                <Paper key={event.id} p="sm" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>{event.title}</Text>
                    <Badge 
                      color={
                        event.type === 'meeting' ? 'blue' : 
                        event.type === 'conference' ? 'green' : 
                        event.type === 'webinar' ? 'violet' : 'orange'
                      }
                    >
                      {event.type}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {event.date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Events; 