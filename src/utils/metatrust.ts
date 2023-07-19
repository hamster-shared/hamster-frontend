// metatrust 通过工具类的 name 查找 具体信息
export const getMetatrustInfoByToolname = (name:string)=>{
    const MetatrustInfo:any = {
        title:'',
        description:'',
        content:[],
        isMetatrust:false,
    }
    switch(name){
        case 'Mythril':
            MetatrustInfo.title = 'Mythril';
            MetatrustInfo.description = "Mythril is a security analysis tool for EVM bytecode. It detects security vulnerabilities in smart contracts built for Ethereum, Hedera, Quorum, Vechain, Roostock, Tron and other EVM-compatible blockchains. It uses symbolic execution, SMT solving and taint analysis to detect a variety of security vulnerabilities. It's also used (in combination with other tools and techniques) in the MythX security analysis platform.";
            MetatrustInfo.content = [];
            MetatrustInfo.isMetatrust = false;
            break;
        case 'MetaTrust Security Analyzer':
            MetatrustInfo.title = 'MetaScan Security Analyzer';
            MetatrustInfo.description = "Security analyzer is an automatic static analysis tool for detecting smart contract vulnerabilities. In this tool, we adopted the context-sensitive, flow-sensitive, money-sensitive technologies to conduct static analysis.";
            MetatrustInfo.content = ["Collected the almost-known vulnerable smart contracts, and analyzed how these vulnerabilities happened","Designed threat analysis model to accurately abstract the pattern of these vulnerabilities","Developed more than 100 rules to automatically detect these vulnerabilities"];
            MetatrustInfo.isMetatrust = true;
            break;
        case 'MetaTrust Security Prover':
            MetatrustInfo.title = 'MetaScan Security Prover';
            MetatrustInfo.description = "Prover is a dynamic scanning engine that can run code and explore its entire state space of all execution processes. During the exploration, Prover detects vulnerabilities based on execution features (such as property changes and execution paths). At the same time, with some sufficient constraint conditions, Prover can prove that the code does not contain some key vulnerabilities, such as reentrancy. Therefore, the Prover engine has both vulnerability detection and code verification for certain key vulnerabilities.";
            MetatrustInfo.content = [];
            MetatrustInfo.isMetatrust = true;
            break;
        case 'MetaTrust Open Source Analyzer':
            MetatrustInfo.title = 'MetaScan Open Source Analyzer';
            MetatrustInfo.description = "Open Source Analyzer is used to identify, monitor and manage the various components of software and their dependencies. It provides developers and security experts with a way to gain a deeper understanding of how software is composed, enabling them to more effectively manage risks and ensure system security.";
            // "Automatically detect the open source components and version information used in the software, which helps track and manage open source dependencies.","Review the licenses of software components to ensure the enterprise complies with relevant regulations and compliance requirements.","Identify known security vulnerabilities and risks to help developers fix vulnerabilities and reduce system security risks in a timely manner.","Analyze the dependency structure between components to help developers understand the interaction between components and potential risk points."
            MetatrustInfo.content = [];
            MetatrustInfo.isMetatrust = true;
            break;
        case 'Solhint':
            MetatrustInfo.title = 'Solhint';
            MetatrustInfo.description = "This is an open source project for linting Solidity code. This project provides both Security and Style Guide validations."
            MetatrustInfo.content = [];
            MetatrustInfo.isMetatrust = false;
            break;
        case 'MetaTrust Code Quality':
            MetatrustInfo.title = 'MetaScan Code Quality';
            MetatrustInfo.description = "The code style engine is a code quality analysis tool that uses static analysis on convention code to identify coding issues, potential errors and non-compliant major codes.";
            MetatrustInfo.content = ["Code style checking: Ensures that code complies with predetermined coding standards, improves consistency and reliability.","Potential error detection: Static analysis reveals issues that may cause crashes, performance degradation or logical errors, and provides fix suggestions.","Code optimization suggestions: Analyzes performance bottlenecks and unnecessary complexity, and provides structural and performance optimization solutions.","Maintainability analysis: Assesses code maintainability, identifies parts that need maintenance refactoring to improve maintainability and scalability."];
            MetatrustInfo.isMetatrust = true;
            break;
        case 'eth-gas-reporter':
            MetatrustInfo.title = 'eth-gas-reporter';
            MetatrustInfo.description = "A Mocha reporter for Ethereum test suites:";
            MetatrustInfo.content = ["Gas usage per unit test.","Metrics for method calls and deployments.","National currency costs of deploying and using your contract system.","CI integration with codechecks","Simple installation for Truffle and Buidler.","Use ETH, BNB, MATIC, AVAX, HT or MOVR price to calculate the gas price."];
            MetatrustInfo.isMetatrust = false;
            break;
        case 'AI':
            MetatrustInfo.title = 'AI Analysis';
            MetatrustInfo.description = "GPT can analyze various aspects of smart contracts: dependencies, functions, variables, security, etc. It mainly utilizes static analysis, dynamic analysis and formal verification to extract information from smart contracts. The purpose of the analysis is to uncover potential issues and defects in the contracts to improve their quality and security";
            MetatrustInfo.content = [];
            MetatrustInfo.isMetatrust = false;
            break;
    }
    return MetatrustInfo
}