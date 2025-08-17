import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

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

  // ✅ GeeksforGeeks links
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
      const apiKey = "AIzaSyD9qkDA6KbN9CLI3m63spJ49SNozyITouQ"; // 🔑 Replace with real key
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

  // --- Dashboard-like Styles ---
  const pageContainerStyles = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#F0F4F8",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  };
  const mainContentStyles = {
    flexGrow: 1,
    padding: "30px",
    color: "#2C3E50",
    height: "100vh",
    overflowY: "auto",
  };
  const cardStyles = {
    backgroundColor: "#FFFFFF",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #E0E0E0",
    marginBottom: "25px",
  };
  const inputStyles = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E0E0E0",
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "#2C3E50",
    fontSize: "1rem",
  };
  const buttonStyles = {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4FC3F7",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "500",
    marginRight: "10px",
  };

  return (
    <div style={pageContainerStyles}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={mainContentStyles}>
        <h2 style={{ color: "#2C3E50", fontSize: "2rem" }}>
          📚 Study Resources
        </h2>

        {/* 🔍 Search Section */}
        <div style={cardStyles}>
          <input
            type="text"
            placeholder="Search a subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyles}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />

          {/* Dropdown suggestions */}
          {showSuggestions && (
            <ul
              style={{
                marginTop: "10px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                maxHeight: "200px",
                overflowY: "auto",
                listStyle: "none",
                padding: 0,
              }}
            >
              {filteredTopics.length === 0 ? (
                <li style={{ padding: "10px", color: "#607D8B" }}>
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
                      cursor: "pointer",
                      color: "#2C3E50",
                      borderBottom: "1px solid #E0E0E0",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#F0F4F8")
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
          <div style={cardStyles}>
            <h3 style={{ margin: "0 0 15px 0", color: "#2C3E50" }}>
              Selected Subject: {selectedTopic}
            </h3>
            <button
              onClick={() => {
                setResourceType("Videos");
                fetchVideos(selectedTopic);
              }}
              style={buttonStyles}
            >
              🎥 Videos
            </button>
            <button
              onClick={() => {
                setResourceType("Articles");
                setVideos([]);
              }}
              style={buttonStyles}
            >
              📖 Articles
            </button>
          </div>
        )}

        {/* 🎥 Videos Section */}
        {resourceType === "Videos" && (
          <div style={cardStyles}>
            <h3 style={{ color: "#2C3E50" }}>Videos for {selectedTopic}</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {videos.map((video) => (
                <div
                  key={video.id.videoId}
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #E0E0E0",
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
                  <p style={{ marginTop: "10px", color: "#2C3E50" }}>
                    {video.snippet.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📖 Articles Section */}
        {resourceType === "Articles" && (
          <div style={cardStyles}>
            <h3 style={{ color: "#2C3E50" }}>Articles for {selectedTopic}</h3>
            <p style={{ marginTop: "10px" }}>
              <a
                href={gfgLinks[selectedTopic]}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4FC3F7", fontWeight: "500" }}
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
