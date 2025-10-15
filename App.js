const ThemeContext = React.createContext();

/* ThemeProvider: sets class on wrapper .app-root so CSS covers whole page */
function ThemeProvider(props) {
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = function() { setTheme(theme === 'light' ? 'dark' : 'light'); };
  return React.createElement(
    ThemeContext.Provider,
    { value: { theme: theme, toggleTheme: toggleTheme } },
    React.createElement('div', { className: 'app-root' + (theme === 'dark' ? ' dark-theme' : '') }, props.children)
  );
}

/* ErrorBoundary */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(err) { return { hasError: true }; }
  componentDidCatch(err, info) { console.error('ErrorBoundary caught', err, info); }
  render() {
    if (this.state.hasError) return React.createElement('h2', { className: 'text-center mt-5' }, 'Something went wrong!');
    return this.props.children;
  }
}

/* Header */
function Header(props) {
  const ctx = React.useContext(ThemeContext);
  return React.createElement('header', { className: 'header' },
    React.createElement('div', { className: 'brand' }, "Alina's SPA"),
    React.createElement('div', { className: 'nav-buttons' },
      React.createElement('button', { onClick: function(){ props.setPage('home'); } }, 'Home'),
      React.createElement('button', { onClick: function(){ props.setPage('contacts'); } }, 'Contacts'),
      React.createElement('button', { onClick: function(){ props.setPage('about'); } }, 'About Me')
    ),
    React.createElement('button', { className: 'theme-toggle', onClick: ctx.toggleTheme }, ctx.theme === 'light' ? 'Dark Mode' : 'Light Mode')
  );
}

/* Modal - uses props.task (object) */
function Modal(props) {
  const initial = (props.task && props.task.description) ? props.task.description : '';
  const [description, setDescription] = React.useState(initial);

  React.useEffect(function(){
    setDescription((props.task && props.task.description) ? props.task.description : '');
  }, [props.task]);

  if (!props.show) return null;

  return React.createElement('div', { className: 'modal-backdrop' },
    React.createElement('div', { className: 'modal-box' },
      React.createElement('h4', null, 'Edit Task'),
      React.createElement('input', {
        className: 'form-control',
        placeholder: 'Description...',
        value: description,
        onChange: function(e){ setDescription(e.target.value); }
      }),
      React.createElement('div', { className: 'modal-actions' },
        React.createElement('button', { className: 'btn btn-secondary', onClick: props.onClose }, 'Cancel'),
        React.createElement('button', { className: 'btn btn-primary', onClick: function(){ props.onSave(description); } }, 'Save')
      )
    )
  );
}

/* Home (TODO) */
function Home() {
  const [tasks, setTasks] = React.useState(function(){
    try {
      var stored = localStorage.getItem('tasks');
      return stored ? JSON.parse(stored) : [];
    } catch(e) { return []; }
  });
  const [newTask, setNewTask] = React.useState('');
  const [modalTask, setModalTask] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(function(){
    try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch(e){}
  }, [tasks]);

  var addTask = function(){
    if (!newTask || !newTask.trim()) return;
    setTasks(tasks.concat([{ id: Date.now(), title: newTask.trim(), description: '', done: false }]));
    setNewTask('');
  };

  var toggleDone = function(id){
    setTasks(tasks.map(function(t){
      return t.id === id ? Object.assign({}, t, { done: !t.done }) : t;
    }));
  };

  var openModal = function(task){
    setModalTask(task);
    setShowModal(true);
  };

  var saveModal = function(desc){
    setTasks(tasks.map(function(t){
      return t.id === modalTask.id ? Object.assign({}, t, { description: desc }) : t;
    }));
    setShowModal(false);
  };

  var deleteTask = function(id){
    setTasks(tasks.filter(function(t){ return t.id !== id; }));
  };

  return React.createElement('div', { className: 'page' },
    React.createElement('div', { className: 'hero' },
      React.createElement('div', { className: 'h1' },
        React.createElement('span', null, 'My Todo List'),
        React.createElement('span', { className: 'emoji' }, '📝')
      ),
      React.createElement('div', { className: 'input-row' },
        React.createElement('input', {
          className: 'form-control',
          placeholder: 'Enter a task...',
          value: newTask,
          onChange: function(e){ setNewTask(e.target.value); },
          onKeyDown: function(e){ if (e.key === 'Enter') addTask(); }
        }),
        React.createElement('button', { className: 'add-btn', onClick: addTask }, 'Add')
      )
    ),
    React.createElement('ul', { className: 'todo-list' },
      tasks.map(function(task){
        return React.createElement('li', {
          key: task.id,
          className: 'todo-item' + (task.done ? ' done' : ''),
          onClick: function(){ openModal(task); }
        },
          React.createElement('div', { className: 'todo-left' },
            React.createElement('label', { className: 'todo-checkbox' },
              React.createElement('input', {
                type: 'checkbox',
                checked: task.done,
                onChange: function(e){ e.stopPropagation(); toggleDone(task.id); }
              })
            ),
            React.createElement('div', null,
              React.createElement('div', { className: 'todo-title' }, task.title),
              task.description ? React.createElement('div', { className: 'task-desc' }, task.description) : null
            )
          ),
          React.createElement('div', { className: 'actions' },
            React.createElement('button', {
              className: 'del-btn',
              onClick: function(e){ e.stopPropagation(); deleteTask(task.id); }
            }, 'Delete')
          )
        );
      })
    ),
    React.createElement(Modal, { show: showModal, task: modalTask, onClose: function(){ setShowModal(false); }, onSave: saveModal })
  );
}

/* Contacts */
function Contacts() {
  return React.createElement('div', { className: 'page' },
    React.createElement('div', { className: 'hero' },
      React.createElement('h2', null, 'Contacts'),
      React.createElement('p', null, 'You can reach me via email: alina@example.com'),
      React.createElement('p', null, 'Or call: +123456789'),
      React.createElement('div', { className: 'about-stickers' },
        React.createElement('span', { className: 's1' }, '🐱'),
        React.createElement('span', { className: 's2' }, '🐶'),
        React.createElement('span', { className: 's3' }, '🌸'),
        React.createElement('span', { className: 's4' }, '🎵'),
        React.createElement('span', { className: 's5' }, '✈️'),
        React.createElement('span', { className: 's6' }, '🍰')
      )
    )
  );
}

/* About */
function About() {
  return React.createElement('div', { className: 'page' },
    React.createElement('div', { className: 'hero' },
      React.createElement('h2', null, 'About Me'),
      React.createElement('p', null, "Hi! I'm Alina, a Project Manager. I love dancing, eating delicious food, traveling, and meeting new people!"),
      React.createElement('p', { className: 'about-stickers' },
        React.createElement('span', { className: 's1' }, '🐱'),
        React.createElement('span', { className: 's2' }, '🐶'),
        React.createElement('span', { className: 's3' }, '🌸'),
        React.createElement('span', { className: 's4' }, '🎵'),
        React.createElement('span', { className: 's5' }, '✈️'),
        React.createElement('span', { className: 's6' }, '🍰')
      ),
      React.createElement('img', { src: 'Image1/cat.jpg', alt: 'Cat' })
    )
  );
}

/* Main App */
function App() {
  const [page, setPage] = React.useState('home');
  return React.createElement(ErrorBoundary, null,
    React.createElement(Header, { setPage: setPage }),
    page === 'home' ? React.createElement(Home, null) : null,
    page === 'contacts' ? React.createElement(Contacts, null) : null,
    page === 'about' ? React.createElement(About, null) : null
  );
}

/* Render */
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ThemeProvider, null, React.createElement(App, null)));
