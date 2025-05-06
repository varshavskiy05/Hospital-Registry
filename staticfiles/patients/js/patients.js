document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("patient-list");
    const dataScript = document.getElementById("patients-data");


     if (!list || !dataScript || !searchInput) {
        console.error("Не знайдено необхідні елементи для роботи!");
        return;
    }

    const data = JSON.parse(dataScript.textContent);

    function renderList(patients) {
        list.innerHTML = "";

        patients.forEach(patient => {
            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center";

            const text = document.createElement("span");
            text.textContent = `${patient.first_name} ${patient.middle_name || ''} ${patient.last_name} (${patient.date_of_birth || ''})`;

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "d-flex gap-2";

            const editButton = document.createElement("button");
            editButton.className = "btn btn-sm btn-primary";
            editButton.textContent = "Edit";
            editButton.type = "button";
            editButton.addEventListener('click', function() {
                openEditModal(patient);
            });

            const infoButton = document.createElement("button");
            infoButton.className = "btn btn-sm btn-secondary";
            infoButton.textContent = "Info";
            infoButton.type = "button";
            infoButton.addEventListener('click', function() {
                openInfoModal(patient);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-sm btn-danger";
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            deleteButton.addEventListener('click', function() {
                deletePatient(patient.id);
            });

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(infoButton);
            buttonContainer.appendChild(deleteButton);

            item.appendChild(text);
            item.appendChild(buttonContainer);

            list.appendChild(item);
        });
    }


    renderList(data);

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();

        const filteredPatients = data.filter(patient => {
            return (
                (patient.first_name && patient.first_name.toLowerCase().includes(query)) ||
                (patient.middle_name && patient.middle_name.toLowerCase().includes(query)) ||
                (patient.last_name && patient.last_name.toLowerCase().includes(query))
            );
        });

        renderList(filteredPatients);
    });

    function openEditModal(patient) {
        document.getElementById('patientModal').style.display = 'block';

        document.querySelector('input[name="first_name"]').value = patient.first_name || '';
        document.querySelector('input[name="middle_name"]').value = patient.middle_name || '';
        document.querySelector('input[name="last_name"]').value = patient.last_name || '';
        document.querySelector('input[name="phone_number"]').value = patient.phone_number || '';
        document.querySelector('input[name="email"]').value = patient.email || '';
        document.querySelector('input[name="date_of_birth"]').value = patient.date_of_birth || '';
        document.querySelector('input[name="admit_date"]').value = patient.admit_date || '';
        document.querySelector('input[name="admit_time"]').value = patient.admit_time || '';
        document.querySelector('input[name="discharge_date"]').value = patient.discharge_date || '';
        document.getElementById('patient_id').value = patient.id || '';
    }

    function openInfoModal(patient) {
        document.getElementById('infoModal').style.display = 'block';

        const infoContent = document.getElementById('infoContent');
        infoContent.innerHTML = `
            <p><strong>Ім'я:</strong> ${patient.first_name || '-'}</p>
            <p><strong>По батькові:</strong> ${patient.middle_name || '-'}</p>
            <p><strong>Прізвище:</strong> ${patient.last_name || '-'}</p>
            <p><strong>Телефон:</strong> ${patient.phone_number || '-'}</p>
            <p><strong>Email:</strong> ${patient.email || '-'}</p>
            <p><strong>Дата народження:</strong> ${patient.date_of_birth || '-'}</p>
            <p><strong>Дата госпіталізації:</strong> ${patient.admit_date || '-'}</p>
            <p><strong>Час госпіталізації:</strong> ${patient.admit_time || '-'}</p>
            <p><strong>Дата виписки:</strong> ${patient.discharge_date || '-'}</p>
        `;
    }

    function deletePatient(id) {
        if (confirm("Ви впевнені, що хочете видалити пацієнта?")) {
            fetch(`/patients/delete/${id}/`, {
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
                    alert('Не вдалося видалити пацієнта.');
                }
            });
        }
    }


    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.getElementById('patientModal').style.display = 'none';
    });

    document.getElementById('closeInfoBtn').addEventListener('click', function() {
        document.getElementById('infoModal').style.display = 'none';
    });

    // Отправка формы
    document.getElementById('patientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch("{% url 'patients:add_or_update_patient' %}", {
            method: 'POST',
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert('Помилка при збереженні: ' + JSON.stringify(data.errors));
            }
        });
    });
});
