import {useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [newJoke, setNewJoke] = useState(false);
    const [loading, setLoading] = useState(false);
    const [jokeSetup, setJokeSetup] = useState("");
    const [jokePunchline, setJokePunchline] = useState("");


    /*
    *
    *
    LOOK UP WHAT A USE REF IS
    *
    *
    * */

    /*useEffect(() => {
        console.log("The Count has changed.");

        setLoading(true);
        const id = setTimeout(() => setLoading(false), 1000);

        // cleanup for StrictMode/HMR
        return () => clearTimeout(id);
    }, [count]);*/

    //callback func
    useEffect(() => {
        async function fetchDog() {
            try {
                setLoading(true)
                const response = await fetch("https://official-joke-api.appspot.com/random_joke");
                const data = await response.json()
                setJokeSetup(data.setup)
                setJokePunchline(data.punchline)
                console.log(response)
                console.log(data)
                console.log(jokeSetup)
                console.log(jokePunchline)
                setNewJoke(false)
            } catch (error) {
                console.log("ERROR FAILED TO FETCHJOKE")
                console.log(error)
            } finally {
                //finally runs no matter what
                setLoading(false)
            }
        }

        if (newJoke) {
            fetchDog()
        }
    }, [newJoke]);

    if (loading) {
        return (<div>loading!</div>)
    }

    return (
        (
            <>
                <div>
                    <a href="https://vite.dev" target="_blank">
                        <img src={viteLogo} className="logo" alt="Vite logo"/>
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img src={reactLogo} className="logo react" alt="React logo"/>
                    </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                    <div className="redBack"><h1>{jokeSetup}</h1></div>
                    <div className="blueBack"><h1>{jokePunchline}</h1></div>
                    <button onClick={() => setNewJoke(true)}>
                        What a new joke? {newJoke}
                    </button>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test HMR
                    </p>
                </div>
                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                </p>
            </>
        )
    );
}

export default App;
