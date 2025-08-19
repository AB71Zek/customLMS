'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Footer from './Components/Footer';
import HamburgerMenu from './Components/hamburgerMenu';

// Cookie helpers
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string): string | null {
  const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return matches ? decodeURIComponent(matches[1]) : null;
}

export default function Home() {
  const [tabs, setTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [tabContents, setTabContents] = useState<{ [key: number]: string }>({});
  const [outputCode, setOutputCode] = useState<string>('');
  const [editingTab, setEditingTab] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Load tabs and content from localStorage on component mount
  useEffect(() => {
    const savedTabs = localStorage.getItem('lms-tabs');
    const savedContents = localStorage.getItem('lms-tab-contents');
    const savedActiveTabLocal = localStorage.getItem('lms-active-tab');
    const savedActiveTabCookie = getCookie('lms-active-tab');
    
    if (savedTabs) {
      setTabs(JSON.parse(savedTabs));
    }
    if (savedContents) {
      setTabContents(JSON.parse(savedContents));
    }

    // Prefer cookie if present, else fallback to localStorage
    if (savedActiveTabCookie !== null) {
      const parsed = parseInt(savedActiveTabCookie);
      if (!Number.isNaN(parsed)) setActiveTab(parsed);
    } else if (savedActiveTabLocal !== null) {
      const parsed = parseInt(savedActiveTabLocal);
      if (!Number.isNaN(parsed)) setActiveTab(parsed);
    }
  }, []);

  // Save tabs and content to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lms-tabs', JSON.stringify(tabs));
    localStorage.setItem('lms-tab-contents', JSON.stringify(tabContents));
    if (activeTab !== null) {
      const value = activeTab.toString();
      localStorage.setItem('lms-active-tab', value);
      setCookie('lms-active-tab', value, 365);
    }
  }, [tabs, tabContents, activeTab]);

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

  const startEditingTab = (index: number) => {
    setEditingTab(index);
    setEditingName(tabs[index]);
  };

  const saveTabName = (index: number) => {
    if (editingName.trim()) {
      const newTabs = [...tabs];
      newTabs[index] = editingName.trim();
      setTabs(newTabs);
    }
    setEditingTab(null);
    setEditingName('');
  };

  const cancelEditingTab = () => {
    setEditingTab(null);
    setEditingName('');
  };

  const handleTabNameKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      saveTabName(index);
    } else if (e.key === 'Escape') {
      cancelEditingTab();
    }
  };

  const generateOutput = () => {
    if (activeTab === null) return;
    
    const content = tabContents[activeTab] || '';
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello.html</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
        }
        h1 {
            color: #333;
            font-size: 48px;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .content {
            color: #666;
            font-size: 18px;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        .footer {
            color: #999;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello</h1>
        <div class="content">
            ${content.split('\n').filter(line => line.trim()).map(line => 
              `<p style="margin-bottom: 15px;">${line}</p>`
            ).join('')}
        </div>
        <div class="footer">
            Generated from LMS Tab Content
        </div>
    </div>
    
    <script>
        console.log("Hello.html loaded successfully!");
        console.log("Content from tab: ${tabs[activeTab]}");
        
        document.addEventListener('DOMContentLoaded', function() {
            // Add a subtle animation
            const container = document.querySelector('.container');
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.5s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
            
            // Add click effect
            document.addEventListener('click', function() {
                container.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    container.style.transform = 'scale(1)';
                }, 150);
            });
        });
    </script>
</body>
</html>`;
    
    setOutputCode(htmlContent);
  };

  const copyToClipboard = async () => {
    if (outputCode) {
      try {
        await navigator.clipboard.writeText(outputCode);
        // You could add a toast notification here
        alert('Code copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = outputCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Code copied to clipboard!');
      }
    }
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
              <small style={{ color: "#666", display: "block", textAlign: "center", marginBottom: "15px" }}>
                Double-click tab names to edit them
              </small>
              
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
                  }} onClick={() => setActiveTab(index)} onDoubleClick={() => startEditingTab(index)}>
                    <span style={{ 
                      color: activeTab === index ? "white" : "#007bff",
                      flex: 1,
                      fontSize: "14px"
                    }}>
                      {editingTab === index ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => saveTabName(index)}
                          onKeyPress={(e) => handleTabNameKeyPress(e, index)}
                          autoFocus
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: activeTab === index ? "white" : "#007bff",
                            fontSize: "14px",
                            fontWeight: "bold",
                            width: "100%",
                            outline: "none"
                          }}
                        />
                      ) : (
                        tab
                      )}
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
                disabled={activeTab === null}
                style={{ marginBottom: "15px" }}
              >
                Generate Code from Tab Content
              </button>

              {/* Copy Code Button */}
              <button 
                className="btn btn-success w-100 mb-3"
                onClick={copyToClipboard}
                disabled={!outputCode}
                style={{ marginBottom: "15px" }}
              >
                📋 Copy Code to Clipboard
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
                  {outputCode || "Click 'Generate Code from Tab Content' to create a complete Hello.html file that you can copy and paste into a blank file"}
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