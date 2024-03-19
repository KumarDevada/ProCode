import { useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'
import AllCodes from './AllCodes'

function App() {
  const [count, setCount] = useState(0)
  const [name, setname] = useState('')
  const [lang, setlang] = useState('')
  const [code, setcode] = useState('')
  const [flag,setflag] = useState(true)

  const handleSubmit = async () => {
    if(name==='' || lang==='' || code==='') {
      alert('Please fill in all the text fields and then submit.')
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/users', {
        name: name,
        language: lang,
        code: code
      });
  
      console.log('User added successfully');
    } catch (error) {
      console.error('Error:', error);
    }
    setflag((e) => !e)
  };

  return (

    
    <div style={{width:'92vw', backgroundColor:'', margin:'auto'}}>
      <h1>CodePro</h1>

      {flag && 
        <>
          <div style={{ display:'flex',justifyContent:'space-between',width:'90%', backgroundColor:'', margin:'auto', marginBottom:'10px'}}>
          <input type="text" required value={name} onChange={(e) => setname(e.target.value)} className='inp' placeholder='username' />
          <input type="text" required value={lang} onChange={(e) => setlang(e.target.value)} className='inp' placeholder='language' />
          <button onClick={handleSubmit} className='inp'>submit code</button>
          </div>
          <textarea className='inp' name="code" id="code" required value={code}  onChange={(e) => setcode(e.target.value)} placeholder='Enter your code here...' style={{width: '90%', maxWidth:'1080px', height:'90vh', backgroundColor:'lavender'}}></textarea>
        </>
      
      }

      {!flag && 
        <AllCodes flag={flag} setflag={setflag} />
      }

      
      

      
    </div>
  )
}

export default App
