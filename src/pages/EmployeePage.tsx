import { useState, useEffect } from "react";
import './EmployeePage.css'


type formDataObj = {
    FullName: string,
    Department: string,
    Salary: string,
};

type newFormDataObj = {
    newFullName: string,
    newDepartment: string,
    newSalary: string,
};

type EmployeeObj = {
  Id: number;
  FullName: string;
  Department: string;
  Salary: string;
};

export default function EmployeePage () {
    
     const [formData, setFormData] = useState<formDataObj>(
         {
            FullName: "",
            Department: "",
            Salary: ""
         }
     );
     const [editedFormData, setEditedFormData] = useState<newFormDataObj>({
              newFullName: "",
              newDepartment: "",
              newSalary: "",
     })
     const [employees, setEmployees] = useState<EmployeeObj[]>([]);
     const [editingId, setEditingId] = useState<number | null>(null);
     const [refreshTrigger, setRefreshTrigger] = useState(0);

     const apiURL = "http://localhost:3304/api/employees"
     

     // For View of Employees
     useEffect(()=>{     
         fetch(apiURL, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json"
                },
           }).
           then(async (res) => {
                const data = await res.json();
                setEmployees(data.data); 
           }).
           catch(err=> {
               console.error(err);
           });
     }, [refreshTrigger]);
     

     const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
           setFormData(prev=>(
                {
                    ...prev,
                    [e.target.name]: e.target.value
        }));
     };
    

    // For Adding of Employees
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {

            e.preventDefault();

            fetch(apiURL, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            }).
            then(async (res) => {    

                if (res.status == 400){
                    const data = await res.json();
                    const error = new Error(data.message);
                    throw error;
                }

                setRefreshTrigger(prev => prev + 1);
                setFormData({
                     FullName: "",
                     Department: "",
                     Salary: ""
                })
            }).
            catch(err => {
                console.error(err);
                alert(err.message);
            });
    };

   
     const handleEdit = (id: number) => {
           setEditingId(id);
     };

     const handleUpdatedChange = (e:React.ChangeEvent<HTMLInputElement>) => {
         setEditedFormData(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value
            }
         ));
     }

    // For Updating of Employees
    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const payload = {
                FullName: editedFormData.newFullName,
                Department: editedFormData.newDepartment,
                Salary: editedFormData.newSalary
            };

            console.log(payload);

            fetch(apiURL + `?Id=${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            })
                .then(async (res) => {
                    console.log(res.status);
                    if (res.status === 204) {
                        setEditingId(null);
                        setEditedFormData({
                            newFullName: "",
                            newDepartment: "",
                            newSalary: ""
                        });

                        setRefreshTrigger(prev => prev + 1);
                    }
                })
                .catch(console.error);
        };


     // For Delete of Employees
     const handleDelete = (id:number) => {
          
          fetch(apiURL+`?Id=${id}`, {
                "method": "DELETE",
           }).
           then(async (res) => {
                if (res.status == 200){
                    setRefreshTrigger(prev => prev + 1);
                }
           }).
           catch(err=> {
               console.error(err);
           });
     }; 

     return (
        <div className="main-wrapper">
            <div className="view">
                <ul>
                    { employees.map((employee:EmployeeObj)=>(

                       <li key={employee.Id}>
                           {
                            editingId == employee.Id ? 

                            // Updating Employee Details
                            <div className="update">
                              <form onSubmit={(e)=>handleUpdate(e)}>
                                <input 
                                  name="newFullName"
                                  type="text"
                                  value={editedFormData.newFullName}
                                  onChange={(e)=>handleUpdatedChange(e)}
                                  placeholder={employee.FullName}
                                />
                                <input 
                                  name="newDepartment"
                                  type="text"
                                  value={editedFormData.newDepartment}
                                  onChange={(e)=>handleUpdatedChange(e)}
                                  placeholder={employee.Department}
                                />
                                <input 
                                  name="newSalary"
                                  type="text"
                                  value={editedFormData.newSalary}
                                  onChange={(e)=>handleUpdatedChange(e)}
                                  placeholder={employee.Salary}
                                />
                                <button type="submit">Update</button>
                              </form>
                              <button type="button" onClick={()=>{setEditingId(null)}}>Cancel</button>
                            </div>:

                            // Viewing Employee Details
                            <> 
                            <div className="view-employee">
                                EmployeeName - {employee.FullName}, Department - {employee.Department}, Salary - ₱{employee.Salary}
                                <button type="button" onClick={()=>handleEdit(employee.Id)} style={{marginLeft:"10px"}}>Edit</button>
                                <button type="button" onClick={()=>handleDelete(employee.Id)} style={{marginLeft:"10px"}}>Delete</button>
                            </div>
                            </>
                           }
                       </li>
                     ))
                    }
                </ul>

            </div>
            <div className="add">
              <form onSubmit={(e)=>{handleSubmit(e)}}>
                 <input 
                    name="FullName"
                    type="text"
                    value={formData.FullName}
                    onChange={(e)=>handleChange(e)}
                    placeholder="FullName"
                   />
                  <input 
                    name="Department"
                    type="text"
                    value={formData.Department}
                    onChange={(e)=>handleChange(e)}
                    placeholder="Department"
                   />
                  <input 
                    name="Salary"
                    type="number"
                    value={formData.Salary}
                    onChange={(e)=>handleChange(e)}
                    placeholder="Salary"
                   />
                   <button type="submit">Add Employee</button>
                </form>   
            </div>       
        </div>
     ); 
};
