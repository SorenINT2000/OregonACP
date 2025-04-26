import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { MantineProvider, AppShell } from '@mantine/core';
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
import AwardsCommittee from './pages/admin/AwardsCommittee';
import PolicyCommittee from './pages/admin/PolicyCommittee';
import ChapterMeetingCommittee from './pages/admin/ChapterMeetingCommittee';
import { Profile } from './pages/admin/Profile';
import DashboardHome from './pages/admin/DashboardHome';
import { Permissions } from './pages/admin/Permissions';
import SetPassword from './pages/admin/SetPassword';

function App() {
  return (
    <MantineProvider>
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

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/set-password" element={<SetPassword />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="awards" element={<AwardsCommittee />} />
              <Route path="policy" element={<PolicyCommittee />} />
              <Route path="chapter-meeting" element={<ChapterMeetingCommittee />} />
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
