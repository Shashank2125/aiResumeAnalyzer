import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import Ats from "~/components/ATS";
import Details from "~/components/Details";

export const meta=()=>([
    {title:'InsightCV | Review'},
    {name:'description', content:'Detailed Overview of your resume' },
])
const Resume = () => {
    const {auth,isLoading,fs,kv}=usePuterStore();
    const {id}= useParams();
    const [imageUrl,setImageUrl]=useState('');
    const [resumeUrl,setResumeUrl]=useState('');
    const [feedback,setFeedback]=useState<Feedback | null>(null);
    const navigate = useNavigate();
    useEffect(()=>{
        //if user is not authenticated and try to access home we bring
        //them back to auth and take the home as next parameter
        if(!isLoading && !auth.isAuthenticated) {navigate(`/auth?next=/resume${id}`,{replace:true});}
    },[isLoading])
    useEffect(()=>{
        const loadResume=async ()=>{
            //get access to all the resume data
            const resume=await kv.get(`resume:${id}`);
            if(!resume) return;
            //if get access to the resume we will parse the data from resume
            const data =JSON.parse(resume);
            //the files are passed from puter store are in form of blob and we need to covert
            //them into the pdf or image file
            const resumeBlob=await fs.read(data.resumePath);
            if(!resumeBlob) return;
            const pdfBlob=new Blob([resumeBlob],{type:'application/pdf'});
            const resumeUrl=URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);
            const imageBlob=await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl=URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log(resumeUrl,imageUrl,data.feedback);



        }

        loadResume();
    },[id])
    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5"/>
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>

                </Link>

            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg[url('/image/bg-small.svg') bg-cover
                h-[100vh] sticky top-0 items-center justify-center]">
                    {imageUrl && resumeUrl &&(
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                src={imageUrl}
                                className="w-full h-full object-contain rounded-2xl"
                                title="resume"/>

                            </a>
                        </div>
                    )}

                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback?(
                        <div className=" flex flex-col gap-8 animate-in fade-in duration-1000">
                             <Summary feedback={feedback}/>
                            {/* we return score if score exist else 0 similarly for suggestion if it exist else */}
                            <Ats score={feedback.Ats.score || 0} suggestion={feedback.Ats.tips || []}/>
                            <Details feedback={feedback}/>
                        </div>
                    ):(
                        <img src="/images/resume-scan-2.gif" className="w-full"/>
                    )}

                </section>
            </div>
        </main>
    )
}
export default Resume
