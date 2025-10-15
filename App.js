const { useState, useEffect, useContext, createContext } = React;

// ===== Theme Context =====
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

// ===== Header =====
function Header({ setPage }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <header>
      <nav>
        <button className="btn btn-link" onClick={() => setPage('home')}>Home</button>
        <button className="btn btn-link" onClick={() => setPage('contacts')}>Contacts</button>
        <button className="btn btn-link" onClick={() => setPage('about')}>About Me</button>
      </nav>
      <button className="btn btn-secondary" onClick={toggleTheme}>
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
    </header>
  );
}

// ===== Error Boundary =====
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

// ===== Modal =====
function Modal({ show, task, onClose, onSave }) {
  const [description, setDescription] = useState(task?.description || '');
  useEffect(() => setDescription(task?.description || ''), [task]);

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

// ===== Home (TODO) =====
function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(stored);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() !== '') {
      setTodos([...todos, { title: input, done: false, description: '' }]);
      setInput('');
    }
  };

  const toggleDone = (index) => {
    const newTodos = [...todos];
    newTodos[index].done = !newTodos[index].done;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const openModal = (index) => {
    setSelectedTask({ ...todos[index], index });
    setShowModal(true);
  };

  const saveModal = (description) => {
    const newTodos = [...todos];
    newTodos[selectedTask.index].description = description;
    setTodos(newTodos);
    setShowModal(false);
  };

  return (
    <div className="container">
      <h2>My Todo List 📝</h2>
      <div className="mb-3 d-flex gap-2">
        <input 
          className="form-control" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Enter a task..."
        />
        <button className="btn btn-primary" onClick={addTodo}>Add</button>
      </div>
      <ul className="list-group todo-list">
        {todos.map((t, i) => (
          <li key={i} className={`list-group-item d-flex justify-content-between align-items-center ${t.done ? 'done' : ''}`}>
            <div>
              <input type="checkbox" checked={t.done} onChange={() => toggleDone(i)} />
              <span onClick={() => openModal(i)} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                {t.title}
              </span>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(i)}>Delete</button>
          </li>
        ))}
      </ul>

      <Modal 
        show={showModal} 
        task={selectedTask} 
        onClose={() => setShowModal(false)} 
        onSave={saveModal} 
      />
    </div>
  );
}

// ===== Contacts =====
function Contacts() {
  return (
    <div className="container">
      <h2>Contacts 📞</h2>
      <p>Email: alina@example.com</p>
      <p>Phone: +380 00 000 00 00</p>
      <p>Feel free to reach out! 💌</p>
    </div>
  );
}

// ===== About =====
function About() {
  return (
    <div className="container">
      <h2>About Me 🌟</h2>
      <p>Hi! My name is Alina, I am a Project Manager. 🏆 I love dancing, delicious food, traveling, and meeting new people. 💃🍣✈️</p>
      <p>Here are some of my favorite things: 🐶🐱🎉</p>
      <img src="./images/Cat.jpg" alt="Cute cat" />
    </div>
  );
}

// ===== App =====
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

// ===== Render =====
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
