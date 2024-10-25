import React, { useState, useRef, useEffect } from 'react'; 
import './App.css';
import TonnageStudyWeight from './TonnageStudyWeight';
import TonnageDim1 from './TonnageDim1';
import TonnageDim2 from './TonnageDim2';
import Notes from './Notes';

function App() {
  const [activeTab, setActiveTab] = useState('TonnageStudyWeight');
  const [noteText, setNoteText] = useState('');
  const [sessions, setSessions] = useState([]); // Array to store session names
  const [currentSession, setCurrentSession] = useState(null); // The selected session
  const contentRef = useRef(null);
  const tonnageStudyRef = useRef(null);
  const tonnageDim1Ref = useRef(null);
  const tonnageDim2Ref = useRef(null);
  const noteRef = useRef(null);

// Render content based on the active tab
const renderContent = () => {
  return (
    <div style={{ overflow: 'auto', maxHeight: '100%' }}>
      <div
        style={{
          display: activeTab === 'TonnageDim2' ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }}
      >
        <TonnageDim2 ref={tonnageDim2Ref} />
      </div>
      <div
        style={{
          display: activeTab === 'TonnageDim1' ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }}
      >
        <TonnageDim1 ref={tonnageDim1Ref} />
      </div>
      <div
        style={{
          display: activeTab === 'TonnageStudyWeight' ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }}
      >
        <TonnageStudyWeight ref={tonnageStudyRef} />
      </div>
      <div
        style={{
          display: activeTab === 'Notes' ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }}
      >
        <Notes ref={noteRef} noteText={noteText} setNoteText={setNoteText} />
      </div>
    </div>
  );
};


 
const handlePrint = () => {
  const printWindow = window.open('', '', 'width=800,height=600');

  // Get the content and the applied styles
  let contentToPrint = '';

  if (activeTab === 'Notes' && noteRef.current) {
    contentToPrint = `<pre>${noteRef.current.value}</pre>`; // Preformatted notes for Notes tab
  } else if (contentRef.current) {
    // Clone the content to manipulate it before printing
    const clonedContent = contentRef.current.cloneNode(true);

    // Remove blank rows from the table but retain headers
    const tables = clonedContent.querySelectorAll('.data-table');
    tables.forEach((table) => {
      const rows = table.querySelectorAll('tr');
      rows.forEach((row, index) => {
        // Skip the first row if it's a header row
        if (index !== 0) {
          const cells = row.querySelectorAll('td');
          const isBlankRow = Array.from(cells).every((cell) => cell.textContent.trim() === '');
          if (isBlankRow) {
            row.remove();
          }
        }
      });
    });

    contentToPrint = clonedContent.innerHTML; // Get the modified content
  }

  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
      } catch (e) {
        console.error(e);
        return '';
      }
    })
    .join('');

  // Write the content and styles to the print window
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Tab</title>
        <style>
          /* Your existing styles here */
          .right-container {
            width: 50%; /* Right half of the page */
            float: left; /* Align the chart to the right side */
            padding: 20px;
          }
          
          .table-container {
            width: 50%; /* Make the table container occupy half of the page */
            float: left; /* Align the table to the left side */
            padding: 20px;
          }
          
          .data-table td input {
width: 100%; /* Ensure the input fields occupy the full width of the cell */
text-align: center;
padding: 2px;
border: none; /* Remove input field borders */
background-color: transparent; /* Make the background transparent */
outline: none; /* Remove the outline when clicking inside */
font-size: 14px; /* Adjust font size */
box-sizing: border-box; /* Ensure padding doesn't affect the width */
}

.data-table td {
background-color: #fff;
padding: 0; /* Remove extra padding around the input */
}

.data-table th, .data-table td {
border: 1px solid #cecdcd;
padding: 2px 4px; /* Slight padding for a clean look */
text-align: center;
width: 14%;
line-height: 1.2;
}

