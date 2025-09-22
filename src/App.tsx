import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { MantineProvider, AppShell, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import AnnualMeeting from './pages/AnnualMeeting';
import Donate from './pages/Donate';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Scholarship from './pages/Scholarship';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/admin/Login';
import { DashboardLayout } from './pages/admin/DashboardLayout';
import { Profile } from './pages/admin/Profile';
import DashboardHome from './pages/admin/DashboardHome';
import { Permissions } from './pages/admin/Permissions';
import SetPassword from './pages/admin/SetPassword';
import { CommitteeDashboard } from './pages/admin/CommitteeDashboard';

// Custom theme
const theme = createTheme({
    cursorType: 'pointer',
    components: {
        Switch: {
            styles: {
                root: {
                    cursor: 'pointer',
                },
            },
        },
    },
});

function App() {
    return (
        <MantineProvider theme={theme}>
            <Notifications />
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <Home />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/about" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <About />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/events" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <Events />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/annual-meeting" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <AnnualMeeting />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/donate" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <Donate />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/privacy-policy" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <PrivacyPolicy />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/resources" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <Resources />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/scholarship" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <Scholarship />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/contact" element={
                            <AppShell
                                header={{ height: 60 }}
                                padding="md"
                            >
                                <AppShell.Header>
                                    <Navbar />
                                </AppShell.Header>
                                <AppShell.Main>
                                    <Contact />
                                    <Footer />
                                </AppShell.Main>
                            </AppShell>
                        } />
                        <Route path="/admin/login" element={<Login />} />
                        <Route path="/admin/set-password" element={<SetPassword />} />

                        {/* Admin routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Outlet />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }>
                            <Route index element={<DashboardHome />} />
                            <Route path="awards" element={<CommitteeDashboard organization="awards" />} />
                            <Route path="policy" element={<CommitteeDashboard organization="policy" />} />
                            <Route path="chapter-meeting" element={<CommitteeDashboard organization="chapterMeeting" />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="permissions" element={<Permissions />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </MantineProvider>
    );
}

export default App;
