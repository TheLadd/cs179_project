import "../css/InstructionList.css"; // Theme
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
        <table className="table-styling">
            <tbody>
            <tr>
                <th>Name</th>
                <th>Operation</th>
                <th>Weight</th>
            </tr>
            {rowData.map((row, key) => {
                return (
                    <tr key={key}>
                        <td>{row.name}</td>
                        <td>{row.operation}</td>
                        <td>{row.weight}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
        
    
    ); 

}; 