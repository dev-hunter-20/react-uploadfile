import { useEffect, useState } from "react";
import axios from "axios";

export default function ImageList() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get("http://localhost:3000/image");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images", error);
      }
    }

    fetchImages();
  }, []);

  return (
    <div>
      <h2>Image Gallery</h2>
      <div>
        {images.map((image) => (
          <img
            key={image._id}
            src={`http://localhost:3000${image.filePath}`}
            alt="Image"
            width="200"
            style={{ margin: "10px" }}
          />
        ))}
      </div>
    </div>
  );
}