.data-table input[type="number"]::-webkit-outer-spin-button,
.data-table input[type="number"]::-webkit-inner-spin-button {
-webkit-appearance: none;
margin: 0;
}

.data-table input[type="number"] {
-moz-appearance: textfield; /* For Firefox to remove number field arrows */
}

          
          .data-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          
          .data-table tr:hover {
            background-color: #f1f1f1;
          }
          
          .data-table td input[type="number"] {
            -moz-appearance: textfield;
          }
          
          .data-table td input[type="number"]::-webkit-outer-spin-button,
          .data-table td input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          .chart-heading {
            text-align: center;
            font-size: 20px;
            margin-bottom: 20px;
          }
          

          
          /* Regular styles for screen display */
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          /* Print-specific styles to avoid overlap */
          .right-container, .table-container {
            width: 100%;
            float: none;
            page-break-inside: avoid;
            padding: 20px;
          }


          .data-table {
            margin-bottom: 10px; /* Reduce the margin between the table and the graph */
          }

          .chart-heading {
            margin-top: 10px; /* Reduce the margin above the chart */
          }

          .chart-box {
            margin-top: 0; /* Ensure the chart container doesn't add extra margin */
          }

          .data-table th {
font-size: 14.5px; /* Adjust font size */
font-weight: bold; /* Make heading bold (optional) */
padding: 8px 5px; /* Adjust padding to give more space */
text-align: center; /* Center align the text */
background-color: #f5f5f5; /* Background color for the heading */
color: #333; /* Text color */
border: 1px solid #cecdcd;
}
/* Additional print styling */
@media print {
  body {
    -webkit-print-color-adjust: exact;
  }
  
  /* Hide specific elements */
  .add-row-btn {
    display: none;
  }
  .grey-background {
    background-color: #f2f2f2 !important;
  }
  .e-toolbar {
    display: none !important;
  }

  /* Prevent content from being cut off */
  * {
    overflow: visible !important;
  }

  /* Adjust layout to fit the graph properly */
  .printable-content {
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
  }
}

        </style>
      </head>
      <body>
        ${contentToPrint}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};


 
  const handleSave = async () => {
    if (!currentSession) {
      alert('Please select or create a session before saving.');
      return;
    }
  
    // Helper function to filter only the required fields
    const filterFields = (data) => {
      return data.map(row => ({
        Tonnage: row.Tonnage,
        Sample1: row.Sample1,
        Sample2: row.Sample2,
        Sample3: row.Sample3
      }));
    };
  
    // Get the filtered table data
    const tonnageStudyWeightData = tonnageStudyRef.current ? filterFields(tonnageStudyRef.current.getTableData()) : [];
    const tonnageDim1Data = tonnageDim1Ref.current ? filterFields(tonnageDim1Ref.current.getTableData()) : [];
    const tonnageDim2Data = tonnageDim2Ref.current ? filterFields(tonnageDim2Ref.current.getTableData()) : [];
    const notesData = noteRef.current ? noteRef.current.getEditorContent() : ''; // Ensure notes content is fetched
  
    // Prepare the payload with the filtered data
    const payload = {
      session_name: currentSession, // Using the dynamically selected session name
      data: {
        TonnageStudyWeight: tonnageStudyWeightData,
        TonnageDim1: tonnageDim1Data,
        TonnageDim2: tonnageDim2Data,
        Notes: notesData,
      },
    };
    console.log('Note Ref:', noteRef.current); // Check if noteRef exists
console.log('Notes Data:', notesData); // Log the content fetched from RichTextEditor


    console.log('Data being sent:', payload); // For debugging purposes
  
    // Save the data to the backend
    try {
      const response = await fetch('http://localhost:8000/api/save-data/', {  // Update the URL to point to your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${errorMessage}`);
      }
  
      const data = await response.json();
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  const chartRef = useRef(null); // Initialize chartRef

  const handleSelectSession = async (event) => { 
    console.log("Event Target Value:", event.target.value);
    const selectedSession = event.target.value;
    console.log("Selected Session:", selectedSession); 
    setCurrentSession(selectedSession);

    try {
        const response = await fetch(`http://localhost:8000/api/get-session-data/${selectedSession}/`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${errorMessage}`);
        }

        const data = await response.json();
        console.log("Retrieved Data:", data);  

        // Assuming the structure is as expected and `setTableData` is working correctly
        if (tonnageStudyRef.current) tonnageStudyRef.current.setTableData(data.data.TonnageStudyWeight);
        if (tonnageDim1Ref.current) tonnageDim1Ref.current.setTableData(data.data.TonnageDim1);
        if (tonnageDim2Ref.current) tonnageDim2Ref.current.setTableData(data.data.TonnageDim2);

        // For the Notes section
        if (noteRef.current && noteRef.current.rteObject) {
            noteRef.current.rteObject.value = data.data.Notes;
        }

        // Manually trigger chart update if necessary
        if (chartRef.current) {
            chartRef.current.update();  // Adjust this according to how the chart library handles re-rendering
        }
    } catch (error) {
        console.error('Error retrieving session data:', error);
    }
};


  const handleCalculateGraph = () => {
    if (tonnageStudyRef.current) {
      tonnageStudyRef.current.calculateGraphData();
    }
    if (tonnageDim1Ref.current) {
      tonnageDim1Ref.current.calculateGraphData();
    }
    if (tonnageDim2Ref.current) {
      tonnageDim2Ref.current.calculateGraphData();
    }
  };

  useEffect(() => {
    // Load sessions from localStorage
    const storedSessions = JSON.parse(localStorage.getItem('sessions'));
    if (storedSessions) {
      setSessions(storedSessions);
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleCreateSession = () => {
    const sessionName = prompt("Enter the session name:");
    if (sessionName) {
      const newSessions = [...sessions, sessionName];
      setSessions(newSessions);
      setCurrentSession(sessionName);
      // Save updated sessions to localStorage
      localStorage.setItem('sessions', JSON.stringify(newSessions));
    }
  };
 

  const renderTopBar = () => {
    return (
      <div className="top-bar">
        <button onClick={handleCreateSession}>Create Session</button>
        <select onChange={handleSelectSession} value={currentSession || ''}>
          <option value="" disabled>Select Session</option>
          {sessions.map((session, index) => (
            <option key={index} value={session}>{session}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderBottomBar = () => {
    return (
      <div className="bottom-bar">
        <div className="left-buttons">
          <button onClick={handleSave} className="bottom-button">Save</button>
        </div>
        <div className="center-buttons">
          {activeTab !== 'Notes' && (
            <button className="bottom-button" onClick={handlePrint}>Print</button>
          )}
        </div>
        <div className="right-buttons">
          {activeTab !== 'Notes' && (
            <button className="bottom-button" onClick={handleCalculateGraph}>Calculate and Show Graph</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {renderTopBar()}
      <div className="tabs">
        <div className={`tab ${activeTab === 'TonnageStudyWeight' ? 'active' : ''}`} onClick={() => setActiveTab('TonnageStudyWeight')}>
          Tonnage Study Weight
        </div>
        <div className={`tab ${activeTab === 'TonnageDim1' ? 'active' : ''}`} onClick={() => setActiveTab('TonnageDim1')}>
          Tonnage Dim1
        </div>
        <div className={`tab ${activeTab === 'TonnageDim2' ? 'active' : ''}`} onClick={() => setActiveTab('TonnageDim2')}>
          Tonnage Dim2
        </div>
        <div className={`tab ${activeTab === 'Notes' ? 'active' : ''}`} onClick={() => setActiveTab('Notes')}>
          Notes
        </div>
      </div>
      <div className="tab-content" ref={contentRef}>
        {renderContent()}
      </div>
      {renderBottomBar()}
    </div>
  );
}

export default App;