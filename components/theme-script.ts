export const THEME_KEY = "mnha-theme";

// runs in <head> before first paint so a saved light theme never flashes dark
export const themeScript = `try{if(localStorage.getItem("${THEME_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;
