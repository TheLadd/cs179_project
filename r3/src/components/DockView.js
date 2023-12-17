import { useEffect } from 'react'; 
import { handleCreateCargoState,
  handleRunAstar,
  handleRunMove,
    handleGetManifest,
    handleLogMessage,
handleGetCurrentCargoState} from './BackendRoutes'; 

export default function DockView({cachedState, setCachedState}) {
    
    handleCreateCargoState(cachedState.manfest, cachedState.offloadList, cachedState.loadList); 

    console.log(handleGetCurrentCargoState()); 


    return (
        <div id ="dock-view-wrapper">
            <div>
                <button>Log something</button>

            </div>
        </div>
    ); 


}; 

//handleCreateCargoState(manifestData, offloadListData, loadListData);