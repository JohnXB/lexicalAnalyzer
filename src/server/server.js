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
        else if (ch == 'E'|| ch == 'e') {
            if (this.code.charAt(i + 1) == '+'||this.code.charAt(i + 1) == '-') {
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
            if (ch == 'E'||ch=='e') {
                if (this.code.charAt(i + 1) == '+'||this.code.charAt(i + 1) == '-') {
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
        let s = str;
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

    handleMinus(index, str) {
        let i = index;
        let text = this.code
        let ch = text.charAt(++i);
        let s = str;
        if (ch == '-') {
            s = s + ch;
            // 输出运算符
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

    handleMore(index, str) {
        let i = index;
        let text = this.code
        let ch = text.charAt(++i);
        let s = str + ch;
        if (ch == '=') {
            s = s + ch;
            // 输出运算符
            this.addToken(s, "运算符");
            return ++i;
        }

        else if (ch == '>') {
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

    handleLess(index, str) {
        let i = index;
        let text = this.code
        let ch = text.charAt(++i);
        let s = str;
        if (ch == '=') {
            s = s + ch;
            // 输出运算符
            this.addToken(s, "运算符");
            return ++i;
        }

        else if (ch == '<') {
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


}

export default Analyze;