import React, { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { db } from '../firebase'

export default function Experience(){
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ get(ref(db,'experience')).then(s=>{ if(s.exists()) setItems(Object.values(s.val())) }) },[])
  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="text-3xl font-bold mb-6">Experience</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((e,i)=>(
            <div key={i} className="card p-4">
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-slate-400 text-sm">{e.company} — {e.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
