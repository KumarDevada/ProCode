import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'



const AllCodes = (props) => {
    const [userList, setUserList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:4000/users');
            console.log(response.data);
            setUserList(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      const AutoResizeTextarea = ({ value }) => {
        const textareaRef = useRef(null);
      
        useEffect(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }
        }, [value]);
      
        return <textarea className='codebox' ref={textareaRef} value={value} readOnly />;
      };

      const handleback = () => {
        let f = props.flag
        props.setflag(!f)
      }

    return (
        <div className="table-container">
            <button style={{position:'absolute', top:'30px', right:'20px'}} onClick={handleback}>Go Back</button>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Language</th>
                    <th>Code</th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {userList.map(user => (
                    <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.language}</td>
                    <td><AutoResizeTextarea value={user.code} /></td>
                    <td>{user.time}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    )
}

export default AllCodes