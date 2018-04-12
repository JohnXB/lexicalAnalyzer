class Analyze {
    init(code) {
        this.tokenList = [];
        this.charList = [];
        this.errorList = [];
        this.row = 1;
        this.code = code;
        this.keyWords = ["auto", "break", "case", "char", "const", "continue",
            "default", "do", "double", "else", "enum", "extern",
            "float", "for", "goto", "if", "int", "long",
            "register", "return", "short", "signed", "sizeof", "static",
            "struct", "switch", "typedef", "union", "unsigned", "void",
            "volatile", "while"]

    }


    isAlpha(ch) {
        if (((ch <= 'z') && (ch >= 'a')) || ((ch <= 'Z') && (ch >= 'A')) || (ch == '_'))
            return 1;
        else
            return 0;
    }

    /**
     * 判断是否是数字
     */
    isNumber(ch) {
        if (ch >= '0' && ch <= '9') {
            return 1;
        } else {
            return 0;
        }
    }

// 是否关键字
    isKey(ch) {
        for (let i = 0; i < this.keyWords.length; i++) {
             if (ch === this.keyWords[i])
                 return 1;
         }
// 只是普通的标识符
        return 0;
    }

    /**
     * 处理整个字符串
     */
    scannerAll() {
        let i = 0;
        let c;
        let text = this.code + '\0';
        while (i < text.length) {
            c = text.charAt(i);
            if (c == ' ' || c == '\t')
                i++;
            else if (c == '\n') {
                this.row++;
                i++;
            }
            else
                i = this.scannerPart(i);
        }
    }

    scannerPart(index) {
        let i = index;
        let ch = this.code.charAt(i);
        let s = "";
        // 第一个输入的字符是字母
        if (this.isAlpha(ch) == 1) {
            s = "" + ch;
            return this.handleFirstAlpha(i, s);
        }
        // 第一个是数字的话
        else if (this.isNumber(ch) == 1) {
            s = "" + ch;
            return this.handleFirstNum(i, s);

        }
        // 既不是数字也不是字母
        else {
            s = "" + ch;
            switch (ch) {
                case ' ':
                case '\n':
                case '\r':
                case '\t':
                    return ++i;
                case '[':
                case ']':
                case '(':
                case ')':
                case '{':
                case '}':
                    this.addToken(s, "双界符")
                    return ++i;
                case ':':
                    if (this.code.charAt(i + 1) == '=') {
                        s = s + "=";
                        this.addToken(s, "界符")
                        return i + 2;
                    }
                    else {
                        this.addError(s, "不能识别")
                        return i + 1;
                    }
                case ',':
                case '.':
                case ';':
                    this.addToken(s, "单界符")
                    return ++i;
                case '\\':
                    if (this.code.charAt(i + 1) == 'n' || this.code.charAt(i + 1) == 't' || this.code.charAt(i + 1) == 'r') {
                        this.addToken(s + this.code.charAt(i + 1), "转义字符")
                        return i + 2;
                    }
                case '\'':
                    // 判断是否为单字符，否则报错
                    return this.handleChar(i, s);
                case '\"':
                    // 判定字符串
                    return this.handleString(i, s);
                case '+':
                    return this.handlePlus(i, s);
                case '-':
                    return this.handleMinus(i, s);
                case '*':
                case '/':
                    if (this.code.charAt(i + 1) == '*') {
                        return this.handleNote(i, s);
                    }
                    else if (this.code.charAt(i + 1) == '/') {
                        return this.handleSingleLineNote(i, s);
                    }
                case '!':
                case '=':
                    ch = this.code.charAt(++i);
                    if (ch == '=') {
                        // 输出运算符
                        s = s + ch;
                        this.addToken(s, "运算符")
                        return ++i;
                    }
                    else {
                        // 输出运算符
                        this.addToken(s, "运算符")
                        return i;
                    }
                case '>':
                    return this.handleMore(i, s);
                case '<':
                    return this.handleLess(i, s);
                case '%':
                    ch = this.code.charAt(++i);
                    if (ch == '=') {
                        // 输出运算符
                        s = s + ch;
                        this.addToken(s, "运算符")
                        return ++i;
                    }
                    else if (ch == 's' || ch == 'c' || ch == 'd' || ch == 'f' || ch == 'l') {
                        // 输出类型标识符
                        s = s + ch;
                        this.addChar(s, "输出类型标识符")

                        return ++i;
                    }
                    else {
                        // 输出求余标识符
                        this.addChar(s, "求余标识符")
                        return i;
                    }
                default:
                    // 输出暂时无法识别的字符,制表符也被当成了有问题的字符
                    this.addError(s, "暂时无法识别的标识符")
                    return ++i;
            }
        }
    }

    //添加token
    addToken(str, type) {
        this.tokenList.push({
            row: this.row,
            str: str,
            opcodes: type
        });
    }

    //添加字符
    addChar(str, type) {
        this.charList.push({
            row: this.row,
            str: str,
            opcodes: type
        });
    }

    //添加错误信息
    addError(str, type) {
        this.errorList.push({
            row: this.row,
            str: str,
            opcodes: type
        });
    }

    handleFirstAlpha(index, str) {
        let i = index;
        let s = str;
        let ch = this.code.charAt(++i);
        while (this.isAlpha(ch) == 1 || this.isNumber(ch) == 1) {
            s = s + ch;
            ch = this.code.charAt(++i);
        }
        if (s.length == 1) {
            this.addChar(s, "字符常数");
            return i;
        }
        // 到了结尾
        if (this.isKey(s) == 1) {
            // 输出key
            this.addToken(s, "关键字");
            return i;

        }
        else {
            // 输出普通的标识符
            this.addChar(s, "普通标识符");
            return i;
        }
    }

    handleFirstNum(index, str) {
        let i = index;
        let ch = this.code.charAt(++i);
        let s = str;
        while (this.isNumber(ch) == 1) {
            s = s + ch;
            ch = this.code.charAt(++i);
        }
        if ((this.code.charAt(i) == ' ') || (this.code.charAt(i) == '\t') || (this.code.charAt(i) == '\n') || (this.code.charAt(i) == '\r') || (this.code.charAt(i) == '\0') || ch == ';' || ch == ',') {
            // 到了结尾，输出数字
            this.addChar(s, "整数");
            return i;
        }
        else if (ch == 'E') {
            if (this.code.charAt(i + 1) == '+') {
                s = s + ch;
                ch = this.code.charAt(++i);
                s = s + ch;
                ch = this.code.charAt(++i);
                while (this.isNumber(ch) == 1) {
                    s = s + ch;
                    ch = this.code.charAt(++i);
                }
                if (ch == '\r' || ch == '\n' || ch == ';' || ch == '\t') {
                    this.addChar(s, "科学计数");
                    return ++i;
                }
                else {
                    this.addError(s, "浮点数错误");
                    return i;
                }
            }
            else if (this.isNumber(this.code.charAt(i + 1)) == 1) {
                s = s + ch;
                ch = this.code.charAt(++i);
                while (this.isNumber(ch) == 1) {
                    s = s + ch;
                    ch = this.code.charAt(++i);
                }
                if (ch == '\r' || ch == '\n' || ch == ';' || ch == '\t') {
                    this.addChar(s, "科学计数");
                    return ++i;
                }
                else {
                    this.addError(s, "浮点数错误");
                    return i;
                }
            }
            else {
                this.addError(s, "科学计数法错误");
                return ++i;
            }
        }

// 浮点数判断
        else if (this.code.charAt(i) == '.' && (this.isNumber(this.code.charAt(i + 1)) == 1)) {
            s = s + '.';
            ch = this.code.charAt(++i);
            while (this.isNumber(ch) == 1) {
                s = s + ch;
                ch = this.code.charAt(++i);
            }
            if (ch == 'E') {
                if (this.code.charAt(i + 1) == '+') {
                    s = s + ch;
                    ch = this.code.charAt(++i);
                    s = s + ch;
                    ch = this.code.charAt(++i);
                    while (this.isNumber(ch) == 1) {
                        s = s + ch;
                        ch = this.code.charAt(++i);
                    }
                    if (ch == '\r' || ch == '\n' || ch == ';' || ch == '\t') {
                        this.addChar(s, "科学计数");
                        return ++i;
                    }
                    else {
                        this.addError(s, "浮点数错误");
                        return i;
                    }
                }
                else if (this.isNumber(this.code.charAt(i + 1)) == 1) {
                    s = s + ch;
                    ch = this.code.charAt(++i);
                    while (this.isNumber(ch) == 1) {
                        s = s + ch;
                        ch = this.code.charAt(++i);
                    }
                    if (ch == '\r' || ch == '\n' || ch == ';' || ch == '\t') {
                        this.addChar(s, "科学计数");
                        return ++i;
                    }
                    else {
                        this.addError( s, "浮点数错误");
                        return i;
                    }
                }
                else {
                    this.addError(s, "科学计数法错误");
                    return ++i;
                }
            }
            else if (ch == '\n' || ch == '\r' || ch == '\t' || ch == ' ' || ch == '\0' || ch != ',' || ch != ';') {
                this.addChar(s, "浮点数");
                return i;
            }
            else if (ch == '+' || ch == '-' || ch == '*' || ch == '/' || ch == '\0') {
                this.addChar(s, "浮点数");
                return i;
            }
            else {
                while (ch != '\n' && ch != '\t' && ch != ' ' && ch != '\r' && ch != '\0' && ch != ';' && ch != '.' && ch != ',') {
                    s = s + ch;
                    ch = this.code.charAt(++i);
                }
                this.addError(s, "不合法的字符");
                return i;
            }
        }
        else if (ch == '+' || ch == '-' || ch == '*' || ch == '/' || ch == '\0') {
            this.addChar()(s, "整数");
            return i;
        }
        else {
            do {
                ch = this.code.charAt(i++);
                s = s + ch;
            } while ((this.code.charAt(i) != ' ') && (this.code.charAt(i) != '\t') && (this.code.charAt(i) != '\n') && (this.code.charAt(i) != '\r') && (this.code.charAt(i) != '\0'));
            this.addError(s, "错误的标识符");
            return i;
        }
    }

    //单字符
    handleChar(index, str) {
        let text = this.code
        let s = str;
        let i = index;
        let ch = text.charAt(++i);
        while (ch != '\'') {
            if (ch == '\r' || ch == '\n') {
                this.row++;
            }
            else if (ch == '\0') {
                this.addError(s, "单字符错误");
                return i;
            }
            s = s + ch;
            ch = text.charAt(++i);
        }
        s = s + ch;
        if (s.length == 3 || s.equals("\'" + "\\" + "t" + "\'") || s.equals("\'" + "\\" + "n" + "\'") || s.equals("\'" + "\\" + "r" + "\'")) {
            this.addChar(s, "单字符");
        }
        else
            this.addError(s, "字符溢出");
        return ++i;
    }

// 单行注释处理
    handleSingleLineNote(index, str) {
        let s = str;
        let text = this.code
        let i = index;
        let ch = text.charAt(++i);

        while (ch != '\r' && ch != '\n' && ch != '\0') {
            s = s + ch;
            ch = text.charAt(++i);
        }

        this.addChar(s, "单行注释");
        return i;
    }

// 字符串处理
    handleString(index, str) {
        let s = str;
        let text = this.code
        let i = index;
        let ch = text.charAt(++i);

        while (ch != '"') {
            if (ch == '\r' || ch == '\n') {
                this.row++
            }

            else if (ch == '\0') {
                this.addError(s, "字符串没有闭合");
                return i;
            }
            s = s + ch;
            ch = text.charAt(++i);
        }
        s = s + ch;
        this.addChar(s, "字符串");
        return ++i;
    }

    handlePlus(index, str) {
        let i = index;
        let text = this.code
        let ch = text.charAt(++i);
        let s = str;
        if (ch == '+') {
            // 输出运算符
            s = s + ch;
            this.addToken(s, "运算符");
            return ++i;
        }

        else if (ch == '=') {
            s = s + ch;
            // 输出运算符
            this.addToken(s, "运算符");
            return ++i;
        }
        else {
            // 输出运算符
            this.addToken(s, "运算符");
            return i;
        }
    }

// 处理注释,没有考虑不闭合的情况
    handleNote(index, str) {
        let i = index;
        let text = this.code
        let ch = text.charAt(++i);
        let s = str + ch;
        ch = text.charAt(++i);
        while (ch != '*' || ((i + 1) < text.length) && text.charAt(i + 1) != '/') {
            s = s + ch;
            if (ch == '\r' || ch == '\n') {
               this.row++;
            }
            else if (ch == '\0') {
                this.addError(s, "注释没有闭合");
                return i;
            }
            ch = text.charAt(++i);
        }
        s = s + "*/";
        this.addChar(s, "注释");
        return i + 2;
    }

     handleMinus(index,str){
         let i = index;
         let text = this.code
         let ch = text.charAt(++i);
         let s = str + ch;
    if (ch=='-'){
    s = s+ch;
    // 输出运算符
    this.addToken(s, "运算符");
    return ++i;
}

else if(ch=='='){
    s = s+ch;
    // 输出运算符
    this.addToken(s, "运算符");
    return ++i;
}
else{
    // 输出运算符
    this.addToken(s, "运算符");
    return i;
}
}

handleMore(index, str){
    let i = index;
    let text = this.code
    let ch = text.charAt(++i);
    let s = str + ch;
    if (ch=='='){
        s = s+ch;
        // 输出运算符
        this.addToken(s, "运算符");
        return ++i;
    }

    else if(ch=='>'){
        s = s+ch;
        // 输出运算符
        this.addToken(s, "运算符");
        return ++i;
    }
    else{
        // 输出运算符
        this.addToken(s, "运算符");
        return i;
    }
}

handleLess(index,str){
    let i = index;
    let text = this.code
    let ch = text.charAt(++i);
    let s = str + ch;
    if (ch=='='){
        s = s+ch;
        // 输出运算符
        this.addToken(s, "运算符");
        return ++i;
    }

    else if(ch=='<'){
        s = s+ch;
        // 输出运算符
        this.addToken(s, "运算符");
        return ++i;
    }
    else{
        // 输出运算符
        this.addToken(s, "运算符");
        return i;
    }
}
//     /**
//      * 判断是否是字母的函数
//      */
//     isLetter(ch) {
//         if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
//             return true;
//         } else {
//             return false;
//         }
//     }
//
//     /**
//      * 判断是否由两个运算符组成
//      */
//     isTwoOperator(str, ch) {
//         let lc;
//         let length = str.length;
//         if (length > 1 || length === 0) { //字符数大于2和无字符的情况
//             return false;
//         } else { //字符数等于2的情况
//             lc = str[length - 1];
//             if (ch === '=' && (lc === '>' || lc === '<' || lc === '=' || lc === '!')) {
//
//             } else if (ch === '+' && lc === '+') {
//
//             } else if (ch === '-' && lc === '-') {
//
//             } else if (ch === '|' && lc === '|') {
//
//             } else if (ch === '&' && lc === '&') {
//
//             } else {
//                 return false; //否就返回false
//             }
//             return true; //其它符号的情况都返回true
//         }
//     }
//
//     /**
//      * 获取关键字的机器码
//      */
//     getKeywordOpcodes(str) {
//
//         let i;
//         let keyWords = this.keywords
//         for (i = 0; i < keyWords.length; i++) {
//             if (str === keyWords[i])
//                 break;
//         }
//         if (i < keyWords.length) {
//             return i + 1; //返回关键字的机器码
//         } else {
//             return 0;
//         }
//     }
//
//     /**
//      * 获取操作符的机器码
//      */
//     getOperatorOpcodes(str) {
//         let i;
//         let operator = this.operator
//         for (i = 0; i < operator.length; i++) {
//             if (str === operator[i])
//                 break;
//         }
//         if (i < operator.length)
//             return i + 21; //返回操作符的机器码
//         else
//             return 0;
//     }
//
//     /**
//      * 获取分界符的机器码
//      */
//     getDelimiterOpcodes(str) {
//         let i;
//         let delimiter = this.delimiter
//         for (i = 0; i < delimiter.length; i++) {
//             if (str === delimiter[i])
//                 break;
//         }
//
//         if (i < delimiter.length)
//             return i + 41; //返回分界符的机器码
//         else
//             return 0;
//     }
//
//     /**
//      * 判断字符是否可以识别
//      */
//     isIdent(str) {
//         let ch;
//         let i;
//         for (i = 0; i < str.length; i++) {
//             ch = str[i];
//             //非数字串的情况和非由英文字母组成的字符串
//             if ((i === 0 && !this.isLetter(ch)) || (!this.isDigit(ch) && !this.isLetter(ch))) {
//                 break;
//             }
//         }
//
//         if (i < str.length) {
//             return false;
//         } else {
//             return true;
//         }
//     }
//
//     /**
//      *
//      * 预处理函数
//      */
//     preFunction() {
//         let ts = "";
//         let str = this.code;
//         let i;
//         let length = str.length
//         let ch, nc;
//         //这里的i<length-1
//         for (i = 0; i < length - 1; i++) {
//             ch = str[i];
//             nc = str[i + 1];
//
//             if (ch === '\n') { //如果字符是换行符,将\n换成$
//                 ch = '$';
//                 ts = ts + ch;
//             } else if (ch === ' ' || ch === '\r' || ch === '\t') {
//                 if (nc === ' ' || nc === '\r' || ch === '\t') {
//                     continue; //连续' '或者'\t'或者'\r'的情况，直接跳过
//                 } else {
//                     ch = ' '; //一个' '或者'\t'或者'\r'的情况，将这些字符换成' '
//                     ts = ts + ch;
//                 }
//             } else {
//                 ts = ts + ch; //将字符连起来
//             }
//         }
//
//         //
//         ch = str[length - 1];
//         if (ch !== ' ' && ch !== '\r' && ch !== '\t' && ch !== '\n') {
//             ts = ts + ch;
//         }
//         return ts;
//     }
//
//     /**
//      * 将字符串分成一个个单词，存放在数组列表
//      */
//     divide(str) {
//         let list = [];
//         let length = str.length;
//         let s = "";
//         let ch;
//         let i;
//         let row = 1;
//
//         for (i = 0; i < length; i++) {
//             ch = str[i];
//             if (i === 0 && ch === ' ') //字符串的第一个字符
//                 continue;
//             if (ch === ' ') { //' '或者'\t'或者'\r'的情况
//                 if (s !== "") {
//                     list.push({
//                         row: row,
//                         word: s
//                     });
//                     s = ""; //置空
//                 } else {
//                     continue;
//                 }
//             } else if (this.isDigit(ch) || this.isLetter(ch)) {
//                 if (s === "" || this.isDigit(s[s.length - 1]) || this.isLetter(s[s.length - 1])) {
//                     s = s + ch;
//                 } else {
//                     list.push({
//                         row: row,
//                         word: s
//                     });
//                     s = "";
//                     s = s + ch;
//                 }
//             } else {
//                 if (this.isTwoOperator(s, ch)) { //两个运算符的情况
//                     s = s + ch;
//                 } else {
//                     if (s === "" && ch !== '$') {
//                         s = s + ch;
//                     } else if (s === "" && ch === '$') { //若检测到$符号，就换行
//                         row++; //行数加一
//                     } else {
//                         list.push({
//                             row: row,
//                             word: s
//                         });
//                         s = "";
//                         if (ch !== '$') {
//                             s = s + ch;
//                         } else {
//                             row++;
//                         }
//                     }
//                 }
//             }
//         }
//         if (s !== "") {
//             list.push({
//                 row: row,
//                 word: s
//             });
//         }
//         return list;
//     }
//
//     /**
//      * 判断字符串是数字串，单个字符，还是一个字符串
//      */
//     check(str) {
//         let ch;
//         ch = str.charAt(0);
//         if (ch >= '0' && ch <= '9') {
//             return 1; //数字串
//         }
//         if (str.length === 1)
//             return 2; //单个字符
//         else
//             return 3; //一个字符串
//     }
//
//     /**
//      *
//      * 检查字符串是否为数字串，返回其机器码
//      */
//     checkDigit(str) {
//         let i;
//         let ch;
//         for (i = 0; i < str.length; i++) {
//             ch = str[i];
//             if (ch > '9' || ch < '0')
//                 break;
//         }
//         if (i < str.length) {
//             return "不可识别1"; //不可识别的情况
//         } else {
//             return "常数"; //常数
//         }
//     }
//
//     /**
//      *
//      * 检查字符串是否为单个字符，返回其机器码
//      */
//     checkChar(str) {
//         if (this.getOperatorOpcodes(str) !== 0) { //操作符
//             return this.getOperatorOpcodes(str);
//         } else if (this.getDelimiterOpcodes(str) !== 0) { //分界符
//             return this.getDelimiterOpcodes(str);
//         } else if (this.isIdent(str)) {
//             return "自定义"; //用户自定义标识符的机器码
//         } else {
//             return "不可识别"; //不可以被识别的标识符，机器码为0
//         }
//     }
//
//     /**
//      *
//      * 检查字符串是否为字符串，返回其机器码
//      */
//     checkString(str) {
//         if (this.getOperatorOpcodes(str) !== 0) { //操作符
//             return this.getOperatorOpcodes(str);
//         } else if (this.getKeywordOpcodes(str) !== 0) { //关键字
//             return this.getKeywordOpcodes(str);
//         } else if (this.isIdent(str)) {
//             return "自定义"; //用户自定义标识符的机器码
//         } else {
//             return "标识符"; //不可以被识别的标识符，机器码为0
//         }
//     }
}

export default Analyze;