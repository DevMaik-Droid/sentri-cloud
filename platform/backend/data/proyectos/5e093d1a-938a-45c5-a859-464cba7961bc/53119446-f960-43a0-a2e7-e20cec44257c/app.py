from flask import Flask, request, redirect, render_template, url_for,flash
import sqlite3
from os import name
from flask_login import LoginManager, login_user, login_required, logout_user, UserMixin, current_user
from werkzeug.security import generate_password_hash, check_password_hash
app = Flask(__name__)
app.secret_key = 'ClaveSuperSecreta'

# configurar flask-login
login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)



def get_db_connection():
    conn = sqlite3.connect("tareas.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    conn = sqlite3.connect("tareas.db")
    cursor= conn.cursor()
    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password_hash TEXT,
            created_at DATE DEFAULT CURRENT_TIMESTAMP
        )
        '''
    )
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        completed TEXT,
        user_id INTEGER REFERENCES users(id),
        created_at DATE DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()
#init_database()

# Clase usuario para flask-login
class User(UserMixin):
    def __init__(self, id, username, password_hash, created_at):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.created_at = created_at

    @staticmethod
    def get_by_id(id):
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE id = ?', (id,)).fetchone()
        conn.close()
        if user:
            return User(**user)
        return None
    @staticmethod
    def get_by_username(username):
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()
        if user:
            return User(**user)
        return None

@login_manager.user_loader
def load_user(user_id):
    return User.get_by_id(user_id)



@app.route("/")
def home():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT title, descripcion, completed FROM tasks")
    tasks = cursor.fetchall()
    conn.close()

    return render_template("index.html", tasks=tasks)

@app.route("/dashboard")
@login_required
def dashboard():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    conn.close()
    return render_template("dashboard.html", tasks=tasks)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hash_pass = generate_password_hash(password)
        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', 
                         (username, hash_pass))
            conn.commit()
            flash('Usuario registrado correctamente. Inicia sesión para continuar.', 'success')
            return redirect(url_for('login'))
        except:
            flash('El nombre de usuario ya existe', 'danger')
        finally:
            conn.close()
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['txt_usuario']
        password = request.form['txt_contrasenia']
        user = User.get_by_username(username)
        if user is not None and check_password_hash(user.password_hash, password):
            login_user(user)
            flash('Inicio de sesion exitoso', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Credenciales invalidaas', 'danger')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Has cerrado sesión', 'success')
    return redirect(url_for('home'))

@app.route('/nueva_task', methods=['GET', 'POST'])
@login_required
def nueva_task():
    if request.method == 'POST':
        title = request.form['title']
        descripcion = request.form['descripcion']
        completed = request.form['completed']
        user_id = current_user.id
        conn = get_db_connection()
        conn.execute('INSERT INTO tasks (title, descripcion, completed, user_id) VALUES (?, ?, ?, ?)', 
                     (title, descripcion, completed, user_id))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))
    return render_template('form_tasks.html')

@app.route('/editar_task/<int:id>', methods=['GET', 'POST'])
@login_required
def editar_task(id):
    conn = get_db_connection()
    task = conn.execute('SELECT * FROM tasks WHERE id = ?', (id,)).fetchone()
    conn.close()
    if request.method == 'POST':
        title = request.form['title']
        descripcion = request.form['descripcion']
        completed = request.form['completed']
        conn = get_db_connection()
        conn.execute('UPDATE tasks SET title = ?, descripcion = ?, completed = ? WHERE id = ?', 
                     (title, descripcion, completed, id))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))
    return render_template('form_tasks.html', task=task)


@app.route('/eliminar_task/<int:id>')
@login_required
def eliminar_task(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM tasks WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('dashboard'))

if __name__ == "__main__":
    app.run(debug=True)