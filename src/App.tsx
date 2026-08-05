import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SiteLayout } from '@/components/layout/SiteLayout';
import Home from './pages/Home';
import Enter from './pages/Enter';
import About from './pages/About';
import Qualifying from './pages/Qualifying';
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
            <Route path="/qualifying" element={<Qualifying />} />
            {/* Judges and Sponsors are hidden for now, not deleted. The pages
                and their data are still in the repo; restore by re-adding the
                imports and these two routes, plus their nav entries in
                SiteHeader and SiteFooter.
                <Route path="/judges" element={<Judges />} />
                <Route path="/sponsors" element={<Sponsors />} /> */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
