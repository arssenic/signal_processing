// Generate time array
const t = Array.from({length: 1000}, (_, i) => i * 0.01);

// Generate original signals
const signal1 = t.map(ti => Math.sin(2 * Math.PI * 0.5 * ti));
const signal2 = t.map(ti => Math.cos(2 * Math.PI * 0.3 * ti));

// Create charts
const originalSignalsChart = new Chart(document.getElementById('originalSignalsChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: t,
        datasets: [{
            label: 'Signal 1',
            data: signal1,
            borderColor: 'blue',
            fill: false
        }, {
            label: 'Signal 2',
            data: signal2,
            borderColor: 'red',
            fill: false
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Original Signals'
            },
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                },
                ticks: {
                    callback: function(value, index, values) {
                        return Math.round(value * 10) / 10;
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amplitude'
                },
                ticks: {
                    callback: function(value, index, values) {
                        return Math.round(value * 10) / 10;
                    }
                }
            }
        }
    }
});

const resultChart = new Chart(document.getElementById('resultChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: t,
        datasets: [{
            label: 'Result',
            data: signal1,
            borderColor: 'green',
            fill: false
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Result of Operation'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                },
                ticks: {
                    callback: function(value, index, values) {
                        return Math.round(value * 10) / 10;
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amplitude'
                },
                ticks: {
                    callback: function(value, index, values) {
                        return Math.round(value * 10) / 10;
                    }
                }
            }
        }
    }
});

// Get DOM elements
const amplitudeSlider = document.getElementById('amplitudeSlider');
const frequencySlider = document.getElementById('frequencySlider');
const phaseSlider = document.getElementById('phaseSlider');
const amplitudeValue = document.getElementById('amplitudeValue');
const frequencyValue = document.getElementById('frequencyValue');
const phaseValue = document.getElementById('phaseValue');
const operationRadios = document.getElementsByName('operation');
const showSignal1 = document.getElementById('showSignal1');
const showSignal2 = document.getElementById('showSignal2');
const selectSignal1 = document.getElementById('selectSignal1');
const selectSignal2 = document.getElementById('selectSignal2');

// Update function
function update() {
    const operation = document.querySelector('input[name="operation"]:checked').id;
    const amp = parseFloat(amplitudeSlider.value);
    const freq = parseFloat(frequencySlider.value);
    const phase = parseFloat(phaseSlider.value);
    const selectedSignal = selectSignal1.checked ? signal1 : signal2;

    let result;
    switch (operation) {
        case 'original':
            result = selectedSignal.map(s => amp * s);
            break;
        case 'add':
            result = selectedSignal.map((s, i) => amp * (s + (selectSignal1.checked ? signal2[i] : signal1[i])));
            break;
        case 'multiply':
            result = selectedSignal.map((s, i) => amp * s * (selectSignal1.checked ? signal2[i] : signal1[i]));
            break;
        case 'timeShift':
            result = t.map((ti, i) => amp * selectedSignal[Math.floor((ti - phase + 10) % 10 * 100)]);
            break;
        case 'timeScale':
            result = t.map((ti) => {
                const scaledIndex = Math.floor(freq * ti * 100);
                return scaledIndex < selectedSignal.length ? amp * selectedSignal[scaledIndex] : 0;
            });
            break;
    }

    resultChart.data.datasets[0].data = result;
    resultChart.options.plugins.title.text = `Result of ${operation.charAt(0).toUpperCase() + operation.slice(1)} Operation on ${selectSignal1.checked ? 'Signal 1' : 'Signal 2'}`;
    resultChart.update();

    amplitudeValue.textContent = amp.toFixed(1);
    frequencyValue.textContent = freq.toFixed(1);
    phaseValue.textContent = phase.toFixed(2);

    // Update original signals visibility
    originalSignalsChart.data.datasets[0].hidden = !showSignal1.checked;
    originalSignalsChart.data.datasets[1].hidden = !showSignal2.checked;
    originalSignalsChart.update();
}

// Add event listeners
amplitudeSlider.addEventListener('input', update);
frequencySlider.addEventListener('input', update);
phaseSlider.addEventListener('input', update);
operationRadios.forEach(radio => radio.addEventListener('change', update));
showSignal1.addEventListener('change', update);
showSignal2.addEventListener('change', update);
selectSignal1.addEventListener('change', update);
selectSignal2.addEventListener('change', update);

// Initial update
update();