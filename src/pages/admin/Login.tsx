import React, { useState } from 'react';
import { Container, Paper, TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Alert } from '@mantine/core';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { IconCheck, IconX } from '@tabler/icons-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [resetError, setResetError] = useState('');
    const [sendingReset, setSendingReset] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('');
            await signIn(email, password);
            navigate('/admin');
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setResetError('Please enter your email address first');
            return;
        }

        try {
            setSendingReset(true);
            setResetError('');

            // Configure the action code settings for password reset
            const actionCodeSettings = {
                url: `${window.location.origin}/admin/set-password`,
                handleCodeInApp: false,
            };

            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setResetEmailSent(true);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setResetError('Failed to send password reset email. Please check your email address.');
        } finally {
            setSendingReset(false);
        }
    };

    return (
        <Container size="xs" mt="xl">
            <Paper radius="md" p="xl" withBorder>
                <Title order={2} ta="center" mt="md" mb={50}>
                    Admin Login
                </Title>

                {resetEmailSent ? (
                    <Alert icon={<IconCheck size={16} />} title="Password Reset Email Sent" color="green">
                        <Text size="sm" mb="md">
                            We've sent a password reset link to <strong>{email}</strong>.
                            Please check your email and follow the instructions to reset your password.
                        </Text>
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                setResetEmailSent(false);
                                setEmail('');
                                setPassword('');
                            }}
                        >
                            Back to Login
                        </Button>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Stack>
                            <TextInput
                                required
                                label="Email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <PasswordInput
                                required
                                label="Password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && (
                                <Alert icon={<IconX size={16} />} color="red">
                                    {error}
                                </Alert>
                            )}

                            {resetError && (
                                <Alert icon={<IconX size={16} />} color="red">
                                    {resetError}
                                </Alert>
                            )}

                            <Button type="submit" fullWidth mt="xl">
                                Sign In
                            </Button>

                            <Text ta="center" size="sm" mt="md">
                                <Anchor
                                    component="button"
                                    type="button"
                                    onClick={handleForgotPassword}
                                    style={{ opacity: sendingReset ? 0.6 : 1 }}
                                    disabled={sendingReset}
                                >
                                    {sendingReset ? 'Sending reset email...' : 'Forgot your password?'}
                                </Anchor>
                            </Text>
                        </Stack>
                    </form>
                )}
            </Paper>
        </Container>
    );
}; 