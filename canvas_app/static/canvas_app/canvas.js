const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const preview = document.getElementById("preview");
const previewCtx = preview?.getContext("2d");
const colorInput = document.getElementById("color");
const sizeInput = document.getElementById("size");
const textInput = document.getElementById("text");
const fontSizeInput = document.getElementById("font-size");
const fontColorInput = document.getElementById("font-color");
const clearBtn = document.getElementById("clear");
const downloadBtn = document.getElementById("download");
const fillBtn = document.getElementById("fill");
const toolButtons = document.querySelectorAll("[data-tool]");
const statusEl = document.getElementById("status");
const aspectSelect = document.getElementById("aspect");
const textControls = document.getElementById("text-controls");

let drawing = false;
let currentTool = "draw";
let lastPoint = null;
const maxDimension = 1280;

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
  if (textControls) {
    textControls.classList.toggle("is-hidden", tool !== "text");
  }
  if (tool !== "text") {
    clearPreview();
  }
  const verb =
    tool === "draw"
      ? "Drawing"
      : tool === "erase"
      ? "Erasing"
      : tool === "text"
      ? "Text"
      : "Fill";
  setStatus(`${verb} mode active`);
};

const parseRatio = (value) => {
  const [w, h] = value.split(":").map((part) => Number(part));
  return { w, h };
};

const resizeCanvas = (ratioValue) => {
  const { w, h } = parseRatio(ratioValue);
  if (!w || !h) {
    return;
  }
  if (h > w) {
    canvas.height = maxDimension;
    canvas.width = Math.round((maxDimension * w) / h);
  } else {
    canvas.width = maxDimension;
    canvas.height = Math.round((maxDimension * h) / w);
  }
  if (preview) {
    preview.width = canvas.width;
    preview.height = canvas.height;
  }
  clearCanvas();
  setStatus(`Canvas resized to ${w}:${h}`);
};

const startDraw = (event) => {
  drawing = true;
  lastPoint = getPosition(event);
  if (currentTool === "fill") {
    fillCanvas();
    drawing = false;
    return;
  }
  if (currentTool === "text") {
    placeText(lastPoint);
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

const clearPreview = () => {
  if (previewCtx) {
    previewCtx.clearRect(0, 0, preview.width, preview.height);
  }
};

const hasTextContent = () => textInput?.value?.trim().length;

const placeText = (point) => {
  const content = textInput?.value?.trim();
  if (!content) {
    setStatus("Enter text before placing it");
    return;
  }
  const fontSize = Number(fontSizeInput?.value || 32);
  ctx.fillStyle = fontColorInput?.value || "#1a202c";
  ctx.font = `${fontSize}px \"Segoe UI\", system-ui, sans-serif`;
  ctx.textBaseline = "top";
  ctx.fillText(content, point.x, point.y);
  clearPreview();
  setStatus("Text placed");
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

textInput?.addEventListener("input", () => {
  if (!hasTextContent()) {
    clearPreview();
  }
});

fontSizeInput?.addEventListener("input", clearPreview);
fontColorInput?.addEventListener("input", clearPreview);

aspectSelect?.addEventListener("change", (event) => {
  resizeCanvas(event.target.value);
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousemove", (event) => {
  if (currentTool !== "text" || !hasTextContent()) {
    clearPreview();
    return;
  }
  if (!previewCtx) {
    return;
  }
  const point = getPosition(event);
  previewCtx.clearRect(0, 0, preview.width, preview.height);
  const fontSize = Number(fontSizeInput?.value || 32);
  previewCtx.fillStyle = fontColorInput?.value || "#1a202c";
  previewCtx.font = `${fontSize}px \"Segoe UI\", system-ui, sans-serif`;
  previewCtx.textBaseline = "top";
  previewCtx.globalAlpha = 0.6;
  previewCtx.fillText(textInput.value.trim(), point.x, point.y);
  previewCtx.globalAlpha = 1;
});

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
canvas.addEventListener("mouseleave", clearPreview);

clearCanvas();
setTool("draw");
if (aspectSelect) {
  resizeCanvas(aspectSelect.value);
}
