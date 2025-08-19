import { useState } from "react";
import { apiGet, apiPost } from "../utils/ApiRequest";

/**
 * DreamWeaver component for generating images from text prompts.
 */
const DreamWeaver = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [resourceId, setResourceId] = useState(null);
  const [progress, setProgress] = useState(0);

  const pollJob = async (jobId, extra = false) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const status = await apiGet(`/imagegeneration/status/${jobId}`);
          setProgress(Math.round(status.progress || 0));

          if (status.status === "finished") {
            clearInterval(interval);

            const result = await apiGet(`/imagegeneration/result/${jobId}`);
            if (extra) {
              console.log("w");
              const img = await apiGet(`/imagegeneration/status/${jobId}`);
              setImageUrl(img.image_url);
            }
            setResourceId(result.resource_id);
            setLoading(false);
            resolve();
          }
        } catch (e) {
          clearInterval(interval);
          setLoading(false);
          reject(e);
        }
      }, 1000); // опрашиваем каждые 1 секунду
    });
  };

  const generateImage = async () => {
    setLoading(true);
    setImageUrl(null);
    setProgress(0);
    setResourceId(null);

    try {
      const res = await apiPost("/imagegeneration/generate", {
        text_prompt: prompt,
      });
      const jobId = res.job_id;
      await pollJob(jobId);
    } catch (e) {
      console.error("Generation error:", e);
      setLoading(false);
    }
  };

  const handleAction = async (endpoint) => {
    if (!resourceId) return;
    setLoading(true);
    setProgress(0);
    try {
      const res = await apiPost(endpoint, { resource_id: resourceId });
      const jobId = res.job_id;
      await pollJob(jobId, true);
    } catch (e) {
      console.error("Action failed:", e);
      setLoading(false);
    }
  };

  const saveImageHandler = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated_image.png"; //  <-- без () !
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="d-flex flex-column" style={{ gap: 8 }}>
      <h2>Generate Image</h2>

      <input
        type="text"
        placeholder="Enter text prompt"
        className="form-control"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />

      <button
        className="btn btn-primary"
        onClick={generateImage}
        disabled={!prompt || loading}
      >
        Generate
      </button>

      {loading && <p>Loading... (progress: {progress}%)</p>}

      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt="Generated result"
            style={{ width: "100%", maxWidth: 400 }}
          />

          <div className="mt-2 d-flex flex-wrap" style={{ gap: 6 }}>
            <button className="btn btn-success" onClick={saveImageHandler}>
              Save
            </button>
            <button
              className="btn btn-dark"
              onClick={() => handleAction("/imagegeneration/upscale")}
              disabled={loading}
            >
              Upscale ×2
            </button>
            <button
              className="btn btn-dark"
              onClick={() => handleAction("/imagegeneration/zoom/in")}
              disabled={loading}
            >
              Zoom In
            </button>
            <button
              className="btn btn-dark"
              onClick={() => handleAction("/imagegeneration/zoom/out")}
              disabled={loading}
            >
              Zoom Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DreamWeaver;
