import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SiteLayout } from '@/components/layout/SiteLayout';
import Home from './pages/Home';
import Enter from './pages/Enter';
import About from './pages/About';
import Judges from './pages/Judges';
import Qualifying from './pages/Qualifying';
import Sponsors from './pages/Sponsors';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin sits outside the public shell: it has its own header, and
              the show's navigation is not useful while reconciling payments. */}
          <Route path="/admin" element={<Admin />} />

          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/enter" element={<Enter />} />
            <Route path="/about" element={<About />} />
            <Route path="/judges" element={<Judges />} />
            <Route path="/qualifying" element={<Qualifying />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
