import '../css/Grid.css'; 
import Container from './Container'; 

export default function Grid(props) {
    let items = props.items; 
    console.log(items); 
    // render containers based on whether it's buffer or ship 
    if (items.length === 0)  {
        items =  Array.from({ length: 12 }, () => Array(8).fill(null));
    }

    // const getGridItemClass = value => {
    //     switch (value) {
    //       case 'NAN':
    //         return 'nan-grid';
    //       case 'UNDEFINED':
    //         return 'undef-grid';
    //       default:
    //         return 'item-grid';
    //     }
    // };


    return (
        <div className={props.type}>
            {items.map((arr, index) => 
                <Container key={index} position={arr[0]} weight={arr[1]} name={arr[2]} /> 
            )}
        </div>
    ); 
}; 





  