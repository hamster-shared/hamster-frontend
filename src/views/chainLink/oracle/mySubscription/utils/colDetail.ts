import { renderTableText } from '@/utils/customRender'
export const expenseColumns:any = [
    {
        title: 'Number',
        dataIndex: 'number',
        key:'number',
        width:'20%',
        align:'center'
    },
    {
        title: 'Time',
        dataIndex: 'time',
        width:'20%',
        align:'center',
    },
    {
        title: 'Request Name',
        dataIndex: 'name',
        width:'20%',
        align:'center'
    },
    {
        title: 'Consumers',
        dataIndex: 'consumers',
        align:'center',
        width:'20%',
        customRender: renderTableText(20)
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        width:'20%',
        align:'center',
        customRender: ({ text }:any) => {
            if (!text) {
                return `<span style="color:red">${text}</span>0000`
            }
        },
    },
]

export const depositColumns:any = [
    {
        title: 'Number',
        dataIndex: 'number',
        key:'number',
        align:'center'
    },
    {
        title: 'Time',
        dataIndex: 'time',
        align:'center'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        align:'center',
    },
    {
        title: 'TxID',
        dataIndex: 'TxID',
        align:'center',
        customRender: renderTableText(20)
    },
    {
        title: 'Address',
        dataIndex: 'address',
        align:'center',
        customRender: renderTableText(20)
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        align:'center',
    },
]

export const consumersColumns:any = [
    {
        title: 'Number',
        dataIndex: 'number',
        key:'number',
        align:'center'
    },
    {
        title: 'Added',
        dataIndex: 'time',
        align:'center'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        align:'center'
    },
    {
        title: 'TxID',
        dataIndex: 'tx',
        align:'center',
        customRender: renderTableText(20)
    },
    {
        title: 'Address',
        dataIndex: 'address',
        align:'center',
        customRender: renderTableText(20)
    },
    {
        title: 'Action',
        dataIndex: 'operation',
        slots: { customRender: 'operation' },
    }
]