document.addEventListener('DOMContentLoaded', function () {
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentList = document.querySelector('.appointment-list');
    const calendarEl = document.getElementById('appointmentCalendar');
    const patientSelect = document.getElementById('patientName');
    const specialtySelect = document.getElementById('doctorSpecialty');
    const doctorSelect = document.getElementById('doctorName');
    const newAppointmentModal = new bootstrap.Modal(document.getElementById('newAppointmentModal'));

    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    const doctors = [
        { id: 1, name: 'Dr. Juan Pérez', specialty: 'Cardiología' },
        { id: 2, name: 'Dra. Ana Gómez', specialty: 'Dermatología' },
        { id: 3, name: 'Dr. Carlos Ruiz', specialty: 'Pediatría' },
        { id: 4, name: 'Dra. Laura Méndez', specialty: 'Ginecología' },
        { id: 5, name: 'Dr. Pedro Martins', specialty: 'Cardiología' }
    ];
    let calendar;

    const loadPatients = () => {
        if (patientSelect) {
            patientSelect.innerHTML = '<option selected disabled>Seleccionar paciente</option>';
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = `${patient.firstName} ${patient.lastName}`;
                option.textContent = `${patient.firstName} ${patient.lastName}`;
                patientSelect.appendChild(option);
            });
        }
    };

    const loadSpecialties = () => {
        const specialties = [...new Set(doctors.map(d => d.specialty))];
        specialtySelect.innerHTML = '<option selected disabled>Seleccionar especialidad</option>';
        specialties.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            specialtySelect.appendChild(option);
        });
    };

    const updateDoctors = () => {
        const selectedSpecialty = specialtySelect.value;
        const filteredDoctors = doctors.filter(d => d.specialty === selectedSpecialty);
        doctorSelect.innerHTML = '<option selected disabled>Seleccionar médico</option>';
        filteredDoctors.forEach(d => {
            const option = document.createElement('option');
            option.value = d.name;
            option.textContent = d.name;
            doctorSelect.appendChild(option);
        });
    };

    if (specialtySelect) {
        specialtySelect.addEventListener('change', updateDoctors);
    }

    const renderAppointments = () => {
        if (appointmentList) {
            appointmentList.innerHTML = '';
            const sortedAppointments = [...appointments].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${a.time}`));
            sortedAppointments.forEach(appointment => {
                const appointmentItem = document.createElement('div');
                appointmentItem.className = 'appointment-item';
                appointmentItem.innerHTML = `
                    <div class="appointment-time">${appointment.time}</div>
                    <div class="appointment-info">
                        <h6>${appointment.patient}</h6>
                        <p>${appointment.type} con ${appointment.doctor || 'médico no asignado'}</p>
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${appointment.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${appointment.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                appointmentList.appendChild(appointmentItem);
            });
        }

        if (calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(appointments.map(apt => ({
                title: `${apt.patient} - ${apt.type} (${apt.doctor || 'N/A'})`,
                start: `${apt.date}T${apt.time}`,
                id: apt.id
            })));
        }
    };

    const populateForm = (appointment) => {
        document.getElementById('appointmentId').value = appointment.id;
        document.getElementById('patientName').value = appointment.patient;
        document.getElementById('appointmentDate').value = appointment.date;
        document.getElementById('appointmentTime').value = appointment.time;
        document.getElementById('consultationType').value = appointment.type;
        document.getElementById('appointmentNotes').value = appointment.notes;

        // Pre-select specialty and doctor when editing
        if (appointment.doctor) {
            const doctor = doctors.find(d => d.name === appointment.doctor);
            if (doctor) {
                specialtySelect.value = doctor.specialty;
                updateDoctors(); // Update doctor list based on specialty
                doctorSelect.value = doctor.name;
            }
        }
    };

    if (calendarEl && typeof FullCalendar !== 'undefined') {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            height: 400,
            events: [],
            eventClick: function(info) {
                const appointmentId = info.event.id;
                const appointment = appointments.find(apt => apt.id == appointmentId);
                if (appointment) {
                    populateForm(appointment);
                    newAppointmentModal.show();
                }
            }
        });
        calendar.render();
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const appointmentId = document.getElementById('appointmentId').value;

            const newAppointment = {
                id: appointmentId ? appointmentId : Date.now(),
                patient: document.getElementById('patientName').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                type: document.getElementById('consultationType').value,
                doctor: document.getElementById('doctorName').value, // Save doctor
                notes: document.getElementById('appointmentNotes').value
            };

            if (appointmentId) {
                appointments = appointments.map(apt => apt.id == appointmentId ? newAppointment : apt);
            } else {
                appointments.push(newAppointment);
            }

            localStorage.setItem('appointments', JSON.stringify(appointments));
            renderAppointments();
            appointmentForm.reset();
            document.getElementById('appointmentId').value = '';
            newAppointmentModal.hide();
        });
    }

    if (appointmentList) {
        appointmentList.addEventListener('click', function(e) {
            const editButton = e.target.closest('.edit-btn');
            const deleteButton = e.target.closest('.delete-btn');

            if (editButton) {
                const appointmentId = editButton.getAttribute('data-id');
                const appointment = appointments.find(apt => apt.id == appointmentId);
                if (appointment) {
                    populateForm(appointment);
                    newAppointmentModal.show();
                }
            }

            if (deleteButton) {
                const appointmentId = deleteButton.getAttribute('data-id');
                appointments = appointments.filter(apt => apt.id != appointmentId);
                localStorage.setItem('appointments', JSON.stringify(appointments));
                renderAppointments();
            }
        });
    }

    document.getElementById('newAppointmentModal').addEventListener('show.bs.modal', function () {
        loadPatients();
        loadSpecialties();
        // Reset form for new entry, unless an ID is already present (editing)
        if (!document.getElementById('appointmentId').value) {
            appointmentForm.reset();
            doctorSelect.innerHTML = '<option selected disabled>Seleccionar médico</option>'; // Reset doctors dropdown
        }
    });

    renderAppointments();
});