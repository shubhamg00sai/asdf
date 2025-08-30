import React, { useEffect, useState } from 'react'
import { ref, get, push } from 'firebase/database'
import { db } from '../firebase'

export default function Contact(){
  const [heading,setHeading]=useState<string|null>(null)
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [message,setMessage]=useState(''); const [status,setStatus]=useState('')
  useEffect(()=>{ get(ref(db,'headings/inbox')).then(s=>{ setHeading(s.exists()?s.val():'Contact Me') }).catch(()=>setHeading('Contact Me')) },[])
  const submit=async(e:any)=>{ e.preventDefault(); if(!name||!email||!message){ setStatus('Fill all'); return }; await push(ref(db,'messages'),{name,email,message,createdAt:Date.now()}); setStatus('Sent'); setName(''); setEmail(''); setMessage('') }
  return (
    <section id="contact" className="section">
      <div className="container">
        {heading===null? <div>Loading...</div> : <h2 className="text-3xl font-bold mb-6">{heading}</h2>}
        <form onSubmit={submit} className="max-w-xl grid gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" className="p-2 rounded bg-white/5"/>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your Email" className="p-2 rounded bg-white/5"/>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message" className="p-2 rounded bg-white/5 h-32"></textarea>
          <button className="btn bg-teal-400 text-black w-fit px-4 py-2">Send</button>
          <p className="text-slate-400">{status}</p>
        </form>
      </div>
    </section>
  )
}
