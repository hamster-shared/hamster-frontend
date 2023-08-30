export interface Chain{
    category: string,
    id: string,
    name: string,
    rpcUrl: string | undefined,
    symbol: string | undefined,
    blockExplorerUrl: string | undefined
}

export interface ChainCategory {
    category: string,
    chains: Chain[]
}

export const ChainList: Chain[] = [
    {
        category: "Ethereum",
        id: "0x1",
        name: "Ethereum Mainnet",
        rpcUrl: "https://rpc.ankr.com/eth",
        symbol: "ETH",
        blockExplorerUrl: undefined
    },
    {
        category: "Ethereum",
        id: "0x5",
        name: "Goerli",
        rpcUrl: "https://rpc.ankr.com/eth_goerli",
        symbol: "ETH",
        blockExplorerUrl: undefined
    },
    {
        category: "Ethereum",
        id: "0xaa36a7",
        name: "Sepolia",
        rpcUrl: "https://rpc.sepolia.org",
        symbol: "ETH",
        blockExplorerUrl: undefined
    },
    {
        category: "Ethereum",
        id: "0x501",
        name: "Hamster",
        rpcUrl: "https://rpc-moonbeam.hamster.newtouch.com",
        symbol: "HM",
        blockExplorerUrl: undefined
    },
    {
        category: "Polygon",
        id: "0x89",
        name: "Polygon Mainnet",
        rpcUrl: "https://polygon-rpc.com/",
        symbol: "MATIC",
        blockExplorerUrl: "https://polygonscan.com"
    },
    {
        category: "Polygon",
        id: "0x13881",
        name: "Mumbai",
        rpcUrl: "https://rpc-mumbai.maticvigil.com",
        symbol: "MATIC",
        blockExplorerUrl: "https://mumbai.polygonscan.com"
    },
    {
        category: "BNB Smart Chain",
        id: "0x38",
        name: "BNB Smart Chain Mainnet",
        rpcUrl: "https://bsc-dataseed.binance.org/",
        symbol: "BNB",
        blockExplorerUrl: "https://bscscan.com"
    },
    {
        category: "BNB Smart Chain",
        id: "0x61",
        name: "BNB Smart Chain Testnet",
        rpcUrl: "https://bsc-testnet.publicnode.com",
        symbol: "tBNB",
        blockExplorerUrl: "https://testnet.bscscan.com"
    },
    {
        category: "Arbitrum",
        id: "0xa4b1",
        name: "Arbitrum One",
        rpcUrl: "https://arb1.arbitrum.io/rpc",
        symbol: "ETH",
        blockExplorerUrl: "https://arbiscan.io"
    },
    {
        category: "Arbitrum",
        id: "0xa4ba",
        name: "Arbitrum Nova",
        rpcUrl: "https://nova.arbitrum.io/rpc",
        symbol: "ETH",
        blockExplorerUrl: "https://nova-explorer.arbitrum.io"
    },
    {
        category: "Arbitrum",
        id: "0x66eed",
        name: "Arbitrum Goerli",
        rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
        symbol: "AGOR",
        blockExplorerUrl: "https://goerli-rollup-explorer.arbitrum.io"
    },
    {
        category: "IRIShub",
        id: "0x1a20",
        name: "IRIShub",
        rpcUrl: "https://evmrpc.irishub-1.irisnet.org",
        symbol: "ERIS",
        blockExplorerUrl: "https://irishub.iobscan.io"
    },
    {
        category: "IRIShub",
        id: "0x4130",
        name: "IRIShub Testnet",
        rpcUrl: "https://evmrpc.nyancat.irisnet.org",
        symbol: "ERIS",
        blockExplorerUrl: "https://nyancat.iobscan.io"
    },
    {
        category: "Filecoin",
        id: "0x13a",
        name: "Filecoin - Mainnet",
        rpcUrl: "https://api.node.glif.io",
        symbol: "FIL",
        blockExplorerUrl: "https://filfox.info/en"
    },
    {
        category: "Filecoin",
        id: "0x4cb2f",
        name: "Filecoin - Calibration testnet",
        rpcUrl: "https://api.calibration.node.glif.io/rpc/v1",
        symbol: "tFIL",
        blockExplorerUrl: "https://calibration.filscan.io"
    },
    {
        category: "Scroll",
        id: "0x82751",
        name: "Scroll Alpha Testnet",
        rpcUrl: "https://alpha-rpc.scroll.io/l2",
        symbol: "ETH",
        blockExplorerUrl: "https://alpha-blockscout.scroll.io"
    },
    {
        category: "Scroll",
        id: "0x8274f",
        name: "Scroll Sepolia Testnet",
        rpcUrl: "https://sepolia-rpc.scroll.io",
        symbol: "ETH",
        blockExplorerUrl: "https://sepolia-blockscout.scroll.io"
    },
    {
        category: "Linea",
        id: "0xe708",
        name: "Linea",
        rpcUrl: "https://rpc.linea.build",
        symbol: "ETH",
        blockExplorerUrl: "https://lineascan.build"
    },
    {
        category: "Linea",
        id: "0xe704",
        name: "Linea Testnet",
        rpcUrl: "https://rpc.goerli.linea.build",
        symbol: "ETH",
        blockExplorerUrl: "https://goerli.lineascan.build"
    },
    {
        category: "Base",
        id: "0x2105",
        name: "Base",
        rpcUrl: "https://mainnet.base.org",
        symbol: "ETH",
        blockExplorerUrl: "https://basescan.org"
    },
    {
        category: "Base",
        id: "0x14a33",
        name: "Base Goerli Testnet",
        rpcUrl: "https://goerli.base.org",
        symbol: "ETH",
        blockExplorerUrl: "https://goerli.basescan.org"
    },
    {
        category: "conflux",
        id: "0x406",
        name: "Conflux eSpace",
        rpcUrl: "https://evm.confluxrpc.com",
        symbol: "CFX",
        blockExplorerUrl: "https://evm.confluxscan.net"
    },
    {
        category: "conflux",
        id: "0x47",
        name: "Conflux eSpace (Testnet)",
        rpcUrl: "https://evm.confluxrpc.com",
        symbol: "CFX",
        blockExplorerUrl: "https://evmtestnet.confluxscan.net"
    }
]

export function getChain(id : string): Chain | undefined {
    return ChainList.find(t => t.id === id)
}
