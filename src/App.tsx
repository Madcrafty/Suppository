//import React from 'react'
import { useRete } from 'rete-react-plugin';
// import reactLogo from './assets/react.svg'
// import reteLogo from './assets/rete.svg'
// import viteLogo from '/vite.svg'
import { createEditor } from './rete/editor';
import './App.css'
import './rete.css';

export default function App() {
  const [ref] = useRete(createEditor)

  return (
    <>
      <div ref={ref} className="rete"></div>
    </>
  )
}