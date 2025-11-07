/*  This is a REACT Component
*
This pretty much creates an HTML element that can be used in app with:
*           <Name/>
* */
function Name() {
    //create a variable with my name
    const name = 'Shane'
    const emptyName = ''

    //in the {} you can put anything that returns a value, you could even do a function call
    //return <h1>My Name Is {name}!</h1>

    //you can also do an if(name)
        //so if name is empty itll be false ELSE true
    //if(name){
    //    return <h1>name is non-empty</h1>
    //}else{
    //    return <h1>name is empty</h1>
    //}

    if(emptyName && name){
        return <h1>emptyName is non-empty</h1>
    }else{
        return <h1>emptyName is empty</h1>
    }
}

export default Name;