import { useState } from "react";
import {Tool}  from "../shared/ToolCard";
import { PencilSquareIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';



interface ToolCardProps{
  tool: Tool
}

const ToolCard = ({tool}: ToolCardProps) => {
  const [isEdit, setIsEdit]= useState<boolean>(false);

  const toggleIsEdit= () => setIsEdit(prevIsEdit=>!prevIsEdit);

  return(
    <div key={tool.id} className='h-48 group relative rounded-md flex flex-col justify-between shadow-slate-900 shadow-md p-4 bg-gradient-to-r from-slate-800 to-slate-700'>
      <div>
        <div className="text-xl mb-2 font-bold">{tool.title}</div>
        <div className="">{tool.description}</div>
      </div>
      <a href='{tool.url}' target='_blank' className="text-slate-400">{tool.url}</a>
      { 
        isEdit ?
        <></>:
        <PencilSquareIcon className="h-6 w-6 text-slate-900 hidden group-hover:block absolute top-4 right-4 cursor-pointer" />
        
      }
    </div>
  )
}

export default ToolCard;