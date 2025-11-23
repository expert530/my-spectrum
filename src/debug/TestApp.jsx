import React, { useState } from 'react'

export default function TestApp(){
  const [c, setC] = useState(0)
  return (
    <div style={{padding:30}}>
      <h1>Test App</h1>
      <p>Counter: {c}</p>
      <button onClick={()=>setC(c+1)}>Inc</button>
    </div>
  )
}
