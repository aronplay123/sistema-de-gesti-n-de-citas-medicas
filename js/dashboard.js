document.addEventListener('DOMContentLoaded', function () {
    // --- Sample Data Seeding ---
    const seedData = () => {
        const samplePatients = [
            { id: 1, firstName: 'Juan', lastName: 'Pérez', dob: '1985-05-20', dni: '12345678', phone: '987654321', email: 'juan.perez@example.com', address: 'Av. Siempre Viva 123', medicalHistory: 'Ninguno' },
            { id: 2, firstName: 'Maria', lastName: 'Gonzales', dob: '1990-02-15', dni: '87654321', phone: '912345678', email: 'maria.gonzales@example.com', address: 'Calle Falsa 456', medicalHistory: 'Alergia a la penicilina' },
        ];

        const sampleAppointments = [
            { id: 1, patient: 'Juan Pérez', date: '2025-10-05', time: '10:00', type: 'Consulta General', notes: 'Chequeo de rutina.' },
            { id: 2, patient: 'Maria Gonzales', date: '2025-10-05', time: '11:00', type: 'Especialidad', notes: 'Consulta con cardiólogo.' },
            { id: 3, patient: 'Juan Pérez', date: '2025-09-15', time: '09:30', type: 'Emergencia', notes: 'Dolor abdominal agudo.' },
            { id: 4, patient: 'Maria Gonzales', date: '2025-08-12', time: '16:00', type: 'Consulta General', notes: 'Vacunación.' },
        ];

        if (!localStorage.getItem('patients') || JSON.parse(localStorage.getItem('patients')).length === 0) {
            localStorage.setItem('patients', JSON.stringify(samplePatients));
        }
        if (!localStorage.getItem('appointments') || JSON.parse(localStorage.getItem('appointments')).length === 0) {
            localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
        }
    };

    seedData();

    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const patients = JSON.parse(localStorage.getItem('patients')) || [];

    // --- Update Stat Cards ---
    try {
        const today = new Date().toISOString().split('T')[0];
        const appointmentsToday = appointments.filter(apt => apt.date === today).length;
        const totalPatients = patients.length;
        const pendingAppointments = appointments.filter(apt => new Date(apt.date) >= new Date()).length;

        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 3) {
            statCards[0].querySelector('.card-text').textContent = appointmentsToday;
            statCards[1].querySelector('.card-text').textContent = totalPatients;
            statCards[2].querySelector('.card-text').textContent = pendingAppointments;
        }
    } catch (e) {
        console.error("Error updating stat cards:", e);
    }

    // --- Data Processing for Charts ---
    const monthlyData = {};
    const appointmentTypes = new Set();
    appointments.forEach(apt => {
        try {
            const month = new Date(apt.date).toLocaleString('es-ES', { month: 'long' });
            if (!monthlyData[month]) {
                monthlyData[month] = {};
            }
            if (!monthlyData[month][apt.type]) {
                monthlyData[month][apt.type] = 0;
            }
            monthlyData[month][apt.type]++;
            appointmentTypes.add(apt.type);
        } catch (e) {
            console.error("Error processing appointment data:", apt, e);
        }
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        const monthsOrder = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return monthsOrder.indexOf(a.toLowerCase()) - monthsOrder.indexOf(b.toLowerCase());
    });

    const typeColors = {
        'Consulta General': 'rgba(255, 99, 132, 0.7)',
        'Emergencia': 'rgba(54, 162, 235, 0.7)',
        'Especialidad': 'rgba(255, 206, 86, 0.7)',
        'Seguimiento': 'rgba(75, 192, 192, 0.7)',
    };

    // --- Bar Chart ---
    const barCtx = document.getElementById('barChart')?.getContext('2d');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: sortedMonths,
                datasets: Array.from(appointmentTypes).map(type => ({
                    label: type,
                    data: sortedMonths.map(month => monthlyData[month]?.[type] || 0),
                    backgroundColor: typeColors[type] || 'rgba(153, 102, 255, 0.7)',
                }))
            },
            options: { plugins: { title: { display: true, text: 'Citas por Mes y Tipo' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }
        });
    }

    // --- Pie Chart ---
    const pieCtx = document.getElementById('pieChart')?.getContext('2d');
    if (pieCtx) {
        const pieData = {};
        appointments.forEach(apt => {
            if (!pieData[apt.type]) pieData[apt.type] = 0;
            pieData[apt.type]++;
        });

        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(pieData),
                datasets: [{ data: Object.values(pieData), backgroundColor: Object.keys(pieData).map(type => typeColors[type] || 'rgba(153, 102, 255, 0.7)') }]
            },
            options: { plugins: { title: { display: true, text: 'Distribución de Citas' } } }
        });
    }

    // --- Line Chart ---
    const lineCtx = document.getElementById('lineChart')?.getContext('2d');
    if (lineCtx) {
        const lineData = {};
        sortedMonths.forEach(month => {
            lineData[month] = Object.values(monthlyData[month] || {}).reduce((a, b) => a + b, 0);
        });

        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: sortedMonths,
                datasets: [{ label: 'Total de Citas por Mes', data: Object.values(lineData), fill: false, borderColor: 'rgb(75, 192, 192)', tension: 0.1 }]
            },
            options: { plugins: { title: { display: true, text: 'Tendencia de Citas' } } }
        });
    }

    // Export and Share functionality
    const exportBtn = document.getElementById('exportDashboardBtn');
    const shareBtn = document.getElementById('shareDashboardBtn');
    const dashboardContent = document.querySelector('main.container');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (window.html2canvas && window.jspdf) {
                const { jsPDF } = window.jspdf;
                html2canvas(dashboardContent).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save('dashboard-report.pdf');
                });
            } else {
                console.error('jsPDF or html2canvas not loaded');
            }
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            window.print();
        });
    }
});