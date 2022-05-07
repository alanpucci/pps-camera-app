export const sleep = (miliseconds:number=1000) =>  {
    return new Promise(resolve => 
        setTimeout(resolve, miliseconds)
    );
}