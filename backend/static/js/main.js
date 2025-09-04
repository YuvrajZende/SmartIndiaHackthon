// /static/js/main.js
document.addEventListener('DOMContentLoaded', function() {

    const analysisForm = document.getElementById('analysis-form');
    const predictionForm = document.getElementById('prediction-form');
    const chatForm = document.getElementById('chat-form');
    
    const loader = document.getElementById('loader');
    const statusMessage = document.getElementById('status-message');
    const resultsContainer = document.getElementById('results-container');
    
    let currentRegionKey = null;

    // --- Main Analysis Handler ---
    analysisForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const regionSelect = document.getElementById('region-select');
        currentRegionKey = regionSelect.value;
        if (!currentRegionKey) {
            alert('Please select a region.');
            return;
        }

        // Reset UI
        resultsContainer.style.display = 'none';
        loader.style.display = 'block';
        statusMessage.textContent = `Fetching data and training models for ${regionSelect.options[regionSelect.selectedIndex].text}... This may take a few minutes.`;

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region_key: currentRegionKey })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed.');
            }

            const data = await response.json();
            displayResults(data);
            statusMessage.textContent = 'Analysis complete!';

        } catch (error) {
            statusMessage.textContent = `Error: ${error.message}`;
            console.error('Analysis error:', error);
        } finally {
            loader.style.display = 'none';
        }
    });

    // --- Prediction Handler ---
    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        data.region_key = currentRegionKey;
        const resultBox = document.getElementById('prediction-result');
        resultBox.textContent = 'Predicting...';

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);
            
            resultBox.textContent = JSON.stringify(result, null, 2);

        } catch (error) {
            resultBox.textContent = `Error: ${error.message}`;
        }
    });

    // --- Chat Handler ---
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const chatInput = document.getElementById('chat-input');
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addChatMessage('You', userMessage);
        chatInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, region_key: currentRegionKey })
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);
            
            addChatMessage('OceanGPT', result.response);

        } catch (error) {
            addChatMessage('System', `Error: ${error.message}`);
        }
    });

    // --- UI Update Functions ---
    function displayResults(data) {
        // Display summary
        const summaryContent = document.getElementById('summary-content');
        summaryContent.innerHTML = Object.entries(data.summary)
            .map(([key, value]) => `<p><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</p>`)
            .join('');

        // Display model metrics
        const metricsContent = document.getElementById('metrics-content');
        metricsContent.innerHTML = Object.entries(data.model_metrics)
            .map(([param, metrics]) => `<p><strong>${param}:</strong> ${metrics.r2} (${metrics.model_type})</p>`)
            .join('');

        // Render plots
        renderPlot('plot-geo-map', data.visualizations.geo_map);
        renderPlot('plot-depth-profile', data.visualizations.depth_profile);
        renderPlot('plot-time-series', data.visualizations.time_series);
        renderPlot('plot-scatter-3d', data.visualizations.scatter_3d);

        resultsContainer.style.display = 'block';
    }

    function renderPlot(elementId, plotJson) {
        const container = document.getElementById(elementId);
        container.innerHTML = ''; // Clear previous plot
        if (plotJson) {
            try {
                // The plotJson from flask is a string, it needs to be parsed
                const plotData = JSON.parse(plotJson); 
                Plotly.newPlot(elementId, plotData.data, plotData.layout);
            } catch (e) {
                console.error(`Failed to parse or render plot for ${elementId}`, e);
                container.textContent = 'Error rendering plot. Check console for details.';
            }
        } else {
            container.textContent = 'Visualization not available for this data.';
        }
    }
    
    
    function addChatMessage(sender, message) {
        const chatBox = document.getElementById('chat-box');
        const msgElement = document.createElement('p');
        msgElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(msgElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    }
});