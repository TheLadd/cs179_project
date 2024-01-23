import "../css/Loading.css"; 

const Loading = ({ displayText }) => { 
    // displayText: show something to users if they want 

    return ( 
        <div> 
        <div className="loading"> 
        <span style={{backgroundColor: '#005F73'}}>L</span>
        <span style={{backgroundColor: '#0A9396'}}>O</span>
        <span style={{backgroundColor: '#94D2BD'}}>A</span>
        <span style={{backgroundColor: '#EE9B00'}}>D</span>
        <span style={{backgroundColor: '#CA6702'}}>I</span>
        <span style={{backgroundColor: '#BB3E03'}}>N</span>
        <span style={{backgroundColor: '#AE2012'}}>G</span>
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
            <h1>{displayText}</h1>
        </div> 
    )


}

export default Loading; 