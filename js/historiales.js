document.addEventListener('DOMContentLoaded', function () {
    const newRecordModal = document.getElementById('newRecordModal');
    const patientListContainer = document.getElementById('patientsList');
    const timelineContainer = document.getElementById('recordTimeline');
    const recordTitleElement = document.getElementById('recordTitle');
    const patientSelect = newRecordModal ? newRecordModal.querySelector('#recordPatient') : null;
    const searchInput = document.getElementById('searchMedicalRecords');
    const searchBtn = document.getElementById('searchBtn');

    let medicalRecords = JSON.parse(localStorage.getItem('medicalRecords')) || [];
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    let selectedPatientId = null;
    let filteredPatients = [...patients];

    const renderTimeline = (patientId) => {
        timelineContainer.innerHTML = '';
        const records = medicalRecords.filter(r => r.patientId == patientId);
        records.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (records.length === 0) {
            timelineContainer.innerHTML = '<p>No hay registros para este paciente.</p>';
            return;
        }

        records.forEach(record => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-date">${record.date}</div>
                <div class="timeline-content">
                    <h6>${record.type}</h6>
                    <p><strong>Diagnóstico:</strong> ${record.diagnosis}</p>
                    <p><strong>Tratamiento:</strong> ${record.treatment}</p>
                    ${record.notes ? `<p><strong>Observaciones:</strong> ${record.notes}</p>` : ''}
                </div>
            `;
            timelineContainer.appendChild(item);
        });
    };

    const renderPatientList = () => {
        patientListContainer.innerHTML = '';
        filteredPatients.forEach(patient => {
            const item = document.createElement('a');
            item.href = '#';
            item.className = 'list-group-item list-group-item-action';
            item.dataset.patientId = patient.id;
            item.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${patient.firstName} ${patient.lastName}</h6>
                    <small>${patient.age || ''} años</small>
                </div>
                <small>DNI: ${patient.dni}</small>
            `;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                selectedPatientId = patient.id;
                document.querySelectorAll('.list-group-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                recordTitleElement.textContent = `Historial Médico - ${patient.firstName} ${patient.lastName}`;
                renderTimeline(patient.id);
            });
            patientListContainer.appendChild(item);
        });

        // Auto-select first patient
        if (filteredPatients.length > 0) {
            patientListContainer.firstChild.click();
        }
    };

    // Función de búsqueda por nombre del paciente
    const searchPatientByName = (searchTerm) => {
        if (searchTerm.trim() === '') {
            filteredPatients = [...patients];
        } else {
            filteredPatients = patients.filter(patient =>
                `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        renderPatientList();
    };

    // Evento para el botón de búsqueda
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value;
            searchPatientByName(searchTerm);
        });
    }

    const loadPatientsForModal = () => {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        if (patientSelect) {
            patientSelect.innerHTML = '<option value="" selected disabled>Seleccionar paciente</option>';
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = `${patient.firstName} ${patient.lastName}`;
                patientSelect.appendChild(option);
            });
        }
    };

    if (newRecordModal) {
        newRecordModal.addEventListener('show.bs.modal', () => {
            loadPatientsForModal();
        });
    }

    const medicalRecordForm = document.getElementById('medicalRecordForm');
    if (medicalRecordForm) {
        medicalRecordForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const newRecord = {
                id: Date.now(),
                patientId: document.getElementById('recordPatient').value,
                date: document.getElementById('recordDate').value,
                type: document.getElementById('recordType').value,
                diagnosis: document.getElementById('recordDiagnosis').value,
                treatment: document.getElementById('recordTreatment').value,
                notes: document.getElementById('recordNotes').value,
                files: []
            };

            medicalRecords.push(newRecord);
            localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));

            alert('Registro médico guardado con éxito.');
            medicalRecordForm.reset();
            const modal = bootstrap.Modal.getInstance(newRecordModal);
            modal.hide();

            // Refresh timeline
            if (newRecord.patientId === selectedPatientId) {
                renderTimeline(selectedPatientId);
            }
        });
    }

    renderPatientList();
});