import {useEffect, useState} from 'react';
import './App.css';
import {Button,EditableText,InputGroup,Toaster} from '@blueprintjs/core'

const AppToaster=Toaster.create({
  position:"top"
})

function App() {
  const [user ,setUser]=useState([]);
  const [newName,setNewName]=useState('');
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");


  useEffect(()=>{
    fetch("https://jsonplaceholder.typicode.com/users")
    .then((response)=>response.json())
    .then((json)=> setUser(json))
  },[])



  const addUser=()=>{
const name = newName.trim();
const email = newEmail.trim();
const website = newWebsite.trim();
if(name && email && website){
fetch("https://jsonplaceholder.typicode.com/users",
  {
    method:"POST",
    body:JSON.stringify({
      name,
      email,
      website
    }),
    headers:{
      "Content-Type":"application/json; charset=UTF-8"
    }
  }
).then((response)=>response.json())
.then((data)=>{
  setUser([...user,data])
  AppToaster.show({
    message:"user added successfully",intent:"success",
    timeout:"3000"
  })
  setNewName("");
  setNewEmail('');
  setNewWebsite('');
})
}
  }


const onChangeHandeler=(id,key,value)=>{
setUser((user)=>{
  return user.map(user=>{
    return user.id === id ? {...user,[key]:value}:user;

  })

})
}



const updateUser=(id)=>{
const users=user.find((users)=>users.id === id);
fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
  method: "PUT",
  body: JSON.stringify(users),
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((data) => {
   
    AppToaster.show({
      message: "user update successfully",
      intent: "success",
      timeout: "3000",
    });
   
  });
}



// const deleteUser=(id)=>{
//   fetch(`https://jsonplaceholder.typicode.com/users/${id}`, 
//     {
//     method: "DELETE",
  
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       setUser((user)=>{
//         user.filter(user=>user.id !== id)
//       })
//       AppToaster.show({
//         message: "user deleted successfully",
//         intent: "success",
//         timeout: "3000",
//       });
//     });
// }


const deleteUser = (id) => {
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      setUser((users) => {
        // Filter out the user with the deleted id
        return users.filter((user) => user.id !== id);
      });

      AppToaster.show({
        message: "User deleted successfully",
        intent: "success",
        timeout: 3000,
      });
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      AppToaster.show({
        message: "Failed to delete user",
        intent: "danger",
        timeout: 3000,
      });
    });
};


  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>
        </thead>
        <tbody>
          {user.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText
                  onChange={(value) =>
                    onChangeHandeler(user.id, "email", value)
                  }
                  value={user.email}
                />
              </td>
              <td>
                <EditableText
                  onChange={(value) =>
                    onChangeHandeler(user.id, "website", value)
                  }
                  value={user.website}
                />
              </td>
              <td>
                <Button intent="primary" onClick={()=>updateUser(user.id)}>Update</Button>
                &nbsp;
                <Button intent="danger" onClick={()=>deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="enter name..."
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="enter email..."
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="enter website..."
              />
            </td>
            <td>
              <Button intent="success" onClick={addUser}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
