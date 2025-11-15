document.addEventListener('DOMContentLoaded', () => {

    const doctors = [
        {
            id: 1,
            name: 'Dr. Juan Pérez',
            specialty: 'Cardiología',
            location: 'Sede Central',
            image: 'img/doctor1.png'   // ← TU IMAGEN REAL
        },
        {
            id: 2,
            name: 'Dra. Ana Gómez',
            specialty: 'Dermatología',
            location: 'Sede Norte',
            image: 'img/doc.jpg'
        },
        {
            id: 3,
            name: 'Dr. Carlos Ruiz',
            specialty: 'Pediatría',
            location: 'Sede Central',
            image: 'img/doctor1.png'
        },
        {
            id: 4,
            name: 'Dra. Laura Méndez',
            specialty: 'Ginecología',
            location: 'Sede Sur',
            image: 'img/doctora4.jpg'
        },
        {
            id: 5,
            name: 'Dr. Pedro Martins',
            specialty: 'Cardiología',
            location: 'Sede Norte',
            image: 'img/doctor3.jpg'
        }
    ];

    const doctorListContainer = document.getElementById('doctorList');
    const specialtyFilter = document.getElementById('filterSpecialty');
    const locationFilter = document.getElementById('filterLocation');
    const searchInput = document.getElementById('searchDoctorInput');

    const renderDoctors = (filteredDoctors) => {
        doctorListContainer.innerHTML = '';
        filteredDoctors.forEach(doctor => {
            const doctorCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${doctor.image}" class="card-img-top" alt="${doctor.name}">
                        <div class="card-body">
                            <h5 class="card-title">${doctor.name}</h5>
                            <p class="card-text">${doctor.specialty}</p>
                            <p class="card-text"><small class="text-muted">${doctor.location}</small></p>
                            <button class="btn btn-primary" onclick="viewDoctorDetails(${doctor.id})">Ver más</button>
                        </div>
                    </div>
                </div>
            `;
            doctorListContainer.innerHTML += doctorCard;
        });
    };

    const populateFilters = () => {
        const specialties = [...new Set(doctors.map(d => d.specialty))];
        const locations = [...new Set(doctors.map(d => d.location))];

        specialties.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            specialtyFilter.appendChild(option);
        });

        locations.forEach(l => {
            const option = document.createElement('option');
            option.value = l;
            option.textContent = l;
            locationFilter.appendChild(option);
        });
    };

    const filterDoctors = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedSpecialty = specialtyFilter.value;
        const selectedLocation = locationFilter.value;

        const filtered = doctors.filter(doctor => {
            const nameMatch = doctor.name.toLowerCase().includes(searchTerm);
            const specialtyMatch = doctor.specialty.toLowerCase().includes(searchTerm);
            const specialtyFilterMatch = selectedSpecialty.includes('Filtrar') || doctor.specialty === selectedSpecialty;
            const locationFilterMatch = selectedLocation.includes('Filtrar') || doctor.location === selectedLocation;

            return (nameMatch || specialtyMatch) && specialtyFilterMatch && locationFilterMatch;
        });

        renderDoctors(filtered);
    };

    searchInput.addEventListener('input', filterDoctors);
    specialtyFilter.addEventListener('change', filterDoctors);
    locationFilter.addEventListener('change', filterDoctors);

    renderDoctors(doctors);
    populateFilters();

    // FUNCIÓN PARA VER DETALLES DEL MÉDICO USANDO LA MISMA LISTA
    window.viewDoctorDetails = (doctorId) => {
        const doctor = doctors.find(d => d.id === doctorId);
        if (!doctor) return;

        document.getElementById('modalDoctorImage').src = doctor.image;
        document.getElementById('modalDoctorName').textContent = doctor.name;
        document.getElementById('modalDoctorSpecialty').textContent = doctor.specialty;
        document.getElementById('modalDoctorLocation').textContent = doctor.location;

        const modalEl = document.getElementById('doctorDetailsModal');
        const calendarEl = document.getElementById('doctorCalendar');
        const modal = new bootstrap.Modal(modalEl);

        modalEl.addEventListener('shown.bs.modal', () => {
            if (calendar) {
                calendar.destroy();
            }
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                height: 'auto',
                events: [
                    { title: 'Disponible', start: '2025-10-20' },
                    { title: 'Disponible', start: '2025-10-22' },
                    { title: 'Disponible', start: '2025-10-24' }
                ]
            });
            calendar.render();
        }, { once: true });

        modal.show();
    };
});