import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { Dialog } from '@headlessui/react';
import { collection, getDocs, query, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import ToolCard from '../shared/ToolCard';
import 'react-toastify/dist/ReactToastify.css';

//For ToolCard
export type Tool = {
  id: string,
  title: string,
  description: string,
  url: string
}

//Variables to store data for a while
export enum InputEnum {
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

  //Update tool (Editing)
  const onUpdateTool =  (id: string, data: Partial<Tool>) => {
    const docRef = doc(firestore, "tools", id);

     updateDoc(docRef, data)
      .then(docRef => {
        toast.success('🦄 updated the tool successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      })
      .catch(error => {
        console.log(error)
      })
  }

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
                <ToolCard key={tool.id} tool={tool} onUpdate={onUpdateTool}/>
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
