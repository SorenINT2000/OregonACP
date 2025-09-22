import React, { useState, useEffect } from 'react';
import { Container, Paper, PasswordInput, Button, Title, Text, Stack, Alert } from '@mantine/core';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function SetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [systemError, setSystemError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const verifyResetCode = async () => {
            try {
                const mode = searchParams.get('mode');
                const oobCode = searchParams.get('oobCode');

                // Check if we have the required parameters
                if (!mode || !oobCode) {
                    setSystemError('Invalid password reset link. Missing required parameters.');
                    setLoading(false);
                    return;
                }

                // Check if this is a password reset action
                if (mode !== 'resetPassword') {
                    setSystemError('Invalid action mode. Expected password reset.');
                    setLoading(false);
                    return;
                }

                // Verify the password reset code and get the email
                const email = await verifyPasswordResetCode(auth, oobCode);
                setEmail(email);
                setLoading(false);
            } catch (error) {
                console.error('Error verifying password reset code:', error);
                setSystemError(error instanceof Error ? error.message : 'Invalid or expired password reset link');
                setLoading(false);
            }
        };

        verifyResetCode();
    }, [auth, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Client-side validation - these should not hide the form
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            setSubmitting(true);

            const oobCode = searchParams.get('oobCode');
            if (!oobCode) {
                throw new Error('Reset code is missing');
            }

            // Confirm the password reset with the new password
            await confirmPasswordReset(auth, oobCode, password);

            setSuccess(true);

            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/admin/login');
            }, 2000);
        } catch (error) {
            console.error('Error setting password:', error);
            setError(error instanceof Error ? error.message : 'An error occurred while setting password');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container size="xs" mt="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Text ta="center">Verifying password reset link...</Text>
                </Paper>
            </Container>
        );
    }

    if (systemError) {
        return (
            <Container size="xs" mt="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Alert icon={<IconX size={16} />} title="Error" color="red">
                        {systemError}
                    </Alert>
                    <Button
                        fullWidth
                        mt="md"
                        variant="outline"
                        onClick={() => navigate('/admin/login')}
                    >
                        Go to Login
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (success) {
        return (
            <Container size="xs" mt="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Alert icon={<IconCheck size={16} />} title="Success!" color="green">
                        Your password has been successfully reset. You will be redirected to the login page shortly.
                    </Alert>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xs" mt="xl">
            <Paper p="xl" radius="md" withBorder>
                <Title order={2} ta="center" mb="lg">
                    Set Your New Password
                </Title>

                {email && (
                    <Text size="sm" c="dimmed" ta="center" mb="lg">
                        Setting password for: {email}
                    </Text>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack>
                        <PasswordInput
                            label="New Password"
                            placeholder="Enter your new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={submitting}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={submitting}
                        />

                        {error && (
                            <Alert icon={<IconX size={16} />} color="red">
                                {error}
                            </Alert>
                        )}

                        <Button type="submit" loading={submitting} disabled={submitting}>
                            {submitting ? 'Setting Password...' : 'Set Password'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
} 