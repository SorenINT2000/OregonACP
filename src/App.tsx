import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider, AppShell } from '@mantine/core';
import '@mantine/core/styles.css';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import AnnualMeeting from './pages/AnnualMeeting';
import Donate from './pages/Donate';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer/Footer';

function App() {
  return (
    <MantineProvider>
      <Router>
        <AppShell
          header={{ height: 60 }}
          padding="md"
        >
          <AppShell.Header>
            <Navbar />
          </AppShell.Header>

          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/annual-meeting" element={<AnnualMeeting />} />
              <Route path="/donate" element={<Donate />} />
            </Routes>
            <Footer />
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  );
}

export default App;
