import React, { useState, useEffect } from 'react';
import { Container, Paper, PasswordInput, Button, Title, Text, Stack } from '@mantine/core';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const verifyEmailLink = async () => {
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          // Get email from localStorage or prompt user
          let email = localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
            if (email) {
              localStorage.setItem('emailForSignIn', email);
            }
          }

          if (!email) {
            throw new Error('Email is required to complete sign in');
          }

          setEmail(email);
          setLoading(false);
        } else {
          setError('Invalid sign-in link');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error verifying email link:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setLoading(false);
      }
    };

    verifyEmailLink();
  }, [auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);

      if (!email) {
        throw new Error('Email is required');
      }

      // Complete the sign in process
      await signInWithEmailLink(auth, email, window.location.href);

      // Update the user's password
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, password);
      }

      // Clear the email from localStorage
      localStorage.removeItem('emailForSignIn');

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error setting password:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="xs" mt="xl">
        <Paper p="xl" radius="md" withBorder>
          <Text>Verifying sign-in link...</Text>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xs" mt="xl">
        <Paper p="xl" radius="md" withBorder>
          <Text color="red">{error}</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xs" mt="xl">
      <Paper p="xl" radius="md" withBorder>
        <Title order={2} ta="center" mb="lg">
          Set Your Password
        </Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={loading}>
              Set Password
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 