import React, { useRef, useState } from "react";
import { apiPost } from "../utils/ApiRequest";

const MindReader = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recognized, setRecognized] = useState([]);
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setRecognized([]);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");
    setRecognized([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Example: {objects: [{x,y,width,height,label}, ...]}
      const result = await apiPost("/mindreader/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRecognized(result.objects);
      setMessage(`Recognized ${result.objects.length} objects`);
    } catch (e) {
      setMessage("Error recognizing objects.");
      setRecognized([]);
    } finally {
      setLoading(false);
    }
  };

  // draw rectangles when recognized objects change
  React.useEffect(() => {
    if (!imagePreview || recognized.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imagePreview;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.font = "16px Arial";
      ctx.fillStyle = "red";

      recognized.forEach((obj) => {
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        ctx.fillText(obj.label, obj.x + 4, obj.y + 18);
      });
    };
  }, [recognized, imagePreview]);

  return (
    <div>
      <h1>MindReader</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      <br />

      <button
        className="btn btn-primary mt-2"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        Upload
      </button>

      {loading && <p>Loading...</p>}

      {message && <p>{message}</p>}

      {imagePreview && (
        <canvas
          ref={canvasRef}
          style={{ maxWidth: "100%", border: "1px solid #ddd" }}
        />
      )}
    </div>
  );
};

export default MindReader;
