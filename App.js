/* ===== Theme Context ===== */
const ThemeContext = React.createContext();

function ThemeProvider(props) {
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      <div className={theme === 'dark' ? 'dark-theme' : ''} style={{ minHeight: '100vh' }}>
        {props.children}
      </div>
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
function Header(props) {
  const ctx = React.useContext(ThemeContext);
  return (
    <header>
      <h3>Alina's SPA</h3>
      <nav>
        <button className="btn btn-link" onClick={() => props.setPage('home')}>Home</button>
        <button className="btn btn-link" onClick={() => props.setPage('contacts')}>Contacts</button>
        <button className="btn btn-link" onClick={() => props.setPage('about')}>About Me</button>
      </nav>
      <button className="btn btn-secondary" onClick={ctx.toggleTheme}>
        {ctx.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </header>
  );
}

/* ===== Modal ===== */
function Modal(props) {
  const [description, setDescription] = React.useState(
    props.task && props.task.description ? props.task.description : ''
  );

  React.useEffect(() => {
    setDescription(props.task && props.task.description ? props.task.description : '');
  }, [props.task]);

  if (!props.show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h4>Edit Task</h4>
        <input 
          className="form-control mb-2" 
          value={description} 
          onChange={function(e){setDescription(e.target.value)}} 
          placeholder="Description..."
        />
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-primary" onClick={function(){props.onSave(description)}}>Save</button>
          <button className="btn btn-secondary" onClick={props.onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Home ===== */
function Home() {
  const [tasks, setTasks] = React.useState(function() {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [newTask, setNewTask] = React.useState('');
  const [modalTask, setModalTask] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(function(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = function() {
    if (!newTask.trim()) return;
    setTasks(tasks.concat([{ id: Date.now(), title: newTask, description: '', done: false }]));
    setNewTask('');
  };

  const toggleDone = function(id) {
    setTasks(tasks.map(function(t){
      return t.id === id ? {...t, done: !t.done} : t;
    }));
  };

  const openModal = function(task) {
    setModalTask(task);
    setShowModal(true);
  };

  const saveModal = function(desc) {
    setTasks(tasks.map(function(t){
      return t.id === modalTask.id ? {...t, description: desc} : t;
    }));
    setShowModal(false);
  };

  const deleteTask = function(id) {
    setTasks(tasks.filter(function(t){return t.id !== id;}));
  };

  return (
    <div className="container">
      <h2>My TODO List</h2>
      <div className="d-flex mb-3">
        <input 
          className="form-control me-2" 
          placeholder="New task..." 
          value={newTask} 
          onChange={function(e){setNewTask(e.target.value)}}
        />
        <button className="btn btn-primary" onClick={addTask}>Add</button>
      </div>
      <ul className="todo-list">
        {tasks.map(function(task){
          return (
            <li key={task.id} className={task.done ? 'done' : ''} onClick={function(){openModal(task)}}>
              <div>
                <input type="checkbox" checked={task.done} onChange={function(e){e.stopPropagation(); toggleDone(task.id)}} />
                <span style={{marginLeft:'8px'}}>{task.title}</span>
              </div>
              <button className="btn btn-danger btn-sm" onClick={function(e){e.stopPropagation(); deleteTask(task.id)}}>Delete</button>
            </li>
          );
        })}
      </ul>
      <Modal 
        show={showModal} 
        task={modalTask} 
        onClose={function(){setShowModal(false)}} 
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
      <p className="about-stickers">🐱 🐶 🌸 🎵 ✈️ 🍰</p>
    </div>
  );
}

/* ===== About Me ===== */
function About() {
  return (
    <div className="container">
      <h2>About Me</h2>
      <p>Hi! I'm Alina, a Project Manager. I love dancing, eating delicious food, traveling, and meeting new people!</p>
      <p className="about-stickers">🐱🐶🌸🎵✈️🍰</p>
      <img src="Image1/cat.jpg" alt="Cat" />
    </div>
  );
}

/* ===== Main App ===== */
function App() {
  const [page, setPage] = React.useState('home');
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
