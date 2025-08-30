import React, { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { db } from '../firebase'
export default function Education(){
  const [items,setItems] = useState<any[]>([])
  useEffect(()=>{ get(ref(db,'education')).then(s=>{ if(s.exists()) setItems(Array.isArray(s.val())?s.val():Object.values(s.val())) }) },[])
  return (
    <section id="education" className="section">
      <div className="container">
        <h2 className="text-3xl font-bold mb-6">Education</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((ed,i)=>(
            <div key={i} className="card p-4 flex items-center gap-4">
              {ed.img && <img src={ed.img} alt="" className="w-16 h-16 object-contain"/>}
              <div>
                <h3 className="font-semibold">{ed.degree}</h3>
                <p className="text-slate-400">{ed.university} — {ed.year} {ed.cgpa?`(CGPA: ${ed.cgpa})`:''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
