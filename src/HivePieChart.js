import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HivePieChart = ({ honeyLevel }) => {
    const data = {
        labels: ['Honey Level', 'Remaining'],
        datasets: [
            {
                data: [honeyLevel, 100 - honeyLevel],
                backgroundColor: ['#FFCE56', '#E0E0E0'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        maintainAspectRatio: false, // Allows you to set fixed height and width
    };

    return (
        <div style={{ width: '200px', height: '200px' }}> {/* Adjust size here */}
            <Pie data={data} options={options} />
        </div>
    );
};

export default HivePieChart;
