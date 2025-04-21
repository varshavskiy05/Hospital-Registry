document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("patient-list");
    const dataScript = document.getElementById("patients-data");

    if (!list) {
        console.error("Елемент #patient-list не знайдено!");
        return;
    }

    if (!dataScript) {
        console.error("Дані patients не знайдені!");
        return;
    }

    const data = JSON.parse(dataScript.textContent);

    data.forEach(patient => {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.textContent = `${patient.first_name} ${patient.last_name} (${patient.date_of_birth})`;
        list.appendChild(item);
    });
});
