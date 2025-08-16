import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // ✅ actually use Sidebar

const StudyResources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [videos, setVideos] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ Predefined subjects
  const subjects = [
    "HTML",
    "CSS",
    "JavaScript",
    "ReactJS",
    "DBMS",
    "Data Structures",
    "Python",
    "MongoDB",
    "Java",
  ];

  // ✅ GeeksforGeeks links for subjects
  const gfgLinks = {
    HTML: "https://www.geeksforgeeks.org/html-tutorials/",
    CSS: "https://www.geeksforgeeks.org/css-tutorials/",
    JavaScript: "https://www.geeksforgeeks.org/javascript/",
    ReactJS: "https://www.geeksforgeeks.org/reactjs-tutorials/",
    DBMS: "https://www.geeksforgeeks.org/dbms/",
    "Data Structures": "https://www.geeksforgeeks.org/data-structures/",
    Python: "https://www.geeksforgeeks.org/python-programming-language/",
    MongoDB: "https://www.geeksforgeeks.org/mongodb/",
    Java: "https://www.geeksforgeeks.org/java/",
  };

  // ✅ Filter suggestions
  const filteredTopics = subjects.filter((topic) =>
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Fetch YouTube videos
  const fetchVideos = async (topic) => {
    try {
      const apiKey = "AIzaSyD9qkDA6KbN9CLI3m63spJ49SNozyITouQ"; // 🔑 replace with your YouTube Data API v3 key
      const query = `${topic} tutorials`;
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 30,
            key: apiKey,
          },
        }
      );
      setVideos(res.data.items);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0A192F",
      }}
    >
      {/* ✅ Sidebar on the left */}
      <Sidebar />

      {/* ✅ Main content on the right */}
      <div style={{ flex: 1, padding: "20px", color: "#E6F1FF" }}>
        <h2 style={{ color: "#64FFDA" }}>📚 Study Resources</h2>

        {/* 🔍 Search bar */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search a subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #64FFDA",
              width: "100%",
              backgroundColor: "#112240",
              color: "#E6F1FF",
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />

          {/* Dropdown suggestions */}
          {showSuggestions && (
            <ul
              style={{
                position: "absolute",
                top: "45px",
                left: 0,
                right: 0,
                backgroundColor: "#112240",
                border: "1px solid #64FFDA",
                borderRadius: "6px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {filteredTopics.length === 0 ? (
                <li
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #233554",
                    color: "#8892b0",
                  }}
                >
                  No subject found
                </li>
              ) : (
                filteredTopics.map((topic) => (
                  <li
                    key={topic}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setSearchTerm(topic);
                      setShowSuggestions(false);
                      setResourceType("");
                      setVideos([]);
                    }}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #233554",
                      cursor: "pointer",
                      color: "#E6F1FF",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#233554")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {topic}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* ✅ Selected subject */}
        {selectedTopic && (
          <h3 style={{ color: "#64FFDA", marginBottom: "20px" }}>
            Selected Subject: {selectedTopic}
          </h3>
        )}

        {/* ✅ Resource Type buttons */}
        {selectedTopic && (
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => {
                setResourceType("Videos");
                fetchVideos(selectedTopic);
              }}
              style={{
                marginRight: "10px",
                padding: "10px 15px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#64FFDA",
                color: "#0A192F",
                cursor: "pointer",
              }}
            >
              🎥 Videos
            </button>

            <button
              onClick={() => {
                setResourceType("Articles");
                setVideos([]);
              }}
              style={{
                padding: "10px 15px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#64FFDA",
                color: "#0A192F",
                cursor: "pointer",
              }}
            >
              📖 Articles
            </button>
          </div>
        )}

        {/* 🎥 Videos Section */}
        {resourceType === "Videos" && (
          <div>
            <h3 style={{ color: "#64FFDA" }}>Videos for {selectedTopic}</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              {videos.map((video) => (
                <div
                  key={video.id.videoId}
                  style={{
                    backgroundColor: "#112240",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                >
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    title={video.snippet.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  <p style={{ marginTop: "10px", color: "#E6F1FF" }}>
                    {video.snippet.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📖 Articles Section */}
        {resourceType === "Articles" && (
          <div>
            <h3 style={{ color: "#64FFDA" }}>Articles for {selectedTopic}</h3>
            <p style={{ marginTop: "10px" }}>
              <a
                href={gfgLinks[selectedTopic]}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#64FFDA" }}
              >
                Open {selectedTopic} Articles →
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyResources;
