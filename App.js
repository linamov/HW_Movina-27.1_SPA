const { useState, useEffect, createContext, useContext } = React;

/* ===== Theme Context ===== */
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark-theme' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
}

/* ===== Error Boundary ===== */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) return <h2 className="text-center mt-5">Something went wrong!</h2>;
    return this.props.children;
  }
}

/* ===== Header ===== */
function Header({ setPage }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <header>
      <h3>Alina's SPA</h3>
      <nav>
        <button className="btn btn-link" onClick={() => setPage('home')}>Home</button>
        <button className="btn btn-link" onClick={() => setPage('contacts')}>Contacts</button>
        <button className="btn btn-link" onClick={() => setPage('about')}>About Me</button>
      </nav>
      <button className="btn btn-secondary" onClick={toggleTheme}>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </header>
  );
}

/* ===== Modal ===== */
function Modal({ show, task, onClose, onSave }) {
  const [description, setDescription] = useState(task && task.description ? task.description : '');
  useEffect(() => setDescription(task && task.description ? task.description : ''), [task]);

  if (!show) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h4>Edit Task</h4>
        <input 
          className="form-control mb-2" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Description..."
        />
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-primary" onClick={() => onSave(description)}>Save</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Home / TODO List ===== */
function Home() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [modalTask, setModalTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTask, description: '', done: false }]);
    setNewTask('');
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  };

  const openModal = (task) => {
    setModalTask(task);
    setShowModal(true);
  };

  const saveModal = (desc) => {
    setTasks(tasks.map(t => t.id === modalTask.id ? {...t, description: desc} : t));
    setShowModal(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="container">
      <h2>My TODO List</h2>
      <div className="d-flex mb-3">
        <input 
          className="form-control me-2" 
          placeholder="New task..." 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTask}>Add</button>
      </div>
      <ul className="todo-list">
        {tasks.map(task => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <div>
              <input type="checkbox" checked={task.done} onChange={() => toggleDone(task.id)} />
              <span onClick={() => openModal(task)} style={{cursor:'pointer', marginLeft:'8px'}}>
                {task.title}
              </span>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <Modal 
        show={showModal} 
        task={modalTask} 
        onClose={() => setShowModal(false)} 
        onSave={saveModal} 
      />
    </div>
  );
}

/* ===== Contacts ===== */
function Contacts() {
  return (
    <div className="container">
      <h2>Contacts</h2>
      <p>You can reach me via email: alina@example.com</p>
      <p>Or call: +123456789</p>
    </div>
  );
}

/* ===== About Me ===== */
function About() {
  return (
    <div className="container">
      <h2>About Me</h2>
      <p>Hi! I'm Alina, a Project Manager. I love dancing, eating delicious food, traveling, and meeting new people!</p>
      <p>Here are some fun stickers: 🐱🐶🌸🎵✈️🍰</p>
      <img src="Image1/cat.jpg" alt="Cat" />
    </div>
  );
}

/* ===== Main App ===== */
function App() {
  const [page, setPage] = useState('home');
  return (
    <ErrorBoundary>
      <Header setPage={setPage} />
      {page === 'home' && <Home />}
      {page === 'contacts' && <Contacts />}
      {page === 'about' && <About />}
    </ErrorBoundary>
  );
}

/* ===== Render ===== */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
