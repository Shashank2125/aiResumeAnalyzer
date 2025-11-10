import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation} from "react-router";
import {useNavigate} from "react-router";

export const meta=()=>([
    {title:'InsightCV | Auth'},
    {name:'description', content:'Log into your account'}
])




const Auth = () => {
    //auth=information about the user and which state they are in
    //and also about the authentication
    const {isLoading,auth}=usePuterStore();
    const location=useLocation();
    //the page user want to access next
    const next=location.search.split("next=")[1];
    const navigate=useNavigate();
    //if the user want to access the page were they are not authenticated
    //we redirect them to page were they can pass their authentication and redirect them back
    //to page when they are authenticated
    useEffect(()=>{
      if(auth.isAuthenticated) navigate(next);
      //user who are not logged in will be blocked here
    },[auth.isAuthenticated,next])
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>
                    <div>
                        {isLoading?(
                            <button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>
                        ):(
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p>Log Out</p>
                                    </button>
                                ):(
                                    <button className="auth-button" onClick={auth.signIn}>
                                        <p>Log in</p>
                                    </button>

                                )}
                            </>
                        )}
                    </div>

                </section>

            </div>
        </main>
    )
}
export default Auth
