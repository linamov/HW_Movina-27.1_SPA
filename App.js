const { useState, useContext, createContext } = React;
const { BrowserRouter, Routes, Route, Link } = ReactRouterDOM;

// ======= Theme Context =======
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

// ======= Header =======
function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <header className="d-flex justify-content-between align-items-center">
      <nav>
        <Link to="/">Головна</Link>
        <Link to="/contacts">Контакти</Link>
        <Link to="/about">Про мене</Link>
      </nav>
      <button className="toggle-theme" onClick={toggleTheme}>
        {theme === 'dark' ? 'Світла тема' : 'Темна тема'}
      </button>
    </header>
  );
}

// ======= Error Boundary =======
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
    if (this.state.hasError) return <h2>Щось пішло не так!</h2>;
    return this.props.children;
  }
}

// ======= Home (TODO) =======
function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if(input.trim() !== '') setTodos([...todos, input]);
    setInput('');
  };

  return (
    <div className="container">
      <h2>Список TODO</h2>
      <div className="mb-3">
        <input 
          className="todo-input" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Введіть задачу"
        />
        <button className="btn btn-primary" onClick={addTodo}>Додати</button>
      </div>
      <ul className="todo-list">
        {todos.map((t,i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}

// ======= Contacts =======
function Contacts() {
  return (
    <div className="container">
      <h2>Контакти</h2>
      <p>Моя електронна пошта: example@email.com</p>
      <p>Телефон: +380 00 000 00 00</p>
    </div>
  );
}

// ======= About =======
function About() {
  return (
    <div className="container">
      <h2>Про мене</h2>
      <p>Тут можеш написати довільний текст про себе.</p>
      <img 
        src="./images/Image1.jpg" 
        alt="Моя картинка" 
        style={{ maxWidth: '300px', borderRadius: '10px', marginTop: '1rem' }}
      />
    </div>
  );
}

// ======= App =======
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<h2 className="container">Сторінка не знайдена</h2>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// ======= Render =======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
