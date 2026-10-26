// Inline answers for the search bar: math ("2+2*3", "15% of 2400", "sqrt(16)")
// and unit conversions ("10 km in mi"). A small recursive-descent parser, no eval.

// length in meters, mass in grams; temperature is not linear, so it is handled apart
const length: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 };
const mass: Record<string, number> = { g: 1, kg: 1000, oz: 28.349523125, lb: 453.59237 };
const temp: Record<string, [(v: number) => number, (v: number) => number]> = {
    c: [(v) => v, (v) => v],
    f: [(v) => ((v - 32) * 5) / 9, (v) => (v * 9) / 5 + 32],
    k: [(v) => v - 273.15, (v) => v + 273.15],
};

const constants: Record<string, number> = { pi: Math.PI };
const functions: Record<string, (x: number) => number> = { sqrt: Math.sqrt };

function format(n: number): string | null {
    if (!Number.isFinite(n)) return null;
    // at most 10 significant digits, so float noise like 0.30000000000000004 stays clean
    return n.toLocaleString(undefined, { maximumSignificantDigits: 10 });
}

function convert(query: string): string | null {
    const m = query.match(/^(-?\d*\.?\d+)\s*([a-z]+)\s+(?:in|to|в)\s+([a-z]+)$/i);
    if (!m) return null;
    const value = Number(m[1]);
    const from = m[2].toLowerCase();
    const to = m[3].toLowerCase();
    if (Object.hasOwn(temp, from) && Object.hasOwn(temp, to)) return format(temp[to][1](temp[from][0](value)));
    for (const table of [length, mass]) {
        if (Object.hasOwn(table, from) && Object.hasOwn(table, to)) return format((value * table[from]) / table[to]);
    }
    return null;
}

type Token = { type: "num" | "op" | "fn"; text: string; value?: number };

function tokenize(input: string): Token[] | null {
    const tokens: Token[] = [];
    let i = 0;
    while (i < input.length) {
        const ch = input[i];
        if (/\s/.test(ch)) {
            i++;
        } else if (/[\d.]/.test(ch)) {
            const num = input.slice(i).match(/^\d*\.?\d+/)?.[0];
            if (!num) return null;
            tokens.push({ type: "num", text: num, value: Number(num) });
            i += num.length;
        } else if (/[a-zа-я]/i.test(ch)) {
            const word = input.slice(i).match(/^[a-zа-я]+/i)![0].toLowerCase();
            i += word.length;
            if (word === "of" || word === "от") {
                // "15% of 2400" reads as a multiplication, so "of" is just an operator
                tokens.push({ type: "op", text: "*" });
            } else if (Object.hasOwn(constants, word)) {
                tokens.push({ type: "num", text: word, value: constants[word] });
            } else if (Object.hasOwn(functions, word)) {
                tokens.push({ type: "fn", text: word });
            } else {
                return null;
            }
        } else if ("+-*/^%()".includes(ch)) {
            tokens.push({ type: "op", text: ch });
            i++;
        } else {
            return null;
        }
    }
    return tokens;
}

class Parser {
    pos = 0;
    // binary operators, powers, percents and functions seen; a lone number is not a calculation
    ops = 0;

    constructor(private tokens: Token[]) {}

    private peek(text: string) {
        const t = this.tokens[this.pos];
        return t?.type === "op" && t.text === text ? t : undefined;
    }

    parse(): number {
        const v = this.expr();
        if (this.pos !== this.tokens.length) throw new Error("trailing");
        return v;
    }

    private expr(): number {
        let v = this.term();
        while (this.peek("+") || this.peek("-")) {
            const op = this.tokens[this.pos++].text;
            this.ops++;
            const r = this.term();
            v = op === "+" ? v + r : v - r;
        }
        return v;
    }

    private term(): number {
        let v = this.unary();
        while (this.peek("*") || this.peek("/")) {
            const op = this.tokens[this.pos++].text;
            this.ops++;
            const r = this.unary();
            v = op === "*" ? v * r : v / r;
        }
        return v;
    }

    private unary(): number {
        if (this.peek("-") || this.peek("+")) {
            const op = this.tokens[this.pos++].text;
            const v = this.unary();
            return op === "-" ? -v : v;
        }
        return this.power();
    }

    private power(): number {
        const base = this.postfix();
        if (!this.peek("^")) return base;
        this.pos++;
        this.ops++;
        return base ** this.unary();
    }

    private postfix(): number {
        let v = this.primary();
        while (this.peek("%")) {
            this.pos++;
            this.ops++;
            v /= 100;
        }
        return v;
    }

    private primary(): number {
        const t = this.tokens[this.pos];
        if (!t) throw new Error("unexpected end");
        this.pos++;
        if (t.type === "num") return t.value!;
        if (t.type === "fn") {
            this.ops++;
            return functions[t.text](this.group());
        }
        if (t.text === "(") {
            const v = this.expr();
            if (!this.peek(")")) throw new Error("expected )");
            this.pos++;
            return v;
        }
        throw new Error("unexpected token");
    }

    private group(): number {
        if (!this.peek("(")) throw new Error("expected (");
        this.pos++;
        const v = this.expr();
        if (!this.peek(")")) throw new Error("expected )");
        this.pos++;
        return v;
    }
}

function calculate(query: string): string | null {
    const tokens = tokenize(query);
    if (!tokens?.length) return null;
    const parser = new Parser(tokens);
    try {
        const value = parser.parse();
        return parser.ops ? format(value) : null;
    } catch {
        return null;
    }
}

/** The answer to a calculation or unit conversion in the search bar, or null if it is not one. */
export function answer(query: string): string | null {
    const q = query.trim();
    if (!q) return null;
    return convert(q) ?? calculate(q);
}
