// let canvas, ctx;
// createCanvas().then((res) => {
//     canvas = res;
//     console.log('canvas: ', canvas);
//     ctx = canvas.getContext('2d');
// })
// let snapshot
// const API_URL = 'https://extension-services.dgu.io.vn'

// let captureMode = false;
// let startX, startY, endX, endY;
// console.log('Content script executed');

// document.addEventListener('keydown', function (event) {
//     if (event.getModifierState('Shift') && event.key === 'Z') {
//         snapshot = createSnapshot();
//         captureMode = !captureMode;

//         if (captureMode) {
//             console.log('Capture mode activated');
//             activateCaptureMode();
//         } else {
//             console.log('Capture mode deactivated');
//         }
//     }
// });

// // function createCanvas() {
// //     const canvas = document.createElement('canvas');
// //     canvas.id = 'captureCanvas';
// //     canvas.width = 800;
// //     canvas.height = 600;
// //     document.body.appendChild(canvas);
// //     return canvas;
// // }

// async function createCanvas() {
//     const canvas = await html2canvas(document.body);
//     document.body.appendChild(canvas);
//     return canvas;
// }

// function createSnapshot() {
//     const snapshot = document.createElement('div');
//     snapshot.id = 'snapshot';
//     snapshot.style.position = 'absolute';
//     snapshot.style.zIndex = '1';
//     snapshot.style.border = '2px dashed yellow';
//     document.body.appendChild(snapshot);
//     return snapshot;
// }

// function activateCaptureMode() {
//     document.addEventListener('mousedown', startSelection);
// }

// function startSelection(event) {
//     startX = event.clientX;
//     startY = event.clientY;
//     document.addEventListener('mousemove', updateSelection);
// }

// function updateSelection(event) {
//     if (!startX || !startY) {
//         return;
//     }

//     endX = event.clientX;
//     endY = event.clientY;

//     const width = endX - startX;
//     const height = endY - startY;

//     snapshot.style.left = startX + 'px';
//     snapshot.style.top = startY + 'px';
//     snapshot.style.width = width + 'px';
//     snapshot.style.height = height + 'px';
//     document.addEventListener('mouseup', endSelection);
// }

// function endSelection() {
//     console.log('end selection');
//     document.removeEventListener('mousedown', startSelection);
//     document.removeEventListener('mousemove', updateSelection);
//     document.removeEventListener('mouseup', endSelection);

//     captureMode = false;

//     const capturedImageData = ctx.getImageData(startX, startY, endX - startX, endY - startY);

//     const resultCanvas = document.createElement('canvas');
//     resultCanvas.width = endX - startX;
//     resultCanvas.height = endY - startY;
//     const resultCtx = resultCanvas.getContext('2d');
//     resultCtx.putImageData(capturedImageData, 0, 0);

//     const base64Image = resultCanvas.toDataURL();
//     console.log(base64Image);
//     // let result;
//     // handleQuestion(base64Image).then((response) => {
//     //     result = response
//     //     console.log(result);
//     // })
//     snapshot.style.display = 'none';
// }

// async function handleQuestion(base64) {
//     const response = await fetch(`${API_URL}/api/v1/question-answer`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "encoded_image": base64,
//         }),
//     });

//     const data = await response.json();

//     return data;
// }

// (() => {
//     console.log('EXTENSION_______________________________----------------------');
// })();

// Import thư viện html2canvas
// Thêm đoạn mã sau vào đầu file content.js

const API_URL = 'https://extension-services.dgu.io.vn';
let captureMode = false;
let startX, startY, endX, endY;
const snapshot = createSnapshot();

document.addEventListener('keydown', function (event) {
    if (event.getModifierState('Shift') && event.key === 'Z') {
        captureMode = !captureMode;

        if (captureMode) {
            console.log('Capture mode activated');
            activateCaptureMode();
        } else {
            console.log('Capture mode deactivated');
        }
    }
});

function createSnapshot() {
    const snapshot = document.createElement('div');
    snapshot.id = 'snapshot';
    snapshot.style.position = 'absolute';
    snapshot.style.zIndex = '1';
    snapshot.style.border = '2px dashed yellow';
    document.body.appendChild(snapshot);
    return snapshot;
}

async function captureSelectedArea() {
    const canvas = await html2canvas(document.body, {
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
    });
    document.body.appendChild(canvas);
    return canvas;
}

function activateCaptureMode() {
    document.addEventListener('mousedown', startSelection);
}

function startSelection(event) {
    startX = event.clientX;
    startY = event.clientY;
    document.addEventListener('mousemove', updateSelection);
}

function updateSelection(event) {
    if (!startX || !startY) {
        return;
    }

    endX = event.clientX;
    endY = event.clientY;

    const width = endX - startX;
    const height = endY - startY;

    snapshot.style.left = startX + 'px';
    snapshot.style.top = startY + 'px';
    snapshot.style.width = width + 'px';
    snapshot.style.height = height + 'px';
    document.addEventListener('mouseup', endSelection);
}

function endSelection() {
    console.log('end selection');
    captureMode = false;

    document.removeEventListener('mousedown', startSelection);
    document.removeEventListener('mousemove', updateSelection);
    document.removeEventListener('mouseup', endSelection);
    captureSelectedArea().then((capturedCanvas) => {
        const base64Image = capturedCanvas.toDataURL();
        // console.log('bage64Image: ', base64Image);
        const newWindow = window.open();
        newWindow.document.write(`<img src="${base64Image}" style="max-width: 100%; height: auto;">`);
        console.log('%c ', `padding: 50px; line-height: 100px; background: url(${base64Image}) no-repeat; background-size: contain;`);

        // Gửi ảnh đến server để xử lý
        // handleQuestion(base64Image).then((response) => {
        //     console.log(response);
        // });

        // Ẩn vùng chọn
        startX = startY = endX = endY = null;
        captureMode = false;
        snapshot.style.display = 'none';
    });
}

// document.addEventListener('mouseup', () => {
//     if (captureMode) {
//         console.log('Capture mode ended');
//         captureSelectedArea().then((capturedCanvas) => {
//             const base64Image = capturedCanvas.toDataURL();
//             console.log('bage64Image: ', base64Image);

//             // Gửi ảnh đến server để xử lý
//             // handleQuestion(base64Image).then((response) => {
//             //     console.log(response);
//             // });

//             // Ẩn vùng chọn
//             startX = startY = endX = endY = null;
//             captureMode = false;
//         });
//     }
// });

// async function handleQuestion(base64) {
//     const response = await fetch(`${API_URL}/api/v1/question-answer`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             encoded_image: base64,
//         }),
//     });

//     const data = await response.json();
//     return data;
// }

(() => {
    console.log('EXTENSION_______________________________----------------------');
})();
