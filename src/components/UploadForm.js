import { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filePath, setFilePath] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://localhost:3000/uploads",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", response);

        const uploadedFilePath = response.data.filePath;
        if (!uploadedFilePath) {
          throw new Error("File path not returned from upload API.");
        }

        setFilePath(uploadedFilePath);
      } catch (error) {
        console.error("Error uploading file", error);
        alert("Failed to upload image");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!filePath) {
      alert("No file path available. Please upload a file first.");
      return;
    }

    try {
      const saveResponse = await axios.post("http://localhost:3000/image", {
        imagePath: filePath,
      });

      console.log("Save response:", saveResponse);

      if (saveResponse.status === 201) {
        alert("Image uploaded and path saved successfully");
      } else {
        alert("Failed to save image path");
      }
    } catch (error) {
      console.error("Error saving file path", error);
      alert("Failed to save image path");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Selected Preview" width="200" />}
      <button type="submit">Upload</button>
    </form>
  );
}
