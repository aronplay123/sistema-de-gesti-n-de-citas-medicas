document.addEventListener('DOMContentLoaded', function () {
    const patientForm = document.getElementById('patientForm');
    const patientTableBody = document.querySelector('.table-hover tbody');
    const newPatientModal = new bootstrap.Modal(document.getElementById('newPatientModal'));

    let patients = JSON.parse(localStorage.getItem('patients')) || [];

    const renderPatients = () => {
        if (!patientTableBody) return;
        patientTableBody.innerHTML = '';
        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.firstName} ${patient.lastName}</td>
                <td>${calculateAge(patient.dob)}</td>
                <td>${patient.dni}</td>
                <td>${patient.phone}</td>
                <td>N/A</td>
                <td><span class="badge bg-success">Activo</span></td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${patient.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${patient.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            patientTableBody.appendChild(row);
        });
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const populateForm = (patient) => {
        document.getElementById('patientId').value = patient.id;
        document.getElementById('patientFirstName').value = patient.firstName;
        document.getElementById('patientLastName').value = patient.lastName;
        document.getElementById('patientDNI').value = patient.dni;
        document.getElementById('patientDOB').value = patient.dob;
        document.getElementById('patientPhone').value = patient.phone;
        document.getElementById('patientEmail').value = patient.email;
        document.getElementById('patientAddress').value = patient.address;
        document.getElementById('patientMedicalHistory').value = patient.medicalHistory;
    };

    if (patientForm) {
        patientForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const patientId = document.getElementById('patientId').value;

            const patientData = {
                id: patientId ? patientId : Date.now(),
                firstName: document.getElementById('patientFirstName').value,
                lastName: document.getElementById('patientLastName').value,
                dni: document.getElementById('patientDNI').value,
                dob: document.getElementById('patientDOB').value,
                phone: document.getElementById('patientPhone').value,
                email: document.getElementById('patientEmail').value,
                address: document.getElementById('patientAddress').value,
                medicalHistory: document.getElementById('patientMedicalHistory').value
            };

            if (patientId) {
                patients = patients.map(p => p.id == patientId ? patientData : p);
            } else {
                patients.push(patientData);
            }

            localStorage.setItem('patients', JSON.stringify(patients));
            renderPatients();
            patientForm.reset();
            document.getElementById('patientId').value = '';
            newPatientModal.hide();
        });
    }

    if (patientTableBody) {
        patientTableBody.addEventListener('click', function (e) {
            const editButton = e.target.closest('.edit-btn');
            const deleteButton = e.target.closest('.delete-btn');

            if (editButton) {
                const patientId = editButton.getAttribute('data-id');
                const patient = patients.find(p => p.id == patientId);
                if (patient) {
                    populateForm(patient);
                    newPatientModal.show();
                }
            }

            if (deleteButton) {
                const patientId = deleteButton.getAttribute('data-id');
                patients = patients.filter(p => p.id != patientId);
                localStorage.setItem('patients', JSON.stringify(patients));
                renderPatients();
            }
        });
    }

    renderPatients();
});