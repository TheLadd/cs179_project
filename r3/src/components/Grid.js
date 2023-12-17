import '../css/Grid.css'; 


export default function Grid({type, items}) {

    // render containers based on whether it's buffer or ship 
    if (items.length === 0)  {
        items =  Array.from({ length: 12 }, () => Array(8).fill(null));
    }

    const getGridItemClass = value => {
        switch (value) {
          case 'NAN':
            return 'nan-grid';
          case 'UNDEFINED':
            return 'undef-grid';
          default:
            return 'item-grid';
        }
    };


    return(
        <div className={type}>
            {items.map((name, idx) => 
                <div className={getGridItemClass} id={idx}>
                    <p>{name ? name : null}</p>
                </div> 
            )}
        </div>


    ); 
}; 





  