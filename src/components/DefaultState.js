// global var of default state so we can access in multiple places. portable! 
const DefaultState = ( cachedState  => {
return ({ 
    inProgress: false,
    instruction: "",
    opType: "",
    lastActivityTime: null,
    currStep: 0,
    user: cachedState ? cachedState.user : "", 
    manifest: null,
    buffer: null,
    loadList: [],
    offloadList: [],
    moves: []
}); 
});

export default DefaultState; 