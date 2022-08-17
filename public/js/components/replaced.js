const replaced = (str)=>{
    const out = str
    if(/'/g.test(str)){
        const replaced = str.replace(/'/g,`&apos;`);
        return replaced
    }

    if(/"/g.test(str)){
        const replaced = str.replace(/"/g ,`&quot;`);
        return replaced
    }
    return out
}
export default replaced;