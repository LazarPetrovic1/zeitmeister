import { HashRouter as Router , Routes as Switch, Route } from 'react-router-dom';
import { CommandPalette, Nav } from './components';
import { About, Calendar, PatchNotes, UIMatrix, Welcome } from './pages';
import { CALC_HEIGHT_MINUS } from './utils';
import useEvents from './hooks/useEvents';
import { useEffect, useState } from 'react';
import useEventListener from './hooks/useEventListener';
const { ipcRenderer } = window.require('electron');
function App() {
  const { lsEvents } = useEvents();
  const [isPalette, setIsPalette] = useState(() => false)
  useEffect(() => {
    ipcRenderer.send('initializing', lsEvents)
    ipcRenderer.on('app-before-quit', (e) => {
      ipcRenderer.send('quitting', lsEvents)
    })
    // eslint-disable-next-line
  }, [])
  useEventListener("keydown", (event) => ((event.key === 'p' || event.key === "P") && event.ctrlKey && event.shiftKey) ? setIsPalette(() => true) : null)
  return (
    <Router>
      <Nav />
      <div className="container-fluid" style={{ height: `calc(100vh - ${CALC_HEIGHT_MINUS}px)` }}>
        <Switch>
          <Route path='/' element={<Welcome />} />
          <Route path='/about' element={<About />} />
          <Route path='/patch-notes' element={<PatchNotes />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/urgency' element={<UIMatrix />} />
        </Switch>
        <CommandPalette
          description="Command Palette"
          onClose={() => setIsPalette(() => false)}
          show={isPalette}
        />
      </div>
    </Router>
  );
}

export default App;
