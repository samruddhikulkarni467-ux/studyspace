
import { useEffect, useState } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Revise DAA concepts", tag: "STUDY", done: false },
  { id: 2, title: "Practice Java problems", tag: "CODING", done: true },
  { id: 3, title: "Review today's notes", tag: "STUDY", done: false }
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("studyspace-v2");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });
  const [taskText, setTaskText] = useState("");
  const [tag, setTag] = useState("STUDY");
  const [filter, setFilter] = useState("ALL");
  const [goals, setGoals] = useState([
    { id: 1, text: "Complete daily study session", done: false },
    { id: 2, text: "Solve 3 coding problems", done: false },
    { id: 3, text: "Take mindful breaks", done: true }
  ]);
  const [time, setTime] = useState(1500);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem("studyspace-v2", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setTime((old) => {
        if (old <= 1) {
          clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return old - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  function addTask(e) {
    e.preventDefault();
    if (!taskText.trim()) return;

    setTasks((old) => [
      ...old,
      { id: Date.now(), title: taskText.trim(), tag, done: false }
    ]);
    setTaskText("");
    setFilter("ALL");
  }

  function toggleTask(id) {
    setTasks((old) =>
      old.map((task) => task.id === id ? { ...task, done: !task.done } : task)
    );
  }

  function deleteTask(id) {
    setTasks((old) => old.filter((task) => task.id !== id));
  }

  function toggleGoal(id) {
    setGoals((old) =>
      old.map((goal) => goal.id === id ? { ...goal, done: !goal.done } : goal)
    );
  }

  const completed = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const goalsDone = goals.filter((goal) => goal.done).length;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "PENDING") return !task.done;
    if (filter === "COMPLETED") return task.done;
    return true;
  });
  const displayTime = `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;

  function resetTimer() {
    setRunning(false);
    setTime(1500);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✳</div>
          <div>
            <h2>studyspace<span>.</span></h2>
            <p>YOUR LITTLE CORNER</p>
          </div>
        </div>

        <p className="side-heading">WORKSPACE</p>
        <div className="side-link selected"><span>⌂</span> Overview</div>
        <div className="side-link"><span>▤</span> My tasks</div>
        <div className="side-link"><span>◷</span> Focus room</div>

        <div className="sidebar-note">
          <div className="note-flower">✿</div>
          <p>You've got what it takes to make today count.</p>
          <small>A LITTLE REMINDER</small>
        </div>

        <div className="sidebar-bottom">
          <span className="online-dot" /> Your study space is ready
        </div>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div>
            <p className="date-label">YOUR PERSONAL PRODUCTIVITY SPACE</p>
            <h1>Make room for <em>great things.</em></h1>
            <p className="top-subtitle">A calmer way to plan, focus and get things done.</p>
          </div>
          <div className="user-chip">
            <div className="user-avatar">S</div>
            <div><strong>Student</strong><small>Doing my best ✨</small></div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <span className="hero-pill">✦ YOUR DAY, YOUR PACE</span>
            <h2>One thing at a time.</h2>
            <p>You don't need to do everything. Just start with something.</p>
            <a href="#tasks" className="hero-link">View my tasks <span>↗</span></a>
          </div>
          <div className="hero-decoration">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-flower">✿</div>
            <span className="spark spark-one">✧</span>
            <span className="spark spark-two">✦</span>
            <span className="spark spark-three">·</span>
          </div>
          <div className="hero-number">01 / BEGIN</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-heading"><span className="stat-icon icon-pink">✓</span><span className="stat-label">TASKS COMPLETED</span></div>
            <div className="stat-value">{String(completed).padStart(2, "0")}<span> / {String(tasks.length).padStart(2, "0")}</span></div>
            <p>Your effort is adding up.</p>
          </div>
          <div className="stat-card">
            <div className="stat-heading"><span className="stat-icon icon-purple">↗</span><span className="stat-label">DAILY PROGRESS</span></div>
            <div className="stat-value">{progress}<span>%</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="stat-card">
            <div className="stat-heading"><span className="stat-icon icon-yellow">✧</span><span className="stat-label">DAILY GOALS</span></div>
            <div className="stat-value">{goalsDone}<span> / {goals.length}</span></div>
            <p>Small wins are still wins.</p>
          </div>
        </section>

        <section className="main-grid">
          <section className="panel task-panel" id="tasks">
            <div className="panel-header">
              <div><span className="overline">YOUR PLAN</span><h2>The to-do list<span className="heading-period">.</span></h2><p>Keep the promises you make to yourself.</p></div>
              <span className="panel-count">{String(tasks.length).padStart(2, "0")} ITEMS</span>
            </div>

            <form className="add-form" onSubmit={addTask}>
              <input
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Add something to your day..."
                aria-label="New task"
              />
              <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Task category">
                <option value="STUDY">Study</option>
                <option value="CODING">Coding</option>
                <option value="PERSONAL">Personal</option>
              </select>
              <button type="submit" className="add-button">Add task <span>+</span></button>
            </form>

            <div className="filter-bar">
              {["ALL", "PENDING", "COMPLETED"].map((item) => (
                <button type="button" key={item} className={filter === item ? "filter active-filter" : "filter"} onClick={() => setFilter(item)}>
                  {item.charAt(0) + item.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="task-list">
              {visibleTasks.length === 0 ? (
                <div className="empty-state"><span>✿</span><p>Nothing here for now. Enjoy the breathing room.</p></div>
              ) : visibleTasks.map((task, index) => (
                <div className="task-row" key={task.id}>
                  <button type="button" className={task.done ? "task-check is-done" : "task-check"} onClick={() => toggleTask(task.id)} aria-label="Toggle task">
                    {task.done ? "✓" : ""}
                  </button>
                  <div className="task-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="task-details">
                    <span className={task.done ? "task-title crossed" : "task-title"}>{task.title}</span>
                    <span className={`task-tag tag-${task.tag.toLowerCase()}`}>{task.tag}</span>
                  </div>
                  <button type="button" className="delete-task" onClick={() => deleteTask(task.id)} aria-label="Delete task">×</button>
                </div>
              ))}
            </div>
            <div className="task-footer"><span>✦</span> Progress over perfection, always.</div>
          </section>

          <div className="right-stack">
            <section className="panel focus-panel">
              <div className="panel-header">
                <div><span className="overline">DEEP WORK</span><h2>Focus session<span className="heading-period">.</span></h2></div>
                <span className="focus-symbol">◷</span>
              </div>
              <div className="timer">
                <svg viewBox="0 0 180 180" className="timer-svg" aria-hidden="true">
                  <circle cx="90" cy="90" r="77" className="timer-track" />
                  <circle cx="90" cy="90" r="77" className="timer-progress" />
                </svg>
                <div className="timer-text"><span>TIME TO FOCUS</span><strong>{displayTime}</strong><small>minutes : seconds</small></div>
              </div>
              <p className="focus-caption">Put distractions aside. This time is yours.</p>
              <div className="timer-actions">
                <button type="button" className="timer-start" onClick={() => { if (time === 0) setTime(1500); setRunning((old) => !old); }}>
                  {running ? "Ⅱ  Pause session" : time === 0 ? "↻  Start again" : "▶  Start session"}
                </button>
                <button type="button" className="timer-reset" onClick={resetTimer} aria-label="Reset timer">↺</button>
              </div>
            </section>

            <section className="panel goals-panel">
              <div className="panel-header">
                <div><span className="overline">AIM FOR TODAY</span><h2>Little intentions<span className="heading-period">.</span></h2></div>
                <span className="goals-heart">♡</span>
              </div>
              <div className="goals-list">
                {goals.map((goal) => (
                  <label className="goal-row" key={goal.id}>
                    <input type="checkbox" checked={goal.done} onChange={() => toggleGoal(goal.id)} />
                    <span className={goal.done ? "crossed" : ""}>{goal.text}</span>
                  </label>
                ))}
              </div>
              <div className="goal-footer"><div className="progress-track"><div className="progress-fill" style={{ width: `${goalsDone / goals.length * 100}%` }} /></div><span>{goalsDone} of {goals.length} completed</span></div>
            </section>
          </div>
        </section>

        <footer className="footer"><span>STUDYSPACE © 2026</span><span>Made for your next little win <b>✿</b></span></footer>
      </main>
    </div>
  );
}

export default App;
