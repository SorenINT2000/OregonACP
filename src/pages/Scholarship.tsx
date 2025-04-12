import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  TextInput, 
  Textarea, 
  NumberInput, 
  Checkbox, 
  Button, 
  Paper, 
  Stack, 
  Group,
  Select,
  Divider
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  trainingProgram: string;
  trainingYear: string;
  programDirectorName: string;
  programDirectorEmail: string;
  hasTimeOff: boolean;
  activity: string;
  levelOfParticipation: string;
  fundsRequested: number;
  careerAspirations: string;
}

const Scholarship = () => {
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      trainingProgram: '',
      trainingYear: '',
      programDirectorName: '',
      programDirectorEmail: '',
      hasTimeOff: false,
      activity: '',
      levelOfParticipation: '',
      fundsRequested: 0,
      careerAspirations: '',
    },
    validate: {
      name: (value: string) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value: string) => (value.length < 10 ? 'Phone number must be at least 10 digits' : null),
      address: (value: string) => (value.length < 5 ? 'Address must be at least 5 characters' : null),
      trainingProgram: (value: string) => (value.length < 2 ? 'Training program is required' : null),
      trainingYear: (value: string) => (value.length < 4 ? 'Training year is required' : null),
      programDirectorName: (value: string) => (value.length < 2 ? 'Program director name is required' : null),
      programDirectorEmail: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      activity: (value: string) => (value.length < 2 ? 'Activity is required' : null),
      levelOfParticipation: (value: string) => (value.length < 2 ? 'Level of participation is required' : null),
      fundsRequested: (value: number) => (value <= 0 ? 'Funds requested must be greater than 0' : null),
      careerAspirations: (value: string) => {
        const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
        if (wordCount < 20) return 'Please provide more details about your career aspirations';
        if (wordCount > 500) return 'Career aspirations must not exceed 500 words';
        return null;
      },
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Here you would typically send the form data to your backend
    console.log(values);
    // You could add a success message or redirect here
  };

  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center" mb="xl">ACP Oregon Walter J. McDonald Travel Scholarship Application</Title>
      <Text ta="center" mb="xl">
        This scholarship, in honor of beloved Oregon physician and ACP Master Dr. Walt McDonald, supports travel to national ACP events for trainees
        with demonstrated scholarship and commitment to careers in internal medicine. We at Oregon ACP believe this honors Dr. McDonald's passion for
        early-career learners as well as his long-term service to the College. 
      </Text>
      
      <Paper shadow="sm" p="md" withBorder mb="xl">
        <Title order={3} mb="md">Eligibility and Requirements</Title>
        <Text mb="md">
          Applicants must be ACP members currently enrolled in an internal medicine program or IM-subspecialty fellowship at a health-system headquartered in Oregon.
          Applicants must attest that they have requested and been granted time off to participate in the activity.
        </Text>
        
        <Title order={3} mb="md">Eligible Activities</Title>
        <Text mb="md">
          Recipients must use funds for travel only (standard coach airline ticket, train, ground transportation, or car mileage reimbursement) to one of the following activities:
        </Text>
        <ul>
          <li>ACP National Meeting for poster presentation</li>
          <li>ACP National Meeting for Doctor's Dilemma participation</li>
          <li>ACP Leadership Day on Capitol Hill (subject to fund availability and limited to 1-2 attendees per year maximum)</li>
        </ul>
        <Text mb="md">
          Priority will be given to ACP National meeting applicants.
        </Text>
        
        <Title order={3} mb="md">Funding Limitations</Title>
        <Text mb="md">
          Funds may not be used for airport parking, luxury ride-share services, extra baggage fees (above 1 checked bag), meals nor alcoholic beverages.
        </Text>
        
        <Title order={3} mb="md">Application Process</Title>
        <Text mb="md">
          Trainees must apply for the scholarship fund prior to the event for which they are requesting funds. Efforts will be made to respond to fund requests within six weeks of application.
          Trainees are encouraged to explore matching funding from their residency program leadership.
        </Text>
        
        <Title order={3} mb="md">Fund Distribution</Title>
        <Text mb="md">
          Funds will be distributed as reimbursements for all expenses (full or partial) approved at the time of the fund award, and fund distribution will require itemized receipts which include proof of method of payment. 
          Fund awards will range from $250 - $1000 subject to fund availability.
        </Text>
        
        <Text mb="md">
          The Oregon ACP Finance Committee will serve as the fund's approval committee.
        </Text>
      </Paper>
      
      <Paper shadow="sm" p="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Title order={3}>Personal Information</Title>
            <TextInput
              label="Full Name"
              placeholder="Your full name"
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Email"
              placeholder="your.email@example.com"
              required
              {...form.getInputProps('email')}
            />
            <TextInput
              label="Phone Number"
              placeholder="(123) 456-7890"
              required
              {...form.getInputProps('phone')}
            />
            <Textarea
              label="Address"
              placeholder="Your full address"
              required
              {...form.getInputProps('address')}
            />
            
            <Divider my="md" />
            
            <Title order={3}>Training Information</Title>
            <TextInput
              label="Training Program"
              placeholder="Your training program"
              required
              {...form.getInputProps('trainingProgram')}
            />
            <TextInput
              label="Training Year"
              placeholder="e.g., 2023"
              required
              {...form.getInputProps('trainingYear')}
            />
            
            <Divider my="md" />
            
            <Title order={3}>Program Director Information</Title>
            <TextInput
              label="Program Director's Name"
              placeholder="Program director's full name"
              required
              {...form.getInputProps('programDirectorName')}
            />
            <TextInput
              label="Program Director's Email"
              placeholder="director.email@example.com"
              required
              {...form.getInputProps('programDirectorEmail')}
            />
            <Checkbox
              label="Program director has approved time off"
              {...form.getInputProps('hasTimeOff', { type: 'checkbox' })}
            />
            
            <Divider my="md" />
            
            <Title order={3}>Scholarship Details</Title>
            <TextInput
              label="Activity"
              placeholder="Activity or event you're applying for"
              required
              {...form.getInputProps('activity')}
            />
            <Select
              label="Level of Participation"
              placeholder="Select level of participation"
              data={[
                { value: 'presenter', label: 'Presenter' },
                { value: 'attendee', label: 'Attendee' },
                { value: 'other', label: 'Other' },
              ]}
              required
              {...form.getInputProps('levelOfParticipation')}
            />
            <NumberInput
              label="Funds Requested ($)"
              placeholder="Amount in U.S. dollars"
              min={0}
              required
              prefix="$"
              decimalScale={2}
              fixedDecimalScale
              {...form.getInputProps('fundsRequested')}
            />
            <Textarea
              label="Career Aspirations"
              placeholder="Describe how this travel will support your future career aspirations"
              minRows={4}
              required
              description={`${form.values.careerAspirations.trim().split(/\s+/).filter(word => word.length > 0).length}/500 words`}
              {...form.getInputProps('careerAspirations')}
            />
            
            <Group justify="center" mt="xl">
              <Button type="submit" size="lg">Submit Application</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default Scholarship;
