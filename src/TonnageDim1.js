import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import './TonnageAllPages.css';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, Category, Tooltip, Legend } from '@syncfusion/ej2-react-charts';

const TonnageDim1 = forwardRef((props, ref) => {
  // Load saved data from sessionStorage (if exists) when the component mounts
  const savedTableData = JSON.parse(sessionStorage.getItem('TonnageDim1Data')) || [
    { Tonnage: '', Sample1: '', Sample2: '', Sample3: '', AvgDim1: '', ActualIncrease: '', PercentIncrease: '' },
    { Tonnage: '', Sample1: '', Sample2: '', Sample3: '', AvgDim1: '', ActualIncrease: '', PercentIncrease: '' },
    { Tonnage: '', Sample1: '', Sample2: '', Sample3: '', AvgDim1: '', ActualIncrease: '', PercentIncrease: '' },
    { Tonnage: '', Sample1: '', Sample2: '', Sample3: '', AvgDim1: '', ActualIncrease: '', PercentIncrease: '' },
  ];

  const [tableData, setTableData] = useState(savedTableData);
  const [chartData, setChartData] = useState([]); // State for chart data
  const [errors, setErrors] = useState([]); // State to store validation errors
  const tableRef = useRef([]); // Ref for input cells



  // Function to handle input changes in the table
  const handleChange = (index, field, value) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setTableData(newData);
  };

  // Store the updated data in sessionStorage whenever tableData changes
  useEffect(() => {
    sessionStorage.setItem('TonnageDim1Data', JSON.stringify(tableData));
  }, [tableData]);

  // Function to handle paste event
 const handlePaste = (index, field, event) => {
  event.preventDefault();

  const clipboardData = event.clipboardData.getData('text');
  const rows = clipboardData.trim().split('\n'); // Split by row (new lines)

  const updatedData = [...tableData];
  const requiredRows = index + rows.length - updatedData.length;

  // If more rows are needed, add them dynamically
  for (let i = 0; i < requiredRows; i++) {
    updatedData.push({
      Tonnage: '',
      Sample1: '',
      Sample2: '',
      Sample3: '',
      AvgWeight: '',
      ActualIncrease: '',
      PercentIncrease: ''
    });
  }

  // Update the tableData with the new rows
  rows.forEach((rowData, rowIndex) => {
    const rowCells = rowData.split('\t'); // Split by tab (columns)
    const targetIndex = index + rowIndex;

    // Update corresponding fields with values from the pasted data
    if (rowCells[0] !== undefined) updatedData[targetIndex]['Tonnage'] = rowCells[0].trim();
    if (rowCells[1] !== undefined) updatedData[targetIndex]['Sample1'] = rowCells[1].trim();
    if (rowCells[2] !== undefined) updatedData[targetIndex]['Sample2'] = rowCells[2].trim();
    if (rowCells[3] !== undefined) updatedData[targetIndex]['Sample3'] = rowCells[3].trim(); // Sample3 should map correctly here
  });

  setTableData(updatedData); // Set the updated table data
};

  // Function to add a new row to the table
  const handleAddRow = () => {
    const newRow = {
      Tonnage: '', Sample1: '', Sample2: '', Sample3: '', AvgDim1: '', ActualIncrease: '', PercentIncrease: ''
    };
    setTableData([...tableData, newRow]); // Add new row to the table data
  };

  // Function to validate the rows
  const validateRows = () => {
    const newErrors = [];
    tableData.forEach((row, index) => {
      if (
        (row.Tonnage || row.Sample1 || row.Sample2 || row.Sample3) &&
        (!row.Tonnage || !row.Sample1 || !row.Sample2 || !row.Sample3)
      ) {
        newErrors.push('Missing fields in row ' + (index + 1)); // Push error to the array
      }
    });
    setErrors(newErrors);
    
    if (newErrors.length > 0) {
      alert(newErrors.join('\n')); // Display popup with error messages
    }

    return newErrors.length === 0;
  };



  useImperativeHandle(ref, () => ({ 
    setTableData(data) {
      setTableData(data);
  },
    getTableData() {
      return tableData; // Return the current state of the table
    },
    calculateGraphData() {
      // Validate rows before calculation
      if (!validateRows()) return;
  
      // Filter rows with missing values for Tonnage and Samples
      const validData = tableData.filter(row => row.Tonnage && row.Sample1 && row.Sample2 && row.Sample3);
  
      // Sort the valid data by Tonnage in descending order
      const sortedData = validData.sort((a, b) => parseFloat(b.Tonnage) - parseFloat(a.Tonnage));
  
      let previousAvgDim1 = null; // Track the previous row's average Dim1
  
      const data = sortedData.map((row, index) => {
        const Sample1 = parseFloat(row.Sample1) || 0;
        const Sample2 = parseFloat(row.Sample2) || 0;
        const Sample3 = parseFloat(row.Sample3) || 0;
  
        // Calculate the average Dim1
        const avgDim1 = (Sample1 + Sample2 + Sample3) / 3;
  
        let actualIncrease = 0;
        let percentIncrease = 0;
  
        if (previousAvgDim1 !== null) {
          // Apply the formulas after sorting
          actualIncrease = avgDim1 - previousAvgDim1;
          percentIncrease = (actualIncrease / previousAvgDim1) * 100;
        }
  
        // Update row data with calculated values
        row.AvgDim1 = avgDim1.toFixed(2);
        row.ActualIncrease = actualIncrease.toFixed(2);
        row.PercentIncrease = percentIncrease.toFixed(2);
  
        previousAvgDim1 = avgDim1; // Update the previous average Dim1 for the next iteration
  
        return {
          Tonnage: parseFloat(row.Tonnage),
          AvgDim1: avgDim1,
        };
      });
  
      // Update table data after sorting for UI
      setTableData(sortedData);
  
      // Set chart data with sorted values
      setChartData(data);
    }
  }));
  

  const handleKeyDown = (event, rowIndex, field) => {
    const key = event.key;
  
    // Prevent default behavior of arrow keys
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
    }
  
    // Current input position in the form of [rowIndex, columnIndex]
    const fieldMapping = {
      'Tonnage': 0,
      'Sample1': 1,
      'Sample2': 2,
      'Sample3': 3
    };
  
    const columnIndex = fieldMapping[field];
    const totalRows = tableData.length;
    const totalColumns = 4; // Tonnage, Sample1, Sample2, Sample3
  
if (key === 'Enter') {
  const totalColumns = tableRef.current[0].length;  // Total columns in the table

  // Check if we're at the last row
  if (rowIndex < totalRows - 1) {
    // Move to the next row's same column
    tableRef.current[rowIndex + 1][columnIndex].focus();
  } else {
    // If on the last row, move to the next column of the first row
    const nextColumn = (columnIndex + 1) % totalColumns;

    // If we're at the last column of the last row, wrap to the first row and first column
    if (nextColumn === 0) {
      tableRef.current[0][0].focus();
    } else {
      tableRef.current[0][nextColumn].focus();
    }
  }
}

    // Move focus based on the arrow key pressed
    else if (key === 'ArrowRight') {
      if (columnIndex < totalColumns - 1) {
        // Move right to the next column
        tableRef.current[rowIndex][columnIndex + 1].focus();
      } else if (columnIndex === totalColumns - 1) {
        // If on Sample3, move to the next row's Tonnage if not on the last row
        if (rowIndex < totalRows - 1) {
          tableRef.current[rowIndex + 1][0].focus();
        } else {
          // If on the last row's Sample3, go back to the first row's Tonnage
          tableRef.current[0][0].focus();
        }
      }
    } else if (key === 'ArrowLeft') {
      if (columnIndex > 0) {
        // Move left to the previous column
        tableRef.current[rowIndex][columnIndex - 1].focus();
      } else if (columnIndex === 0) {
        // If on Tonnage, move to the previous row's Sample3 if not on the first row
        if (rowIndex > 0) {
          tableRef.current[rowIndex - 1][totalColumns - 1].focus();
        } else {
          // If on the first row's Tonnage, go to the last row's Sample3
          tableRef.current[totalRows - 1][totalColumns - 1].focus();
        }
      }
    } else if (key === 'ArrowDown' && rowIndex < totalRows - 1) {
      // Move down to the next row
      tableRef.current[rowIndex + 1][columnIndex].focus();
    } else if (key === 'ArrowUp' && rowIndex > 0) {
      // Move up to the previous row
      tableRef.current[rowIndex - 1][columnIndex].focus();
    }
  };
  
  
  const tonnageValues = chartData.map(data => data.Tonnage);
  const minTonnage = Math.min(...tonnageValues);
  const maxTonnage = Math.max(...tonnageValues);
  const range = maxTonnage - minTonnage;
  
  // Calculate the differences between consecutive values
  const differences = tonnageValues.slice(1).map((value, index) => value - tonnageValues[index]);
  
  // Find the most common difference
  const mostCommonDifference = differences.sort((a, b) =>
    differences.filter(v => v === a).length - differences.filter(v => v === b).length
  ).pop();
  
  const consistentCount = differences.filter(diff => diff === mostCommonDifference).length;
  const isConsistentMultiple = consistentCount >= Math.floor(differences.length * 0.7); // 70% consistency
  
  let interval;
  if (range > 1000) {
    // If the range is greater than 1000, set the interval to 200
    interval = 200;
  } else if (range > 500) {
    // If the range is between 500 and 1000, set the interval to 100
    interval = 100;
  } else if (isConsistentMultiple) {
    // If values are in consistent multiples, use the most common difference as the base interval
    interval = Math.abs(mostCommonDifference);
  
    // Adjust the interval if there are too many values (e.g., more than 10 points)
    if (tonnageValues.length > 10) {
      interval *= Math.ceil(tonnageValues.length / 10); // Scale the interval up based on the number of points
    }
  } else {
    // Determine the number of sections based on the range
    let numberOfSections;
    if (range <= 10) {
      numberOfSections = 5; // Smaller range, fewer sections
    } else if (range <= 50) {
      numberOfSections = 7; // Medium range, moderate number of sections
    } else {
      numberOfSections = 10; // Larger range, more sections
    }
    interval = Math.ceil(range / numberOfSections);
  }


  return (
    <div className="page-container">
      {/* Left half - Table */}
      <div className="table-container">
        {/* Add Row Button */}
        <button onClick={handleAddRow} className="add-row-btn">
          Add Row
        </button>

        {/* Table */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Tonnage</th>
              <th>Sample 1</th>
              <th>Sample 2</th>
              <th>Sample 3</th>
              <th>Avg Dim1</th>
              <th>Actual Increase</th>
              <th>% Increase</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <input
                    type="number"
                    value={row.Tonnage}
                    ref={(el) => {
                      tableRef.current[rowIndex] = tableRef.current[rowIndex] || [];
                      tableRef.current[rowIndex][0] = el;
                    }}
                    onChange={(e) => handleChange(rowIndex, 'Tonnage', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'Tonnage')}
                    onPaste={(e) => handlePaste(rowIndex, 'Tonnage', e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.Sample1}
                    ref={(el) => {
                      tableRef.current[rowIndex] = tableRef.current[rowIndex] || [];
                      tableRef.current[rowIndex][1] = el;
                    }}
                    onChange={(e) => handleChange(rowIndex, 'Sample1', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'Sample1')}
                    onPaste={(e) => handlePaste(rowIndex, 'Sample1', e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.Sample2}
                    ref={(el) => {
                      tableRef.current[rowIndex] = tableRef.current[rowIndex] || [];
                      tableRef.current[rowIndex][2] = el;
                    }}
                    onChange={(e) => handleChange(rowIndex, 'Sample2', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'Sample2')}
                    onPaste={(e) => handlePaste(rowIndex, 'Sample2', e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.Sample3}
                    ref={(el) => {
                      tableRef.current[rowIndex] = tableRef.current[rowIndex] || [];
                      tableRef.current[rowIndex][3] = el;
                    }}
                    onChange={(e) => handleChange(rowIndex, 'Sample3', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'Sample3')}
                    onPaste={(e) => handlePaste(rowIndex, 'Sample3', e)}
                  />
                </td>
                <td className="grey-background">{row.AvgDim1}</td>
                <td className="grey-background">{row.ActualIncrease}</td>
                <td className="grey-background">{row.PercentIncrease}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="error-container">
            {errors.map((error, index) => (
              <p key={index} className="error-message">{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Right half - Chart */}
      <div className="right-container">
        <h2 className="chart-heading">Tonnage Dim1</h2>
        <ChartComponent
          id="charts"
          primaryXAxis={{
            title: 'Tonnage',
            valueType: 'Double',
            minimum: minTonnage,
            interval: interval,
            // labelIntersectAction: 'Rotate45',
            // edgeLabelPlacement: 'Shift'
            isInversed: true // Invert x-axis values
          }}
          primaryYAxis={{
            title: 'Avg Dim1',
            minimum: 0,
            labelFormat: '{value}',
            edgeLabelPlacement: 'Shift'
          }}
          tooltip={{ enable: true }}
        >
          <Inject services={[LineSeries, Category, Tooltip, Legend]} />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={chartData}
              xName="Tonnage"
              yName="AvgDim1"
              type="Line"
              marker={{ visible: true }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  );
});

export default TonnageDim1;
