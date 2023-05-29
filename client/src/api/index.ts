import { UseFetchReturn, createFetch } from "@vueuse/core";
import Noty from "noty"

const myUseFetch = createFetch({
    baseUrl: "http://localhost:3000",
})

export type IPhotos = {
    id: number,
    label: string,
    photoUrl: string,
}

const notification = (text:string, type: Noty.Type) => {
    new Noty({
        type,
        text,
        timeout: 500,
        progressBar: true
    }).show()
}


export const apiGet = (query: string = "" ): UseFetchReturn<Array<IPhotos>> => {
    return myUseFetch(query !== "" ? `/search?nameLabel=${query}` : "/all").get().json()
}

export const apiPost = (payload: { label: string, photoUrl: string } ): UseFetchReturn<IPhotos> => {
    return myUseFetch("/create").post(payload,'json').json()
}

export const apiPostFetch = async (payload: { label: string, photoUrl: string }) => {
    return fetch("http://localhost:3000/create", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        }
    })
    .then( response => {
        if (!response.ok) { throw response }
        return response.json()
    })
    .then( json => {
        notification("Successfully Add","success")
        return json
    })
    .catch((er) => {
        er.text().then((errorMessage: string) => {
            const jsParse = JSON.parse(errorMessage)
            if(jsParse.data) {
                notification(jsParse.data,"alert")
            }
            // console.log(jsParse.photoUrl._errors)
            if (jsParse.photoUrl) {
                const errPhotoUrl = jsParse.photoUrl._errors
                for (let index = 0; index < errPhotoUrl.length; index++) {
                    let msg = errPhotoUrl[index];
                    if(msg !== undefined){
                        notification(msg,"alert")
                    }
                }
            }
            if (jsParse.label) {
                const errLabel = jsParse.label._errors
                for (let index = 0; index < errLabel.length; index++) {
                    const msg = errLabel[index];  
                    notification(msg,"alert")
                }
            }
            // console.log(JSON.parse(errorMessage))
        })
    });
}

export const apiDeleteFetch = async (payload: string, id: number) => {
    return fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ passwordInput: payload }),
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        }
    })
    .then( response => {
        if (!response.ok) { throw response }
        return response.json()
    })
    .then( json => {
        notification("Successfully Delete","success")
        return json
    })
    .catch((er) => {
        er.text().then((errorMessage: string) => {
            const jsParse = JSON.parse(errorMessage)
            if(jsParse.data) {
                notification(jsParse.data,"warning")
            }
            if (jsParse.passwordInput) {
                const errpasswordInput = jsParse.passwordInput._errors
                for (let index = 0; index < errpasswordInput.length; index++) {
                    const msg = errpasswordInput[index];  
                    notification(msg,"alert")
                }
            }
            // console.log(JSON.parse(errorMessage))
        })
    });
}