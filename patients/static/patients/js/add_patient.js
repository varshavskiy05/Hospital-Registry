document.getElementById('addPatientBtn').addEventListener('click', function() {
    document.getElementById('patientModal').style.display = 'block';
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('patientModal').style.display = 'none';
});

const savePatientBtn = document.getElementById('savePatientBtn');
const savePatientUrl = savePatientBtn.getAttribute('data-add-url');

document.getElementById('patientForm').addEventListener('submit', function(e) {
   e.preventDefault()
   let formData = new FormData(this);

   fetch(savePatientUrl, {
       method: 'POST',
       headers: {
              'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
         },
         body: formData
       })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            location.reload();
        } else {
            alert('Ошибка: ' + JSON.stringify(data.errors));
        }
   })
});