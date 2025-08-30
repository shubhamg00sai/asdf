import React, { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { db } from '../firebase'
export default function Skills(){
  const [data,setData]=useState<any>(null)
  useEffect(()=>{ get(ref(db,'skills')).then(s=>{ if(s.exists()) setData(s.val()) })},[])
  if(!data) return <section className="section"><div className="container">Loading skills...</div></section>
  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="text-3xl font-bold mb-6">{data.title||'Skills'}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {data.items?.map((it:any,i:number)=>(<div key={i} className="card p-4"><h4 className="font-semibold">{it.category}</h4><p className="text-slate-300">{it.list}</p></div>))}
        </div>
      </div>
    </section>
  )
}
