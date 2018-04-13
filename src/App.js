import React, {Component} from 'react';
import Header from './component/header';
import Content from './component/content'
import './App.css';


class App extends Component {
    constructor(props) {
        super()
        this.state = {
            fileValue: "",
            tokenList: [],
            errorList:[],
            charList:[]
        }
    }

    changeFileValue(value) {
        this.setState({
            fileValue: value
        })
    }

    changeTokenList(value) {
        this.setState({
            tokenList: value
        })
    }
    changeCharList(value) {
        this.setState({
            charList: value
        })
    }
    changeErrorList(value) {
        this.setState({
            errorList: value
        })
    }
    render() {
        return (
            <div>
                <Header changeFileValue={this.changeFileValue.bind(this)} changeTokenList={this.changeTokenList.bind(this)} changeCharList={this.changeCharList.bind(this)} changeErrorList={this.changeErrorList.bind(this)} fileValue={this.state.fileValue}/>
                <Content changeFileValue={this.changeFileValue.bind(this)} fileValue={this.state.fileValue} tokenList={this.state.tokenList} charList={this.state.charList} errorList={this.state.errorList}/>
            </div>

        )

    }
}

export default App;
