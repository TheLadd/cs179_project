
// global var of default state so we can access in multiple places. portable! 
export const DefaultState = {
    inProgress: false,
    instruction: "",
    opType: "",
    lastActivityTime: null,
    currStep: 0,
    user: cachedState.user,
    manifest: null,
    buffer: null,
    loadList: [],
    offloadList: [],
    moves: []
};