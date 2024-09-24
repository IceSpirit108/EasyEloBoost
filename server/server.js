const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Маршрут для входа
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (user.rows.length > 0) {
            res.json(user.rows[0]);
        } else {
            res.status(401).json({ message: 'Неправильный логин или пароль' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для регистрации
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        console.log('Полученные данные на сервере:', { username, password, email });

        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
        }

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Пользователь с таким именем или email уже существует' });
        }

        const newUser = await pool.query(
            'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, password, email, 'client']
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Ошибка сервера при регистрации' });
    }
});


app.post('/api/logout', async (req, res) => {
    try {
        // Здесь вы можете добавить логику для очистки сессии
        res.json({ success: true, message: 'Выход выполнен успешно' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Ошибка при выходе' });
    }
});


// Новый маршрут для отправки сообщения
app.post('/api/send-message', async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ message: 'Необходимо указать ID пользователя и сообщение' });
        }

        const newMessage = await pool.query(
            'INSERT INTO messages (user_id, message) VALUES ($1, $2) RETURNING *',
            [userId, message]
        );

        res.json(newMessage.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Ошибка сервера при отправке сообщения' });
    }
});



// Новый маршрут для получения сообщений (только для админов)
app.get('/api/get-messages', async (req, res) => {
    try {
        const messages = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(messages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Ошибка сервера при получении сообщений' });
    }
});

// Новый маршрут для получения сообщений конкретного пользователя (для клиента)
app.get('/api/get-user-messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await pool.query('SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC', [id]);
        res.json(messages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Ошибка сервера при получении сообщений пользователя' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

