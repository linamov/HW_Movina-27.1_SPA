/* App.js (use with <script type="text/babel">) */
/* Make sure Image1/cat.jpg exists relative to index.html */

const ThemeContext = React.createContext();

/* ThemeProvider: wraps app and toggles .app-root.dark-theme */
function ThemeProvider(props) {
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = function() { setTheme(theme === 'light' ? 'dark' : 'light'); };
  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      <div className={'app-root' + (theme === 'dark' ? ' dark-theme' : '')}>
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
}

/* ErrorBoundary (class component) */
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(err){ return { hasError: true }; }
  componentDidCatch(err, info){ console.error('ErrorBoundary:', err, info); }
  render(){ if (this.state.hasError) return <h2 className="text-center mt-5">Something went wrong!</h2>; return this.props.children; }
}

/* Header */
function Header(props){
  const ctx = React.useContext(ThemeContext);
  return (
    <div className="header">
      <div className="brand">Alina's SPA</div>
      <div className="nav">
        <button onClick={function(){props.setPage('home');}}>Home</button>
        <button onClick={function(){props.setPage('contacts');}}>Contacts</button>
        <button onClick={function(){props.setPage('about');}}>About Me</button>
      </div>
      <div>
        <button className="theme-toggle" onClick={ctx.toggleTheme}>
          {ctx.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </div>
  );
}

/* Modal */
function Modal(props){
  var initial = (props.task && props.task.description) ? props.task.description : '';
  var [description, setDescription] = React.useState(initial);

  React.useEffect(function(){
    setDescription((props.task && props.task.description) ? props.task.description : '');
  }, [props.task]);

  if (!props.show) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h4>Edit Task</h4>
        <input className="form-control" placeholder="Description..." value={description} onChange={function(e){ setDescription(e.target.value); }} />
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
          <button className="btn btn-secondary" onClick={props.onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={function(){ props.onSave(description); }}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* Home (TODO) */
function Home(){
  var [tasks, setTasks] = React.useState(function(){
    try { var s = localStorage.getItem('tasks'); return s ? JSON.parse(s) : []; } catch(e){ return []; }
  });
  var [newTask, setNewTask] = React.useState('');
  var [modalTask, setModalTask] = React.useState(null);
  var [showModal, setShowModal] = React.useState(false);

  React.useEffect(function(){
    try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch(e){}
  }, [tasks]);

  var addTask = function(){
    if (!newTask || !newTask.trim()) return;
    setTasks(tasks.concat([{ id: Date.now(), title: newTask.trim(), description: '', done: false }]));
    setNewTask('');
  };

  var toggleDone = function(id){
    setTasks(tasks.map(function(t){ return t.id === id ? Object.assign({}, t, { done: !t.done }) : t; }));
  };

  var openModal = function(task){
    setModalTask(task);
    setShowModal(true);
  };

  var saveModal = function(desc){
    setTasks(tasks.map(function(t){ return t.id === modalTask.id ? Object.assign({}, t, { description: desc }) : t; }));
    setShowModal(false);
  };

  var deleteTask = function(id){
    setTasks(tasks.filter(function(t){ return t.id !== id; }));
  };

  return (
    <div className="container-page">
      <div className="hero">
        <div className="title-row">
          <h1>My Todo List</h1>
          <span className="emoji">📝</span>
        </div>

        <div className="input-row">
          <input className="form-control" placeholder="Enter a task..." value={newTask} onChange={function(e){ setNewTask(e.target.value); }} onKeyDown={function(e){ if (e.key === 'Enter') addTask(); }} />
          <button className="add-btn" onClick={addTask}>Add</button>
        </div>
      </div>

      <ul className="todo-list" style={{marginTop:18}}>
        {tasks.map(function(task){
          return (
            <li key={task.id} className={'todo-item' + (task.done ? ' done' : '')} onClick={function(){ openModal(task); }}>
              <div className="todo-left">
                <label className="todo-checkbox">
                  <input type="checkbox" checked={task.done} onChange={function(e){ e.stopPropagation(); toggleDone(task.id); }} />
                </label>
                <div>
                  <div className="todo-title">{task.title}</div>
                  {task.description ? React.createElement('div', { className: 'todo-desc' }, task.description) : null}
                </div>
              </div>

              <div className="actions">
                <button className="del-btn" onClick={function(e){ e.stopPropagation(); deleteTask(task.id); }}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>

      <Modal show={showModal} task={modalTask} onClose={function(){ setShowModal(false);} } onSave={saveModal} />
    </div>
  );
}

/* Contacts */
function Contacts() {
  return (
    <div className="container">
      <h2>Contacts <span className="sticker">📞</span></h2>
      <h2>Contacts 📞</h2>
      <p>Email: alina@example.com</p>
      <p>Phone: +380 00 000 00 00</p>
      <p>Feel free to reach out! <span className="sticker">💌</span></p>
      <p>Feel free to reach out! 💌</p>
    </div>
  );
}

/* About */
function About(){
  return (
    <div className="container-page">
      <div className="hero">
          <h2>About Me 🌟</h2>
      <p>Hi! My name is Alina, I am a Project Manager. 🏆 I love dancing, delicious food, traveling, and meeting new people. 💃🍣✈️</p>
      <p>Here are some of my favorite things: 🐶🐱🎉</p>
        </div>
        <img src="Image1/cat.jpg" alt="Cat" style={{maxWidth:240, marginTop:14, borderRadius:8}} />
      </div>
    </div>
  );
}

/* App */
function App(){
  var [page, setPage] = React.useState('home');
  return (
    <ErrorBoundary>
      <Header setPage={setPage} />
      {page === 'home' ? React.createElement(Home) : null}
      {page === 'contacts' ? React.createElement(Contacts) : null}
      {page === 'about' ? React.createElement(About) : null}
    </ErrorBoundary>
  );
}

/* render */
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ThemeProvider, null, React.createElement(App, null)));
