async function initChat() {
    console.log('Инициализация чата');
    const userId = document.getElementById('userId').value;
    const messages = await getUserMessages(userId);
    displayUserMessages(messages);

    // Добавляем обработчик события для кнопки отправки сообщения
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    if (sendMessageBtn) {
        console.log('Обработчик события добавлен');
        sendMessageBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение кнопки
            await handleSendMessage();
        });
    } else {
        console.error('Кнопка отправки сообщения не найдена');
    }
}

async function handleSendMessage() {
    console.log('Функция handleSendMessage вызвана');
    const userId = document.getElementById('userId').value;
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message.trim() === '') {
        alert('Пожалуйста, введите сообщение');
        return;
    }

    try {
        console.log('Отправка сообщения...');
        const response = await fetch('http://localhost:3000/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, message })
        });

        const result = await response.json();
        console.log('Ответ сервера:', result);

        if (response.ok) {
            console.log('Сообщение отправлено успешно');
            messageInput.value = '';
            const messages = await getUserMessages(userId);
            displayUserMessages(messages);
        } else {
            throw new Error(result.message || 'Произошла ошибка при отправке сообщения');
        }
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        alert('Произошла ошибка при отправке сообщения: ' + error.message);
    }
}

async function sendMessage(userId, message) {
    try {
        console.log('Отправка запроса на сервер');
        const response = await fetch('http://localhost:3000/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, message })
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Сообщение отправлено успешно');
            return result;
        } else {
            throw new Error(result.message || 'Произошла ошибка при отправке сообщения');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
}


async function getUserMessages(userId) {
    try {
        console.log('Запрос сообщений пользователя');
        const response = await fetch(`http://localhost:3000/api/get-user-messages/${userId}`);
        const messages = await response.json();
        return messages;
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
}

function displayUserMessages(messages) {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.textContent = `${message.message} (${message.created_at})`;
        messageList.appendChild(messageItem);
    });
}
