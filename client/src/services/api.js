// This is the ONLY file that talkt to the backend Every component calls these functions
//instead of using fetch( directly theat way, if the API changes , we only update it in one place 

import { mockRoadmap } from "../data/mockRoadmap";

//Flip this to false once the real backend endpoint is live and tested
const USE_MOCK = true;

//sends the user one sentence input to the Ai , gets back their road map.

export async function generateRoadmap(userInput) {
    if (USE_MOCK) {
        //Fake network delay so the loading spinner actually has something to show 

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockRoadmap);
            }, 1500);
        });
    }
    const res = await fetch('http://localhost:5000/api/roadmap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput }),
    });
    return res.json();
}

//Registers a new user and links their guest roadmap to their new account.
export async function registerUser(name, email, password, roadmapData) {
    if (USE_MOCK) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ token: 'fake-jwt-token' });
            }, 800);
        });

    }
    const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, roadmapData }),
    });
    return res.json();
}



