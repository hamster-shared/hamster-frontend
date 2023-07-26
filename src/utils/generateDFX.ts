// 生成dfx.json文件
export const generateDFX = (name:any,type:string,source:string)=>{
    return {
        "canisters":{
            [name]:{
                "type":type,
                "source":[source],
                "frontend":{}
            }
        }
    }     
}