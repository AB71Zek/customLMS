'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Footer from './Components/Footer';
import HamburgerMenu from './Components/hamburgerMenu';

export default function Home() {
  const [tabs, setTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [tabContents, setTabContents] = useState<{ [key: number]: string }>({});
  const [outputCode, setOutputCode] = useState<string>('');

  const addTab = () => {
    if (tabs.length < 15) {
      const newTabIndex = tabs.length;
      const newTabName = `Tab ${newTabIndex + 1}`;
      setTabs([...tabs, newTabName]);
      setTabContents({ ...tabContents, [newTabIndex]: '' });
      setActiveTab(newTabIndex);
    }
  };

  const removeTab = (index: number) => {
    const newTabs = tabs.filter((_, i) => i !== index);
    const newTabContents = { ...tabContents };
    delete newTabContents[index];
    
    // Adjust indices for remaining tabs
    const adjustedTabContents: { [key: number]: string } = {};
    Object.keys(newTabContents).forEach((key, newIndex) => {
      adjustedTabContents[newIndex] = newTabContents[parseInt(key)];
    });
    
    setTabs(newTabs);
    setTabContents(adjustedTabContents);
    
    if (activeTab === index) {
      setActiveTab(newTabs.length > 0 ? 0 : null);
    } else if (activeTab !== null && activeTab > index) {
      setActiveTab(activeTab - 1);
    }
  };

  const updateTabContent = (index: number, content: string) => {
    setTabContents({ ...tabContents, [index]: content });
  };

  const generateOutput = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello.html</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f0f0f0;">
    <div style="text-align: center; padding: 50px;">
        <h1 style="color: #333; font-size: 48px; margin-bottom: 20px;">Hello</h1>
        <p style="color: #666; font-size: 24px;">Welcome to the LMS Output!</p>
    </div>
    <script>
        console.log("Hello from the LMS!");
        document.addEventListener('DOMContentLoaded', function() {
            alert('Hello.html loaded successfully!');
        });
    </script>
</body>
</html>`;
    
    setOutputCode(htmlContent);
    
    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Hello.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", marginBottom: "100px" }}>
      {/* Top Bar - Student Number, Title, Toggle Button, Hamburger Menu */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        padding: "15px 20px",
        zIndex: 1001,
        borderBottom: "2px solid #007bff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Left - Student Number */}
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "8px 15px",
          borderRadius: "20px",
          border: "2px solid #007bff"
        }}>
          <span style={{
            color: "#007bff",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            Student No: 21406232
          </span>
        </div>

        {/* Center - MOODLE LMS Title */}
        <div>
          <h1 style={{
            color: "#007bff",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            margin: 0
          }}>
            MOODLE LMS
          </h1>
        </div>

        {/* Right - Light/Dark Mode Toggle Button + Hamburger Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button 
            className="btn btn-outline-primary"
            style={{
              borderColor: "#007bff",
              color: "#007bff",
              padding: "10px 20px",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            🌙 Dark Mode
          </button>
          <HamburgerMenu />
        </div>
      </div>

      {/* Main Content - 3 Sections */}
      <div style={{ marginTop: "80px", padding: "20px" }}>
        <div className="row" style={{ minHeight: "70vh" }}>
          
          {/* Left Section - Tabs */}
          <div className="col-md-3">
            <div style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: "20px",
              borderRadius: "10px",
              border: "2px solid #007bff",
              height: "100%"
            }}>
              <h3 style={{ color: "#007bff", marginBottom: "20px", textAlign: "center" }}>Tabs</h3>
              
              {/* Add Tab Button */}
              <button 
                className="btn btn-success w-100 mb-3"
                onClick={addTab}
                disabled={tabs.length >= 15}
                style={{ marginBottom: "15px" }}
              >
                + Add Tab ({tabs.length}/15)
              </button>

              {/* Tab List */}
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {tabs.map((tab, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "8px",
                    backgroundColor: activeTab === index ? "#007bff" : "rgba(255, 255, 255, 0.1)",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }} onClick={() => setActiveTab(index)}>
                    <span style={{ 
                      color: activeTab === index ? "white" : "#007bff",
                      flex: 1,
                      fontSize: "14px"
                    }}>
                      {tab}
                    </span>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(index);
                      }}
                      style={{ padding: "2px 6px", fontSize: "10px" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section - Tabs Content */}
          <div className="col-md-5">
            <div style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: "20px",
              borderRadius: "10px",
              border: "2px solid #007bff",
              height: "100%"
            }}>
              <h3 style={{ color: "#007bff", marginBottom: "20px", textAlign: "center" }}>Tabs Content</h3>
              
              {activeTab !== null ? (
                <div>
                  <h5 style={{ color: "white", marginBottom: "15px" }}>
                    {tabs[activeTab]}
                  </h5>
                  <textarea
                    className="form-control"
                    value={tabContents[activeTab] || ''}
                    onChange={(e) => updateTabContent(activeTab, e.target.value)}
                    placeholder="Write your content here..."
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid #007bff",
                      color: "white",
                      minHeight: "300px",
                      resize: "vertical"
                    }}
                  />
                </div>
              ) : (
                <div style={{ 
                  color: "#666", 
                  textAlign: "center", 
                  padding: "50px 20px",
                  fontSize: "16px"
                }}>
                  Select a tab to start writing content
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Output */}
          <div className="col-md-4">
            <div style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: "20px",
              borderRadius: "10px",
              border: "2px solid #007bff",
              height: "100%"
            }}>
              <h3 style={{ color: "#007bff", marginBottom: "20px", textAlign: "center" }}>Output</h3>
              
              {/* Generate Output Button */}
              <button 
                className="btn btn-primary w-100 mb-3"
                onClick={generateOutput}
                style={{ marginBottom: "15px" }}
              >
                Generate Hello.html
              </button>

              {/* Output Code Display */}
              <div style={{
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                border: "1px solid #007bff",
                borderRadius: "5px",
                padding: "15px",
                maxHeight: "400px",
                overflowY: "auto"
              }}>
                <pre style={{
                  color: "#00ff00",
                  fontSize: "12px",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word"
                }}>
                  {outputCode || "Click 'Generate Hello.html' to see the output code"}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
} 