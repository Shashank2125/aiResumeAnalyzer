import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import resumeCard from "~/components/ResumeCard";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "InsightCV" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
    const {auth}=usePuterStore();

    const navigate=useNavigate();
    //if the user want to access the page were they are not authenticated
    //we redirect them to page were they can pass their authentication and redirect them back
    //to page when they are authenticated
    useEffect(()=>{
        //if user is not authenticated and try to access home we bring
        //them back to auth and take the home as next parameter
        if(!auth.isAuthenticated) {navigate("/auth?next=/",{replace:true});}
    },[auth.isAuthenticated,navigate])
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
      <Navbar />
    <section className="main-section">
        <div className="page-heading py-16">
            <h1>Track your Applications & Rate your Resume</h1>
            <h2>Review your submission and get feedback from AI.</h2>

        </div>

      {resumes.length>0&&(
          <div className="resumes-section">
              {resumes.map((resume)=>(
                      <ResumeCard key ={resume.id} resume={resume}/>
                  ))}
          </div>





      )}
    </section>

  </main>
}
