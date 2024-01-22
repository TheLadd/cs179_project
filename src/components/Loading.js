import "../css/Loading.css"; 

// source: https://codepen.io/austinmzach/pen/nPJOBO 
const Loading = ({ displayText, redirectPath }) => { 
    // displayText: show something to users if they want 
    // redirectPath: where it should redirect users to once finished rendering (if applicable - might just use if/else statement in code)

    return ( 
        <div className="loading"> 
        <span>l</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
        <div className="hidden">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        </div> 
    )


}

export default Loading; 