// 生成dfx.json文件
export const generateDFX = (name:any,type:any,source:string)=>{
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