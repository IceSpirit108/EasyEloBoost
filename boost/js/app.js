
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }

    document.querySelector('.modal-trigger[data-modal="chat"]').addEventListener('click', initChat);

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        }
    });
});
