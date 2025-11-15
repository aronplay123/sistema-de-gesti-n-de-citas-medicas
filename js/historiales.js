document.addEventListener('DOMContentLoaded', function () {
    const newRecordModal = document.getElementById('newRecordModal');
    const patientListContainer = document.querySelector('.list-group');
    const timelineContainer = document.querySelector('.timeline');
    const patientSelect = newRecordModal ? newRecordModal.querySelector('#recordPatient') : null;
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    let medicalRecords = JSON.parse(localStorage.getItem('medicalRecords')) || [];
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    let selectedPatientId = null;

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
        patients.forEach(patient => {
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
                document.querySelector('.card-title.mb-0').textContent = `Historial Médico - ${patient.firstName} ${patient.lastName}`;
                renderTimeline(patient.id);
            });
            patientListContainer.appendChild(item);
        });

        // Auto-select first patient
        if (patients.length > 0) {
            patientListContainer.firstChild.click();
        }
    };

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

    // Búsqueda de pacientes
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.toLowerCase().trim();
            const allPatients = document.querySelectorAll('.list-group-item');
            let found = false;

            allPatients.forEach(item => {
                const patientName = item.querySelector('h6').textContent.toLowerCase();
                if (query === '' || patientName.includes(query)) {
                    item.style.display = '';
                    if (patientName.includes(query) && query !== '') {
                        item.click();
                        found = true;
                    }
                } else {
                    item.style.display = 'none';
                }
            });

            if (!found && query !== '') {
                alert('Paciente no encontrado');
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
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