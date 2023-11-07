import { renderTableText } from '@/utils/customRender'
import dayjs from "dayjs";
export const expenseColumns:any = [
    {
        title: 'Number',
        dataIndex: 'number',
        key:'number',
        align:'center',
        customRender: ({ index }:any) => {
            return index+1
          },
    },
    {
        title: 'Time',
        dataIndex: 'created',
        align:'left',
        customRender: ({ text }:any) => {
            return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
          },
    },
    {
        title: 'Request ID',
        dataIndex: 'requestId',
        align:'left',
        customRender: renderTableText(20)
    },
    {
        title: 'Consumers',
        dataIndex: 'consumerAddress',
        align:'left',
        customRender: renderTableText(20)
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        align:'left',
        slots: { customRender: 'amount' },
    },
]

export const depositColumns:any = [
    {
        title: 'Number',
        dataIndex: 'number',
        key:'number',
        align:'center',
        customRender: ({ index }:any) => {
            return index+1
          },
    },
    {
        title: 'Time',
        dataIndex: 'created',
        align:'left',
        customRender: ({ text }:any) => {
            return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
          },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        align:'left',
        slots: { customRender: 'status' },
    },
    {
        title: 'TxID',
        dataIndex: 'transactionTx',
        align:'left',
        slots: { customRender: 'transactionTx' },
    },
    {
        title: 'Address',
        dataIndex: 'address',
        align:'left',
        customRender: renderTableText(15)
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        align:'left',
        slots: { customRender: 'amount' },
    },
]

export const consumersColumns:any = [
    {
        title: 'Number',
        dataIndex: 'number',
        key:'number',
        align:'center',
        customRender: ({ index }:any) => {
            return index+1
          },
    },
    {
        title: 'Added',
        dataIndex: 'created',
        align:'left',
        customRender: ({ text }:any) => {
            return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
          },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        align:'left',
        slots: { customRender: 'status' },
    },
    {
        title: 'TxID',
        dataIndex: 'transactionTx',
        align:'left',
        slots: { customRender: 'transactionTx' },
    },
    {
        title: 'Address',
        dataIndex: 'consumerAddress',
        align:'left',
        customRender: renderTableText(15)
    },
    {
        title: 'Action',
        dataIndex: 'operation',
        align:'left',
        slots: { customRender: 'operation' },
    }
]