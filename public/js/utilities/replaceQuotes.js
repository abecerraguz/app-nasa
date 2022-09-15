const replaceQuotes = (str)=>{
    const out = str
    if(/'/g.test(out)){
        const replaced = out.replace(/'/g,`\'`);
        return replaced
    }

    if(/"/g.test(out)){
        const replaced = out.replace(/"/g ,`\"`);
        return replaced
    }
    return out
}
export default replaceQuotes