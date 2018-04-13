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
    title: '类型',
    dataIndex: 'opcodes',
}];
const characterListColumns = [{
    title: '行',
    dataIndex: 'row',
    render: text => <a href="#">{text}</a>,
}, {
    title: '字符',
    className: 'column-money',
    dataIndex: 'str',
}, {
    title: '类型',
    dataIndex: 'opcodes',
}];
const errorListColumns = [{
    title: '行',
    dataIndex: 'row',
    render: text => <a href="#">{text}</a>,
}, {
    title: '字符',
    className: 'column-money',
    dataIndex: 'str',
}, {
    title: '类型',
    dataIndex: 'opcodes',
}];
class Content extends Component {


    render() {
        this.props.errorList.pop()
        return (
            <div className="content">
                <InputBox fileValue = {this.props.fileValue} changeFileValue={this.props.changeFileValue}/>
                <CharacterTable charList = {this.props.charList}/>
                <TokenTable tokenList = {this.props.tokenList}/>
                <ErrorTable errorList = {this.props.errorList}/>
            </div>
        )
    }
}

class InputBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            readFileValue: this.props.fileValue
        }
    }
    setState_ = (e) => {
        this.setState({
                readFileValue : e.target.value
            }
        )
        this.props.changeFileValue(e.target.value)
    }
    render() {
        return (
            <div className="content-textArea">
                <Tag color="#2db7f5" className="title">代码块</Tag>
                <TextArea value={this.props.fileValue} onChange ={this.setState_} className= "content-textArea-input"/>
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
                       dataSource={this.props.charList}
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
                       dataSource={this.props.errorList}
                       className="content-table-show"/>
            </div>
        )
    }
}

export default Content;