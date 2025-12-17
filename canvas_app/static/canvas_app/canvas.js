const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorInput = document.getElementById("color");
const sizeInput = document.getElementById("size");
const clearBtn = document.getElementById("clear");
const downloadBtn = document.getElementById("download");
const fillBtn = document.getElementById("fill");
const toolButtons = document.querySelectorAll("[data-tool]");
const statusEl = document.getElementById("status");

let drawing = false;
let currentTool = "draw";
let lastPoint = null;

const setStatus = (message) => {
  if (statusEl) {
    statusEl.textContent = message;
  }
};

const setTool = (tool) => {
  currentTool = tool;
  toolButtons.forEach((btn) => {
    btn.disabled = btn.dataset.tool === tool;
  });
  const verb = tool === "draw" ? "Drawing" : tool === "erase" ? "Erasing" : "Fill";
  setStatus(`${verb} mode active`);
};

const startDraw = (event) => {
  drawing = true;
  lastPoint = getPosition(event);
  if (currentTool === "fill") {
    fillCanvas();
    drawing = false;
    return;
  }
  draw(event);
};

const stopDraw = () => {
  drawing = false;
  lastPoint = null;
};

const draw = (event) => {
  if (!drawing || currentTool === "fill") return;
  const { x, y } = getPosition(event);
  ctx.strokeStyle = currentTool === "erase" ? "#ffffff" : colorInput.value;
  ctx.lineWidth = sizeInput.value;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(x, y);
  ctx.stroke();
  lastPoint = { x, y };
};

const getPosition = (event) => {
  const rect = canvas.getBoundingClientRect();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

const fillCanvas = () => {
  ctx.fillStyle = colorInput.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const downloadCanvas = () => {
  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "canvas.png";
  link.href = url;
  link.click();
};

clearBtn?.addEventListener("click", () => {
  clearCanvas();
  setStatus("Canvas cleared");
});

downloadBtn?.addEventListener("click", () => {
  downloadCanvas();
  setStatus("Image downloaded");
});

fillBtn?.addEventListener("click", () => {
  setTool("fill");
});

toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTool(button.dataset.tool);
  });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", (event) => {
  event.preventDefault();
  startDraw(event);
});
canvas.addEventListener("touchend", (event) => {
  event.preventDefault();
  stopDraw();
});
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  draw(event);
});

clearCanvas();
setTool("draw");
