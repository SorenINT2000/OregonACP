import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text } from '@mantine/core';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">ACP Admin Login</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your credentials to access the admin dashboard
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Text c="red" size="sm" mt="sm">{error}</Text>}
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}; 