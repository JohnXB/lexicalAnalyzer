import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {Menu, Dropdown, Icon, Tag,  message,} from 'antd';
import './header.css'
import Analyze from '../server/server'

const openMenu = (
    <Menu>
        <Menu.Item>
            <input type="file" text="打开"/>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer">保存</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer">另存为</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer">退出</a>
        </Menu.Item>
    </Menu>
);


class AHeader extends Component {
    constructor(props) {
        super()
        this.state = {
            readFileValue: ""
        }
    }

    fileImport(e) {
        try{
            var _this = this;
            let fileDom = ReactDom.findDOMNode(this.refs["fileRead"])
            //获取读取我文件的File对象
            var selectedFile = fileDom.files[0];

            var reader = new FileReader();//这是核心,读取操作就是由它完成.
            reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
            reader.onload = function () {
                _this.setState({
                    readFileValue: this.result
                })
                _this.props.changeFileValue(this.result)
            }
            message.success("打开文件成功")
        }
        catch (e){
            message.error("打开文件出现问题")
        }

    }
    analyze() {
        var _this = this;
        // 关键字
        const keyWords = ["int", "long", "char", "if", "else", "for", "while", "return", "break", "continue", "switch", "case", "default", "float", "double", "void", "struct", "static", "do", "short"]
        // 运算符
        const operator = ["+", "-", "*", "/", "%", "=", ">", "<", "!", "==", "!=", ">=", "<=", "++", "--", "&", "&&", "||", "[", "]"]
        // 分界符
        const delimiter = [",", ";", "(", ")", "{", "}", "'", "\"", ":", "#"]
        Analyze.prototype.init(this.state.readFileValue, keyWords, operator, delimiter)
        let errors = [];
        let errorNum = 0;
        let values = [];
        try {
            (function doTocken(erros, errorNum, values) {
                let ts = Analyze.prototype.preFunction();
                let wlist = Analyze.prototype.divide(ts);
                let opcodes = -1;
                let str;
                let i;
                while (wlist.length > 0) {
                    let word = wlist.shift();
                    str = word.word;
                    i = Analyze.prototype.check(str);
                    switch (i) {
                        case 1:
                            opcodes = Analyze.prototype.checkDigit(str);
                            break;
                        case 2:
                            opcodes = Analyze.prototype.checkChar(str);
                            break;
                        case 3:
                            opcodes = Analyze.prototype.checkString(str);
                            break;
                        default:
                            throw "(header.js line:66)处发生了错误"
                    }

                    if (opcodes === 0) {
                        errors.push({
                            row: word.row,
                            str: str
                        })
                        errorNum++;
                    }
                    values.push({
                        row: word.row,
                        str: str,
                        opcodes: opcodes
                    })
                    // count++;
                }
            })(errors, errorNum, values)
            _this.props.changeTokenList(values)
            message.success("词法分析完成.")
        } catch (e) {
            message.error("词法分析过程中发生了错误.")
        }
    }
    render() {
        return (
            <div className="header">
                <div className="flex-box">
                    <Tag color="#87d068" className="logo">C语言词法分析器</Tag>

                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item>
                                <input ref="fileRead" accept="" type="file" onChange={this.fileImport.bind(this)}/>
                            </Menu.Item>
                            <Menu.Item>
                                <span>保存</span>
                            </Menu.Item>
                            <Menu.Item>
                                <span>另存为</span>
                            </Menu.Item>
                            <Menu.Item>
                                <span>退出</span>
                            </Menu.Item>
                        </Menu>
                    }>
                        <a className="ant-dropdown-link dropdown">
                            文件 <Icon type="down"/>
                        </a>
                    </Dropdown>
                    <Dropdown overlay= {
                        <Menu>
                            <Menu.Item>
                                <span onClick= {this.analyze.bind(this)}>手工生成过程演示</span>
                            </Menu.Item>
                            <Menu.Item>
                                <span>自动生成算法演示</span>
                            </Menu.Item>
                        </Menu>
                    }>
                        <a className="ant-dropdown-link dropdown">
                            词法分析 <Icon type="down"/>
                        </a>
                    </Dropdown>
                    <Dropdown overlay={openMenu}>
                        <a className="ant-dropdown-link dropdown">
                            语法分析 <Icon type="down"/>
                        </a>
                    </Dropdown>
                    <Dropdown overlay={openMenu}>
                        <a className="ant-dropdown-link  dropdown">
                            中间代码生成 <Icon type="down"/>
                        </a>
                    </Dropdown>
                    <Dropdown overlay={openMenu}>
                        <a className="ant-dropdown-link dropdown">
                            目标代码生成 <Icon type="down"/>
                        </a>
                    </Dropdown>
                    <Dropdown overlay={openMenu}>
                        <a className="ant-dropdown-link dropdown">
                            帮助 <Icon type="down"/>
                        </a>
                    </Dropdown>
                </div>
            </div>


        )
    }
}

export default AHeader;
