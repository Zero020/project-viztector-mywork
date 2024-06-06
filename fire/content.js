let receivedData = null;
let chartWindow = null;

window.addEventListener('load', () => {
  loadChartJs().then(() => {
    console.log('Chart.js loaded');
    initializeExtension();
  }).catch(err => {
    console.error('Error loading Chart.js:', err);
  });
});

function loadChartJs() {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.src = chrome.runtime.getURL('chart.js');
    script.onload = () => {
      console.log('Chart.js loaded');
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load Chart.js');
      reject();
    };
    document.head.appendChild(script);
  });
}

function initializeExtension() {
  if (!document.getElementById('fire-extension-button')) {
    let button = document.createElement('div');
    button.id = 'fire-extension-button';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.backgroundColor = 'skyblue';
    button.style.borderRadius = '50%';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      button.style.backgroundColor = 'grey';
      let images = document.getElementsByTagName('img');
      for (let img of images) {
        img.style.border = '2px solid red';
        img.addEventListener('click', (event) => {
          let imageUrl = event.target.src;
          console.log('Image URL:', imageUrl);
          sendImageUrl(imageUrl);
          let rect = event.target.getBoundingClientRect();
          console.log('Image position and size:', rect);
          fetch(chrome.runtime.getURL('test.json'))
            .then(response => response.json())
            .then(data => {
              handleServerData(data);
              openChartWindow(rect);
              createPopup();
            })
            .catch(error => console.error('Error fetching test.json:', error));
        });
      }
    });
  }
}

function sendImageUrl(url) {
  console.log('Simulating WebSocket connection');
  let data = { imageUrl: url };
  console.log('Sent data:', JSON.stringify(data));
  fetch(chrome.runtime.getURL('test.json'))
    .then(response => response.json())
    .then(data => {
      handleServerData(data);
    })
    .catch(error => console.error('Error fetching test.json:', error));
}

function handleServerData(data) {
  receivedData = data;
  console.log('Data from server:', receivedData);
}

function openChartWindow(rect) {
  if (!receivedData) {
    console.error('No data available to display the chart');
    return;
  }

  const width = rect.width;
  const height = rect.height;
  const left = rect.right + window.screenX;
  const top = rect.top + window.screenY;

  chartWindow = window.open('', '_blank', `width=${width},height=${height},left=${left},top=${top}`);
  if (chartWindow) {
    chartWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chart Example</title>
        <script src="${chrome.runtime.getURL('chart.js')}"></script>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #chart-container {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="chart-container">
          <canvas id="chart-canvas"></canvas>
        </div>
        <script>
          document.addEventListener('DOMContentLoaded', function () {
            const ctx = document.getElementById('chart-canvas').getContext('2d');
            const data = ${JSON.stringify(receivedData)};
            window.chart = new Chart(ctx, {
              type: data.type,
              data: {
                labels: data.labels,
                datasets: [{
                  label: '# of Votes',
                  data: data.values,
                  backgroundColor: data.colors,
                  borderColor: data.colors.map(color => color.replace('0.2', '1')),
                  borderWidth: 1
                }]
              },
              options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
          });
        </script>
      </body>
      </html>
    `);
    chartWindow.document.close(); // 새 창의 문서 스트림을 닫습니다.
  } else {
    console.error('Failed to open a new window for the chart');
  }
}

function createPopup() {
  let popup = document.createElement('div');
  popup.id = 'chart-popup';
  popup.style.position = 'fixed';
  popup.style.top = '10px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.backgroundColor = 'white';
  popup.style.padding = '10px';
  popup.style.border = '1px solid black';
  popup.style.zIndex = '1001';
  popup.style.display = 'flex';
  popup.style.flexDirection = 'column';
  popup.style.alignItems = 'center';
  popup.innerHTML = `
    <label for="gridToggle">Show Grid:</label>
    <input type="checkbox" id="gridToggle">

    <label for="sizeSlider">Chart Size: <span id="sizeValue">50%</span></label>
    <input type="range" id="sizeSlider" min="10" max="200" value="50">

    <button id="detailButton">Detail</button>
    <button id="downloadButton">Download</button>
    <button id="shareButton">Share</button>
    <button id="feedbackButton">User Feedback</button>
    <button id="resetButton">Reset</button>
  `;

  document.body.appendChild(popup);

  document.getElementById('gridToggle').addEventListener('change', function() {
    chartWindow.chart.options.scales.x.grid.display = this.checked;
    chartWindow.chart.options.scales.y.grid.display = this.checked;
    chartWindow.chart.update();
  });

  document.getElementById('sizeSlider').addEventListener('input', function() {
    let size = this.value;
    document.getElementById('sizeValue').innerText = `${size}%`;
    chartWindow.document.getElementById('chart-container').style.width = `${size}%`;
    chartWindow.document.getElementById('chart-container').style.height = `${size}%`;
    chartWindow.chart.resize();
  });

  document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('gridToggle').checked = false;
    document.getElementById('sizeSlider').value = 50;
    document.getElementById('sizeValue').innerText = '50%';
    chartWindow.chart.options.scales.x.grid.display = false;
    chartWindow.chart.options.scales.y.grid.display = false;
    chartWindow.document.getElementById('chart-container').style.width = '90%';
    chartWindow.document.getElementById('chart-container').style.height = '90%';
    chartWindow.chart.resize();
  });

  // 나머지 버튼들은 일단 생성만 하고 기능 추가 필요
  document.getElementById('detailButton').addEventListener('click', function() {
    alert('Detail button clicked');
  });

  document.getElementById('downloadButton').addEventListener('click', function() {
    alert('Download button clicked');
  });

  document.getElementById('shareButton').addEventListener('click', function() {
    alert('Share button clicked');
  });

  document.getElementById('feedbackButton').addEventListener('click', function() {
    alert('User Feedback button clicked');
  });
}
