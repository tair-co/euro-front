import { useEffect, useRef, useState } from "react";
import axios from "axios";

/**
 * MindReader component for recognizing objects in images.
 * @returns
 */
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
    formData.append("image", file);

    try {
      const result = await axios.post(
        "http://localhost:3000/api/imagerecognition/recognize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-TOKEN": localStorage.getItem("token") || "",
          },
        }
      );

      setRecognized(result.data.objects);
      setMessage(`Recognized ${result.data.objects.length} objects`);
    } catch (e) {
      setMessage(`Error recognizing objects: ${e.message}`);
      setRecognized([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        ctx.strokeRect(
          obj.bounding_box.x,
          obj.bounding_box.y,
          obj.bounding_box.width,
          obj.bounding_box.height
        );
        ctx.fillText(
          obj.label,
          obj.bounding_box.x + 10,
          obj.bounding_box.y + 28
        );
      });
    };
  }, [recognized, imagePreview]);

  return (
    <>
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

      {message && <p className=" text-danger">{message}</p>}

      {imagePreview && (
        <canvas
          ref={canvasRef}
          style={{ maxWidth: "100%", border: "1px solid #ddd" }}
        />
      )}
    </>
  );
};

export default MindReader;
