class Analyze {
    init(code, keyWords, operator, delimiter) {
        this.code = code;
        this.keywords = keyWords;
        this.operator = operator;
        this.delimiter = delimiter;
    }
    test() {
        console.log(this.code)
    }
    /**
     * 判断是否是数字
     */
    isDigit(ch) {
        if (ch >= '0' && ch <= '9') {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 判断是否是字母的函数
     */
    isLetter(ch) {
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 判断是否由两个运算符组成
     */
    isTwoOperator(str, ch) {
        let lc;
        let length = str.length;
        if (length > 1 || length === 0) { //字符数大于2和无字符的情况
            return false;
        } else { //字符数等于2的情况
            lc = str[length - 1];
            if (ch === '=' && (lc === '>' || lc === '<' || lc === '=' || lc === '!')) {

            } else if (ch === '+' && lc === '+') {

            } else if (ch === '-' && lc === '-') {

            } else if (ch === '|' && lc === '|') {

            } else if (ch === '&' && lc === '&') {

            } else {
                return false; //否就返回false
            }
            return true; //其它符号的情况都返回true
        }
    }
    /**
     * 获取关键字的机器码
     */
    getKeywordOpcodes(str) {

        let i;
        let keyWords = this.keywords
        for (i = 0; i < keyWords.length; i++) {
            if (str === keyWords[i])
                break;
        }
        if (i < keyWords.length) {
            return i + 1; //返回关键字的机器码
        } else {
            return 0;
        }
    }
    /**
     * 获取操作符的机器码
     */
    getOperatorOpcodes(str) {
        let i;
        let operator = this.operator
        for (i = 0; i < operator.length; i++) {
            if (str === operator[i])
                break;
        }
        if (i < operator.length)
            return i + 21; //返回操作符的机器码
        else
            return 0;
    }
    /**
     * 获取分界符的机器码
     */
    getDelimiterOpcodes(str) {
        let i;
        let delimiter = this.delimiter
        for (i = 0; i < delimiter.length; i++) {
            if (str === delimiter[i])
                break;
        }

        if (i < delimiter.length)
            return i + 41; //返回分界符的机器码
        else
            return 0;
    }
    /**
     * 判断字符是否可以识别
     */
    isIdent(str) {
        let ch;
        let i;
        for (i = 0; i < str.length; i++) {
            ch = str[i];
            //非数字串的情况和非由英文字母组成的字符串
            if ((i === 0 && !this.isLetter(ch)) || (!this.isDigit(ch) && !this.isLetter(ch))) {
                break;
            }
        }

        if (i < str.length) {
            return false;
        } else {
            return true;
        }
    }
    /**
     *
     * 预处理函数
     */
    preFunction() {
        let ts = "";
        let str = this.code;
        let i;
        let length = str.length
        let ch, nc;
        //这里的i<length-1
        for (i = 0; i < length - 1; i++) {
            ch = str[i];
            nc = str[i + 1];

            if (ch === '\n') { //如果字符是换行符,将\n换成$
                ch = '$';
                ts = ts + ch;
            } else if (ch === ' ' || ch === '\r' || ch === '\t') {
                if (nc === ' ' || nc === '\r' || ch === '\t') {
                    continue; //连续' '或者'\t'或者'\r'的情况，直接跳过
                } else {
                    ch = ' '; //一个' '或者'\t'或者'\r'的情况，将这些字符换成' '
                    ts = ts + ch;
                }
            } else {
                ts = ts + ch; //将字符连起来
            }
        }

        //
        ch = str[length - 1];
        if (ch !== ' ' && ch !== '\r' && ch !== '\t' && ch !== '\n') {
            ts = ts + ch;
        }
        return ts;
    }
    /**
     * 将字符串分成一个个单词，存放在数组列表
     */
    divide(str) {
        let list = [];
        let length = str.length;
        let s = "";
        let ch;
        let i;
        let row = 1;

        for (i = 0; i < length; i++) {
            ch = str[i];
            if (i === 0 && ch === ' ') //字符串的第一个字符
                continue;
            if (ch === ' ') { //' '或者'\t'或者'\r'的情况
                if (s !== "") {
                    list.push({
                        row: row,
                        word: s
                    });
                    s = ""; //置空
                } else {
                    continue;
                }
            } else if (this.isDigit(ch) || this.isLetter(ch)) {
                if (s === "" || this.isDigit(s[s.length - 1]) || this.isLetter(s[s.length - 1])) {
                    s = s + ch;
                } else {
                    list.push({
                        row: row,
                        word: s
                    });
                    s = "";
                    s = s + ch;
                }
            } else {
                if (this.isTwoOperator(s, ch)) { //两个运算符的情况
                    s = s + ch;
                } else {
                    if (s === "" && ch !== '$') {
                        s = s + ch;
                    } else if (s === "" && ch === '$') { //若检测到$符号，就换行
                        row++; //行数加一
                    } else {
                        list.push({
                            row: row,
                            word: s
                        });
                        s = "";
                        if (ch !== '$') {
                            s = s + ch;
                        } else {
                            row++;
                        }
                    }
                }
            }
        }
        if (s !== "") {
            list.push({
                row: row,
                word: s
            });
        }
        return list;
    }

    /**
     * 判断字符串是数字串，单个字符，还是一个字符串
     */
    check(str) {
        let ch;
        ch = str.charAt(0);
        if (ch >= '0' && ch <= '9') {
            return 1; //数字串
        }
        if (str.length === 1)
            return 2; //单个字符
        else
            return 3; //一个字符串
    }

    /**
     *
     * 检查字符串是否为数字串，返回其机器码
     */
    checkDigit(str) {
        let i;
        let ch;
        for (i = 0; i < str.length; i++) {
            ch = str[i];
            if (ch > '9' || ch < '0')
                break;
        }
        if (i < str.length) {
            return "不可识别"; //不可识别的情况
        } else {
            return "常数"; //常数
        }
    }

    /**
     *
     * 检查字符串是否为单个字符，返回其机器码
     */
    checkChar(str) {
        if (this.getOperatorOpcodes(str) !== 0) { //操作符
            return this.getOperatorOpcodes(str);
        } else if (this.getDelimiterOpcodes(str) !== 0) { //分界符
            return this.getDelimiterOpcodes(str);
        } else if (this.isIdent(str)) {
            return "自定义"; //用户自定义标识符的机器码
        } else {
            return "不可识别"; //不可以被识别的标识符，机器码为0
        }
    }

    /**
     *
     * 检查字符串是否为字符串，返回其机器码
     */
    checkString(str) {
        if (this.getOperatorOpcodes(str) !== 0) { //操作符
            return this.getOperatorOpcodes(str);
        } else if (this.getKeywordOpcodes(str) !== 0) { //关键字
            return this.getKeywordOpcodes(str);
        } else if (this.isIdent(str)) {
            return "自定义"; //用户自定义标识符的机器码
        } else {
            return "不可识别"; //不可以被识别的标识符，机器码为0
        }
    }
}
export default Analyze;