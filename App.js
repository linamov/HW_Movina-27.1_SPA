const { useState, useContext, createContext } = React;

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

// ===== Home (TODO) =====
function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if(input.trim() !== '') setTodos([...todos, input]);
    setInput('');
  };

  return (
    <div className="container">
      <h2>My Todo List <span className="sticker">📝</span></h2>
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
        {todos.map((t,i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}

// ===== Contacts =====
function Contacts() {
  return (
    <div className="container">
      <h2>Contacts <span className="sticker">📞</span></h2>
      <p>Email: alina@example.com</p>
      <p>Phone: +380 00 000 00 00</p>
      <p>Feel free to reach out! <span className="sticker">💌</span></p>
    </div>
  );
}

// ===== About =====
function About() {
  return (
    <div className="container">
      <h2>About Me <span className="sticker">🌟</span></h2>
      <p>Hi! My name is Alina, I am a Project Manager. 🏆 I love dancing, delicious food, traveling, and meeting new people. <span className="sticker">💃🍣✈️</span></p>
      <p>Here are some of my favorite things: <span className="sticker">🐶🐱🎉</span></p>
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
