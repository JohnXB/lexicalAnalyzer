import React, {Component} from 'react';
import {Input, Tag, Table,Button} from 'antd';
import './content.css'

const {TextArea} = Input;
const tokenListColumns = [{
    title: '行',
    dataIndex: 'row',
    render: text => <a href="#">{text}</a>,
}, {
    title: '字符',
    className: 'column-money',
    dataIndex: 'str',
}, {
    title: '机器码',
    dataIndex: 'opcodes',
}];
const characterListColumns = [{
    title: 'Name',
    dataIndex: 'name',
    render: text => <a href="#">{text}</a>,
}, {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money',
}, {
    title: 'Address',
    dataIndex: 'address',
}];
const errorListColumns = [{
    title: 'Name',
    dataIndex: 'name',
    render: text => <a href="#">{text}</a>,
}, {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money',
}, {
    title: 'Address',
    dataIndex: 'address',
}];
class Content extends Component {
    render() {
        return (
            <div className="content">
                <InputBox fileValue = {this.props.fileValue}/>
                <TokenTable tokenList = {this.props.tokenList}/>
                <CharacterTable />
                <ErrorTable/>
            </div>
        )
    }
}

class InputBox extends Component {
    constructor(){
        super()
    }
    render() {
        return (
            <div className="content-textArea">
                <Tag color="#2db7f5" className="title">代码块</Tag>
                <TextArea value={this.props.fileValue} className= "content-textArea-input"/>
            </div>


        )
    }
}

class TokenTable extends Component {
    render() {
        return (
            <div className="content-table">
                <Tag color="#2db7f5" className="title">TokenList</Tag>
                <Table columns={tokenListColumns}
                       bordered
                       dataSource={this.props.tokenList}
                        className="content-table-show"/>
            </div>
        )
    }
}
class CharacterTable extends Component {
    render() {
        return (
            <div className="content-table">
                <Tag color="#2db7f5" className="title">字符</Tag>
                <Table columns={characterListColumns}
                       bordered

                       className="content-table-show"/>
            </div>
        )
    }
}

class ErrorTable extends Component {
    render() {
        return (
            <div className="content-table">
                <Tag color="#2db7f5" className="title">ErrorList</Tag>
                <Table columns={errorListColumns}
                       bordered
                       className="content-table-show"/>
            </div>
        )
    }
}

export default Content;