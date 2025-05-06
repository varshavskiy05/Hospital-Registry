document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("doctor-list");
    const dataScript = document.getElementById("doctor-data");
    const searchInput = document.getElementById("searchInput");

    if (!list || !dataScript || !searchInput) {
        console.error("Не знайдено необхідні елементи для роботи!");
        return;
    }

    const data = JSON.parse(dataScript.textContent);

    function renderList(doctors) {
        list.innerHTML = "";

        doctors.forEach(doctor => {
            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center";

            const text = document.createElement("span");
            text.textContent = `${doctor.first_name} ${doctor.middle_name || ''} ${doctor.last_name}; ${doctor.specialty || ''}; Кабінет: ${doctor.cabinet || 'Не визначено'}` ;

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "d-flex gap-2";

            const appointmentButton = document.createElement("Button");
            appointmentButton.className = "btn btn-sm btn-success"
            appointmentButton.textContent = "Запис"
            appointmentButton.type = "button"
            appointmentButton.addEventListener('click', function () {
                openBookModal(doctor)
            })

            const editButton = document.createElement("button");
            editButton.className = "btn btn-sm btn-primary";
            editButton.textContent = "Редагувати";
            editButton.type = "button";
            editButton.addEventListener('click', function () {
                openEditModal(doctor);
            });

            const infoButton = document.createElement("button");
            infoButton.className = "btn btn-sm btn-secondary";
            infoButton.textContent = "Інформація";
            infoButton.type = "button";
            infoButton.addEventListener('click', function () {
                openInfoModal(doctor);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-sm btn-danger";
            deleteButton.textContent = "Видалити";
            deleteButton.type = "button";
            deleteButton.addEventListener('click', function () {
                deleteDoctor(doctor.id);
            });

            buttonContainer.appendChild(appointmentButton)
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(infoButton);
            buttonContainer.appendChild(deleteButton);

            item.appendChild(text);
            item.appendChild(buttonContainer);

            list.appendChild(item);
        });
    }

    renderList(data);

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();

        const filteredDoctors = data.filter(doctor => {
            return (
                (doctor.first_name && doctor.first_name.toLowerCase().includes(query)) ||
                (doctor.middle_name && doctor.middle_name.toLowerCase().includes(query)) ||
                (doctor.last_name && doctor.last_name.toLowerCase().includes(query)) ||
                (doctor.specialty && doctor.specialty.toLowerCase().includes(query))
            );
        });

        renderList(filteredDoctors);
    });

    document.getElementById('addDoctorBtn').addEventListener('click', function () {
        document.getElementById('editModal').style.display = 'block';
        document.getElementById('edit_doctor_id').value = '';
        document.getElementById('edit_first_name').value = '';
        document.getElementById('edit_middle_name').value = '';
        document.getElementById('edit_last_name').value = '';
        document.getElementById('edit_specialty').value = '';
        document.getElementById('edit_phone_number').value = '';
        document.getElementById('edit_email').value = '';
        document.getElementById('edit_date_of_birth').value = '';
        document.getElementById('edit_hire_date').value = '';
        document.getElementById('edit_fire_date').value = '';
        document.getElementById('edit_cabinet').value = '';
    });

    document.getElementById('closeBookModal').addEventListener('click', function () {
        document.getElementById('bookModal').style.display = 'none';
    });

    const appointmentCreareUrl = document.getElementById('appointmentsCreateUrl').value

    document.getElementById('bookForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        fetch(appointmentCreareUrl, {
            method: 'POST',
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Запис створено!");
                location.reload();
            } else {
                alert("Помилка: " + JSON.stringify(data.errors));
            }
        });
    });



    document.getElementById('saveDoctorBtn').addEventListener('click', function () {
        const doctorId = document.getElementById('edit_doctor_id').value;

        const formData = new FormData();
        formData.append('doctor_id', doctorId);
        formData.append('first_name', document.getElementById('edit_first_name').value);
        formData.append('middle_name', document.getElementById('edit_middle_name').value);
        formData.append('last_name', document.getElementById('edit_last_name').value);
        formData.append('specialty', document.getElementById('edit_specialty').value);
        formData.append('phone_number', document.getElementById('edit_phone_number').value);
        formData.append('email', document.getElementById('edit_email').value);
        formData.append('date_of_birth', document.getElementById('edit_date_of_birth').value);
        formData.append('hire_date', document.getElementById('edit_hire_date').value);
        formData.append('fire_date', document.getElementById('edit_fire_date').value);
        formData.append('cabinet', document.getElementById('edit_cabinet').value)

        const url = doctorId ? '/doctors/update/' : '/doctors/create/';

        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(doctorId ? 'Лікаря оновлено успішно!' : 'Лікаря додано успішно!');
                location.reload();
            } else {
                alert('Помилка при збереженні: ' + JSON.stringify(data.errors));
            }
        });
    });

    function openEditModal(doctor) {
        document.getElementById('editModal').style.display = 'block';

        document.getElementById('edit_doctor_id').value = doctor.id || '';
        document.getElementById('edit_first_name').value = doctor.first_name || '';
        document.getElementById('edit_middle_name').value = doctor.middle_name || '';
        document.getElementById('edit_last_name').value = doctor.last_name || '';
        document.getElementById('edit_specialty').value = doctor.specialty || '';
        document.getElementById('edit_phone_number').value = doctor.phone_number || '';
        document.getElementById('edit_email').value = doctor.email || '';
        document.getElementById('edit_date_of_birth').value = doctor.date_of_birth || '';
        document.getElementById('edit_hire_date').value = doctor.hire_date || '';
        document.getElementById('edit_fire_date').value = doctor.fire_date || '';
        document.getElementById('edit_cabinet').value = doctor.cabinet || '';
    }

    function openInfoModal(doctor) {
        document.getElementById('infoModal').style.display = 'block';
        const infoContent = document.getElementById('infoContent');
        infoContent.innerHTML = `
            <p><strong>Ім’я:</strong> ${doctor.first_name || '-'}</p>
            <p><strong>По батькові:</strong> ${doctor.middle_name || '-'}</p>
            <p><strong>Прізвище:</strong> ${doctor.last_name || '-'}</p>
            <p><strong>Спеціальність:</strong> ${doctor.specialty || '-'}</p>
            <p><strong>Телефон:</strong> ${doctor.phone_number || '-'}</p>
            <p><strong>Email:</strong> ${doctor.email || '-'}</p>
            <p><strong>Дата народження:</strong> ${doctor.date_of_birth || '-'}</p>
            <p><strong>Дата прийому на роботу:</strong> ${doctor.hire_date || '-'}</p>
            <p><strong>Дата звільнення:</strong> ${doctor.fire_date || '-'}</p>
            <p><strong>Кабінет:</strong> ${doctor.cabinet || '-'}</p>
        `;
    }


    function openBookModal(doctor) {
        const modal = document.getElementById('bookModal');
        modal.style.display = 'block';

        // Вставляємо єдиного лікаря у select
        const select = document.getElementById('book_doctor');
        select.innerHTML = ''; // очищаємо

        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.first_name} ${doctor.last_name}`;
        option.selected = true;
        select.appendChild(option);

        // Очищуємо інші поля
        document.getElementById('book_patient').value = '';
        document.getElementById('book_phone').value = '';
        document.getElementById('book_date').value = '';
        document.getElementById('book_note').value = '';
    }



    function deleteDoctor(id) {
        if (confirm("Ви впевнені, що хочете видалити лікаря?")) {
            fetch(`/doctors/delete/${id}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert('Помилка при видаленні лікаря.');
                }
            });
        }
    }

    document.getElementById('closeEditModal').addEventListener('click', function () {
        document.getElementById('editModal').style.display = 'none';
    });

    document.getElementById('closeInfoModal').addEventListener('click', function () {
        document.getElementById('infoModal').style.display = 'none';
    });
});
