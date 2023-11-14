import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog } from '@headlessui/react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { PencilSquareIcon } from '@heroicons/react/24/outline'
export type Tool = {
  id: string,
  title: string,
  description: string,
  url: string
}

//Variables to store data for a while
enum InputEnum {
  Id='id',
  Title='title',
  Description='description',
  Url='url',
}

function Index() {
  const { state } = useAuthState();
  const [tools, setTools]= useState<Array<Tool>>([]);
  const firestore= useFirestore();
  //Partial is a data type that makes a field optional to fill.
  const [inputData, setInputData]=useState<Partial<Tool>>({
    title:'',
    description:'',
    url:''
  });
  //error handling
  const [formError, setFormError]= useState<boolean>(false);


  useEffect(() => {
    async function fetchData() {
      const toolsCollection = collection(firestore,"tools"); //firestore: reference to the database service, "tools": references the name of collection.
      const toolsQuery=query(toolsCollection);
      const querySnapshot=await getDocs(toolsQuery);
      const fetchedData: Array<Tool>=[];
      querySnapshot.forEach((doc) => {
        fetchedData.push({id: doc.id, ...doc.data()} as Tool)
      })
      console.table(fetchedData);
      setTools(fetchedData);
    }
    fetchData();
  }, []);


  const handleInputChange=(field: InputEnum, value:string) => {
    setInputData({... inputData, [field]: value})
  }

  const handleFormSubmit= async (e: React.FormEvent<HTMLFormElement>)=> {
    //to not reload the page
    e.preventDefault();

    try {
      const toolsCollection=collection(firestore, "tools");
      const newTool: Partial<Tool>={
        title:inputData.title,
        description:inputData.description,
        url:inputData.url
      }
      
      //adding new tool
      await addDoc(toolsCollection, newTool);
      //notification
      toast.success('🦄 Saved the tool successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      //save to show in the table (card)
      setTools([...tools, newTool]);
      //clean data from inputs
      setInputData({
        title: '',
        description: '',
        url: ''
      })

    } catch (error) {
      setFormError(true);
    }
  }


  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <form action="" onSubmit={handleFormSubmit} className="flex">
            {/* calling "handleInputChange" to store values from inputs */}
            <input type="text" onChange={(e)=> handleInputChange(InputEnum.Title, e.target.value)} value={inputData.title} placeholder="title" className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-700 focus:outline-none p-4 rounded-lg" />
            <input type="text" onChange={(e)=> handleInputChange(InputEnum.Description, e.target.value)} value={inputData.description} placeholder="description" className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-700 focus:outline-none p-4 rounded-lg" />
            <input type="text" onChange={(e)=> handleInputChange(InputEnum.Url, e.target.value)} value={inputData.url} placeholder="url" className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-700 focus:outline-none p-4 rounded-lg" />
            <button type="submit" className="m-4 border border-purple-500 p-5 rounded-lg transition-opacity bg-purple-600 bg-opacity-30 hover:bg-opacity-50 text-slate-50">Add new tool</button>
          </form>
          <div className="grid grid-cols-3 gap-4 w-full bg-transparent text-slate-50">
            {
              tools.map((tool)=>(
                <div key={tool.id} className='h-48 group relative rounded-md flex flex-col justify-between shadow-slate-900 shadow-md p-4 bg-gradient-to-r from-slate-800 to-slate-700'>
      <div>
        <div className="text-xl mb-2 font-bold">{tool.title}</div>
        <div className="">{tool.description}</div>
      </div>
      <a href='{tool.url}' target='_blank' className="text-slate-400">{tool.url}</a>
      <PencilSquareIcon className="h-6 w-6 text-slate-900 hidden group-hover:block absolute top-4 right-4 cursor-pointer" />
    </div>
              ))
    
            }
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Index;
