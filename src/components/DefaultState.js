// global var of default state so we can access in multiple places. portable! 
// if cachedState null, resets to empty user. pass current cached state to reset to default while user is logged in. 
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
    moves: null
}); 
});

export default DefaultState; 