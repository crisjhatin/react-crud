import { useState } from "react";
import { Tool, InputEnum }  from "../screens/Index";
import { PencilSquareIcon, CheckIcon, XCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { clsx } from "clsx";


interface ToolCardProps{
  tool: Tool
  onUpdate: (id:string, data: Partial<Tool>)=>void
  onDelete: (data: string)=>void
}

const ToolCard = ({tool, onUpdate, onDelete}: ToolCardProps) => {
  const [isEdit, setIsEdit]= useState<boolean>(false);
  const [inputData, setInputData]=useState<Partial<Tool>>(tool);
  
  const toggleIsEdit= () => setIsEdit(prevIsEdit=> !prevIsEdit);

  const onClose = () =>{
    setIsEdit(false);
    setInputData(tool);
  }

  const handleInputChange=(field: InputEnum, value:string) => {
    setInputData({... inputData, [field]: value})
  }

  const handleUpdate = () => {

    //Change the state because it's edited now.
    setIsEdit(false);
    onUpdate(tool.id, inputData);
  }
  const handleDelete = () => {
    setIsEdit(false);
    onDelete(tool.id);
  }

  const inputClasses = clsx (
    'bg-transparent',
    'border-0',
    'py-2',
    'px-4',
    'rounded-md'
  )

  return(
    <div key={tool.id} className="h-48 group relative rounded-md flex flex-col justify-between shadow-slate-900 shadow-md p-4 bg-gradient-to-r from-slate-800 to-slate-700">
      <div>
        <input className={clsx(inputClasses,
          /*additional attributes*/ "text-xl mb-2 font-bold text-slate-50", 
          {
            'bg-gray-900': isEdit,
            'cursor-text': isEdit
          })} 
          value={inputData.title} 
          onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
          readOnly={isEdit?false:true}
          />
        <input className={clsx(inputClasses,{
          'bg-gray-900':isEdit,
          'cursor-text': isEdit
        })} value={inputData.description} 
        onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
        readOnly={isEdit?false:true}
        />
      </div>
      <input className={
        clsx(inputClasses,
        'text-slate-400',
        {
        'bg-gray-900':isEdit,
        'cursor-text': isEdit
      })}
       value={tool.url} 
       onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
       readOnly={isEdit?false:true}
       />
      { 
        isEdit ?
        <>
          <CheckIcon onClick={handleUpdate} className="h-6 w-6 text-green-900 absolute top-4 right-12 cursor-pointer"/>
          <XCircleIcon onClick={onClose} className="h-6 w-6 text-blue-900 absolute top-4 right-4 cursor-pointer"/>
          <TrashIcon onClick={handleDelete} className="h-6 w-6 text-red-900 absolute top-4 right cursor-pointer"/>
        </> :
        <button className="btn btn-active btn-ghost hidden group-hover:block absolute top-4 right-4 p-0" onClick={toggleIsEdit}>
          <PencilSquareIcon className="h-6 w-6 text-slate-50 cursor-pointer" />
        </button>
        
      }
    </div>
  )
}

export default ToolCard;