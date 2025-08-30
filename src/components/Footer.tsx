import React, { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { db } from '../firebase'
export default function Footer(){
  const [data,setData]=useState<any>(null)
  useEffect(()=>{ get(ref(db,'footer')).then(s=>{ if(s.exists()) setData(s.val()) }) },[])
  return (
    <footer className="py-8">
      <div className="container text-center text-slate-400">
        <div className="flex justify-center gap-6 mb-3">
          {data?.socials && Object.values(data.socials).map((s:any,i:number)=>(<a key={i} href={s.link}><img src={s.icon} className="w-6 h-6" alt=""/></a>))}
        </div>
        <div>{data?.copyright||'© 2025'}</div>
      </div>
    </footer>
  )
}
