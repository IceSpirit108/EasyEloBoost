// Функция для закрытия модальных окон
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Добавьте обработчики для кнопок закрытия модальных окон
document.querySelectorAll('.close').forEach(button => {
    button.onclick = function() {
        const modal = this.parentElement.parentElement;
        closeModal(modal.id);
    };
});

// Добавьте обработчик для клика вне модального окна
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
};

// Функция для обновления UI после успешного входа
function updateUIForLoggedInUser(username) {
    console.log('Обновление UI для авторизованного пользователя');
    document.getElementById('authLink').style.display = 'none';
    document.getElementById('registerLink').style.display = 'none';
    document.getElementById('userLink').style.display = 'block';
    document.getElementById('usernameDisplay').textContent = username;
    document.getElementById('chatLink').style.display = 'block';
    document.getElementById('userId').value = username; // Установка ID пользователя для чата

    console.log('UI обновлено');
}

// Функция для выхода из аккаунта
async function logout() {
    try {
        const response = await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Выход выполнен успешно');
            updateUIForLoggedOutUser();
        } else {
            console.log('Ошибка при выходе');
            alert(result.message || 'Произошла ошибка при попытке выйти.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при попытке выйти.');
    }
}

// Функция для обновления UI после выхода из аккаунта
function updateUIForLoggedOutUser() {
    document.getElementById('authLink').style.display = 'block';
    document.getElementById('registerLink').style.display = 'block';
    document.getElementById('userLink').style.display = 'none';
    document.getElementById('chatLink').style.display = 'none';
}

// Обработка входа
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Успешный вход');
            updateUIForLoggedInUser(result.username);
        } else {
            console.log('Ошибка входа');
            alert(result.message || 'Произошла ошибка при попытке войти.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при попытке войти.');
    }
});

// Добавьте обработчик для кнопки выхода
document.addEventListener('DOMContentLoaded', function() {
    const userLink = document.getElementById('userLink');
    if (userLink) {
        userLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});


