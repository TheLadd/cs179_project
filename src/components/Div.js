import { createBox, createTheme } from '@mui/system';

// possibly come back later so we can make the styling more portable 

// default styling for our div 
const defaultTheme = createTheme({
    palette: {
        finish: { 
            main: '#005F73',
            border: '#EE9B00', 
            text: '#E9D8A6', 

        }, 
        dockview: { 
            main: '#EE9B00', 
            border:'#94D2BD', 
            text: '#E9D8A6', 
            orangey: '#BB3E03', 
            deepred: '#9B2226'
        }

    }, 
    borderRadius: '16px', 
    border: '50px', 
    margin: 10, 
    width: 1/2, 
          
});

const Div = createBox({ defaultTheme });

export default Div;
