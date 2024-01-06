import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "../css"; // Theme
import { useState } from 'react'; 


export default function InstructionList() {
    const [rowData, setRowData] = useState([
        { name: "Dog", operation: "Onload", weight: "5" },
        { name: "Car", operation: "Offload", weight: "-" } 
        
      ]);
      
      // Column Definitions: Defines & controls grid columns.
      const [colDefs, setColDefs] = useState([
        { field: "name" }, 
        { field: "operation" }, 
        { field: "weight" }
      ]);



    return (
        <div className="ag-theme-nuhastheme">
            <AgGridReact rowData={rowData} columnDefs={colDefs} />
        </div>
    
    ); 

}; 